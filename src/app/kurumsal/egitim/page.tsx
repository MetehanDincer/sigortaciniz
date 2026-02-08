"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Car, ShieldCheck, AlertTriangle, CheckCircle2, XCircle, Info, Lock, ChevronRight, GraduationCap, Star, ShieldAlert } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"

const TRAININGS = [
    {
        id: "trafik",
        title: "Trafik Sigortası Eğitimi",
        description: "Zorunlu Trafik Sigortası kapsamı, limitleri ve satış stratejileri.",
        icon: Car,
        color: "bg-blue-500"
    },
    {
        id: "kasko",
        title: "Kasko Sigortası Eğitimi",
        description: "Genişletilmiş Kasko avantajları ve ek teminatlar.",
        icon: Car,
        color: "bg-indigo-500"
    },
    {
        id: "saglik",
        title: "Sağlık Sigortası Eğitimi",
        description: "Tamamlayıcı ve Özel Sağlık sigortası farkları.",
        icon: ShieldCheck,
        color: "bg-emerald-500",
        comingSoon: true
    }
]

export default function EducationPage() {
    const [selectedId, setSelectedId] = useState<string | null>("trafik")

    const renderTrafikContent = () => (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 italic text-blue-900 leading-relaxed shadow-sm">
                <p className="flex items-start gap-3">
                    <Info className="h-5 w-5 mt-0.5 shrink-0" />
                    <span>
                        Zorunlu Trafik Sigortası, aracın başkalarına verdiği zararları karşılayan zorunlu bir sigortadır.
                        <strong> Trafik sigortası poliçe içerikleri DEVLET tarafından hazırlanmakta olup içeriğinde değişiklik talep edilemezdir.</strong>
                    </span>
                </p>
            </div>

            <div className="bg-amber-50 p-6 rounded-2xl border border-amber-100 shadow-sm">
                <div className="flex gap-4">
                    <div className="bg-amber-100 p-3 rounded-xl h-fit">
                        <AlertTriangle className="h-6 w-6 text-amber-600" />
                    </div>
                    <div>
                        <h3 className="font-black text-amber-900 uppercase tracking-wider mb-2">ÖNEMLİ BİLGİLER</h3>
                        <ul className="space-y-2 text-amber-800 font-medium">
                            <li className="flex items-center gap-2">
                                <div className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                                Trafik sigortası sürücünün kendi aracını ve kendisini korumaz.
                            </li>
                            <li className="flex items-center gap-2 text-amber-950 font-black underline decoration-2 underline-offset-4">
                                <div className="h-1.5 w-1.5 rounded-full bg-amber-700" />
                                TRAFİK SİGORTASI POLİÇELERİ ÇEKİCİ HİZMETİ VERMEMEKTEDİR.
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            <section>
                <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                    <CheckCircle2 className="h-6 w-6 text-emerald-500" />
                    Neleri Karşılar?
                </h3>
                <div className="grid gap-4 md:grid-cols-2">
                    <Card className="border-2 border-slate-100 shadow-none hover:border-primary/20 transition-colors">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-500">Araç Hasarı</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm leading-relaxed text-slate-700">
                                Kaporta, mekanik ve tamir masrafları <span className="text-red-600 font-bold underline underline-offset-2">400.000 TL</span> ye kadar karşılama sağlanmakta olup, zincirleme kazada toplam <span className="text-red-600 font-bold underline underline-offset-2">800.000 TL</span> üst limit bulunmaktadır.
                            </p>
                        </CardContent>
                    </Card>
                    <Card className="border-2 border-slate-100 shadow-none hover:border-primary/20 transition-colors">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-500">Bedeni Zararlar</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm leading-relaxed text-slate-700">
                                Kişi başına <span className="font-bold text-slate-900">3.600.000 TL</span>, kaza başına toplam <span className="font-bold text-slate-900">18.000.000 TL</span> yasal limitler dahilinde ödeme yapılır.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </section>

            <section className="bg-rose-50 p-6 rounded-2xl border border-rose-100 shadow-sm text-rose-900">
                <h3 className="text-xl font-black mb-6 flex items-center gap-2">
                    <XCircle className="h-6 w-6" />
                    Neleri Karşılamaz?
                </h3>
                <ul className="grid sm:grid-cols-2 gap-4">
                    {[
                        "Sigortalının kendi aracındaki hasar",
                        "Sigortalının kendi sağlık giderleri",
                        "Sigortalının kendi aracının değer kaybı",
                        "Alkol veya kasıtlı kullanım zararları",
                        "Poliçe başlangıç saatinden önce gerçekleşmiş kazalar"
                    ].map((item, i) => (
                        <li key={i} className="flex items-center gap-3 bg-white/50 p-3 rounded-xl border border-rose-200/50 font-bold text-sm">
                            <XCircle className="h-4 w-4 text-rose-500 shrink-0" />
                            {item}
                        </li>
                    ))}
                </ul>
                <p className="mt-6 text-center text-sm font-black uppercase tracking-[0.2em] border-t border-rose-200 pt-6">
                    🛡️ BU TÜR KORUMALAR KASKO İLE SAĞLANIR
                </p>
            </section>

            <div className="grid gap-6 md:grid-cols-2">
                <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl">
                    <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-4 flex items-center gap-2">
                        <Lock className="h-3 w-3" /> Poliçe Süresi
                    </h4>
                    <p className="text-sm leading-relaxed font-medium">
                        Yapılan trafik sigortası poliçesi yapıldığı günden itibaren <span className="text-primary font-bold italic">365 gün</span> geçerlidir.
                    </p>
                </div>
                <div className="bg-indigo-600 text-white p-6 rounded-2xl shadow-xl">
                    <h4 className="text-xs font-black uppercase tracking-[0.2em] text-indigo-300 mb-4 flex items-center gap-2">
                        <ShieldCheck className="h-3 w-3" /> Hasar Bildirimi
                    </h4>
                    <p className="text-sm leading-relaxed font-medium">
                        Maddi hasarlarda sigorta şirketinin 7/24 destek hattı, bedeni hasarlarda ise resmi bildirim yolları kullanılmalıdır.
                    </p>
                </div>
            </div>
        </div>
    )

    const renderKaskoContent = () => (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-amber-50 p-6 rounded-2xl border border-amber-100 shadow-sm">
                <h3 className="text-sm font-black text-amber-900 uppercase tracking-widest mb-2 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    Önemli Not
                </h3>
                <p className="text-sm text-amber-800 font-medium leading-relaxed">
                    Aşağıda ki poliçe içeriği kasko yaptırmak isteyen müşterilerin <span className="text-amber-900 font-black">%95'i</span> tarafından tercih edilendir, teminatları değiştirmek için temsilciniz ile iletişime geçebilirsiniz. Kasko teklifi aldığınızda teminatlar otomatik olarak aşağıda ki gibi gelmektedir.
                </p>
            </div>

            <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100 italic text-indigo-900 leading-relaxed shadow-sm">
                <p className="flex items-start gap-3">
                    <Info className="h-5 w-5 mt-0.5 shrink-0" />
                    <span>
                        Kasko sigortası, aracın kendi başına yaşayabileceği zararları güvence altına alır.
                        <strong> Trafik sigortası sadece karşı tarafı, Kasko ise hem sizin aracınızı hem de karşı tarafı (+İMM) korur.</strong>
                    </span>
                </p>
            </div>

            <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Star className="h-24 w-24 text-emerald-600" />
                </div>
                <div className="relative">
                    <h3 className="text-lg font-black text-emerald-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <Star className="h-6 w-6 fill-emerald-500 text-emerald-500" />
                        ÖNE ÇIKAN AVANTAJLARI (Full Paket)
                    </h3>
                    <div className="grid gap-4 sm:grid-cols-3">
                        <div className="bg-white/80 p-4 rounded-xl border border-emerald-200">
                            <p className="text-[10px] font-black uppercase text-emerald-600 mb-1">Karşı Taraf Güvencesi</p>
                            <p className="text-sm font-black text-slate-900">5.000.000 TL İMM</p>
                        </div>
                        <div className="bg-white/80 p-4 rounded-xl border border-emerald-200">
                            <p className="text-[10px] font-black uppercase text-emerald-600 mb-1">İkame Araç Hizmeti</p>
                            <p className="text-sm font-black text-slate-900">14 GÜNE KADAR (7x2)</p>
                        </div>
                        <div className="bg-white/80 p-4 rounded-xl border border-emerald-200">
                            <p className="text-[10px] font-black uppercase text-emerald-600 mb-1">Servis Özgürlüğü</p>
                            <p className="text-sm font-black text-slate-900">TÜM SERVİS & ORİJİNAL PARÇA</p>
                        </div>
                    </div>
                </div>
            </div>

            <section>
                <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2 uppercase tracking-tight">
                    <CheckCircle2 className="h-6 w-6 text-emerald-500" />
                    Kapsam Detayları
                </h3>
                <div className="grid gap-6 md:grid-cols-2">
                    <Card className="border-none shadow-sm bg-slate-50">
                        <CardHeader>
                            <CardTitle className="text-sm font-black uppercase border-b pb-2">🎯 Satışta Altın Cümleler</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="p-3 bg-white rounded-lg border border-slate-200 shadow-sm">
                                <p className="text-xs font-bold italic text-slate-600 leading-relaxed">
                                    "Trafik sigortası yetmezse, 5 milyon TL'ye kadar kasko sizi ve karşı tarafı korumaya devam eder."
                                </p>
                            </div>
                            <div className="p-3 bg-white rounded-lg border border-slate-200 shadow-sm">
                                <p className="text-xs font-bold italic text-slate-600 leading-relaxed">
                                    "Aracınız servisteyken günlük hayatınız aksamasın diye tam 14 gün ikame araç veriyoruz."
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-sm bg-slate-50">
                        <CardHeader>
                            <CardTitle className="text-sm font-black uppercase border-b pb-2">Neleri Karşılar?</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-2">
                                {["Çarpma - Çarpılma", "Yanma - Çalınma", "Doğal Afetler", "Kendi Aracınızın Değer Kaybı", "Poliçe Sahibinin Tüm Masrafları"].map((item, i) => (
                                    <li key={i} className="flex items-center gap-2 text-xs font-bold text-slate-700">
                                        <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                </div>
            </section>

            <section className="bg-rose-50 p-6 rounded-2xl border border-rose-100 shadow-sm text-rose-900">
                <h3 className="text-xl font-black mb-4 flex items-center gap-2 uppercase tracking-tight">
                    <ShieldAlert className="h-6 w-6 text-rose-600" />
                    Kritik Uyarılar (Söylenmemeli!)
                </h3>
                <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <p className="text-xs font-black uppercase text-rose-700">Yanlış İfadeler ❌</p>
                        <ul className="space-y-1">
                            {["Her hasarı kesin öder", "Ne olursa olsun ödeme çıkar", "Tüm riskler sınırsız"].map((item, i) => (
                                <li key={i} className="text-xs font-bold flex items-center gap-2">
                                    <XCircle className="h-3 w-3" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="space-y-2">
                        <p className="text-xs font-black uppercase text-emerald-700">Doğru İfadeler ✅</p>
                        <ul className="space-y-1">
                            {["Maddi risklere karşı korur", "Poliçe limitleri dahilinde güvence", "Belirlenen şartlarda ikame araç"].map((item, i) => (
                                <li key={i} className="text-xs font-bold flex items-center gap-2">
                                    <CheckCircle2 className="h-3 w-3" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </section>
        </div>
    )

    return (
        <div className="min-h-screen flex flex-col bg-slate-50">
            <Header />

            <main className="flex-1">
                {/* Hero Section */}
                <div className="bg-white border-b">
                    <div className="container max-w-7xl mx-auto px-4 py-12">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div>
                                <h1 className="text-4xl font-black text-slate-900 mb-2 flex items-center gap-3">
                                    <GraduationCap className="h-10 w-10 text-primary" />
                                    İş Ortağı Eğitim Paneli
                                </h1>
                                <p className="text-slate-500 font-medium">Satış yetkinizi artıracak eğitim içerikleri ve sigorta detayları.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="container max-w-7xl mx-auto px-4 py-8">
                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Sidebar Navigation */}
                        <aside className="lg:w-80 shrink-0 space-y-4">
                            <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest px-2">Eğitimler</h2>
                            <div className="space-y-2">
                                {TRAININGS.map((t) => (
                                    <button
                                        key={t.id}
                                        onClick={() => !t.comingSoon && setSelectedId(t.id)}
                                        className={`w-full flex items-center gap-3 p-4 rounded-2xl border transition-all text-left group ${selectedId === t.id
                                            ? "bg-white border-primary shadow-md"
                                            : "bg-transparent border-transparent hover:bg-white hover:border-slate-200"
                                            } ${t.comingSoon ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                                    >
                                        <div className={`p-2.5 rounded-xl ${selectedId === t.id ? t.color : 'bg-slate-200'} text-white transition-transform group-hover:scale-110`}>
                                            <t.icon className="h-5 w-5" />
                                        </div>
                                        <div className="flex-1">
                                            <p className={`font-bold text-sm ${selectedId === t.id ? 'text-slate-900' : 'text-slate-600'}`}>{t.title}</p>
                                            {t.comingSoon ? (
                                                <span className="text-[10px] font-black uppercase text-amber-600">Yakında</span>
                                            ) : (
                                                <span className="text-[10px] font-black uppercase text-primary">Aktif</span>
                                            )}
                                        </div>
                                        {!t.comingSoon && <ChevronRight className={`h-4 w-4 transition-transform ${selectedId === t.id ? 'text-primary translate-x-1' : 'text-slate-300'}`} />}
                                    </button>
                                ))}
                            </div>

                            <Card className="bg-primary text-white border-none shadow-xl mt-8">
                                <CardContent className="pt-6">
                                    <h3 className="font-bold mb-2">Desteğe mi ihtiyacınız var?</h3>
                                    <p className="text-xs text-primary-foreground/80 mb-4 leading-relaxed">Ürünler hakkında aklınıza takılan sorular için temsilci panelimizden bize ulaşabilirsiniz.</p>
                                    <Button variant="secondary" className="w-full text-primary font-bold rounded-xl" asChild>
                                        <a href="tel:05379473464">Bizi Arayın</a>
                                    </Button>
                                </CardContent>
                            </Card>
                        </aside>

                        {/* Content Area */}
                        <div className="flex-1">
                            <Card className="border-none shadow-xl rounded-3xl overflow-hidden min-h-[600px] bg-white">
                                <CardContent className="p-0">
                                    {selectedId === "trafik" ? (
                                        <div className="p-8 md:p-12">
                                            <div className="flex items-center gap-4 mb-10 border-b pb-8">
                                                <div className="bg-blue-500 p-4 rounded-2xl shadow-lg text-white">
                                                    <Car className="h-8 w-8" />
                                                </div>
                                                <div>
                                                    <h2 className="text-3xl font-black text-slate-900">Trafik Sigortası Eğitimi</h2>
                                                    <p className="text-slate-500 font-bold uppercase text-xs tracking-widest mt-1">Eğitim Kodu: TRF-001</p>
                                                </div>
                                            </div>
                                            {renderTrafikContent()}
                                        </div>
                                    ) : selectedId === "kasko" ? (
                                        <div className="p-8 md:p-12">
                                            <div className="flex items-center gap-4 mb-10 border-b pb-8">
                                                <div className="bg-indigo-500 p-4 rounded-2xl shadow-lg text-white">
                                                    <Car className="h-8 w-8" />
                                                </div>
                                                <div>
                                                    <h2 className="text-3xl font-black text-slate-900">Kasko Sigortası Eğitimi</h2>
                                                    <p className="text-slate-500 font-bold uppercase text-xs tracking-widest mt-1">Eğitim Kodu: KSK-001</p>
                                                </div>
                                            </div>
                                            {renderKaskoContent()}
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center py-20 text-center px-6">
                                            <div className="bg-slate-100 p-6 rounded-3xl mb-6">
                                                <GraduationCap className="h-16 w-16 text-slate-300" />
                                            </div>
                                            <h2 className="text-2xl font-bold text-slate-900 mb-2">Eğitim Seçin</h2>
                                            <p className="text-slate-500 max-w-md">Soldaki menüden incelemek istediğiniz eğitim içeriğini seçebilirsiniz. Diğer eğitimler çok yakında eklenecektir.</p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}
