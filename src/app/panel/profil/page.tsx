"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Save, Loader2 } from "lucide-react"
import Link from "next/link"

export default function ProfileEditPage() {
    const router = useRouter()
    const supabase = createClient()
    const [profile, setProfile] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const [formData, setFormData] = useState({
        full_name: "",
        iban: "",
        phone_number: ""
    })

    useEffect(() => {
        const getProfile = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) {
                router.push("/giris")
                return
            }

            const { data: profileData } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single()

            if (profileData) {
                setProfile(profileData)
                setFormData({
                    full_name: profileData.full_name || "",
                    iban: profileData.iban || "",
                    phone_number: profileData.phone_number || ""
                })
            }
            setIsLoading(false)
        }
        getProfile()
    }, [router, supabase])

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSaving(true)

        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const { error } = await supabase
            .from('profiles')
            .update({
                full_name: formData.full_name,
                iban: formData.iban,
                phone_number: formData.phone_number,
                updated_at: new Date().toISOString()
            })
            .eq('id', user.id)

        if (error) {
            alert("Profil güncellenirken bir hata oluştu: " + error.message)
        } else {
            alert("Profil başarıyla güncellendi!")
            router.push("/panel")
            router.refresh()
        }
        setIsSaving(false)
    }

    if (isLoading) {
        return <div className="min-h-screen flex items-center justify-center font-bold">Yükleniyor...</div>
    }

    return (
        <div className="min-h-screen flex flex-col bg-slate-50">
            <Header />
            <main className="flex-grow container max-w-2xl mx-auto p-4 py-12">
                <Link href="/panel" className="inline-flex items-center text-slate-500 hover:text-primary mb-6 font-bold transition-colors">
                    <ArrowLeft className="h-4 w-4 mr-2" /> Panel'e Geri Dön
                </Link>

                <Card className="shadow-lg border-none overflow-hidden">
                    <CardHeader className="bg-white border-b border-slate-100 p-8">
                        <CardTitle className="text-2xl font-extrabold text-slate-900">Profili Düzenle</CardTitle>
                        <p className="text-slate-500 mt-1">İş ortağı bilgilerinizi buradan güncelleyebilirsiniz.</p>
                    </CardHeader>
                    <CardContent className="p-8">
                        <form onSubmit={handleSave} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-slate-400 font-bold uppercase text-xs tracking-wider">E-Posta Adresi</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={profile.email}
                                    disabled
                                    className="bg-slate-50 border-slate-200 font-semibold cursor-not-allowed"
                                />
                                <p className="text-[10px] text-slate-400 font-medium italic">E-posta adresi güvenlik nedeniyle değiştirilemez.</p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="phone_number" className="text-slate-700 font-bold uppercase text-xs tracking-wider">Telefon Numarası</Label>
                                <Input
                                    id="phone_number"
                                    type="tel"
                                    placeholder="05XXXXXXXXX"
                                    value={formData.phone_number}
                                    onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                                    className="border-slate-200 focus:border-primary focus:ring-primary/20 h-12 font-semibold"
                                    maxLength={11}
                                />
                                <p className="text-[10px] text-slate-400 font-medium italic">İş ortaklarımıza ulaşabilmemiz için güncel numaranız gereklidir.</p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="full_name" className="text-slate-700 font-bold uppercase text-xs tracking-wider">İsim Soyisim</Label>
                                <Input
                                    id="full_name"
                                    placeholder="Adınız ve Soyadınız"
                                    value={formData.full_name}
                                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                                    className="border-slate-200 focus:border-primary focus:ring-primary/20 h-12 font-semibold"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="iban" className="text-slate-700 font-bold uppercase text-xs tracking-wider">IBAN Numarası</Label>
                                <Input
                                    id="iban"
                                    placeholder="TR00 0000 0000 0000 0000 0000 00"
                                    value={formData.iban}
                                    onChange={(e) => setFormData({ ...formData, iban: e.target.value })}
                                    className="border-slate-200 focus:border-primary focus:ring-primary/20 h-12 font-semibold"
                                />
                                <p className="text-[10px] text-red-600 font-bold italic">Kazançlarınızın yatırılacağı IBAN numarasını giriniz. IBAN numaranız sistemde kayıtlı olan İsim ve soyisim sahibine ait olmalıdır.</p>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-slate-400 font-bold uppercase text-xs tracking-wider">Referans Kodunuz</Label>
                                <div className="h-12 flex items-center px-3 rounded-md bg-slate-50 border border-slate-200 font-bold text-primary">
                                    {profile.affiliate_id}
                                </div>
                                <p className="text-[10px] text-slate-400 font-medium italic">Referans kodunuz güvenlik nedeni ile değiştirilemez.</p>
                            </div>

                            <div className="pt-4">
                                <Button
                                    type="submit"
                                    className="w-full h-12 text-lg font-extrabold shadow-lg shadow-primary/20 transition-all active:scale-95"
                                    disabled={isSaving}
                                >
                                    {isSaving ? (
                                        <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Güncelleniyor...</>
                                    ) : (
                                        <><Save className="mr-2 h-5 w-5" /> Değişiklikleri Kaydet</>
                                    )}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </main>
            <Footer />
        </div>
    )
}
