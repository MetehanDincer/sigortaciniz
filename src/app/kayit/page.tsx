"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function RegisterPage() {
    const router = useRouter()
    const supabase = createClient()
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    async function handleRegister(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setIsLoading(true)
        setError(null)

        const formData = new FormData(e.currentTarget)
        const email = formData.get("email") as string
        const password = formData.get("password") as string
        const fullName = formData.get("fullName") as string

        const { error: authError, data } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: fullName,
                }
            }
        })

        if (authError) {
            setError(authError.message)
            setIsLoading(false)
            return
        }

        // SignUp might require email confirmation depending on Supabase settings
        if (data.session) {
            router.push("/panel")
        } else {
            alert("Kayıt başarılı! Lütfen e-postanızı onaylayın (eğer açıksa).")
            router.push("/giris")
        }
        setIsLoading(false)
    }

    async function handleGoogleLogin() {
        await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/auth/callback`,
            },
        })
    }

    return (
        <div className="min-h-screen flex flex-col bg-slate-50">
            <Header />
            <main className="flex-grow flex items-center justify-center p-4 py-12">
                <Card className="w-full max-w-md shadow-xl border-t-4 border-t-primary">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl font-bold text-center">Gelir Ortağımız Olun</CardTitle>
                        <CardDescription className="text-center italic">
                            Hemen kayıt olun, referanslarınızdan kazanç elde etmeye başlayın.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <form onSubmit={handleRegister} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="fullName">Ad Soyad</Label>
                                <Input id="fullName" name="fullName" placeholder="Mehmet Yılmaz" required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">E-posta</Label>
                                <Input id="email" name="email" type="email" placeholder="ornek@mail.com" required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Şifre</Label>
                                <Input id="password" name="password" type="password" required />
                            </div>
                            {error && <p className="text-sm text-red-500 font-medium">{error}</p>}
                            <Button type="submit" className="w-full font-semibold" disabled={isLoading}>
                                {isLoading ? "Kaydediliyor..." : "Hesap Oluştur"}
                            </Button>
                        </form>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-slate-200" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-white px-2 text-slate-500">Veya şununla devam et</span>
                            </div>
                        </div>

                        <Button variant="outline" type="button" className="w-full gap-2" onClick={handleGoogleLogin}>
                            <svg className="h-4 w-4" viewBox="0 0 24 24">
                                <path
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    fill="#4285F4"
                                />
                                <path
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    fill="#34A853"
                                />
                                <path
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                                    fill="#FBBC05"
                                />
                                <path
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    fill="#EA4335"
                                />
                            </svg>
                            Google ile Kayıt Ol
                        </Button>
                    </CardContent>
                    <CardFooter className="flex justify-center flex-wrap gap-1 border-t py-4 text-sm text-slate-500">
                        Zaten hesabınız var mı?{" "}
                        <Link href="/giris" className="text-primary hover:underline font-semibold">
                            Giriş Yap
                        </Link>
                    </CardFooter>
                </Card>
            </main>
            <Footer />
        </div>
    )
}
