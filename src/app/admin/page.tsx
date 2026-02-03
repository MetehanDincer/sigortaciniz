"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

export default function AdminRootPage() {
    const router = useRouter()
    const supabase = createClient()

    useEffect(() => {
        const checkAuth = async () => {
            const { data: { user } } = await supabase.auth.getUser()

            if (!user) {
                router.push("/admin/giris")
                return
            }

            // Check role
            const { data: profile } = await supabase
                .from('admin_profiles')
                .select('cfu_authorized')
                .eq('id', user.id)
                .single()

            if (profile?.cfu_authorized) {
                router.push("/admin/yonetim")
            } else {
                router.push("/admin/operasyon")
            }
        }

        checkAuth()
    }, [router, supabase])

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 font-medium text-slate-500">
            Yönlendiriliyor...
        </div>
    )
}
