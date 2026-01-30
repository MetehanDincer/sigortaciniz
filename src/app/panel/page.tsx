"use client"

import { useEffect, useState, Suspense } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, FileText, CheckCircle, Wallet, Copy, LogOut, Eye, X, ChevronRight, Clock, Download, ArrowLeft, TrendingUp, History, CreditCard } from "lucide-react"

const shortenId = (id: string) => id ? `#T-${id.slice(0, 8).toUpperCase()}` : "";

const PROCESS_STEPS = [
    {
        id: 1,
        label: 'Teklif Talebi Alındı',
        color: 'bg-amber-100 text-amber-600 border-amber-200',
        description: 'Danışman tarafından teklif formu dolduruldu ve sistemimize iletildi.',
        dbStatus: 'Bekliyor'
    },
    {
        id: 2,
        label: 'Teklif Verildi',
        color: 'bg-orange-100 text-orange-600 border-orange-200',
        description: 'Müşteri için en uygun teklifler hazırlanarak iletildi.',
        dbStatus: 'Teklif Verildi'
    },
    {
        id: 3,
        label: 'Ödeme Alınıyor',
        color: 'bg-blue-100 text-blue-600 border-blue-200',
        description: 'Müşteriden ödeme süreci başlatıldı.',
        dbStatus: 'Ödeme Alınıyor'
    },
    {
        id: 4,
        label: 'Poliçeleştirildi',
        color: 'bg-primary/10 text-primary border-primary/20',
        description: 'Sigorta poliçesi başarıyla oluşturuldu.',
        dbStatus: 'Satışa Döndü'
    },
    {
        id: 5,
        label: 'Kazanç Yansıtıldı',
        color: 'bg-green-100 text-green-600 border-green-200',
        description: 'Bu satıştan elde edilen kazanç kullanıcı hesabına yansıtıldı.',
        dbStatus: 'Kazanç Yansıtıldı'
    }
]

export default function DashboardPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center font-bold">Yükleniyor...</div>}>
            <DashboardContent />
        </Suspense>
    )
}

