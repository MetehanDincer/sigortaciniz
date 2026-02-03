"use client"

import { useEffect, useState, Suspense } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
    LayoutDashboard,
    TrendingUp,
    Users,
    Wallet,
    LogOut,
    ArrowUpRight,
    ArrowDownLeft,
    ShieldCheck,
    Briefcase,
    Check
} from "lucide-react"

const shortenId = (id: string) => id ? `#T-${id.slice(0, 8).toUpperCase()}` : "";

export default function ManagementDashboardPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center font-bold">Yönetim Paneli Yükleniyor...</div>}>
            <ManagementDashboardContent />
        </Suspense>
    )
}

function ManagementDashboardContent() {
    const router = useRouter()
    const supabase = createClient()
    const [adminProfile, setAdminProfile] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [stats, setStats] = useState({
        totalTurnover: 0,
        totalProfit: 0,
        activeLeads: 0,
        pendingPayouts: 0
    })
    const [reps, setReps] = useState<any[]>([])
    const [partners, setPartners] = useState<any[]>([])
    const [pendingSales, setPendingSales] = useState<any[]>([])

    useEffect(() => {
        const checkAuth = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) {
                router.push("/admin/giris")
                return
            }

            // Verify CFU authorization
            const { data: profile } = await supabase
                .from('admin_profiles')
                .select('*')
                .eq('id', user.id)
                .single()

            if (!profile?.cfu_authorized) {
                // Not authorized for management, redirect to operations
                router.push("/admin/operasyon")
                return
            }

            setAdminProfile(profile)

            // --- FETCH DASHBOARD DATA ---

            // 1. Financial Stats
            const { data: earningsData } = await supabase
                .from('earnings')
                .select('total_premium, company_share')
                .eq('status', 'active')

            const totalTurnover = earningsData?.reduce((sum, item) => sum + Number(item.total_premium), 0) || 0
            const totalProfit = earningsData?.reduce((sum, item) => sum + Number(item.company_share), 0) || 0

            // 2. Pending Payouts (Wallet Balances)
            const { data: profilesData } = await supabase
                .from('profiles')
                .select('wallet_balance')

            const pendingPayouts = profilesData?.reduce((sum, item) => sum + (Number(item.wallet_balance) || 0), 0) || 0

            // 3. Active Operations (All leads except completed/rejected)
            const { count: activeLeadsCount } = await supabase
                .from('leads')
                .select('*', { count: 'exact', head: true })
                .in('status', ['Bekliyor', 'İnceleniyor', 'Teklif Verildi', 'Ödeme Alınıyor'])

            setStats({
                totalTurnover,
                totalProfit,
                activeLeads: activeLeadsCount || 0,
                pendingPayouts
            })

            // 4. Active Reps With Workload
            const { data: adminsData } = await supabase
                .from('admin_profiles')
                .select('*')
                .order('is_active', { ascending: false })

            if (adminsData) {
                // We need to fetch stats for each admin manually since we don't have aggregation views
                const repsWithStats = await Promise.all(adminsData.map(async (admin) => {
                    // Workload
                    const { count: workload } = await supabase
                        .from('leads')
                        .select('*', { count: 'exact', head: true })
                        .eq('assigned_admin_id', admin.id)
                        .in('status', ['Bekliyor', 'İnceleniyor', 'Teklif Verildi', 'Ödeme Alınıyor'])

                    // Sales (Today)
                    // Simplified for now to total "Satışa Döndü"
                    const { count: sales } = await supabase
                        .from('leads')
                        .select('*', { count: 'exact', head: true })
                        .eq('assigned_admin_id', admin.id)
                        .eq('status', 'Satışa Döndü')

                    return {
                        ...admin,
                        workload: workload || 0,
                        sales_count: sales || 0
                    }
                }))
                setReps(repsWithStats)
            }

            // 5. Pending Finance Actions (Sales without earnings)
            // Strategy: Get all 'Satışa Döndü' leads, and check if they have an earning entry
            const { data: salesData } = await supabase
                .from('leads')
                .select('*, assigned_admin:admin_profiles!assigned_admin_id(admin_code)')
                .eq('status', 'Satışa Döndü')
                .is('partner_commission', null) // We can check if commission is set in leads table if we added it, OR check earnings table.
            // Since our previous implementation set 'partner_commission' in leads table when calculating earnings,
            // checking .is('partner_commission', null) is the fastest way to find uncalculated earnings!

            if (salesData) {
                setPendingSales(salesData)
            }

            // 6. Partner Performance Stats
            const { data: allPartners } = await supabase
                .from('profiles')
                .select('affiliate_id, full_name, email')
                .not('affiliate_id', 'is', null)

            const { data: affiliateLeads } = await supabase
                .from('leads')
                .select('*')
                .not('affiliate_id', 'is', null)

            if (allPartners && affiliateLeads) {
                const pStats = allPartners.map(p => {
                    const pLeads = affiliateLeads.filter(l => l.affiliate_id === p.affiliate_id)
                    const sales = pLeads.filter(l => l.status === 'Satışa Döndü').length
                    const qrCount = pLeads.filter(l => l.details?.referral_source === 'qr').length
                    const linkCount = pLeads.filter(l => l.details?.referral_source === 'link').length

                    return {
                        id: p.affiliate_id,
                        name: p.full_name || p.email,
                        code: p.affiliate_id,
                        total_leads: pLeads.length,
                        sales: sales,
                        qr_usage: qrCount,
                        link_usage: linkCount
                    }
                })
                    .filter(p => p.total_leads > 0) // Only show active partners
                    .sort((a, b) => b.total_leads - a.total_leads)

                setPartners(pStats)
            }

            setLoading(false)
        }
        checkAuth()
    }, [router, supabase])

    const handleLogout = async () => {
        await supabase.auth.signOut()
        router.push("/")
        router.refresh()
    }

    if (loading) return <div className="min-h-screen flex items-center justify-center font-bold">Erişim Kontrol Ediliyor...</div>

    return (
        <div className="min-h-screen flex flex-col bg-slate-50">
            <Header />
            <main className="flex-grow container max-w-screen-2xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="bg-indigo-900 text-white text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider">
                                CFU YÖNETİM
                            </span>
                            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Merkezi Finans Birimi</h1>
                        </div>
                        <p className="text-slate-500 font-medium">Hoş geldin, {adminProfile?.full_name}. Finansal operasyonlar ve yönetim paneli.</p>
                    </div>
                    <div className="flex gap-3">
                        <Button variant="outline" className="gap-2 font-bold shadow-sm" onClick={() => router.push('/admin/operasyon')}>
                            <Briefcase className="h-4 w-4" /> Operasyon Paneline Git
                        </Button>
                        <Button variant="outline" className="gap-2 font-bold shadow-sm" onClick={handleLogout}>
                            <LogOut className="h-4 w-4" /> Çıkış
                        </Button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <Card className="border-none shadow-sm bg-indigo-900 text-white">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-indigo-100 uppercase tracking-wider">Canlı Ciro (Bu Ay)</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-black tracking-tighter">
                                {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(stats.totalTurnover)}
                            </div>
                            <p className="text-xs text-indigo-300 mt-1 flex items-center gap-1">
                                <TrendingUp className="h-3 w-3" /> Şirket toplam prim üretimi
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-sm bg-white">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-slate-500 uppercase tracking-wider">Net Şirket Karı</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-black tracking-tighter text-slate-900">
                                {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(stats.totalProfit)}
                            </div>
                            <p className="text-xs text-slate-400 mt-1">Bu ayın toplam komisyon geliri</p>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-sm bg-white">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-slate-500 uppercase tracking-wider">Aktif Operasyon</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-black tracking-tighter text-slate-900">{stats.activeLeads}</div>
                            <p className="text-xs text-slate-400 mt-1">Bekleyen/İncelenen işlem sayısı</p>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-sm bg-white">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-slate-500 uppercase tracking-wider">Bekleyen Ödemeler</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-black tracking-tighter text-slate-900">
                                {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(stats.pendingPayouts)}
                            </div>
                            <p className="text-xs text-slate-400 mt-1">İş ortaklarına ödenecek hakediş</p>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    {/* Active Reps Table */}
                    <Card className="border-none shadow-sm bg-white overflow-hidden">
                        <CardHeader className="bg-slate-50/50 border-b border-slate-100 flex flex-row items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Users className="h-5 w-5 text-indigo-600" />
                                <CardTitle>Aktif Temsilciler</CardTitle>
                            </div>
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Canlı İzleme</span>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-slate-50 border-b border-slate-100 text-[10px] uppercase font-black text-slate-400 tracking-wider">
                                        <tr>
                                            <th className="px-6 py-4">Temsilci</th>
                                            <th className="px-6 py-4 text-center">Durum</th>
                                            <th className="px-6 py-4 text-center">İş Yükü</th>
                                            <th className="px-6 py-4 text-right">Performans (Poliçe)</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {reps.map((rep) => (
                                            <tr key={rep.id} className="hover:bg-slate-50/50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="font-bold text-slate-900">{rep.full_name || 'İsimsiz'}</div>
                                                    <div className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded w-fit mt-0.5">
                                                        {rep.admin_code}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <span className={`inline-block w-2.5 h-2.5 rounded-full ${rep.is_active ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-slate-300'}`} />
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <span className={`font-black text-sm px-2 py-1 rounded-lg ${rep.workload > 5 ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'}`}>
                                                        {rep.workload}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="inline-flex items-center gap-1 font-bold text-slate-700">
                                                        <Check className="h-4 w-4 text-green-500" />
                                                        {rep.sales_count}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Pending Finance Actions */}
                    <Card className="border-none shadow-sm bg-white overflow-hidden flex flex-col h-full">
                        <CardHeader className="bg-amber-50/50 border-b border-amber-100 flex flex-row items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Wallet className="h-5 w-5 text-amber-600" />
                                <CardTitle className="text-amber-900">Bekleyen Finansal İşlemler</CardTitle>
                            </div>
                            <div className="bg-amber-100 text-amber-700 px-2.5 py-0.5 rounded-full text-xs font-black">
                                {pendingSales.length}
                            </div>
                        </CardHeader>
                        <CardContent className="p-0 flex-grow bg-white">
                            {pendingSales.length > 0 ? (
                                <div className="divide-y divide-slate-50">
                                    {pendingSales.map((sale) => (
                                        <div key={sale.id} className="p-4 flex items-center justify-between group hover:bg-slate-50 transition-colors">
                                            <div className="flex items-center gap-3">
                                                <div className="bg-indigo-50 p-2 rounded-lg text-indigo-600 font-black text-xs">
                                                    {shortenId(sale.id)}
                                                </div>
                                                <div>
                                                    <div className="text-sm font-bold text-slate-900">{sale.type}</div>
                                                    <div className="text-[10px] text-slate-400 font-medium">Bitiş: {sale.assigned_admin?.admin_code}</div>
                                                </div>
                                            </div>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="border-green-200 text-green-700 hover:bg-green-50 hover:text-green-800 font-bold"
                                                onClick={() => router.push('/admin/operasyon')}
                                            >
                                                Hesapla <ArrowUpRight className="h-3 w-3 ml-1" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center p-8 text-center">
                                    <div className="bg-green-50 p-4 rounded-full mb-3">
                                        <ShieldCheck className="h-8 w-8 text-green-500" />
                                    </div>
                                    <p className="font-bold text-slate-900">Her şey yolunda!</p>
                                    <p className="text-xs text-slate-500 mt-1">Bekleyen kazanç hesaplaması bulunmuyor.</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Partner Performance Table */}
                <Card className="border-none shadow-sm bg-white overflow-hidden">
                    <CardHeader className="bg-slate-50/50 border-b border-slate-100 flex flex-row items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Users className="h-5 w-5 text-indigo-600" />
                            <CardTitle>İş Ortakları Performansı</CardTitle>
                        </div>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Referans Takibi</span>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50 border-b border-slate-100 text-[10px] uppercase font-black text-slate-400 tracking-wider">
                                    <tr>
                                        <th className="px-6 py-4">İş Ortağı</th>
                                        <th className="px-6 py-4 text-center">Toplam Yönlendirme</th>
                                        <th className="px-6 py-4 text-center">QR / Link</th>
                                        <th className="px-6 py-4 text-right">Satışa Dönüşen</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {partners.map((p) => (
                                        <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="font-bold text-slate-900">{p.name}</div>
                                                <div className="text-[10px] font-mono text-slate-400 mt-0.5">
                                                    #{p.code}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className="font-black text-sm bg-indigo-50 text-indigo-700 px-3 py-1 rounded-lg">
                                                    {p.total_leads}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <div className="flex items-center justify-center gap-2 text-xs font-bold">
                                                    <span className="text-slate-600 bg-slate-100 px-2 py-0.5 rounded flex items-center gap-1" title="QR Kod">
                                                        QR: {p.qr_usage}
                                                    </span>
                                                    <span className="text-slate-400">/</span>
                                                    <span className="text-blue-600 bg-blue-50 px-2 py-0.5 rounded flex items-center gap-1" title="Link Paylaşımı">
                                                        Link: {p.link_usage}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="inline-flex items-center gap-1 font-bold text-green-600 bg-green-50 px-3 py-1 rounded-lg">
                                                    <Check className="h-4 w-4" />
                                                    {p.sales}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {partners.length === 0 && (
                                        <tr>
                                            <td colSpan={4} className="px-6 py-8 text-center text-slate-400 text-sm italic">
                                                Henüz aktif bir iş ortağı verisi bulunmuyor.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </main>
            <Footer />
        </div>
    )
}
