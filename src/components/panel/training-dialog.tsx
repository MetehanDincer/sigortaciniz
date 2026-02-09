"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ShieldCheck, AlertTriangle, CheckCircle2, XCircle, Info, ArrowRight, Lock, Star } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"

interface TrainingDialogProps {
    isOpen: boolean
    onClose: () => void
    trainingType: string
    trainingTitle: string
    onComplete: () => void
}

export function TrainingDialog({ isOpen, onClose, trainingType, trainingTitle, onComplete }: TrainingDialogProps) {
    const [isRead, setIsRead] = useState(false)
    const [loading, setLoading] = useState(false)
    const supabase = createClient()

    const handleComplete = async () => {
        if (!isRead) return
        setLoading(true)
        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) throw new Error("Oturum bulunamadı")

            const { error } = await supabase
                .from('partner_trainings')
                .upsert({
                    user_id: user.id,
                    training_type: trainingType,
                    completed_at: new Date().toISOString()
                }, { onConflict: 'user_id, training_type' })

            if (error) throw error

            toast.success(`${trainingTitle} eğitimi tamamlandı! Satış yetkiniz açıldı.`)
            onComplete()
            onClose()
        } catch (err: any) {
            console.error("❌ Eğitim Aktivasyon Hatası:", err)
            const errorMessage = err.message || "Eğitim kaydedilirken bir hata oluştu."
            toast.error(errorMessage)
        } finally {
            setLoading(false)
        }
    }

    const renderContent = () => {
        switch (trainingType) {
            case 'trafik':
                return (
                    <div className="space-y-6 text-sm text-slate-700 leading-relaxed">
                        <section className="bg-blue-50 p-4 rounded-xl border border-blue-100 italic">
                            Zorunlu Trafik Sigortası, aracın başkalarına verdiği zararları karşılayan zorunlu bir sigortadır. Trafik sigortası poliçe içerikleri DEVLET tarafından hazırlanmakta olup içeriğinde değişiklik talep edilemezdir.
                        </section>

                        <section className="bg-amber-50 p-4 rounded-xl border border-amber-100 flex gap-3">
                            <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0" />
                            <div>
                                <p className="font-bold text-amber-900 mb-1">ÖNEMLİ:</p>
                                <p>Trafik sigortası sürücünün kendi aracını ve kendisini korumaz.</p>
                                <p className="mt-2 font-bold text-amber-950 underline underline-offset-2">Trafik sigortası poliçeleri çekici hizmeti vermemektedir.</p>
                            </div>
                        </section>

                        <section className="space-y-3">
                            <h4 className="font-bold text-slate-900 flex items-center gap-2">
                                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                                Trafik Sigortası Neleri KARŞILAR?
                            </h4>
                            <p>Kazada karşı tarafa verilen zararları, yasal limitler dahilinde karşılar.</p>
                            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                                <li className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                                    <p className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-1">Araç Hasarı</p>
                                    <p className="text-xs leading-relaxed">
                                        Kaporta, mekanik ve tamir masrafları <span className="text-red-600 font-bold">400.000 TL</span> ye kadar karşılama sağlanmakta olup, zincirleme kazada toplam <span className="text-red-600 font-bold">800.000 TL</span> üst limit bulunmaktadır.
                                    </p>
                                </li>
                                <li className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                                    <p className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-1">Bedeni Zararlar</p>
                                    <p className="text-xs">Ölüm ve sürekli sakatlık durumları karşılanır. (Kişi başı: 3.6M TL / Toplam: 18M TL)</p>
                                </li>
                            </ul>
                            <div className="bg-indigo-50 p-3 rounded-lg border border-indigo-100 text-xs mt-2">
                                <p className="font-bold text-indigo-900 mb-1 flex items-center gap-1">
                                    <Info className="h-3 w-3" /> Sağlık Giderleri Notu
                                </p>
                                <p>Üçüncü kişilerin sağlık masrafları SGK üzerinden karşılanır. Sigorta şirketinin direkt ödeme yükümlülüğü yoktur.</p>
                            </div>
                        </section>

                        <section className="bg-rose-50 p-4 rounded-xl border border-rose-100">
                            <h4 className="font-bold text-rose-900 flex items-center gap-2 mb-3">
                                <XCircle className="h-5 w-5" />
                                Neleri KARŞILAMAZ? (KRİTİK)
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
                                {[
                                    "Sigortalının kendi aracındaki hasar",
                                    "Sigortalının kendi sağlık giderleri",
                                    "Sigortalının kendi aracının değer kaybı",
                                    "Alkol veya kasıtlı kullanım zararları",
                                    "Poliçe öncesi gerçekleşmiş kazalar"
                                ].map((item, i) => (
                                    <div key={i} className="flex gap-2 items-start">
                                        <div className="h-1.5 w-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0" />
                                        <span className="text-xs font-medium text-rose-800">{item}</span>
                                    </div>
                                ))}
                            </div>
                            <p className="mt-4 text-xs font-bold text-rose-950 uppercase tracking-widest text-center border-t border-rose-200 pt-3 italic">
                                👉 Bu tür korumalar KASKO ile sağlanır.
                            </p>
                        </section>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <section className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                                <h4 className="font-bold text-slate-800 text-xs uppercase tracking-widest mb-2 flex items-center gap-2">
                                    <Lock className="h-3 w-3" /> Poliçe Süresi
                                </h4>
                                <p className="text-xs">Yapılan trafik sigortası poliçesi yapıldığı günden itibaren 365 gün geçerlidir.</p>
                            </section>
                            <section className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                                <h4 className="font-bold text-slate-800 text-xs uppercase tracking-widest mb-2 flex items-center gap-2">
                                    <ShieldCheck className="h-3 w-3 text-emerald-600" /> Hasar Anı
                                </h4>
                                <p className="text-xs">Maddi hasarlarda 7/24 destek hattı aranmalı, bedeni hasarlarda yazılı bildirim yapılmalıdır.</p>
                            </section>
                        </div>

                        <section className="border-t pt-4">
                            <h4 className="font-bold text-slate-900 mb-3 flex items-center gap-2 underline decoration-primary decoration-2 underline-offset-4">
                                SATIŞTA DİKKAT EDİLMESİ GEREKENLER
                            </h4>
                            <div className="space-y-3">
                                <div className="flex gap-3">
                                    <div className="bg-emerald-100 text-emerald-700 font-bold px-2 py-0.5 rounded text-[10px] h-fit">EVET</div>
                                    <p className="text-xs">"Trafik sigortası, kazada <strong>karşı tarafın</strong> zararını güvence altına alır."</p>
                                </div>
                                <div className="flex gap-3">
                                    <div className="bg-rose-100 text-rose-700 font-bold px-2 py-0.5 rounded text-[10px] h-fit uppercase">HAYIR</div>
                                    <p className="text-xs">"Her şeyi karşılar, kaskoya gerek yoktur, senin arabanı da yaptırır."</p>
                                </div>
                            </div>
                        </section>

                        <section className="bg-primary/5 p-4 rounded-xl border border-primary/10">
                            <p className="text-[11px] leading-snug text-slate-600 italic">
                                <strong>Sorumluluk Notu:</strong> Bu dökümanı okuyup onaylamadan satış yetkisi verilmez. Yanlış veya eksik bilgilendirme iş ortağının sorumluluğundadır.
                            </p>
                        </section>

                        <section className="bg-slate-100 p-4 rounded-xl border border-slate-200">
                            <p className="text-[11px] leading-snug text-slate-600 font-medium">
                                Bu eğitim içeriğine dilediğiniz zaman Kurumsal menüsünde ki Eğitim sayfasından erişebilirsiniz.
                            </p>
                        </section>
                    </div>
                )
            case 'kasko':
                return (
                    <div className="space-y-6 text-sm text-slate-700 leading-relaxed">
                        <section className="bg-amber-50 p-4 rounded-xl border border-amber-200">
                            <p className="text-xs leading-relaxed font-bold text-amber-900 mb-1">Önemli Not :</p>
                            <p className="text-xs leading-relaxed text-amber-800">
                                Aşağıda ki poliçe içeriği kasko yaptırmak isteyen müşterilerin %95'i tarafından tercih edilendir, teminatları değiştirmek için temsilciniz ile iletişime geçebilirsiniz. Kasko teklifi aldığınızda teminatlar otomatik olarak aşağıda ki gibi gelmektedir.
                            </p>
                        </section>

                        <section className="bg-indigo-50 p-4 rounded-xl border border-indigo-100 italic font-medium">
                            Kasko sigortası, aracın kendi başına yaşayabileceği zararları güvence altına alır.
                            <br /><span className="text-indigo-900 not-italic font-bold">📌 Trafik sigortası → Karşı Taraf | Kasko → Hem Sizin Arabanız Hem Karşı Taraf (+İMM)</span>
                        </section>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <section className="bg-emerald-50 p-4 rounded-xl border border-emerald-100 shadow-sm col-span-1 md:col-span-2">
                                <h4 className="font-black text-emerald-900 flex items-center gap-2 mb-3 uppercase tracking-wider text-xs">
                                    <Star className="h-4 w-4 text-emerald-500 fill-emerald-500" />
                                    ÖNE ÇIKAN AVANTAJLARI ⭐
                                </h4>
                                <div className="space-y-3">
                                    <div className="bg-white/80 p-3 rounded-lg border border-emerald-200">
                                        <p className="font-bold text-slate-900 border-b pb-1 mb-2 tracking-tight">5.000.000 TL İMM (Ekstra Karşı Taraf Güvencesi)</p>
                                        <p className="text-xs leading-relaxed text-slate-700">
                                            Trafik sigortası limitlerinin yetmediği durumlarda devreye girer. Karşı tarafın tüm masraflarını <strong className="text-red-600 underline underline-offset-2">5.000.000 TL</strong>'ye kadar kaskonuz karşılar.
                                        </p>
                                    </div>
                                    <div className="bg-white/80 p-3 rounded-lg border border-emerald-200">
                                        <p className="font-bold text-slate-900 border-b pb-1 mb-2 tracking-tight">7x2 = Toplam 14 Gün İkame Araç 🚗</p>
                                        <p className="text-xs leading-relaxed text-slate-700">
                                            Aracınız servisteyken mağdur olmamanız için ilk hasarda <strong className="text-indigo-600">7 gün</strong>, ikinci hasarda <strong className="text-indigo-600">7 gün</strong> toplamda 14 gün ikame araç verilir.
                                        </p>
                                    </div>
                                    <div className="bg-white/80 p-3 rounded-lg border border-emerald-200">
                                        <p className="font-bold text-slate-900 border-b pb-1 mb-2 tracking-tight">Tüm Servislerde Geçerli & Orijinal Parça 🛠️</p>
                                        <p className="text-xs leading-relaxed text-slate-700">
                                            Kısıtlama yok! Aracınızı istediğiniz <strong className="text-emerald-700">Yetkili</strong> veya <strong className="text-emerald-700">Özel</strong> servise götürebilirsiniz. Tüm parçalar orijinali ile değiştirilir.
                                        </p>
                                    </div>
                                </div>
                            </section>
                        </div>

                        <section className="space-y-3">
                            <h4 className="font-bold text-slate-900 flex items-center gap-2">
                                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                                Kasko Neleri Karşılar?
                            </h4>
                            <div className="grid grid-cols-2 gap-2">
                                {[
                                    "Çarpma – Çarpılma",
                                    "Yanma – Çalınma",
                                    "Doğal Afetler",
                                    "Kendi Aracınızın Hasarları",
                                    "Poliçe Sahibinin Tüm Masrafları",
                                    "İkame Araç Hizmeti"
                                ].map((item, i) => (
                                    <div key={i} className="bg-slate-50 p-2 rounded-lg border border-slate-100 flex items-center gap-2 text-[11px] font-bold text-slate-700">
                                        <div className="h-1 w-1 rounded-full bg-emerald-400" />
                                        {item}
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section className="bg-rose-50 p-4 rounded-xl border border-rose-100">
                            <h4 className="font-bold text-rose-900 flex items-center gap-2 mb-3 text-xs uppercase tracking-widest">
                                <XCircle className="h-4 w-4" />
                                Neleri KARŞILAMAZ? (Net Olun!)
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {[
                                    "Trafik Cezaları",
                                    "Alkol Karışmış Kazalar",
                                    "Kasıtlı Kullanım Zararları",
                                    "Poliçe Öncesi Hasarlar"
                                ].map((item, i) => (
                                    <div key={i} className="flex gap-2 items-start">
                                        <div className="h-1.5 w-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0" />
                                        <span className="text-[11px] font-bold text-rose-800">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section className="border-t pt-4">
                            <h4 className="font-black text-slate-900 mb-3 flex items-center gap-2 underline decoration-indigo-500 decoration-2 underline-offset-4 text-xs">
                                DOĞRU SATIŞ CÜMLELERİ ✅
                            </h4>
                            <div className="space-y-2 text-xs font-medium text-slate-700">
                                <p>✔️ "Kasko, aracınızı ve sizi maddi risklere karşı korur."</p>
                                <p>✔️ "Bu poliçede <span className="text-red-600 font-black">5 MİLYON TL</span> ek karşı taraf güvencesi var."</p>
                                <p>✔️ "İstediğiniz servisi kullanma özgürlüğüne sahipsiniz."</p>
                            </div>
                        </section>

                        <div className="space-y-3">
                            <section className="bg-primary/5 p-4 rounded-xl border border-primary/10">
                                <p className="text-[11px] leading-snug text-slate-600 italic">
                                    <strong>Sorumluluk Notu:</strong> Bu dökümanı okuyup onaylamadan Kasko satış yetkisi verilmez. Yanlış veya abartılı bilgilendirme iş ortağının sorumluluğundadır.
                                </p>
                            </section>

                            <section className="bg-slate-100 p-4 rounded-xl border border-slate-200">
                                <p className="text-[11px] leading-snug text-slate-600 font-medium">
                                    Bu eğitim içeriğine dilediğiniz zaman Kurumsal menüsünde ki Eğitim sayfasından erişebilirsiniz.
                                </p>
                            </section>
                        </div>
                    </div>
                )
            default:
                return (
                    <div className="py-12 text-center">
                        <Info className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">Bu sigorta türü için eğitim dökümanı henüz hazırlanmamıştır.</p>
                    </div>
                )
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col p-0 overflow-hidden sm:rounded-3xl border-none shadow-2xl">
                <DialogHeader className="p-6 bg-slate-900 text-white shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/20 rounded-lg">
                            <ShieldCheck className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <DialogTitle className="text-xl font-black uppercase tracking-tight">{trainingTitle}</DialogTitle>
                            <DialogDescription className="text-slate-400 text-xs font-medium">
                                Satış yetkinizi aktifleştirmek için lütfen dökümanı sonuna kadar okuyunuz.
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-white">
                    {renderContent()}
                </div>

                <DialogFooter className="p-6 bg-slate-50 border-t shrink-0 sm:flex-col gap-4">
                    <div className="flex items-center space-x-2 w-full">
                        <input
                            type="checkbox"
                            id="confirm"
                            checked={isRead}
                            onChange={(e) => setIsRead(e.target.checked)}
                            className="h-5 w-5 rounded border-slate-300 text-primary focus:ring-primary cursor-pointer"
                        />
                        <label htmlFor="confirm" className="text-sm font-bold text-slate-700 cursor-pointer select-none">
                            Dökümandaki bilgileri okudum, anladım ve sorumluluğu kabul ediyorum.
                        </label>
                    </div>
                    <div className="flex gap-3 w-full">
                        <Button variant="outline" onClick={onClose} className="flex-1 h-12 rounded-xl font-bold">
                            Kapat
                        </Button>
                        <Button
                            onClick={handleComplete}
                            disabled={!isRead || loading}
                            className="flex-[2] h-12 rounded-xl font-black bg-primary hover:bg-primary/90 text-white gap-2 group shadow-lg shadow-primary/20"
                        >
                            {loading ? (
                                <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    Yetkiyi Aktifleştir
                                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
