import { createClient } from '@/lib/supabase/server';
import { calculateEarnings, isValidProductType } from '@/lib/finance/earnings-calculator';
import { ProductType } from '@/lib/finance/commission-rates';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const supabase = await createClient();

        // 1. Verify admin authentication
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 });
        }

        // 2. Verify CFU authorization
        const { data: adminProfile } = await supabase
            .from('admin_profiles')
            .select('cfu_authorized, admin_code')
            .eq('id', user.id)
            .single();

        if (!adminProfile?.cfu_authorized) {
            return NextResponse.json(
                { error: 'Bu işlem için CFU (Merkezi Finans Birimi) yetkisi gereklidir' },
                { status: 403 }
            );
        }

        // 3. Parse request body
        const { leadId, productType, totalPremium } = await request.json();

        // 4. Validate inputs
        if (!leadId || !productType || totalPremium === undefined) {
            return NextResponse.json({ error: 'Eksik bilgi: Lead ID, ürün tipi ve toplam prim gereklidir' }, { status: 400 });
        }

        if (!isValidProductType(productType)) {
            return NextResponse.json({ error: 'Geçersiz ürün tipi' }, { status: 400 });
        }

        const premium = Number(totalPremium);
        if (isNaN(premium) || premium <= 0) {
            return NextResponse.json({ error: 'Toplam prim pozitif bir sayı olmalıdır' }, { status: 400 });
        }

        // 5. Fetch lead and verify affiliate
        const { data: lead, error: leadError } = await supabase
            .from('leads')
            .select('affiliate_id, type')
            .eq('id', leadId)
            .single();

        if (leadError || !lead) {
            return NextResponse.json({ error: 'Lead bulunamadı' }, { status: 404 });
        }

        if (!lead.affiliate_id) {
            return NextResponse.json({ error: 'Bu lead için referans numarası bulunamadı' }, { status: 400 });
        }

        // 6. Get partner profile
        const { data: partner, error: partnerError } = await supabase
            .from('profiles')
            .select('id, wallet_balance, full_name')
            .eq('affiliate_id', lead.affiliate_id)
            .single();

        if (partnerError || !partner) {
            return NextResponse.json({ error: 'İş ortağı bulunamadı' }, { status: 404 });
        }

        // 7. Check for existing active earning
        const { data: existingEarning } = await supabase
            .from('earnings')
            .select('id')
            .eq('lead_id', leadId)
            .eq('status', 'active')
            .maybeSingle();

        if (existingEarning) {
            return NextResponse.json(
                { error: 'Bu lead için kazanç zaten hesaplanmış' },
                { status: 409 }
            );
        }

        // 8. Calculate earnings
        const calculation = calculateEarnings(productType as ProductType, premium);

        // 9. Insert earning record
        const { data: earning, error: earningError } = await supabase
            .from('earnings')
            .insert({
                lead_id: leadId,
                partner_id: partner.id,
                affiliate_id: lead.affiliate_id,
                product_type: productType,
                total_premium: calculation.totalPremium,
                commission_rate: calculation.commissionRate,
                base_commission: calculation.baseCommission,
                company_share: calculation.companyShare,
                partner_earning: calculation.partnerEarning,
                calculated_by: user.id,
                status: 'active',
            })
            .select()
            .single();

        if (earningError) {
            console.error('Earning insert error:', earningError);
            return NextResponse.json({ error: 'Kazanç kaydı oluşturulamadı' }, { status: 500 });
        }

        // 10. Update partner wallet
        const currentBalance = partner.wallet_balance || 0;
        const newBalance = currentBalance + calculation.partnerEarning;

        const { error: walletError } = await supabase
            .from('profiles')
            .update({ wallet_balance: newBalance })
            .eq('id', partner.id);

        if (walletError) {
            console.error('Wallet update error:', walletError);
            // Rollback earning if wallet update fails
            await supabase.from('earnings').delete().eq('id', earning.id);
            return NextResponse.json({ error: 'Cüzdan güncellenemedi' }, { status: 500 });
        }

        // 11. Create wallet transaction record
        const { error: transactionError } = await supabase
            .from('wallet_transactions')
            .insert({
                partner_id: partner.id,
                earning_id: earning.id,
                amount: calculation.partnerEarning,
                transaction_type: 'earning_credit',
                balance_before: currentBalance,
                balance_after: newBalance,
                created_by: user.id,
                notes: `${productType.toUpperCase()} poliçesi kazancı - Lead #${leadId.slice(0, 8)}`,
            });

        if (transactionError) {
            console.error('Transaction log error:', transactionError);
            // Continue even if transaction log fails (non-critical)
        }

        // 12. Create lead log
        const { error: logError } = await supabase
            .from('lead_logs')
            .insert({
                lead_id: leadId,
                admin_id: user.id,
                action: 'EARNING_CALCULATED',
                details: `Kazanç hesaplandı: ₺${calculation.partnerEarning.toFixed(2)} (${productType.toUpperCase()})`,
            });

        if (logError) {
            console.error('Lead log error:', logError);
            // Continue even if log fails (non-critical)
        }

        return NextResponse.json({
            success: true,
            earning: {
                id: earning.id,
                partnerName: partner.full_name,
                affiliateId: lead.affiliate_id,
                ...calculation,
            },
            wallet: {
                previousBalance: currentBalance,
                newBalance: newBalance,
                credited: calculation.partnerEarning,
            },
        });

    } catch (error) {
        console.error('Error processing earning:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Sunucu hatası' },
            { status: 500 }
        );
    }
}
