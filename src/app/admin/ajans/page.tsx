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
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import {
    Settings,
    Save,
    Globe,
    Palette,
    Phone,
    Mail,
    MapPin,
    ImageIcon,
    Loader2,
    ArrowLeft,
    Shield,
    Users
} from "lucide-react"

export default function AgencySettingsPage() {
    return <AgencySettingsContent />
}

function AgencySettingsContent() {
    const router = useRouter()
    const supabase = createClient()
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [adminProfile, setAdminProfile] = useState<any>(null)
    const [agency, setAgency] = useState<any>(null)

    const [form, setForm] = useState({
        name: "",
        domain: "",
        primary_color: "#4f46e5",
        whatsapp_number: "",
        support_email: "",
        address: "",
        logo_url: ""
    })


    useEffect(() => {
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
                    setForm({
                        name: profile.agency.name || "",
                        domain: profile.agency.domain || "",
                        primary_color: profile.agency.primary_color || "#4f46e5",
                        whatsapp_number: profile.agency.whatsapp_number || "",
                        support_email: profile.agency.support_email || "",
                        address: profile.agency.address || "",
                        logo_url: profile.agency.logo_url || ""
                    })
                }
            } catch (error) {
                console.error("Yükleme hatası:", error)
            } finally {
                setLoading(false)
            }
        }
        loadData()
    }, [router])

    const handleSave = async (e?: React.FormEvent | React.MouseEvent) => {
        if (e) e.preventDefault()
        if (!agency?.id) return

        setSaving(true)
        try {
            const { error } = await supabase
                .from('agencies')
                .update({
                    name: form.name,
                    domain: form.domain,
                    primary_color: form.primary_color,
                    whatsapp_number: form.whatsapp_number,
                    support_email: form.support_email,
                    address: form.address,
                    logo_url: form.logo_url,
                    updated_at: new Date().toISOString()
                })
                .eq('id', agency.id)

            if (error) throw error
            toast.success("Ayarlar başarıyla güncellendi.")
            router.refresh()
        } catch (error: any) {
            toast.error("Hata: " + error.message)
        } finally {
            setSaving(false)
        }
    }


    return (
        <div className="min-h-screen flex flex-col bg-slate-50">
            <Header agency={agency} />
            <main className="flex-grow container max-w-4xl mx-auto px-4 py-8">
                {loading ? (
                    <div className="flex-grow flex items-center justify-center min-h-[400px]">
                        <div className="flex flex-col items-center gap-3">
                            <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
                            <p className="font-bold text-indigo-600">Acente Bilgileri Yükleniyor...</p>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="flex items-center gap-4 mb-8">
                            <Button variant="ghost" size="icon" onClick={() => router.push('/admin/yonetim')}>
                                <ArrowLeft className="h-5 w-5" />
                            </Button>
                            <div>
                                <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                                    <Settings className="h-8 w-8 text-indigo-600" />
                                    Acente Ayarları
                                </h1>
                                <p className="text-slate-500 font-medium">Markalama ve iletişim bilgilerinizi buradan yönetin.</p>
                            </div>
                        </div>

                        <div className="grid gap-8">
                            {/* Markalama Bölümü */}
                            <Card className="border-none shadow-sm overflow-hidden">
                                <CardHeader className="bg-slate-50 border-b border-slate-100">
                                    <div className="flex items-center gap-2">
                                        <Palette className="h-5 w-5 text-indigo-600" />
                                        <CardTitle>Görsel Kimlik ve Markalama</CardTitle>
                                    </div>
                                    <CardDescription>Logonuz ve kurumsal renkleriniz.</CardDescription>
                                </CardHeader>
                                <CardContent className="p-6 space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="agency-name">Acente Adı</Label>
                                            <Input
                                                id="agency-name"
                                                value={form.name}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, name: e.target.value })}
                                                placeholder="Örn: Prestij Sigorta"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="primary-color">Kurumsal Renk (Primary)</Label>
                                            <div className="flex gap-2">
                                                <div
                                                    className="w-10 h-10 rounded border"
                                                    style={{ backgroundColor: form.primary_color }}
                                                />
                                                <Input
                                                    id="primary-color"
                                                    value={form.primary_color}
                                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, primary_color: e.target.value })}
                                                    placeholder="#4f46e5"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="logo-url">Logo URL</Label>
                                        <div className="flex gap-4 items-start">
                                            <Input
                                                id="logo-url"
                                                value={form.logo_url}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, logo_url: e.target.value })}
                                                placeholder="https://.../logo.png"
                                            />
                                            {form.logo_url && (
                                                <div className="h-10 w-10 relative border rounded bg-white p-1">
                                                    <img src={form.logo_url} alt="Logo Önizleme" className="object-contain w-full h-full" />
                                                </div>
                                            )}
                                        </div>
                                        <p className="text-xs text-slate-400">Şimdilik bir resim URL'si girin. Yakında dosya yükleme eklenecek.</p>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* İletişim Bölümü */}
                            <Card className="border-none shadow-sm overflow-hidden">
                                <CardHeader className="bg-slate-50 border-b border-slate-100">
                                    <div className="flex items-center gap-2">
                                        <Phone className="h-5 w-5 text-green-600" />
                                        <CardTitle>İletişim ve Destek</CardTitle>
                                    </div>
                                    <CardDescription>Müşterilerinizin size ulaşacağı kanallar.</CardDescription>
                                </CardHeader>
                                <CardContent className="p-6 space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="whatsapp">WhatsApp Numarası</Label>
                                            <Input
                                                id="whatsapp"
                                                value={form.whatsapp_number}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, whatsapp_number: e.target.value })}
                                                placeholder="905XXXXXXXXX"
                                            />
                                            <p className="text-[10px] text-slate-400 font-medium tracking-tight">Ülke kodu ile birlikte (Örn: 90532...)</p>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="email">Destek E-posta</Label>
                                            <Input
                                                id="email"
                                                value={form.support_email}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, support_email: e.target.value })}
                                                placeholder="destek@acente.com"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="address">Ofis Adresi</Label>
                                        <Textarea
                                            id="address"
                                            value={form.address}
                                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setForm({ ...form, address: e.target.value })}
                                            placeholder="Mahalle, Cadde, No..."
                                            rows={3}
                                        />
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Teknik Ayarlar */}
                            <Card className="border-none shadow-sm overflow-hidden">
                                <CardHeader className="bg-slate-50 border-b border-slate-100">
                                    <div className="flex items-center gap-2">
                                        <Globe className="h-5 w-5 text-blue-600" />
                                        <CardTitle>Alan Adı (Domain)</CardTitle>
                                    </div>
                                    <CardDescription>Sitenizin yayınlandığı adres.</CardDescription>
                                </CardHeader>
                                <CardContent className="p-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="domain">Domain</Label>
                                        <Input
                                            id="domain"
                                            value={form.domain}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, domain: e.target.value })}
                                            placeholder="acenteadi.com"
                                        />
                                        <p className="text-xs text-amber-600 font-bold">Dikkat: Domain değişikliği sitenizin erişimini etkileyebilir.</p>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Ekip Yönetimi Linki */}
                            <Card className="border-none shadow-sm overflow-hidden border-2 border-indigo-100 bg-indigo-50/30">
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <Users className="h-5 w-5 text-indigo-600" />
                                                <CardTitle>Ekip Yönetimi</CardTitle>
                                            </div>
                                            <CardDescription>Acentenize bağlı temsilcileri, iş yüklerini ve yetkilerini ayrı bir panelden yönetin.</CardDescription>
                                        </div>
                                        <Button className="font-bold bg-indigo-600 hover:bg-indigo-700" onClick={() => router.push('/admin/ekip')}>
                                            Ekibi Yönet <ArrowLeft className="h-4 w-4 ml-2 rotate-180" />
                                        </Button>
                                    </div>
                                </CardHeader>
                            </Card>

                            {/* Kaydet Butonu */}
                            <div className="flex justify-end gap-3 sticky bottom-8 pt-4">
                                <Button variant="outline" size="lg" className="font-bold" onClick={() => router.back()}>
                                    Vazgeç
                                </Button>
                                <Button size="lg" className="font-bold gap-2 px-8 shadow-lg" onClick={handleSave} disabled={saving}>
                                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                                    Ayarları Kaydet
                                </Button>
                            </div>
                        </div>
                    </>
                )}
            </main>
            <Footer />
        </div>
    )
}
