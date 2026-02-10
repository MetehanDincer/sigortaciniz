"use client"

import { useEffect, useState, Suspense } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import {
    Users,
    UserPlus,
    Trash2,
    Shield,
    Loader2,
    ArrowLeft,
    Search,
    UserCircle,
    CheckCircle2,
    BarChart3,
    Coffee,
    Utensils,
    Activity
} from "lucide-react"

export default function TeamManagementPage() {
    return <TeamManagementContent />
}

function TeamManagementContent() {
    const router = useRouter()
    const supabase = createClient()
    const [loading, setLoading] = useState(true)
    const [addingRep, setAddingRep] = useState(false)
    const [adminProfile, setAdminProfile] = useState<any>(null)
    const [agency, setAgency] = useState<any>(null)
    const [reps, setReps] = useState<any[]>([])
    const [searchTerm, setSearchTerm] = useState("")

    const [newRep, setNewRep] = useState({
        email: "",
        full_name: ""
    })

    const loadData = async () => {
        try {
            setLoading(true)
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) {
                router.push("/admin/giris")
                return
            }

            const { data: profile } = await supabase
                .from('admin_profiles')
                .select('*, agency:agencies(*)')
                .eq('id', user.id)
                .single()

            if (profile?.role !== 'super_admin' && profile?.role !== 'agency_admin') {
                router.push("/admin/operasyon")
                return
            }

            setAdminProfile(profile)
            if (profile.agency) {
                setAgency(profile.agency)
                await loadReps(profile.agency.id)
            }
        } catch (error) {
            console.error("Yükleme hatası:", error)
        } finally {
            setLoading(false)
        }
    }

    const loadReps = async (agencyId: string) => {
        const { data: repsData } = await supabase
            .from('admin_profiles')
            .select('*')
            .eq('agency_id', agencyId)
            .order('created_at', { ascending: false })

        if (repsData) {
            // Fetch stats for each rep (workload and sales)
            const repsWithStats = await Promise.all(repsData.map(async (rep: any) => {
                const { count: workload } = await supabase
                    .from('leads')
                    .select('*', { count: 'exact', head: true })
                    .eq('assigned_admin_id', rep.id)
                    .in('status', ['Bekliyor', 'İnceleniyor', 'Teklif Verildi', 'Ödeme Alınıyor'])

                const { count: sales } = await supabase
                    .from('leads')
                    .select('*', { count: 'exact', head: true })
                    .eq('assigned_admin_id', rep.id)
                    .eq('status', 'Satışa Döndü')

                return {
                    ...rep,
                    workload: workload || 0,
                    sales_count: sales || 0
                }
            }))
            setReps(repsWithStats)
        }
    }

    useEffect(() => {
        loadData()
    }, [router])

    const handleAddRep = async () => {
        if (!newRep.email || !newRep.full_name) {
            toast.error("Lütfen tüm alanları doldurun.")
            return
        }

        setAddingRep(true)
        try {
            // 1. Find user by email in profiles
            const { data: profileData, error: profileError } = await supabase
                .from('profiles')
                .select('id')
                .eq('email', newRep.email)
                .single()

            if (profileError || !profileData) {
                toast.error("Bu e-posta ile kayıtlı bir kullanıcı bulunamadı. Lütfen önce temsilcinin siteye kayıt olmasını isteyin.")
                return
            }

            // 2. Create admin_profile
            const { error: adminError } = await supabase
                .from('admin_profiles')
                .insert({
                    id: profileData.id,
                    full_name: newRep.full_name,
                    admin_code: `REP-${Math.floor(1000 + Math.random() * 9000)}`,
                    role: 'rep',
                    agency_id: agency.id,
                    is_active: true
                })

            if (adminError) {
                if (adminError.code === '23505') {
                    toast.error("Bu kullanıcı zaten bir acenteye kayıtlı.")
                } else {
                    throw adminError
                }
                return
            }

            toast.success("Temsilci başarıyla eklendi.")
            setNewRep({ email: "", full_name: "" })
            loadReps(agency.id)
        } catch (error: any) {
            toast.error("Hata: " + error.message)
        } finally {
            setAddingRep(false)
        }
    }

    const handleDeleteRep = async (repId: string) => {
        if (!confirm("Bu temsilciyi silmek istediğinize emin misiniz? Bu işlem geri alınamaz.")) return

        try {
            const { error } = await supabase
                .from('admin_profiles')
                .delete()
                .eq('id', repId)

            if (error) throw error
            toast.success("Temsilci başarıyla silindi.")
            loadReps(agency.id)
        } catch (error: any) {
            toast.error("Hata: " + error.message)
        }
    }

    const filteredReps = reps.filter(rep =>
        rep.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rep.admin_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rep.id.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="min-h-screen flex flex-col bg-slate-50">
            <Header agency={agency} />
            <main className="flex-grow container max-w-6xl mx-auto px-4 py-8">
                {loading ? (
                    <div className="flex-grow flex items-center justify-center min-h-[400px]">
                        <div className="flex flex-col items-center gap-3">
                            <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
                            <p className="font-bold text-indigo-600">Ekip Bilgileri Yükleniyor...</p>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Header Section */}
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
                            <div className="flex items-center gap-4">
                                <Button variant="ghost" size="icon" onClick={() => router.push('/admin/yonetim')} className="rounded-full hover:bg-white shadow-sm">
                                    <ArrowLeft className="h-5 w-5" />
                                </Button>
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="bg-indigo-600 text-white text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider">
                                            CFU EKİP
                                        </span>
                                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Ekip Yönetimi</h1>
                                    </div>
                                    <p className="text-slate-500 font-medium">Acentenize bağlı temsilcilerin performansını ve durumunu yönetin.</p>
                                </div>
                            </div>

                            <div className="flex bg-white p-1 rounded-2xl shadow-sm border border-slate-100 w-full md:w-auto">
                                <div className="relative flex-grow md:w-64">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                    <Input
                                        placeholder="İsim veya kod ile ara..."
                                        className="pl-10 border-none bg-transparent focus-visible:ring-0 h-10 font-medium"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Left: Add New Rep Form */}
                            <div className="lg:col-span-1">
                                <Card className="border-none shadow-sm overflow-hidden sticky top-24">
                                    <CardHeader className="bg-white border-b border-slate-100">
                                        <div className="flex items-center gap-2 text-indigo-600">
                                            <UserPlus className="h-5 w-5" />
                                            <CardTitle className="text-lg">Yeni Temsilci Ekle</CardTitle>
                                        </div>
                                        <CardDescription>Sisteme kayıtlı bir kullanıcıyı ekibinize dahil edin.</CardDescription>
                                    </CardHeader>
                                    <CardContent className="p-6 space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="rep-name" className="text-xs uppercase font-bold text-slate-500">Ad Soyad</Label>
                                            <Input
                                                id="rep-name"
                                                value={newRep.full_name}
                                                onChange={(e) => setNewRep({ ...newRep, full_name: e.target.value })}
                                                placeholder="Örn: Ahmet Yılmaz"
                                                className="rounded-xl border-slate-200"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="rep-email" className="text-xs uppercase font-bold text-slate-500">E-Posta Adresi</Label>
                                            <Input
                                                id="rep-email"
                                                type="email"
                                                value={newRep.email}
                                                onChange={(e) => setNewRep({ ...newRep, email: e.target.value })}
                                                placeholder="temsilci@email.com"
                                                className="rounded-xl border-slate-200"
                                            />
                                        </div>
                                        <Button
                                            onClick={handleAddRep}
                                            className="w-full font-black py-6 rounded-xl shadow-lg shadow-indigo-200 transition-all hover:scale-[1.02] active:scale-[0.98]"
                                            disabled={addingRep}
                                        >
                                            {addingRep ? <Loader2 className="h-5 w-5 animate-spin" /> : "Temsilciyi Yetkilendir"}
                                        </Button>
                                        <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 mt-2">
                                            <p className="text-[10px] text-amber-700 leading-relaxed font-bold">
                                                ÖNEMLİ: Temsilcinin bu e-posta adresi ile uygulamaya önceden üye olmuş olması gerekmektedir.
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Right: Rep List */}
                            <div className="lg:col-span-2 space-y-6">
                                {/* Stats mini grid */}
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    <Card className="border-none shadow-sm bg-indigo-600 text-white">
                                        <CardContent className="p-4 flex flex-col items-center justify-center">
                                            <Users className="h-8 w-8 mb-1 opacity-80" />
                                            <span className="text-2xl font-black">{reps.length}</span>
                                            <span className="text-[10px] font-bold uppercase opacity-80">Toplam Ekip</span>
                                        </CardContent>
                                    </Card>
                                    <Card className="border-none shadow-sm bg-white">
                                        <CardContent className="p-4 flex flex-col items-center justify-center">
                                            <CheckCircle2 className="h-8 w-8 mb-1 text-green-500" />
                                            <span className="text-2xl font-black">{reps.filter(r => r.sales_count > 0).length}</span>
                                            <span className="text-[10px] font-bold uppercase text-slate-400">Aktif Satışçı</span>
                                        </CardContent>
                                    </Card>
                                    <Card className="border-none shadow-sm bg-white hidden md:flex">
                                        <CardContent className="p-4 flex flex-col items-center justify-center">
                                            <BarChart3 className="h-8 w-8 mb-1 text-amber-500" />
                                            <span className="text-2xl font-black italic">
                                                {reps.reduce((acc, current) => acc + current.workload, 0)}
                                            </span>
                                            <span className="text-[10px] font-bold uppercase text-slate-400">Toplam İş Yükü</span>
                                        </CardContent>
                                    </Card>
                                </div>

                                {/* Rep Table/List */}
                                <Card className="border-none shadow-sm overflow-hidden bg-white">
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left">
                                            <thead className="bg-slate-50 border-b border-slate-100 text-[10px] uppercase font-black text-slate-400 tracking-wider">
                                                <tr>
                                                    <th className="px-6 py-4">Temsilci</th>
                                                    <th className="px-6 py-4 text-center">Durum</th>
                                                    <th className="px-6 py-4 text-center">İş Yükü</th>
                                                    <th className="px-6 py-4 text-right">Performans (Poliçe)</th>
                                                    <th className="px-6 py-4 text-right">İşlem</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100">
                                                {filteredReps.length === 0 ? (
                                                    <tr>
                                                        <td colSpan={4} className="px-6 py-12 text-center">
                                                            <div className="flex flex-col items-center justify-center opacity-40">
                                                                <Search className="h-10 w-10 mb-2" />
                                                                <p className="font-bold">Eşleşen temsilci bulunamadı.</p>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ) : (
                                                    filteredReps.map((rep) => (
                                                        <tr key={rep.id} className="hover:bg-slate-50/50 transition-colors group">
                                                            <td className="px-6 py-4">
                                                                <div className="flex items-center gap-3">
                                                                    <div className="h-10 w-10 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm">
                                                                        {rep.full_name?.slice(0, 2).toUpperCase()}
                                                                    </div>
                                                                    <div>
                                                                        <div className="font-bold text-slate-900 flex items-center gap-2 italic">
                                                                            {rep.full_name || 'İsimsiz'}
                                                                            {rep.role === 'agency_admin' && <Shield className="h-3 w-3 text-amber-500" />}
                                                                        </div>
                                                                        <div className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded w-fit mt-0.5 tracking-widest">
                                                                            {rep.admin_code}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4 text-center">
                                                                <div className="flex flex-col items-center">
                                                                    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${rep.status === 'Aktif' ? 'bg-green-100 text-green-700' :
                                                                        rep.status === 'Mola' ? 'bg-amber-100 text-amber-700' :
                                                                            rep.status === 'Yemekte' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-500'
                                                                        }`}>
                                                                        {rep.status === 'Aktif' && <Activity className="h-3 w-3 animate-pulse" />}
                                                                        {rep.status === 'Mola' && <Coffee className="h-3 w-3" />}
                                                                        {rep.status === 'Yemekte' && <Utensils className="h-3 w-3" />}
                                                                        {rep.status || 'Pasif'}
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4 text-center">
                                                                <div className="flex flex-col items-center">
                                                                    <span className={`font-black text-sm px-3 py-1 rounded-full ${rep.workload > 5 ? 'bg-amber-100 text-amber-700' : 'bg-green-50 text-green-700'}`}>
                                                                        {rep.workload}
                                                                    </span>
                                                                    <span className="text-[9px] font-bold text-slate-400 uppercase mt-1">Aktif Dosya</span>
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4 text-right">
                                                                <div className="flex flex-col items-end">
                                                                    <div className="flex items-center gap-1 font-black text-slate-700 text-lg">
                                                                        {rep.sales_count}
                                                                    </div>
                                                                    <span className="text-[9px] font-bold text-slate-400 uppercase">Toplam Satış</span>
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4 text-right">
                                                                {(adminProfile?.id !== rep.id && rep.role !== 'super_admin') ? (
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="icon"
                                                                        className="text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-full transition-all"
                                                                        onClick={() => handleDeleteRep(rep.id)}
                                                                    >
                                                                        <Trash2 className="h-4 w-4" />
                                                                    </Button>
                                                                ) : (
                                                                    <span className="text-[9px] font-bold text-slate-300 bg-slate-100 px-2 py-1 rounded italic">Sınırlı</span>
                                                                )}
                                                            </td>
                                                        </tr>
                                                    ))
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </Card>
                            </div>
                        </div>
                    </>
                )}
            </main>
            <Footer />
        </div>
    )
}
