import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
    const supabase = await createClient()
    const targetEmail = 'test@test.com'

    // 1. Check if user exists in auth.users (via profiles or just checking session)
    const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id, email, full_name')
        .eq('email', targetEmail)
        .single()

    let diagnostic = {
        targetEmail,
        profileFound: !!profile,
        profileError: profileError?.message,
        adminProfileFound: false,
        instruction: ""
    }

    if (profile) {
        const { data: adminProfile } = await supabase
            .from('admin_profiles')
            .select('*')
            .eq('id', profile.id)
            .single()

        diagnostic.adminProfileFound = !!adminProfile
    }

    if (!diagnostic.profileFound) {
        diagnostic.instruction = `HATA: "${targetEmail}" emaili ile bir profil bulunamadı. Lütfen önce normal kayıt olun veya giriş yapın.`
    } else if (!diagnostic.adminProfileFound) {
        diagnostic.instruction = `DİKKAT: Profil bulundu ama ADMİN yetkisi yok. Lütfen aşağıdaki SQL komutunu Supabase SQL Editor'de çalıştırın:\n\nINSERT INTO admin_profiles (id, admin_code, full_name, is_active) VALUES ('${profile?.id}', 'ADM-TEST', '${profile?.full_name || 'Test Admin'}', true);`
    } else {
        diagnostic.instruction = "TEBRİKLER: Admin hesabınız hazır! /admin/giris sayfasından giriş yapabilirsiniz."
    }

    return NextResponse.json(diagnostic)
}
