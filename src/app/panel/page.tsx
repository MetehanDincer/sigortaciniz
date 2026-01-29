"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, FileText, CheckCircle, Wallet, Copy, LogOut } from "lucide-react"

export default function DashboardPage() {
    const router = useRouter()
    const supabase = createClient()
    const [profile, setProfile] = useState<any>(null)
    const [stats, setStats] = useState({
        totalLeads: 0,
        soldLeads: 0,
        pendingPayment: 0,
        totalEarned: 0
    })

    const [leads, setLeads] = useState<any[]>([])

    useEffect(() => {
        const getData = async () => {
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
                    .select('*')
                    .eq('affiliate_id', profileData.affiliate_id)
                    .order('created_at', { ascending: false })

                if (leadsData) {
                    setLeads(leadsData)
                    setStats({
                        totalLeads: leadsData.length,
                        soldLeads: leadsData.filter(l => l.status === 'Satışa Döndü').length,
                        pendingPayment: profileData.wallet_balance,
                        totalEarned: profileData.wallet_balance
                    })
                }
            }
        }
        getData()
    }, [router, supabase])

    async function handleLogout() {
        await supabase.auth.signOut()
        router.push("/")
        router.refresh()
    }

    const copyAffiliateLink = () => {
        const link = `${window.location.origin}/?ref=${profile?.affiliate_id}`
        navigator.clipboard.writeText(link)
        alert("Referans linkiniz kopyalandı!")
    }

    if (!profile) return <div className="min-h-screen flex items-center justify-center font-bold">Yükleniyor...</div>

    return (
        <div className="min-h-screen flex flex-col bg-slate-50">
            <Header />
            <main className="flex-grow container max-w-6xl mx-auto p-4 py-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Hoş Geldin, {profile.full_name?.split(' ')[0] || 'Ortağımız'}!</h1>
                        <p className="text-slate-500 font-medium">Referans Kodunuz: <span className="text-primary font-bold">{profile.affiliate_id}</span></p>
                    </div>
                    <div className="flex gap-3">
                        <Button variant="outline" className="gap-2 font-bold shadow-sm" onClick={copyAffiliateLink}>
                            <Copy className="h-4 w-4" /> Linki Kopyala
                        </Button>
                        <Button variant="destructive" className="gap-2 font-bold shadow-sm" onClick={handleLogout}>
                            <LogOut className="h-4 w-4" /> Çıkış
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    <StatCard title="Toplam Teklif" value={stats.totalLeads} icon={<FileText className="h-6 w-6 text-blue-500" />} />
                    <StatCard title="Tamamlanan Satış" value={stats.soldLeads} icon={<CheckCircle className="h-6 w-6 text-green-500" />} />
                    <StatCard title="Bekleyen Kazanç" value={`₺${stats.pendingPayment}`} icon={<Wallet className="h-6 w-6 text-amber-500" />} />
                    <StatCard title="Toplam Kazanç" value={`₺${stats.totalEarned}`} icon={<Wallet className="h-6 w-6 text-indigo-500" />} />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        <Card className="shadow-sm border-none overflow-hidden">
                            <CardHeader className="bg-white border-b border-slate-100">
                                <CardTitle>Yeni Teklif Oluştur</CardTitle>
                            </CardHeader>
                            <CardContent className="p-6 space-y-4">
                                <p className="text-slate-600 font-medium">Bu butonlar üzerinden girilen her teklif otomatik olarak sizin hesabınıza kaydedilir.</p>
                                <div className="flex flex-wrap gap-4">
                                    <Button asChild className="h-16 px-8 text-lg font-extrabold shadow-lg shadow-primary/20">
                                        <Link href="/teklif/trafik">🚗 Trafik</Link>
                                    </Button>
                                    <Button asChild variant="secondary" className="h-16 px-8 text-lg font-extrabold shadow-sm">
                                        <Link href="/teklif/kasko">🛡️ Kasko</Link>
                                    </Button>
                                    <Button asChild variant="outline" className="h-16 px-8 text-lg font-extrabold shadow-sm">
                                        <Link href="/teklif/saglik">🏥 Sağlık</Link>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="shadow-sm border-none overflow-hidden">
                            <CardHeader className="bg-white border-b border-slate-100 flex flex-row items-center justify-between">
                                <CardTitle>Son Teklifleriniz</CardTitle>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 text-xs font-bold uppercase tracking-wider">
                                                <th className="p-4">Tarih</th>
                                                <th className="p-4">Hizmet</th>
                                                <th className="p-4">Durum</th>
                                                <th className="p-4">Kazanç</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-50">
                                            {leads.length > 0 ? leads.map((lead) => (
                                                <tr key={lead.id} className="hover:bg-slate-50/50 transition-colors">
                                                    <td className="p-4 py-3 text-sm font-medium text-slate-600">
                                                        {new Date(lead.created_at).toLocaleDateString('tr-TR')}
                                                    </td>
                                                    <td className="p-4 py-3">
                                                        <span className="text-sm font-bold text-slate-900">{lead.type}</span>
                                                    </td>
                                                    <td className="p-4 py-3">
                                                        <span className={`px-2 py-1 rounded-full text-[10px] font-extrabold uppercase ${lead.status === 'Satışa Döndü' ? 'bg-green-100 text-green-700' :
                                                                lead.status === 'İptal' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                                                            }`}>
                                                            {lead.status}
                                                        </span>
                                                    </td>
                                                    <td className="p-4 py-3">
                                                        <span className="text-sm font-bold text-slate-900">₺{lead.commission_amount}</span>
                                                    </td>
                                                </tr>
                                            )) : (
                                                <tr>
                                                    <td colSpan={4} className="p-8 text-center text-slate-400 font-medium italic">
                                                        Henüz bir teklif oluşturulmamış.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <Card className="shadow-sm border-none">
                        <CardHeader>
                            <CardTitle>Profil Bilgileri</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-1">
                                <p className="text-xs font-bold uppercase text-slate-400">E-Posta</p>
                                <p className="font-semibold">{profile.email}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs font-bold uppercase text-slate-400">IBAN</p>
                                <p className="font-semibold">{profile.iban || 'Henüz eklenmemiş'}</p>
                            </div>
                            <Button variant="secondary" className="w-full font-bold">Profilini Düzenle</Button>
                        </CardContent>
                    </Card>
                </div>
            </main>
            <Footer />
        </div>
    )
}

function StatCard({ title, value, icon }: { title: string, value: string | number, icon: React.ReactNode }) {
    return (
        <Card className="border-none shadow-sm hover:translate-y-[-4px] transition-transform">
            <CardContent className="p-6 flex items-center justify-between">
                <div>
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">{title}</p>
                    <p className="text-3xl font-extrabold text-slate-900">{value}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl">
                    {icon}
                </div>
            </CardContent>
        </Card>
    )
}
