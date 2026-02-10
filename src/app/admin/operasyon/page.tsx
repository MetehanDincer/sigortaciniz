"use client"

import { useEffect, useState, Suspense } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
    Users,
    FileText,
    CheckCircle,
    Wallet,
    LogOut,
    Eye,
    X,
    ChevronRight,
    Clock,
    ShieldCheck,
    Filter,
    RefreshCw,
    UserCircle,
    Calculator,
    Check,
    TrendingUp,
    UploadCloud,
    Download,
    Mail,
    Coffee,
    Utensils,
    Activity,
    ChevronDown,
    Loader2
} from "lucide-react"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { toast } from "sonner"

import { EarningsModal } from "@/components/admin/earnings-modal"
import { AdminChatDialog } from "@/components/admin/admin-chat-dialog"

const shortenId = (id: string) => id ? `#T-${id.slice(0, 8).toUpperCase()}` : "";

export default function AdminDashboardPage() {
    return <AdminDashboardContent />
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

function AdminDashboardContent() {
    const router = useRouter()
    const supabase = createClient()
    const [adminProfile, setAdminProfile] = useState<any>(null)
    const [stats, setStats] = useState({
        totalLeads: 0,
        activeAdmins: 0,
        myLeads: 0,
        completedSales: 0
    })

    const [leads, setLeads] = useState<any[]>([])
    const [admins, setAdmins] = useState<any[]>([])
    const [filter, setFilter] = useState<'all' | 'mine'>('all')
    const [selectedLead, setSelectedLead] = useState<any>(null)
    const [isDetailsOpen, setIsDetailsOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [leadLogs, setLeadLogs] = useState<any[]>([])
    const [viewerDoc, setViewerDoc] = useState<{ type: 'Offer' | 'Policy', url: string } | null>(null)
    const [isEarningsModalOpen, setIsEarningsModalOpen] = useState(false)
    const [isUploading, setIsUploading] = useState(false)

    useEffect(() => {
        if (selectedLead) {
            const fetchLogs = async () => {
                const { data } = await supabase
                    .from('lead_logs')
                    .select('*, admin_profiles(admin_code)')
                    .eq('lead_id', selectedLead.id)
                    .order('created_at', { ascending: false })
                if (data) setLeadLogs(data)
            }
            fetchLogs()
        }
    }, [selectedLead, supabase])

    const handleUpdateStatus = async (newStatus: string) => {
        if (!selectedLead || !adminProfile) return

        const { error: updateError } = await supabase
            .from('leads')
            .update({ status: newStatus })
            .eq('id', selectedLead.id)

        if (!updateError) {
            await supabase.from('lead_logs').insert({
                lead_id: selectedLead.id,
                admin_id: adminProfile.id,
                action: 'STATUS_CHANGE',
                details: `Durum "${newStatus}" olarak güncellendi.`
            })

            setLeads(leads.map(l => l.id === selectedLead.id ? { ...l, status: newStatus } : l))
            setSelectedLead({ ...selectedLead, status: newStatus })

            const { data } = await supabase
                .from('lead_logs')
                .select('*, admin_profiles(admin_code)')
                .eq('lead_id', selectedLead.id)
                .order('created_at', { ascending: false })
            if (data) setLeadLogs(data)
        }
    }

    const handleReassign = async (targetAdminId: string) => {
        if (!selectedLead || !adminProfile) return

        const targetAdmin = admins.find(a => a.id === targetAdminId)
        if (!targetAdmin) return

        const { error: updateError } = await supabase
            .from('leads')
            .update({ assigned_admin_id: targetAdminId })
            .eq('id', selectedLead.id)

        if (!updateError) {
            await supabase.from('lead_logs').insert({
                lead_id: selectedLead.id,
                admin_id: adminProfile.id,
                action: 'REASSIGNED',
                details: `İşlem ${adminProfile.admin_code}'den ${targetAdmin.admin_code} kodlu admine devredildi.`
            })

            setLeads(leads.map(l => l.id === selectedLead.id ? { ...l, assigned_admin_id: targetAdminId, assigned_admin: { admin_code: targetAdmin.admin_code } } : l))
            setSelectedLead({ ...selectedLead, assigned_admin_id: targetAdminId, assigned_admin: { admin_code: targetAdmin.admin_code } })
            setIsDetailsOpen(false)
            alert(`İşlem başarıyla ${targetAdmin.admin_code} kodlu admine devredildi.`)
        }
    }

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, fieldName: 'offer_url' | 'policy_url') => {
        const file = e.target.files?.[0]
        if (!file || !selectedLead) return

        setIsUploading(true)
        try {
            const fileExt = file.name.split('.').pop()
            const safeName = file.name.split('.')[0].replace(/[^a-z0-9]/gi, '_').toLowerCase();
            const fileName = `${selectedLead.id}-${fieldName}-${safeName}-${Math.random().toString(36).substring(7)}.${fileExt}`
            const filePath = `${fileName}`

            const { error: uploadError } = await supabase.storage
                .from('leads')
                .upload(filePath, file, {
                    cacheControl: '3600',
                    contentType: file.type,
                    upsert: false
                })

            if (uploadError) {
                console.error("❌ Dosya yükleme (storage) hatası:", uploadError);
                throw uploadError;
            }

            const { data: { publicUrl } } = supabase.storage
                .from('leads')
                .getPublicUrl(filePath)

            const { error: updateError } = await supabase
                .from('leads')
                .update({ [fieldName]: publicUrl })
                .eq('id', selectedLead.id)

            if (updateError) {
                console.error("❌ Veritabanı URL güncelleme hatası:", updateError);
                throw updateError;
            }

            // Log the action
            await supabase.from('lead_logs').insert({
                lead_id: selectedLead.id,
                admin_id: adminProfile.id,
                action: 'DOCUMENT_UPLOAD',
                details: `${fieldName === 'offer_url' ? 'Teklif' : 'Poliçe'} belgesi yüklendi.`
            })

            const updatedLead = { ...selectedLead, [fieldName]: publicUrl }
            setSelectedLead(updatedLead)
            setLeads(leads.map(l => l.id === selectedLead.id ? updatedLead : l))

            // Refresh logs
            const { data: logs } = await supabase
                .from('lead_logs')
                .select('*, admin_profiles(admin_code)')
                .eq('lead_id', selectedLead.id)
                .order('created_at', { ascending: false })
            if (logs) setLeadLogs(logs)

            alert("Dosya başarıyla yüklendi.")
        } catch (error: any) {
            console.error("Upload error:", error)
            alert("Dosya yüklenirken hata oluştu: " + error.message)
        } finally {
            setIsUploading(false)
        }
    }

    const handleAdminStatusChange = async (newStatus: string) => {
        if (!adminProfile) return

        try {
            const { error } = await supabase
                .from('admin_profiles')
                .update({ status: newStatus })
                .eq('id', adminProfile.id)

            if (error) throw error

            setAdminProfile({ ...adminProfile, status: newStatus })
            toast.success(`Durumunuz "${newStatus}" olarak güncellendi.`)
        } catch (error: any) {
            toast.error("Durum güncellenemedi: " + error.message)
        }
    }

    useEffect(() => {
        const getData = async () => {
            try {
                setIsLoading(true)
                const { data: { user } } = await supabase.auth.getUser()

                if (!user) {
                    router.push("/admin/giris")
                    return
                }

                // Fetch current admin profile
                // Fetch current admin profile
                const { data: currentAdmin, error: adminError } = await supabase
                    .from('admin_profiles')
                    .select('*')
                    .eq('id', user.id)
                    .single()

                if (adminError || !currentAdmin) {
                    console.error("Admin Login Error:", adminError)
                    router.push('/admin/giris')
                    return
                }

                setAdminProfile(currentAdmin)

                // --- SIMPLIFIED FETCH FOR DEBUGGING ---
                console.log("Admin Panel: Fetching leads for admin:", currentAdmin.admin_code)

                const { data: leadsData, error: leadsError } = await supabase
                    .from('leads')
                    .select('*') // REMOVED JOIN TEMPORARILY
                    .order('created_at', { ascending: false })

                console.log("Admin Panel - Raw Leads Result:", {
                    count: leadsData?.length || 0,
                    error: leadsError,
                    firstId: leadsData?.[0]?.id
                })

                const { data: adminsData } = await supabase
                    .from('admin_profiles')
                    .select('*')

                if (adminsData) setAdmins(adminsData)

                // Map admin codes manually for display since we removed the join
                let leadsWithAdmins = (leadsData || []).map((l: any) => {
                    const asAdmin = adminsData?.find((a: any) => a.id === l.assigned_admin_id)
                    return {
                        ...l,
                        assigned_admin: asAdmin ? { admin_code: asAdmin.admin_code } : null
                    }
                })

                // --- FETCH PARTNER NAMES ---
                let leadsWithPartners = leadsWithAdmins
                if (leadsData && leadsData.length > 0) {
                    const affiliateIds = Array.from(new Set(leadsData.filter((l: any) => l.affiliate_id).map((l: any) => l.affiliate_id)))
                    if (affiliateIds.length > 0) {
                        const { data: profiles } = await supabase
                            .from('profiles')
                            .select('affiliate_id, full_name, email')
                            .in('affiliate_id', affiliateIds)

                        if (profiles) {
                            leadsWithPartners = leadsWithAdmins.map((l: any) => {
                                const p = profiles.find((profile: any) => profile.affiliate_id === l.affiliate_id)
                                return {
                                    ...l,
                                    partner_name: p?.full_name,
                                    partner_email: p?.email
                                }
                            })
                        }
                    }
                }
                // ---------------------------

                setLeads(leadsWithPartners)

                setStats({
                    totalLeads: leadsData?.length || 0,
                    activeAdmins: adminsData?.filter((a: any) => a.is_active).length || 0,
                    myLeads: leadsData?.filter((l: any) => l.assigned_admin_id === user.id).length || 0,
                    completedSales: leadsData?.filter((l: any) => l.status === 'Satışa Döndü' || l.status === 'Kazanç Yansıtıldı').length || 0
                })
            } catch (error) {
                console.error("❌ Veri çekme hatası:", error)
            } finally {
                setIsLoading(false)
            }
        }
        getData()
    }, [router])

    const handleLogout = async () => {
        await supabase.auth.signOut()
        router.push("/admin/giris")
        router.refresh()
    }

    const filteredLeads = filter === 'mine'
        ? leads.filter(l => l.assigned_admin_id === adminProfile?.id)
        : leads

    return (
        <div className="min-h-screen flex flex-col bg-slate-50">
            <Header />
            <main className="flex-grow container max-w-screen-2xl mx-auto px-4 py-8">
                {isLoading ? (
                    <div className="flex-grow flex items-center justify-center min-h-[400px]">
                        <div className="flex flex-col items-center gap-3">
                            <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
                            <p className="font-bold text-indigo-600">İşlemler Yükleniyor...</p>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Admin Header */}
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="bg-slate-900 text-white text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider">
                                        {adminProfile?.admin_code}
                                    </span>
                                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Temsilci Paneli</h1>
                                </div>
                                <p className="text-slate-500 font-medium">Hoş geldin, {adminProfile?.full_name}. Tüm operasyonları buradan yönetebilirsin.</p>
                            </div>
                            <div className="flex items-center gap-3">
                                {/* Status Selector */}
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline" className="gap-2 font-bold shadow-sm h-10 px-4 border-slate-200">
                                            <div className={`h-2 w-2 rounded-full ${adminProfile?.status === 'Aktif' ? 'bg-green-500 animate-pulse' :
                                                adminProfile?.status === 'Mola' ? 'bg-amber-500' :
                                                    adminProfile?.status === 'Yemekte' ? 'bg-blue-500' : 'bg-slate-400'
                                                }`} />
                                            {adminProfile?.status || 'Durum Seç'}
                                            <ChevronDown className="h-4 w-4 opacity-50" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-48 p-2 rounded-xl shadow-xl border-slate-100">
                                        <DropdownMenuItem onClick={() => handleAdminStatusChange('Aktif')} className="rounded-lg p-3 cursor-pointer flex items-center gap-2 font-semibold text-green-700">
                                            <Activity className="h-4 w-4" /> Aktif
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleAdminStatusChange('Mola')} className="rounded-lg p-3 cursor-pointer flex items-center gap-2 font-semibold text-amber-700">
                                            <Coffee className="h-4 w-4" /> Mola
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleAdminStatusChange('Yemekte')} className="rounded-lg p-3 cursor-pointer flex items-center gap-2 font-semibold text-blue-700">
                                            <Utensils className="h-4 w-4" /> Yemekte
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleAdminStatusChange('Pasif')} className="rounded-lg p-3 cursor-pointer flex items-center gap-2 font-semibold text-slate-600">
                                            <X className="h-4 w-4" /> Pasif
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>

                                {adminProfile?.cfu_authorized && (
                                    <Button asChild variant="default" className="gap-2 font-black shadow-lg bg-indigo-600 hover:bg-indigo-700 h-10 px-6">
                                        <Link href="/admin/yonetim"><TrendingUp className="h-4 w-4" /> Yönetim Paneli</Link>
                                    </Button>
                                )}
                                <Button variant="outline" className="gap-2 font-bold shadow-sm h-10 px-4 text-red-600 border-red-50 hover:bg-red-50" onClick={handleLogout}>
                                    <LogOut className="h-4 w-4" /> Güvenli Çıkış
                                </Button>
                                <AdminChatDialog />
                            </div>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                            <AdminStatCard
                                title="Toplam Teklif"
                                value={stats.totalLeads}
                                icon={<FileText className="h-6 w-6 text-blue-500" />}
                                onClick={() => setFilter('all')}
                                active={filter === 'all'}
                            />
                            <AdminStatCard
                                title="Üzerimdeki İşler"
                                value={stats.myLeads}
                                icon={<UserCircle className="h-6 w-6 text-indigo-500" />}
                                onClick={() => setFilter('mine')}
                                active={filter === 'mine'}
                            />
                            <AdminStatCard
                                title="Tamamlanan Satış"
                                value={stats.completedSales}
                                icon={<CheckCircle className="h-6 w-6 text-green-500" />}
                            />
                            <AdminStatCard
                                title="Aktif Admin"
                                value={stats.activeAdmins}
                                icon={<ShieldCheck className="h-6 w-6 text-amber-500" />}
                            />
                        </div>

                        {/* Leads Table */}
                        <Card className="shadow-sm border-none overflow-hidden mb-10">
                            <CardHeader className="bg-white border-b border-slate-100 flex flex-row items-center justify-between">
                                <CardTitle className="text-xl font-bold">Süreç Takibi & Teklif Yönetimi</CardTitle>
                                <div className="flex items-center gap-2">
                                    <Button variant="ghost" size="sm" onClick={() => window.location.reload()}><RefreshCw className="h-4 w-4 mr-2" /> Yenile</Button>
                                </div>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-slate-50/50 text-[11px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                                                <th className="px-6 py-4">Tarih</th>
                                                <th className="px-6 py-4">Teklif No</th>
                                                <th className="px-6 py-4">Hizmet</th>
                                                <th className="px-6 py-4">Atanan Admin</th>
                                                <th className="px-6 py-4">Durum</th>
                                                <th className="px-6 py-4">Kanal</th>
                                                <th className="px-6 py-4 text-right">İşlem</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100 italic">
                                            {filteredLeads.map((lead) => (
                                                <tr key={lead.id} className={`hover:bg-slate-50/50 transition-colors group ${selectedLead?.id === lead.id ? 'bg-indigo-50/30' : ''}`}>
                                                    <td className="px-6 py-4">
                                                        <div className="text-sm font-bold text-slate-900">{new Date(lead.created_at).toLocaleDateString('tr-TR')}</div>
                                                        <div className="text-[10px] text-slate-400 font-medium">{new Date(lead.created_at).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}</div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className="text-sm font-mono font-black text-indigo-600 bg-indigo-50 px-2 py-1 rounded">
                                                            {shortenId(lead.id)}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className="text-sm font-bold text-slate-700">{lead.type}</span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-2">
                                                            <span className={`text-[10px] font-black px-2 py-0.5 rounded uppercase ${lead.assigned_admin_id === adminProfile?.id ? 'bg-primary text-white' : 'bg-slate-200 text-slate-600'}`}>
                                                                {lead.assigned_admin?.admin_code || "Atanmadı"}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <StatusBadge status={lead.status} />
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <ChannelBadge lead={lead} />
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <Button
                                                            size="sm"
                                                            variant={selectedLead?.id === lead.id ? "default" : "outline"}
                                                            className="font-bold gap-2 group-hover:scale-105 transition-transform"
                                                            onClick={() => {
                                                                setSelectedLead(lead)
                                                                setIsDetailsOpen(true)
                                                            }}
                                                        >
                                                            <Eye className="h-4 w-4" /> Detaylar
                                                        </Button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Admin Lead Details Modal */}
                        {isDetailsOpen && selectedLead && (
                            <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                                <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsDetailsOpen(false)} />
                                <div className="relative bg-white w-full max-w-6xl rounded-3xl shadow-2xl overflow-y-auto border border-slate-100 flex flex-col max-h-[90vh] animate-in fade-in zoom-in duration-200">
                                    {/* Scrollable Modal Content (Header + Body together) */}
                                    <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white shrink-0">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600">
                                                <FileText className="h-6 w-6" />
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">Operasyon Yönetimi</h3>
                                                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-0.5">
                                                    {shortenId(selectedLead.id)} — {selectedLead.type}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="flex flex-col items-end mr-4">
                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Atanan Admin</span>
                                                <span className="text-sm font-black text-indigo-600">{selectedLead.assigned_admin?.admin_code}</span>
                                            </div>
                                            <button
                                                onClick={() => setIsDetailsOpen(false)}
                                                className="p-2 hover:bg-slate-200 rounded-full transition-colors z-[120]"
                                                title="Kapat"
                                            >
                                                <X className="h-5 w-5 text-slate-500" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Modal Body - Stacks on mobile, side-by-side on desktop */}
                                    <div className="flex flex-col lg:flex-row flex-1">
                                        {/* Left: Lead Details & Process */}
                                        <div className="flex-1 p-8 space-y-8 lg:border-r border-slate-100 bg-white">
                                            {/* Status Steps */}
                                            <div className="space-y-4">
                                                <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                                    <RefreshCw className="h-4 w-4" /> Süreç Güncelle
                                                </h4>
                                                <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
                                                    {['Bekliyor', 'Teklif Verildi', 'Ödeme Alınıyor', 'Satışa Döndü', 'Kazanç Yansıtıldı'].map((s) => (
                                                        <button
                                                            key={s}
                                                            onClick={() => handleUpdateStatus(s)}
                                                            className={`p-3 rounded-2xl border-2 transition-all text-center h-20 flex flex-col items-center justify-center gap-1 ${selectedLead.status === s
                                                                ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20 scale-105'
                                                                : 'bg-white border-slate-100 text-slate-600 hover:border-primary/20'}`}
                                                        >
                                                            <span className="text-[10px] font-black uppercase leading-tight">{s}</span>
                                                            {selectedLead.status === s && <CheckCircle className="h-4 w-4" />}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Form Content */}
                                            <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                                <Eye className="h-4 w-4" /> Form Bilgileri
                                            </h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                {/* Reference Info Block */}
                                                {(selectedLead.affiliate_id || selectedLead.details?.referral_source) && (
                                                    <div className="col-span-full flex flex-col p-4 rounded-2xl bg-indigo-50 border border-indigo-100">
                                                        <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-1">Referans Kaynağı</span>
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-lg font-black text-indigo-900">
                                                                {selectedLead.partner_name || selectedLead.affiliate_id || "Bilinmiyor"}
                                                            </span>
                                                            {selectedLead.partner_email && (
                                                                <a
                                                                    href={`mailto:${selectedLead.partner_email}?subject=Poliçe Bilgilendirmesi - ${shortenId(selectedLead.id)}`}
                                                                    className="text-xs font-bold text-indigo-600 bg-indigo-100/50 px-3 py-1 rounded-lg hover:bg-indigo-600 hover:text-white transition-all flex items-center gap-2"
                                                                    title="E-posta Gönder"
                                                                >
                                                                    <Mail className="h-3 w-3" />
                                                                    {selectedLead.partner_email}
                                                                </a>
                                                            )}
                                                            {selectedLead.details?.referral_source && (
                                                                <span className="text-xs font-bold uppercase bg-white text-indigo-600 px-2 py-1 rounded border border-indigo-200">
                                                                    {selectedLead.details.referral_source === 'qr' ? 'QR Kod' :
                                                                        selectedLead.details.referral_source === 'link' ? 'Paylaşım Linki' :
                                                                            selectedLead.details.referral_source}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <span className="text-[10px] text-indigo-400 font-medium mt-1">
                                                            İş Ortağı Kodu: {selectedLead.affiliate_id || "-"}
                                                        </span>
                                                    </div>
                                                )}

                                                {Object.entries(selectedLead.details).map(([key, value]: [string, any]) => {
                                                    if (key === 'referral_source') return null;
                                                    return (
                                                        <div key={key} className="flex flex-col p-4 rounded-2xl bg-slate-50 border border-slate-100/50">
                                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{getLabel(key)}</span>
                                                            <span className="text-sm font-extrabold text-slate-900">{String(value)}</span>
                                                        </div>
                                                    )
                                                })}
                                            </div>

                                            {/* Documents Section (NEWly restored) */}
                                            <div className="space-y-4 pt-4 border-t border-slate-100">
                                                <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                                    <FileText className="h-4 w-4" /> Belgeler & Dosyalar
                                                </h4>
                                                <div className="grid grid-cols-1 gap-4">
                                                    {/* Offer Document */}
                                                    <div className="p-4 rounded-2xl border border-slate-100 space-y-3 bg-white">
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-xs font-black text-slate-400 uppercase">Teklif Belgesi</span>
                                                            {selectedLead.offer_url && (
                                                                <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded">Yüklendi</span>
                                                            )}
                                                        </div>
                                                        <div className="flex gap-2">
                                                            {selectedLead.offer_url ? (
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    className="flex-1 font-bold gap-2"
                                                                    onClick={() => setViewerDoc({ type: 'Offer', url: selectedLead.offer_url })}
                                                                >
                                                                    <Eye className="h-4 w-4" /> Görüntüle
                                                                </Button>
                                                            ) : (
                                                                <div className="flex-1 relative">
                                                                    <input
                                                                        type="file"
                                                                        accept="image/*,.pdf"
                                                                        className="hidden"
                                                                        id="offer-upload"
                                                                        onChange={(e) => handleFileUpload(e, 'offer_url')}
                                                                    />
                                                                    <Button asChild variant="outline" size="sm" className="w-full font-bold gap-2 cursor-pointer" disabled={isUploading}>
                                                                        <label htmlFor="offer-upload" className="cursor-pointer">
                                                                            {isUploading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <UploadCloud className="h-4 w-4" />}
                                                                            {isUploading ? "Yükleniyor..." : "Teklif Yükle"}
                                                                        </label>
                                                                    </Button>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            {/* Devret (Reassign) - Moved inside scrollable area for better flow */}
                                            <div className="p-6 rounded-3xl bg-slate-900 text-white space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <RefreshCw className="h-5 w-5 text-indigo-400" />
                                                        <div>
                                                            <h4 className="font-bold">İşlemi Devret</h4>
                                                            <p className="text-xs text-slate-400 font-medium">Bu teklifi başka bir adminin üzerine atayın.</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex flex-wrap gap-2 pt-2">
                                                    {admins.filter(a => a.id !== selectedLead.assigned_admin_id).map(admin => (
                                                        <button
                                                            key={admin.id}
                                                            onClick={() => handleReassign(admin.id)}
                                                            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs font-black transition-colors border border-slate-700"
                                                        >
                                                            {admin.admin_code} ({admin.full_name})
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Right: Timeline / Logs */}
                                        <div className="w-full lg:w-80 bg-slate-50 p-6 space-y-6 shrink-0 lg:border-l border-slate-100">
                                            <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                                <Clock className="h-4 w-4" /> İşlem Geçmişi
                                            </h4>
                                            <div className="space-y-6 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                                                {leadLogs.map((log) => (
                                                    <div key={log.id} className="relative pl-8">
                                                        <div className="absolute left-0 top-1 w-6 h-6 bg-white rounded-full border-2 border-primary flex items-center justify-center z-10">
                                                            <div className="w-2 h-2 bg-primary rounded-full" />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <div className="flex justify-between items-center">
                                                                <span className="text-[10px] font-black text-primary uppercase tracking-wider">{log.action}</span>
                                                                <span className="text-[10px] text-slate-400 font-bold italic">{new Date(log.created_at).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}</span>
                                                            </div>
                                                            <p className="text-xs font-extrabold text-slate-700 leading-relaxed">{log.details}</p>
                                                            <div className="text-[10px] text-slate-400 font-bold flex items-center gap-1">
                                                                <ShieldCheck className="h-3 w-3" /> {log.admin_profiles?.admin_code || "Sistem"}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                                {leadLogs.length === 0 && (
                                                    <p className="text-xs text-slate-400 italic text-center py-8">Henüz işlem kaydı bulunmuyor.</p>
                                                )}
                                                {selectedLead.status === 'Satışa Döndü' && !selectedLead.partner_commission && adminProfile?.cfu_authorized && (
                                                    <Button
                                                        onClick={() => setIsEarningsModalOpen(true)}
                                                        className="w-full bg-green-600 hover:bg-green-700 text-white"
                                                    >
                                                        <Calculator className="mr-2 h-4 w-4" />
                                                        Kazanç Hesapla & Yansıt
                                                    </Button>
                                                )}

                                                {selectedLead.status === 'Satışa Döndü' && selectedLead.partner_commission && (
                                                    <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center gap-2 text-green-700">
                                                        <Check className="h-5 w-5" />
                                                        <span className="font-bold">Kazanç Hesaplandı</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <EarningsModal
                                        isOpen={isEarningsModalOpen}
                                        onClose={() => setIsEarningsModalOpen(false)}
                                        leadId={selectedLead?.id}
                                        affiliateId={selectedLead?.affiliate_id}
                                        onSuccess={() => {
                                            window.location.reload();
                                        }}
                                    />

                                    {/* Document Viewer Modal (RESTORED) */}
                                    {viewerDoc && (
                                        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-300">
                                            <div className="bg-white rounded-3xl shadow-2xl max-w-5xl w-full h-[90vh] flex flex-col overflow-hidden">
                                                <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
                                                    <div>
                                                        <h3 className="text-xl font-black text-slate-900">Teklif Belgesi</h3>
                                                        <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-0.5">{shortenId(selectedLead.id)}</p>
                                                    </div>
                                                    <div className="flex gap-3">
                                                        <Button variant="outline" size="sm" asChild className="font-bold gap-2">
                                                            <a href={viewerDoc.url} download>
                                                                <Download className="h-4 w-4" /> İndir
                                                            </a>
                                                        </Button>
                                                        <Button variant="ghost" size="icon" onClick={() => setViewerDoc(null)} className="rounded-full hover:bg-slate-200">
                                                            <X className="h-5 w-5" />
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
                                </div>
                            </div>
                        )}
                    </>
                )}
            </main>
            <Footer />
        </div>
    )
}

function AdminStatCard({ title, value, icon, description, onClick, active }: any) {
    return (
        <Card
            className={`transition-all duration-300 border-none shadow-sm ${onClick ? 'cursor-pointer hover:shadow-md' : ''} ${active ? 'ring-2 ring-primary bg-primary/5' : 'bg-white'}`}
            onClick={onClick}
        >
            <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-xl ${active ? 'bg-primary/20 text-primary' : 'bg-slate-50 text-slate-600'}`}>
                        {icon}
                    </div>
                </div>
                <div className="space-y-1">
                    <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">{title}</p>
                    <p className="text-4xl font-black text-slate-900 tracking-tighter">{value}</p>
                    {description && <p className="text-[10px] text-slate-400 font-medium italic leading-tight pt-1">{description}</p>}
                </div>
            </CardContent>
        </Card>
    )
}

function ChannelBadge({ lead }: { lead: any }) {
    if (!lead.affiliate_id) {
        return (
            <div className="flex flex-col">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200 uppercase tracking-tighter">
                    SİTE
                </span>
            </div>
        )
    }

    return (
        <div className="flex flex-col">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-600 border border-indigo-100 uppercase tracking-tighter w-fit">
                PARTNER
            </span>
            {lead.partner_name && (
                <span className="text-[9px] text-slate-400 font-black truncate max-w-[100px] mt-0.5 italic" title={lead.partner_name}>
                    {lead.partner_name}
                </span>
            )}
        </div>
    )
}

function StatusBadge({ status }: { status: string }) {
    const configs: any = {
        'Bekliyor': 'bg-amber-100 text-amber-600 border-amber-200',
        'Teklif Verildi': 'bg-orange-100 text-orange-600 border-orange-200',
        'Ödeme Alınıyor': 'bg-blue-100 text-blue-600 border-blue-200',
        'Satışa Döndü': 'bg-primary/10 text-primary border-primary/20',
        'Kazanç Yansıtıldı': 'bg-green-100 text-green-600 border-green-200',
    }
    const config = configs[status] || 'bg-slate-100 text-slate-600 border-slate-200'
    return (
        <span className={`text-[10px] font-black px-2.5 py-1 rounded-full border uppercase tracking-wide ${config}`}>
            {status}
        </span>
    )
}
