"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, FileText, CheckCircle, Wallet, Copy, LogOut, Eye, X, ChevronRight, Clock, Download, ArrowLeft, TrendingUp, History, CreditCard, ShieldCheck, Car, Heart, Home, Star, Rocket, Lock } from "lucide-react"
import { QRCodeDialog } from "@/components/panel/qr-code-dialog"
import { TrainingDialog } from "@/components/panel/training-dialog"

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

export function DashboardPageContent() {
    const searchParams = useSearchParams()
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
    const [completedTrainings, setCompletedTrainings] = useState<string[]>([])
    const [isTrainingOpen, setIsTrainingOpen] = useState(false)
    const [selectedTraining, setSelectedTraining] = useState<{ type: string, title: string } | null>(null)

    useEffect(() => {
        const filter = searchParams.get('filter')
        if (filter === 'issued') {
            setLeadsFilter('issued')
        }
    }, [searchParams])

    useEffect(() => {
        const getData = async () => {
            try {
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

                    setLeads(leadsData || [])

                    const soldCount = leadsData?.filter((l: any) => l.status === 'Satışa Döndü' || l.status === 'Kazanç Yansıtıldı').length || 0
                    const pendingPaymentCount = leadsData?.filter((l: any) => l.status === 'Ödeme Alınıyor').length || 0

                    const { data: earningsData } = await supabase
                        .from('earnings')
                        .select('amount')
                        .eq('affiliate_id', profileData.affiliate_id)
                        .eq('status', 'completed')

                    const totalEarned = earningsData?.reduce((sum: number, e: any) => sum + (e.amount || 0), 0) || 0

                    setStats({
                        totalLeads: leadsData?.length || 0,
                        soldLeads: soldCount,
                        pendingPayment: pendingPaymentCount,
                        totalEarned
                    })

                    // Fetch completed trainings
                    const { data: trainingData } = await supabase
                        .from('partner_trainings')
                        .select('training_type')
                        .eq('user_id', user.id)

                    if (trainingData) {
                        setCompletedTrainings(trainingData.map((t: any) => t.training_type))
                    }
                }
            } catch (error) {
                console.error("❌ Veri çekme hatası:", error)
            }
        }

        getData()
    }, [router])

    const handleLogout = async () => {
        // Detailed cookie clearing for affiliate data
        const cookiesToClear = ["affiliate_id", "affiliate_source"]

        cookiesToClear.forEach(name => {
            // Delete for current path and root path
            document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
            document.cookie = `${name}=; path=${window.location.pathname}; expires=Thu, 01 Jan 1970 00:00:00 GMT`;

            // Delete for domain-wide if applicable
            const domain = window.location.hostname;
            document.cookie = `${name}=; path=/; domain=.${domain}; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
        });

        await supabase.auth.signOut()
        router.refresh()
        router.push("/")
    }

    const copyAffiliateLink = () => {
        if (profile?.affiliate_id) {
            const link = `${window.location.origin}?ref=${profile.affiliate_id}`
            navigator.clipboard.writeText(link)
            alert("Bağlantı kopyalandı!")
        }
    }

    const filteredLeads = leadsFilter === 'issued'
        ? leads.filter(l => l.status === 'Satışa Döndü' || l.status === 'Kazanç Yansıtıldı')
        : leads

    const getCurrentStep = (status: string) => {
        const step = PROCESS_STEPS.find(s => s.dbStatus === status)
        return step ? step.id : 1
    }

    if (!profile) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Yükleniyor...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1 container max-w-7xl mx-auto px-4 py-8">
                <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">Hoş Geldiniz, {profile.full_name || 'Partner'}</h1>
                        <div className="flex items-center gap-3">
                            <p className="text-muted-foreground">Partner Panelinize hoş geldiniz</p>
                            <div className="flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-bold border border-primary/20">
                                <Star className="h-3.5 w-3.5" />
                                <span>Ref: {profile.affiliate_id}</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <QRCodeDialog
                            value={`${typeof window !== 'undefined' ? window.location.origin : ''}?ref=${profile.affiliate_id}`}
                            partnerName={profile.full_name}
                        />
                        <Button onClick={copyAffiliateLink} variant="outline" className="gap-2">
                            <Copy className="h-4 w-4" />
                            <span className="hidden sm:inline">Bağlantıyı Kopyala</span>
                        </Button>
                        <Button onClick={handleLogout} variant="outline" className="gap-2">
                            <LogOut className="h-4 w-4" />
                            <span className="hidden sm:inline">Çıkış</span>
                        </Button>
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Toplam Müşteri</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.totalLeads}</div>
                            <p className="text-xs text-muted-foreground mt-1">Tüm teklif talepleri</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Satışa Dönen</CardTitle>
                            <CheckCircle className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.soldLeads}</div>
                            <p className="text-xs text-muted-foreground mt-1">Poliçeleşen müşteriler</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Ödeme Bekleyen</CardTitle>
                            <Clock className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.pendingPayment}</div>
                            <p className="text-xs text-muted-foreground mt-1">Ödeme aşamasında</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Toplam Kazanç</CardTitle>
                            <Wallet className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.totalEarned.toLocaleString('tr-TR')} ₺</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                <Link href="/panel/cuzdan" className="text-primary hover:underline">
                                    Cüzdanı Görüntüle →
                                </Link>
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Hızlı İşlemler Section */}
                <div className="mb-8">
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <Rocket className="h-5 w-5 text-primary" />
                        Hızlı Teklif Hazırla
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        {[
                            { title: "Trafik", id: "trafik", icon: Car, href: "/teklif/trafik", color: "bg-blue-500" },
                            { title: "Kasko", id: "kasko", icon: Car, href: "/teklif/kasko", color: "bg-indigo-500" },
                            { title: "T. Sağlık", id: "tamamlayici-saglik", icon: Heart, href: "/teklif/tamamlayici-saglik", color: "bg-rose-500" },
                            { title: "Ö. Sağlık", id: "ozel-saglik", icon: Heart, href: "/teklif/ozel-saglik", color: "bg-emerald-500" },
                            { title: "DASK", id: "dask", icon: Home, href: "/teklif/dask", color: "bg-amber-500" },
                            { title: "Konut", id: "konut", icon: Home, href: "/teklif/konut-sigortasi", color: "bg-slate-700" },
                        ].map((item, idx) => {
                            const isCompleted = completedTrainings.includes(item.id)

                            return (
                                <div
                                    key={idx}
                                    onClick={(e) => {
                                        if (!isCompleted) {
                                            e.preventDefault()
                                            setSelectedTraining({ type: item.id, title: item.title })
                                            setIsTrainingOpen(true)
                                        } else {
                                            router.push(item.href)
                                        }
                                    }}
                                    className={`group relative bg-card border rounded-xl p-4 flex flex-col items-center justify-center text-center transition-all cursor-pointer ${isCompleted
                                        ? "hover:shadow-md hover:border-primary/50"
                                        : "opacity-70 grayscale-[0.5] bg-slate-50 border-dashed"
                                        }`}
                                >
                                    {!isCompleted && (
                                        <div className="absolute top-2 right-2 p-1 bg-amber-100 rounded text-amber-600">
                                            <Lock className="h-3 w-3" />
                                        </div>
                                    )}
                                    <div className={`p-3 rounded-lg ${isCompleted ? item.color : 'bg-slate-400'} text-white mb-3 group-hover:scale-110 transition-transform`}>
                                        <item.icon className="h-6 w-6" />
                                    </div>
                                    <span className={`font-bold text-sm ${!isCompleted ? 'text-slate-500' : ''}`}>{item.title}</span>
                                    {!isCompleted && (
                                        <span className="text-[10px] text-amber-600 font-bold mt-1 uppercase tracking-tighter">Eğitim Gerekli</span>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                </div>

                {selectedTraining && (
                    <TrainingDialog
                        isOpen={isTrainingOpen}
                        onClose={() => setIsTrainingOpen(false)}
                        trainingType={selectedTraining.type}
                        trainingTitle={selectedTraining.title}
                        onComplete={() => {
                            setCompletedTrainings(prev => [...prev, selectedTraining.type])
                        }}
                    />
                )}

                <Card>
                    <CardHeader>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <CardTitle>Müşterilerim</CardTitle>
                            <div className="flex gap-2">
                                <Button
                                    variant={leadsFilter === 'all' ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => setLeadsFilter('all')}
                                >
                                    Tümü ({leads.length})
                                </Button>
                                <Button
                                    variant={leadsFilter === 'issued' ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => setLeadsFilter('issued')}
                                >
                                    Poliçeleşenler ({stats.soldLeads})
                                </Button>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {filteredLeads.length === 0 ? (
                            <div className="text-center py-12">
                                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                <h3 className="text-lg font-semibold mb-2">Henüz müşteri yok</h3>
                                <p className="text-muted-foreground mb-4">
                                    Bağlantınızı paylaşarak ilk müşterinizi kazanın
                                </p>
                                <Button onClick={copyAffiliateLink} className="gap-2">
                                    <Copy className="h-4 w-4" />
                                    Bağlantıyı Kopyala
                                </Button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {filteredLeads.map((lead) => (
                                    <div
                                        key={lead.id}
                                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors cursor-pointer"
                                        onClick={() => {
                                            setSelectedLead(lead)
                                            setIsDetailsOpen(true)
                                        }}
                                    >
                                        <div className="flex-1">
                                            <div className="mb-1">
                                                <h4 className="font-bold text-lg text-foreground">
                                                    {lead.full_name || lead.details?.fullName || lead.details?.full_name || 'İsimsiz Müşteri'}
                                                </h4>
                                            </div>
                                            <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                                                <span className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded italic">
                                                    {shortenId(lead.id)}
                                                </span>
                                                <span>•</span>
                                                <span className="font-medium text-primary/80">{lead.type || lead.insurance_type}</span>
                                                <span>•</span>
                                                <span>{new Date(lead.created_at).toLocaleDateString('tr-TR')}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${PROCESS_STEPS.find(s => s.dbStatus === lead.status)?.color || 'bg-gray-100 text-gray-600'
                                                }`}>
                                                {lead.status}
                                            </span>
                                            <ChevronRight className="h-5 w-5 text-muted-foreground" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {isDetailsOpen && selectedLead && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
                        <div className="bg-background rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                            <div className="sticky top-0 bg-background border-b p-6 flex items-center justify-between">
                                <div>
                                    <h2 className="text-2xl font-bold">Müşteri Detayları</h2>
                                    <p className="text-sm text-muted-foreground mt-1">{shortenId(selectedLead.id)}</p>
                                </div>
                                <Button variant="ghost" size="icon" onClick={() => setIsDetailsOpen(false)}>
                                    <X className="h-5 w-5" />
                                </Button>
                            </div>

                            <div className="p-6 space-y-6">
                                <div className="space-y-4">
                                    <h3 className="font-semibold text-lg">Süreç Durumu</h3>
                                    <div className="relative">
                                        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border"></div>
                                        {PROCESS_STEPS.map((step, idx) => {
                                            const currentStepId = getCurrentStep(selectedLead.status)
                                            const isActive = step.id <= currentStepId
                                            const isCurrent = step.id === currentStepId

                                            return (
                                                <div key={step.id} className="relative pl-12 pb-8 last:pb-0">
                                                    <div className={`absolute left-0 w-8 h-8 rounded-full border-2 flex items-center justify-center ${isActive
                                                        ? 'bg-primary border-primary text-primary-foreground'
                                                        : 'bg-background border-border text-muted-foreground'
                                                        }`}>
                                                        {isActive ? <CheckCircle className="h-4 w-4" /> : <div className="w-2 h-2 rounded-full bg-current"></div>}
                                                    </div>
                                                    <div className={`${isCurrent ? 'ring-2 ring-primary/20' : ''} p-4 rounded-lg border ${isActive ? 'bg-accent/50' : 'bg-background'}`}>
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <span className={`font-semibold ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}>
                                                                {step.label}
                                                            </span>
                                                            {isCurrent && (
                                                                <span className="px-2 py-0.5 bg-primary text-primary-foreground text-xs rounded-full">
                                                                    Mevcut
                                                                </span>
                                                            )}
                                                        </div>
                                                        <p className="text-sm text-muted-foreground">{step.description}</p>
                                                        {step.dbStatus === 'Teklif Verildi' && selectedLead.offer_url && (
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                className="mt-4 gap-2 font-bold h-10 rounded-xl border-orange-200 text-orange-600 hover:bg-orange-50 hover:text-orange-700 shadow-sm transition-all active:scale-95"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    setViewerDoc({ type: 'Offer', url: selectedLead.offer_url });
                                                                }}
                                                            >
                                                                <Eye className="h-4 w-4" /> Teklifi Görüntüle
                                                            </Button>
                                                        )}
                                                        {step.dbStatus === 'Satışa Döndü' && selectedLead.policy_url && (
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                className="mt-4 gap-2 font-bold h-10 rounded-xl border-emerald-200 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 shadow-sm transition-all active:scale-95"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    setViewerDoc({ type: 'Policy', url: selectedLead.policy_url });
                                                                }}
                                                            >
                                                                <ShieldCheck className="h-4 w-4" /> Poliçeyi Görüntüle
                                                            </Button>
                                                        )}
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>

                                <div className="border-t pt-6">
                                    <h3 className="font-semibold text-lg mb-4 text-slate-800">Müşteri Bilgileri</h3>
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <div>
                                            <label className="text-sm text-muted-foreground uppercase font-black tracking-widest text-[10px]">Ad Soyad</label>
                                            <p className="font-bold text-slate-900">{selectedLead.full_name || selectedLead.details?.fullName || selectedLead.details?.full_name || 'İsimsiz'}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm text-muted-foreground uppercase font-black tracking-widest text-[10px]">Telefon</label>
                                            <p className="font-bold text-slate-900">{selectedLead.phone}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm text-muted-foreground uppercase font-black tracking-widest text-[10px]">Sigorta Türü</label>
                                            <p className="font-bold text-indigo-600">{selectedLead.insurance_type || selectedLead.type}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm text-muted-foreground uppercase font-black tracking-widest text-[10px]">Talep Tarihi</label>
                                            <p className="font-bold text-slate-900">{new Date(selectedLead.created_at).toLocaleDateString('tr-TR')}</p>
                                        </div>
                                    </div>
                                </div>

                                {(selectedLead.offer_url || selectedLead.policy_url) && (
                                    <div className="border-t pt-6">
                                        <h3 className="font-semibold text-lg mb-4 text-slate-800">Belgeler</h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            {selectedLead.offer_url && (
                                                <Button
                                                    variant="outline"
                                                    className="w-full h-12 gap-3 font-bold border-2 hover:bg-slate-50 rounded-xl"
                                                    onClick={() => setViewerDoc({ type: 'Offer', url: selectedLead.offer_url })}
                                                >
                                                    <FileText className="h-5 w-5 text-indigo-600" />
                                                    Teklif Belgesini Gör
                                                    <Eye className="h-4 w-4 opacity-50" />
                                                </Button>
                                            )}
                                            {selectedLead.policy_url && (
                                                <Button
                                                    variant="outline"
                                                    className="w-full h-12 gap-3 font-bold border-2 hover:bg-slate-50 rounded-xl"
                                                    onClick={() => setViewerDoc({ type: 'Policy', url: selectedLead.policy_url })}
                                                >
                                                    <ShieldCheck className="h-5 w-5 text-green-600" />
                                                    Poliçe Belgesini Gör
                                                    <Eye className="h-4 w-4 opacity-50" />
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {viewerDoc && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-md animate-in fade-in duration-300">
                        <div className="bg-white rounded-3xl shadow-2xl max-w-5xl w-full h-[90vh] flex flex-col overflow-hidden">
                            <div className="flex items-center justify-between p-6 border-b bg-slate-50/50">
                                <div>
                                    <h3 className="text-xl font-black text-slate-900">{viewerDoc.type === 'Offer' ? 'Teklif Belgesi' : 'Poliçe Belgesi'}</h3>
                                    <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">{shortenId(selectedLead.id)}</p>
                                </div>
                                <div className="flex gap-3">
                                    <Button variant="outline" size="sm" asChild className="font-bold gap-2 rounded-xl">
                                        <a href={viewerDoc.url} download target="_blank">
                                            <Download className="h-4 w-4" /> İndir
                                        </a>
                                    </Button>
                                    <Button variant="ghost" size="icon" onClick={() => setViewerDoc(null)} className="rounded-full hover:bg-slate-200">
                                        <X className="h-5 w-5 text-slate-600" />
                                    </Button>
                                </div>
                            </div>
                            <div className="flex-1 bg-slate-100 flex items-center justify-center overflow-auto p-4">
                                {viewerDoc.url.toLowerCase().endsWith('.pdf') ? (
                                    <iframe
                                        src={viewerDoc.url}
                                        className="w-full h-full border-none rounded-xl bg-white shadow-inner"
                                        title={viewerDoc.type === 'Offer' ? 'Teklif Belgesi' : 'Poliçe Belgesi'}
                                    />
                                ) : (
                                    <img
                                        src={viewerDoc.url}
                                        alt="Belge"
                                        className="max-w-full max-h-full object-contain rounded-xl shadow-lg bg-white"
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </main>
            <Footer />
        </div>
    )
}
