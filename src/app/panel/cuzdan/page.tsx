"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Wallet, ArrowLeft, TrendingUp, History, Download, CreditCard, CheckCircle } from "lucide-react"

export default function WalletPage() {
    const router = useRouter()
    const supabase = createClient()
    const [profile, setProfile] = useState<any>(null)
    const [soldLeadsCount, setSoldLeadsCount] = useState(0)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const getProfile = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) {
                router.push("/giris")
                return
            }

            const { data: profileData } = await supabase.from('profiles').select('*').eq('id', user.id).single()
            setProfile(profileData)

            if (profileData) {
                const { data: leadsData } = await supabase
                    .from('leads')
                    .select('id')
                    .eq('affiliate_id', profileData.affiliate_id)
                    .eq('status', 'Satışa Döndü')

                setSoldLeadsCount(leadsData?.length || 0)
            }
            setLoading(false)
        }
        getProfile()
    }, [router, supabase])

    if (loading || !profile) return <div className="min-h-screen flex items-center justify-center font-bold">Yükleniyor...</div>

    return (
        <div className="min-h-screen flex flex-col bg-slate-50">
            <Header />
            <main className="flex-grow container max-w-6xl mx-auto p-4 py-8">
                <div className="mb-8">
                    <Button asChild variant="ghost" className="gap-2 font-bold text-slate-500 hover:text-slate-900 mb-4">
                        <Link href="/panel">
                            <ArrowLeft className="h-4 w-4" /> Panele Dön
                        </Link>
                    </Button>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Cüzdanım</h1>
                    <p className="text-slate-500 font-medium">Kazançlarınızı ve ödeme taleplerinizi buradan yönetebilirsiniz.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <Card className="md:col-span-2 bg-primary text-white border-none shadow-xl shadow-primary/20 overflow-hidden relative">
                        <div className="absolute top-0 right-0 p-8 opacity-10">
                            <Wallet className="h-32 w-32" />
                        </div>
                        <CardContent className="p-8 relative z-10">
                            <div className="flex justify-between items-start mb-8">
                                <div>
                                    <p className="text-primary-foreground/80 font-bold uppercase tracking-wider text-xs mb-1">Kullanılabilir Bakiye</p>
                                    <h2 className="text-5xl font-black italic tracking-tighter">₺{profile.wallet_balance || 0}</h2>
                                </div>
                                <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-md">
                                    <CreditCard className="h-6 w-6" />
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <Button className="bg-white text-primary hover:bg-slate-100 font-extrabold shadow-sm h-12 px-6">
                                    Ödeme Talebi Et
                                </Button>
                                <Button variant="ghost" className="text-white hover:bg-white/10 font-bold h-12 px-6">
                                    IBAN Düzenle
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    <Link href="/panel?filter=issued" className="block">
                        <Card className="border-none shadow-sm hover:translate-y-[-4px] transition-all hover:shadow-md hover:bg-slate-50/50 cursor-pointer h-full border-2 border-transparent hover:border-primary/10">
                            <CardContent className="p-8 text-center">
                                <div className="bg-primary/10 text-primary p-4 rounded-full w-fit mx-auto mb-4">
                                    <CheckCircle className="h-8 w-8" />
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 mb-1">Poliçeleriniz</h3>
                                <p className="text-3xl font-black text-slate-800">{soldLeadsCount}</p>
                                <p className="text-[10px] text-slate-400 font-bold mt-2 uppercase tracking-widest italic leading-relaxed">
                                    Yalnızca ödemesi alınmış işlemler.
                                </p>
                            </CardContent>
                        </Card>
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <Card className="shadow-sm border-none overflow-hidden h-full text-center p-12 flex flex-col items-center justify-center bg-white">
                            <div className="bg-slate-50 p-6 rounded-full mb-4">
                                <History className="h-10 w-10 text-slate-300" />
                            </div>
                            <h3 className="text-xl font-extrabold text-slate-900 mb-2">Henüz işlem bulunmuyor</h3>
                            <p className="text-slate-500 font-medium max-w-sm mx-auto">Satışlarınız onaylandığında kazançlarınız burada listelenecektir.</p>
                        </Card>
                    </div>

                    <div className="space-y-6">
                        <Card className="shadow-sm border-none bg-blue-50 border-blue-100">
                            <CardHeader>
                                <CardTitle className="text-blue-900 text-lg">Önemli Bilgilendirme</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <p className="text-blue-800/80 text-sm font-medium leading-relaxed">
                                    Kazançlarınız, satış poliçeleştikten sonra 24 saat içerisinde cüzdanınıza yansıtılır.
                                </p>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-blue-900 font-bold text-sm">
                                        <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                                        <span>Minimum çekim tutarı ₺100'dir.</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-blue-900 font-bold text-sm">
                                        <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                                        <span>Ödemeler her Cuma günü yapılır.</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="shadow-sm border-none">
                            <CardHeader>
                                <CardTitle className="text-lg">Kayıtlı IBAN</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 mb-4">
                                    <p className="text-xs font-bold text-slate-400 uppercase mb-1">IBAN Numarası</p>
                                    <p className="font-mono font-bold text-slate-900 break-all">{profile.iban || 'Henüz eklenmemiş'}</p>
                                </div>
                                <Button asChild variant="outline" className="w-full font-bold">
                                    <Link href="/panel/profil">Güncelle</Link>
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}