function DashboardContent() {
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
    const [leadsFilter, setLeadsFilter] = useState<'all' | 'issued'>('all')
    const [selectedLead, setSelectedLead] = useState<any>(null)
    const [isDetailsOpen, setIsDetailsOpen] = useState(false)
    const [viewerDoc, setViewerDoc] = useState<{ type: 'Offer' | 'Policy', url: string } | null>(null)
    const searchParams = useSearchParams()

    useEffect(() => {
        const filter = searchParams.get('filter')
        if (filter === 'issued') {
            setLeadsFilter('issued')
        }
    }, [searchParams])

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
                    <div className="flex flex-wrap gap-3">
                        <Button variant="outline" className="gap-2 font-bold shadow-sm" onClick={copyAffiliateLink}>
                            <Copy className="h-4 w-4" /> Linki Kopyala
                        </Button>
                        <Button asChild variant="secondary" className="gap-2 font-bold shadow-sm bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border-indigo-200">
                            <Link href="/panel/cuzdan">
                                <Wallet className="h-4 w-4" /> Cüzdanım
                            </Link>
                        </Button>
                        <Button variant="destructive" className="gap-2 font-bold shadow-sm" onClick={handleLogout}>
                            <LogOut className="h-4 w-4" /> Çıkış
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    <StatCard
                        title="Toplam Teklif"
                        value={stats.totalLeads}
                        icon={<FileText className="h-6 w-6 text-blue-500" />}
                        onClick={() => setLeadsFilter('all')}
                        active={leadsFilter === 'all'}
                    />
                    <StatCard title="Tamamlanan Satış" value={stats.soldLeads} icon={<CheckCircle className="h-6 w-6 text-green-500" />} />
                    <StatCard
                        title="Bekleyen Kazanç"
                        value={`₺${stats.pendingPayment}`}
                        description="Satışlardan elde ettiğiniz kar burada yazmaktadır."
                        icon={<Wallet className="h-6 w-6 text-amber-500" />}
                        href="/panel/cuzdan"
                    />
                    <StatCard
                        title="Poliçeleştirilen İşlemler"
                        value={stats.soldLeads}
                        description="Ödemesi alınan ve poliçesi kesilen işlemlerinizi buradan takip edebilirsiniz."
                        icon={<CheckCircle className="h-6 w-6 text-indigo-500" />}
                        onClick={() => setLeadsFilter('issued')}
                        active={leadsFilter === 'issued'}
                    />
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
                                    <Button asChild variant="secondary" className="h-16 px-8 text-lg font-extrabold shadow-sm bg-orange-50 text-orange-700 hover:bg-orange-100 border-orange-200">
                                        <Link href="/teklif/dask">🏠 DASK</Link>
                                    </Button>
                                    <Button asChild variant="outline" className="h-16 px-8 text-lg font-extrabold shadow-sm bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200">
                                        <Link href="/teklif/konut">🏘️ Konut</Link>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="shadow-sm border-none overflow-hidden">
                            <CardHeader className="bg-white border-b border-slate-100 flex flex-row items-center justify-between">
                                <CardTitle>İşlem Takibi</CardTitle>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b border-slate-50">
                                                <th className="p-4 py-3 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tarih</th>
                                                <th className="p-4 py-3 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">Teklif No</th>
                                                <th className="p-4 py-3 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">Hizmet</th>
                                                <th className="p-4 py-3 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">Detay</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-50">
                                            {leads.length > 0 ? leads
                                                .filter(lead => leadsFilter === 'all' || lead.status === 'Satışa Döndü')
                                                .map((lead) => {
                                                    const isSelected = selectedLead?.id === lead.id;
                                                    return (
                                                        <tr
                                                            key={lead.id}
                                                            onClick={() => setSelectedLead(lead)}
                                                            className={`transition-all border-l-4 cursor-pointer ${isSelected
                                                                ? "bg-primary/[0.03] border-primary shadow-sm"
                                                                : "hover:bg-slate-50/50 border-transparent"
                                                                }`}
                                                        >
                                                            <td className="p-4 py-3 text-sm font-medium text-slate-500">
                                                                {new Date(lead.created_at).toLocaleDateString('tr-TR')}
                                                            </td>
                                                            <td className="p-4 py-3">
                                                                <span className="text-xs font-mono font-bold text-primary bg-primary/5 px-2 py-1 rounded-md border border-primary/10">
                                                                    {shortenId(lead.id)}
                                                                </span>
                                                            </td>
                                                            <td className="p-4 py-3">
                                                                <span className="text-sm font-bold text-slate-900">{lead.type}</span>
                                                            </td>
                                                            <td className="p-4 py-3">
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        setSelectedLead(lead)
                                                                        setIsDetailsOpen(true)
                                                                    }}
                                                                    className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-primary transition-colors group"
                                                                >
                                                                    <FileText className="h-3.5 w-3.5" />
                                                                    Formu Gör
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    );
                                                }) : (
                                                <tr>
                                                    <td colSpan={4} className="p-8 text-center text-slate-400 font-medium italic">
                                                        Henüz bir işleminiz bulunmuyor.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Süreç Yönetimi Paneli */}
                        {selectedLead ? (
                            <Card className="shadow-lg border-2 border-primary/10 overflow-hidden animate-in slide-in-from-bottom-4 duration-500">
                                <CardHeader className="bg-slate-50/50 border-b border-slate-100 flex flex-row items-center justify-between pb-4">
                                    <div>
                                        <CardTitle className="text-lg flex items-center gap-2">
                                            <CheckCircle className="h-5 w-5 text-primary" />
                                            Süreç Yönetimi ve İşlem Detayları
                                        </CardTitle>
                                        <p className="text-xs text-slate-500 mt-1 font-medium italic">
                                            Seçili İşlem: <span className="text-primary font-bold">{shortenId(selectedLead.id)}</span> - {selectedLead.type}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">İşlem Tarihi</span>
                                        <p className="text-sm font-extrabold text-slate-900">{new Date(selectedLead.created_at).toLocaleDateString('tr-TR')}</p>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-8">
                                    <div className="relative space-y-8 max-w-2xl mx-auto">
                                        {/* Dikey Çizgi */}
                                        <div className="absolute left-[15px] top-2 bottom-2 w-0.5 bg-slate-100" />

                                        {PROCESS_STEPS.map((step, index) => {
                                            // TEST: Tüm adımları yeşil (tamamlanmış) göster
                                            const isCompleted = true;
                                            const isCurrent = false;

                                            return (
                                                <div key={step.id} className="relative flex gap-4 items-center justify-between group">
                                                    <div className="flex gap-6 items-start flex-grow">
                                                        <div className={`z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-300 ${isCompleted ? "bg-primary border-primary shadow-lg shadow-primary/20" :
                                                            isCurrent ? "bg-white border-primary ring-4 ring-primary/10" :
                                                                "bg-white border-slate-200"
                                                            }`}>
                                                            {isCompleted ? (
                                                                <CheckCircle className="h-4 w-4 text-white" />
                                                            ) : (
                                                                <div className={`h-2 w-2 rounded-full ${isCurrent ? "bg-primary animate-pulse" : "bg-slate-200"}`} />
                                                            )}
                                                        </div>
                                                        <div className="flex flex-col gap-1 min-w-0">
                                                            <div className="flex items-center gap-3">
                                                                <h4 className={`text-base font-extrabold transition-colors truncate ${isCompleted || isCurrent ? "text-slate-900" : "text-slate-400"
                                                                    }`}>
                                                                    {step.label}
                                                                </h4>
                                                                {(step.dbStatus === 'Teklif Verildi' || step.dbStatus === 'Satışa Döndü') && (
                                                                    <button
                                                                        className={`px-3 py-1 rounded-xl text-[10px] font-bold transition-all border flex items-center gap-1.5 shadow-sm active:scale-95 ${isCompleted || isCurrent
                                                                            ? "bg-white text-primary hover:bg-primary hover:text-white border-primary/20 hover:border-primary"
                                                                            : "bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed"
                                                                            }`}
                                                                        onClick={(e) => {
                                                                            e.stopPropagation()
                                                                            const url = step.dbStatus === 'Teklif Verildi'
                                                                                ? "/test/teklif.jpg"
                                                                                : "/test/police.png";
                                                                            setViewerDoc({
                                                                                type: step.dbStatus === 'Teklif Verildi' ? 'Offer' : 'Policy',
                                                                                url: url
                                                                            });
                                                                        }}
                                                                        disabled={!(isCompleted || isCurrent)}
                                                                    >
                                                                        <Eye className="h-3.5 w-3.5" /> Görüntüle
                                                                    </button>
                                                                )}
                                                            </div>
                                                            <p className={`text-xs leading-relaxed max-w-md ${isCompleted || isCurrent ? "text-slate-500 font-medium" : "text-slate-300"}`}>
                                                                {step.description}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    {isCompleted && (
                                                        <div className="hidden md:flex items-center gap-1 px-3 py-1 bg-green-50 rounded-full border border-green-100">
                                                            <div className="h-1.5 w-1.5 bg-green-500 rounded-full animate-pulse" />
                                                            <span className="text-[10px] font-bold text-green-600 uppercase">Tamamlandı</span>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </CardContent>
                            </Card>
                        ) : (
                            <Card className="shadow-sm border-dashed border-2 bg-slate-50/50">
                                <CardContent className="p-12 flex flex-col items-center justify-center text-center opacity-60">
                                    <div className="p-4 bg-white rounded-full shadow-sm mb-4">
                                        <ChevronRight className="h-8 w-8 text-slate-300 rotate-90" />
                                    </div>
                                    <h3 className="font-extrabold text-slate-900 mb-2">Süreç Yönetimi</h3>
                                    <p className="text-sm text-slate-500 max-w-xs font-medium">
                                        İşlem takibi tablosundan bir kayıt seçerek süreç detaylarını ve dokümanları buradan yönetebilirsiniz.
                                    </p>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    <Card className="shadow-sm border-none">
                        <CardHeader>
                            <CardTitle>Profil Bilgileri</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-1">
                                <p className="text-xs font-bold uppercase text-slate-400">İsim Soyisim</p>
                                <p className="font-semibold">{profile.full_name || 'Girilmedi'}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs font-bold uppercase text-slate-400">E-Posta</p>
                                <p className="font-semibold">{profile.email}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs font-bold uppercase text-slate-400">Telefon</p>
                                <p className="font-semibold">{profile.phone_number || 'Girilmedi'}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs font-bold uppercase text-slate-400">IBAN</p>
                                <p className="font-semibold">{profile.iban || 'Henüz eklenmemiş'}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs font-bold uppercase text-slate-400">Referans Kodunuz</p>
                                <p className="font-bold text-primary">{profile.affiliate_id}</p>
                            </div>
                            <Button asChild variant="secondary" className="w-full font-bold">
                                <Link href="/panel/profil">Profilini Düzenle</Link>
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </main>
            <Footer />


            {/* Form Detay Modal */}
            {isDetailsOpen && selectedLead && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                        onClick={() => setIsDetailsOpen(false)}
                    />
                    <div className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border border-slate-100 animate-in fade-in zoom-in duration-200">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <div>
                                <h3 className="text-xl font-extrabold text-slate-900">Teklif Formu</h3>
                                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-1">{shortenId(selectedLead.id)}</p>
                            </div>
                            <button
                                onClick={() => setIsDetailsOpen(false)}
                                className="p-2 hover:bg-slate-200 rounded-full transition-colors"
                            >
                                <X className="h-5 w-5 text-slate-500" />
                            </button>
                        </div>
                        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                            <div className="grid grid-cols-1 gap-3">
                                {Object.entries(selectedLead.details).map(([key, value]: [string, any]) => (
                                    <div key={key} className="flex flex-col p-3 rounded-xl bg-slate-50 border border-slate-100/50">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                                            {getLabel(key)}
                                        </span>
                                        <span className="text-sm font-extrabold text-slate-900 break-all">
                                            {String(value)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="p-6 bg-slate-50/50 border-t border-slate-100">
                            <Button className="w-full font-extrabold h-12 shadow-lg shadow-primary/20" onClick={() => setIsDetailsOpen(false)}>
                                Kapat
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Document Viewer Modal */}
            {viewerDoc && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                        onClick={() => setViewerDoc(null)}
                    />
                    <div className="relative max-w-4xl w-full bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh] border border-slate-100 animate-in fade-in zoom-in duration-200">
                        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-primary/10 rounded-xl text-primary">
                                    <FileText className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="font-extrabold text-slate-900">
                                        {viewerDoc.type === 'Offer' ? 'Teklif Detayları' : 'Sigorta Poliçesi'}
                                    </h3>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Görüntüleme ve İndirme</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <a
                                    href={viewerDoc.url}
                                    download={viewerDoc.type === 'Offer' ? 'teklif.jpg' : 'police.png'}
                                    className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-2xl text-sm font-extrabold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
                                >
                                    <Download className="h-4 w-4" /> İndir
                                </a>
                                <button
                                    onClick={() => setViewerDoc(null)}
                                    className="p-2 hover:bg-slate-200 rounded-full transition-colors"
                                >
                                    <X className="h-5 w-5 text-slate-500" />
                                </button>
                            </div>
                        </div>
                        <div className="flex-1 overflow-auto p-4 md:p-8 bg-slate-100 flex items-center justify-center">
                            <img
                                src={viewerDoc.url}
                                alt={viewerDoc.type}
                                className="max-w-full h-auto shadow-2xl rounded-2xl border-8 border-white"
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

function getLabel(key: string) {
    const labels: any = {
        tcNumber: "TC Kimlik No",
        ownerTc: "TC Kimlik No",
        birthDate: "Doğum Tarihi",
        plateNumber: "Plaka",
        licenseSerial: "Ruhsat Seri No",
        phoneNumber: "Telefon",
        phone_number: "Telefon",
        phone: "Telefon",
        fullName: "Ad Soyadı",
        full_name: "Ad Soyadı",
        email: "E-Posta",
        address: "Adres",
        brand: "Marka",
        model: "Model",
        year: "Yıl",
        productType: "Ürün Tipi",
        travelDate: "Seyahat Tarihi",
        duration: "Süre",
        buildingAge: "Bina Yaşı",
        floorCount: "Kat Sayısı",
        floorNumber: "Bulunduğu Kat",
        squareMeter: "Metrekare",
        usageType: "Kullanım Şekli",
        constructionType: "Yapı Tarzı"
    }
    return labels[key] || key
}

function StatCard({ title, value, icon, description, href, onClick, active }: { title: string, value: string | number, icon: React.ReactNode, description?: string, href?: string, onClick?: () => void, active?: boolean }) {
    const isLongText = typeof value === 'string' && value.length > 15;

    const content = (
        <CardContent className="p-6 flex items-center justify-between h-full">
            <div className="flex-grow pr-2">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">{title}</p>
                <p className={`font-extrabold text-slate-900 leading-tight ${isLongText ? 'text-sm text-slate-600' : 'text-3xl'}`}>{value}</p>
                {description && (
                    <p className="text-[10px] text-slate-500 mt-2 font-medium leading-relaxed italic border-t border-slate-100 pt-2">
                        {description}
                    </p>
                )}
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl flex-shrink-0 self-start">
                {icon}
            </div>
        </CardContent>
    );

    const cardClassName = `border-none shadow-sm transition-all h-full border-2 ${active ? 'border-primary ring-2 ring-primary/5 bg-primary/[0.02]' : 'border-transparent'
        } ${href || onClick ? 'hover:translate-y-[-4px] hover:shadow-md hover:bg-slate-50/50 cursor-pointer hover:border-primary/10' : ''}`;

    if (href) {
        return (
            <Link href={href} className="block h-full">
                <Card className={cardClassName}>
                    {content}
                </Card>
            </Link>
        )
    }

    if (onClick) {
        return (
            <div onClick={onClick} className="block h-full">
                <Card className={cardClassName}>
                    {content}
                </Card>
            </div>
        )
    }

    return (
        <Card className={cardClassName}>
            {content}
        </Card>
    )
}
