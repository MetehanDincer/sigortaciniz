"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ShieldCheck, Lock } from "lucide-react"

export default function AdminLoginPage() {
    const router = useRouter()
    const supabase = createClient()
    const [isLoading, setIsLoading] = useState(false)
    const [isCheckingAuth, setIsCheckingAuth] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const checkAuth = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
                const { data: adminData } = await supabase
                    .from('admin_profiles')
                    .select('admin_code')
                    .eq('id', user.id)
                    .single()

                if (adminData) {
                    router.push("/admin")
                    return
                }
            }
            setIsCheckingAuth(false)
        }
        checkAuth()
    }, [router, supabase])

    if (isCheckingAuth) {
        return <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">Yükleniyor...</div>
    }

    async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setIsLoading(true)
        setError(null)

        const formData = new FormData(e.currentTarget)
        const email = formData.get("email") as string
        const password = formData.get("password") as string

        // 1. Authenticate with Supabase
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        if (authError || !authData.user) {
            setError("E-posta veya şifre hatalı.")
            setIsLoading(false)
            return
        }

        // 2. Check if user exists in admin_profiles
        const { data: adminData, error: adminError } = await supabase
            .from('admin_profiles')
            .select('admin_code, cfu_authorized')
            .eq('id', authData.user.id)
            .single()

        if (adminError || !adminData) {
            console.error("Admin check error:", adminError)
            // Not an admin - sign them back out
            await supabase.auth.signOut()
            setError(adminError ? `Hata: ${adminError.message}` : "Yetkisiz erişim. Bu alan sadece yöneticiler içindir.")
            setIsLoading(false)
            return
        }

        // Success - Check Role and Redirect
        if (adminData.cfu_authorized) {
            router.push("/admin/yonetim")
        } else {
            router.push("/admin/operasyon")
        }
        router.refresh()
        setIsLoading(false)
    }

    return (
        <div className="min-h-screen flex flex-col bg-slate-900">
            <Header />
            <main className="flex-grow flex items-center justify-center p-4 py-12">
                <Card className="w-full max-w-md shadow-2xl border-none bg-slate-800 text-slate-100">
                    <CardHeader className="space-y-1 pb-8">
                        <div className="mx-auto bg-primary/20 p-3 rounded-2xl w-fit mb-4">
                            <ShieldCheck className="h-10 w-10 text-primary" />
                        </div>
                        <CardTitle className="text-3xl font-black text-center tracking-tight">Admin Girişi</CardTitle>
                        <CardDescription className="text-center text-slate-400 font-medium">
                            Operasyonel yönetim paneline erişim sağlayın.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <form onSubmit={handleLogin} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-slate-300 font-bold">Admin E-posta</Label>
                                <div className="relative">
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="admin@uygunsigortaci.com"
                                        required
                                        className="bg-slate-900 border-slate-700 text-white pl-10 focus:ring-primary focus:border-primary"
                                    />
                                    <ShieldCheck className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-slate-300 font-bold">Şifre</Label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        name="password"
                                        type="password"
                                        required
                                        className="bg-slate-900 border-slate-700 text-white pl-10 focus:ring-primary focus:border-primary"
                                    />
                                    <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                                </div>
                            </div>
                            {error && (
                                <div className="bg-red-500/10 border border-red-500/50 p-3 rounded-lg">
                                    <p className="text-xs text-red-400 font-bold text-center">{error}</p>
                                </div>
                            )}
                            <Button type="submit" className="w-full h-12 text-lg font-black shadow-lg shadow-primary/20 mt-4" disabled={isLoading}>
                                {isLoading ? "Yetkilendiriliyor..." : "Güvenli Giriş Yap"}
                            </Button>
                        </form>
                    </CardContent>
                    <CardFooter className="flex justify-center border-t border-slate-700 py-6 text-sm">
                        <Link href="/" className="text-slate-400 hover:text-white flex items-center gap-2 transition-colors font-bold">
                            Ana Sayfaya Dön
                        </Link>
                    </CardFooter>
                </Card>
            </main>
            <Footer />
        </div>
    )
}
