"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, BadgeCheck, Phone, Loader2, Info, Check, X, Lock } from "lucide-react"
import {
    PRODUCTS,
    CITIES,
    estimatePremiums,
    formatTL,
    type Product,
    type Gender,
    type InsurerQuote,
} from "@/lib/health-pricing"
import { trackLead } from "@/lib/tracking"
import { maskTC, maskPhone, maskBirthDate } from "@/lib/masks"
import { CitySelect } from "@/components/city-select"

const field =
    "w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"

export function HealthQuoteWizard({ initialProduct = "tss" }: { initialProduct?: Product }) {
    const [step, setStep] = useState(1)

    // Adım 1 — kriterler
    const [product, setProduct] = useState<Product>(initialProduct)
    const [gender, setGender] = useState<Gender>("kadin")
    const [age, setAge] = useState("")
    const [city, setCity] = useState("")

    // Gerçek bilgi (lead) formu
    const [name, setName] = useState("")
    const [surname, setSurname] = useState("")
    const [tc, setTc] = useState("")
    const [birthDate, setBirthDate] = useState("")
    const [phone, setPhone] = useState("")
    const [email, setEmail] = useState("")
    const [k1, setK1] = useState(false)
    const [k2, setK2] = useState(false)

    const [results, setResults] = useState<InsurerQuote[]>([])
    const [showModal, setShowModal] = useState(false)
    const [submitting, setSubmitting] = useState(false)
    const [leadDone, setLeadDone] = useState(false)

    const ageNum = parseInt(age, 10)
    const step1Valid = age !== "" && ageNum >= 0 && ageNum <= 80 && city !== ""
    const leadValid =
        name.trim() !== "" &&
        surname.trim() !== "" &&
        tc.length === 11 &&
        birthDate.length === 10 &&
        phone.replace(/\D/g, "").length === 11 &&
        k1 &&
        k2
    const productLabel = PRODUCTS.find((p) => p.value === product)?.label || ""

    // Teklifleri göster
    function showResults() {
        if (!step1Valid) return
        setResults(estimatePremiums({ product, gender, age: ageNum, city }))
        setStep(2)
    }

    // 5 saniye gezinme → pop-up (yalnızca ilk seferde, lead alınmadıysa)
    useEffect(() => {
        if (step === 2 && !leadDone) {
            const t = setTimeout(() => setShowModal(true), 5000)
            return () => clearTimeout(t)
        }
    }, [step, leadDone])

    async function submitLead() {
        if (!leadValid || submitting) return
        setSubmitting(true)
        try {
            await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    type: `Sağlık Teklif (Gösterge) - ${productLabel}`,
                    adSoyad: `${name} ${surname}`,
                    tcKimlik: tc,
                    dogumTarihi: birthDate,
                    telefon: phone,
                    email,
                    cinsiyet: gender === "kadin" ? "Kadın" : "Erkek",
                    yas: age,
                    sehir: city,
                    urun: productLabel,
                }),
            })
            trackLead(`Sağlık Teklif - ${productLabel}`)
        } catch {
            // best-effort: lead gitmese de akış devam eder
        }
        setSubmitting(false)
        setLeadDone(true)
        setShowModal(false)
    }

    return (
        <div className="w-full">
            {/* ADIM 1 — Kriterler */}
            {step === 1 && (
                <div className="rounded-2xl bg-white p-5 shadow-xl md:p-6">
                    <div className="grid gap-4 md:grid-cols-4">
                        <div>
                            <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">Ürün</label>
                            <select className={field} value={product} onChange={(e) => setProduct(e.target.value as Product)}>
                                {PRODUCTS.map((p) => (
                                    <option key={p.value} value={p.value}>{p.label}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">Cinsiyetiniz</label>
                            <select className={field} value={gender} onChange={(e) => setGender(e.target.value as Gender)}>
                                <option value="kadin">Kadın</option>
                                <option value="erkek">Erkek</option>
                            </select>
                        </div>
                        <div>
                            <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">Yaşınız</label>
                            <input className={field} type="number" min={0} max={80} inputMode="numeric" placeholder="Örn. 30" value={age} onChange={(e) => setAge(e.target.value)} />
                        </div>
                        <div>
                            <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">Yaşadığınız şehir</label>
                            <CitySelect value={city} onChange={setCity} cities={CITIES} />
                        </div>
                    </div>
                    <Button size="lg" className="mt-5 h-12 w-full text-base" disabled={!step1Valid} onClick={showResults}>
                        Teklifleri Listele <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                </div>
            )}

            {/* ADIM 2 — Gösterge teklifleri */}
            {step === 2 && (
                <div>
                    <div className="mb-4 flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center">
                        <div className="text-sm text-muted-foreground">
                            Size özel <span className="font-bold text-foreground">{results.length} sonuç</span> bulundu
                            <span className="mx-2">·</span>
                            <span className="font-semibold text-foreground">{productLabel}</span> · {gender === "kadin" ? "Kadın" : "Erkek"} · {age} yaş · {city}
                        </div>
                        <button onClick={() => setStep(1)} className="text-sm font-semibold text-primary hover:underline">
                            Kriterleri değiştir
                        </button>
                    </div>

                    {/* Lead alındı bilgisi / alınmadıysa CTA */}
                    {leadDone ? (
                        <div className="mb-6 flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
                            <BadgeCheck className="h-5 w-5 shrink-0 text-emerald-600" />
                            <p>Talebiniz alındı! Sigorta uzmanımız, verdiğiniz bilgiler doğrultusunda <strong>size özel teklifinizi</strong> hazırlayıp en kısa sürede sizi arayacaktır.</p>
                        </div>
                    ) : (
                        <div className="mb-6 flex flex-col items-center justify-between gap-3 rounded-xl border border-primary/20 bg-primary/5 p-4 sm:flex-row">
                            <div className="flex items-start gap-3 text-sm text-foreground">
                                <Info className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                                <p>Aşağıdaki fiyatlar size fikir vermesi için hazırlanmış <strong>ortalama tutarlardır</strong>. Size özel <strong>en doğru teklifi</strong> hazırlayabilmemiz için bilgilerinizi bırakın; uzmanımız en kısa sürede sizi arayarak yardımcı olsun.</p>
                            </div>
                            <Button className="shrink-0" onClick={() => setShowModal(true)}>Nihai Teklifi Gör</Button>
                        </div>
                    )}

                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {results.map((q, i) => (
                            <div key={q.key} className="relative flex flex-col rounded-2xl border bg-card p-6 shadow-sm transition-all hover:shadow-lg">
                                {i === 0 && (
                                    <span className="absolute -top-3 left-6 rounded-full bg-emerald-600 px-3 py-1 text-[11px] font-bold text-white">EN UYGUN</span>
                                )}
                                <div className="mb-4 text-lg font-bold text-foreground">{q.name}</div>
                                <div className="mb-4 border-b pb-4">
                                    <div className="text-xs text-muted-foreground">Ortalama gösterge fiyat</div>
                                    <div className="text-3xl font-extrabold text-primary">{formatTL(q.yearly)} TL<span className="text-sm font-medium text-muted-foreground"> /yıl</span></div>
                                    <div className="text-xs text-muted-foreground">{q.installments} taksitle aylık {formatTL(q.monthly)} TL</div>
                                </div>
                                <ul className="mb-6 space-y-2 text-sm">
                                    <li className="flex items-center justify-between"><span className="text-muted-foreground">Ayakta tedavi</span><span className="font-semibold text-foreground">{q.ayaktaAdet} adet</span></li>
                                    <li className="flex items-center justify-between"><span className="text-muted-foreground">Yatarak tedavi</span><span className="flex items-center gap-1 font-semibold text-emerald-600"><Check className="h-4 w-4" /> {q.yatarak}</span></li>
                                    <li className="flex items-center justify-between"><span className="text-muted-foreground">Hastane ağı</span><span className="font-semibold text-foreground">{q.network}</span></li>
                                    <li className="flex items-center justify-between"><span className="text-muted-foreground">Giriş yaşı</span><span className="font-semibold text-foreground">{q.girisYasi}</span></li>
                                    <li className="flex items-center justify-between"><span className="text-muted-foreground">Yenileme hakkı</span><span className="font-semibold text-foreground">{q.yenileme}</span></li>
                                </ul>
                                <Button className="mt-auto w-full" onClick={() => setShowModal(true)}>
                                    Başvur <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* GERÇEK BİLGİ POP-UP */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 animate-in fade-in-0">
                    <div className="relative max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl md:p-8 animate-in zoom-in-95">
                        <button onClick={() => setShowModal(false)} aria-label="Kapat" className="absolute right-4 top-4 text-muted-foreground hover:text-foreground">
                            <X className="h-5 w-5" />
                        </button>
                        <div className="mb-6 text-center">
                            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                                <Lock className="h-7 w-7 text-primary" />
                            </div>
                            <h3 className="text-xl font-bold text-foreground">Nihai tekliflerinizi hazırlayalım</h3>
                            <p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">
                                Gösterge fiyatları gördünüz. Size <strong>nihai teklifinizi</strong> sunabilmemiz için aşağıdaki bilgileri girin; sigorta uzmanımız sizi arasın.
                            </p>
                        </div>
                        <div className="grid gap-3 sm:grid-cols-2">
                            <input className={field} placeholder="Adınız" value={name} onChange={(e) => setName(e.target.value)} />
                            <input className={field} placeholder="Soyadınız" value={surname} onChange={(e) => setSurname(e.target.value)} />
                            <input className={field} placeholder="TC Kimlik Numaranız" inputMode="numeric" value={tc} onChange={(e) => setTc(maskTC(e.target.value))} />
                            <input className={field} placeholder="Doğum Tarihiniz (GG.AA.YYYY)" inputMode="numeric" value={birthDate} onChange={(e) => setBirthDate(maskBirthDate(e.target.value))} />
                            <input className={field} placeholder="Telefon numaranız" inputMode="tel" value={phone} onChange={(e) => setPhone(maskPhone(e.target.value))} />
                            <input className={field} placeholder="E-posta adresiniz" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                        </div>
                        <div className="mt-4 space-y-3">
                            <label className="flex items-start gap-2 text-xs text-muted-foreground cursor-pointer">
                                <input type="checkbox" checked={k1} onChange={(e) => setK1(e.target.checked)} className="mt-0.5 h-4 w-4 shrink-0 accent-primary" />
                                <span>
                                    <Link href="/kullanim-kosullari" target="_blank" className="text-primary underline">Kullanıcı sözleşmesi</Link>,{" "}
                                    <Link href="/gizlilik-politikasi" target="_blank" className="text-primary underline">gizlilik politikası</Link> ve KVKK aydınlatma metnini okudum, anladım.
                                </span>
                            </label>
                            <label className="flex items-start gap-2 text-xs text-muted-foreground cursor-pointer">
                                <input type="checkbox" checked={k2} onChange={(e) => setK2(e.target.checked)} className="mt-0.5 h-4 w-4 shrink-0 accent-primary" />
                                <span>Kişisel verilerimin mevzuat çerçevesinde işlenmesine ve sigortam ile ilgili tarafıma elektronik ileti (telefon, SMS, e-posta, WhatsApp) gönderilmesine açık rıza veriyorum.</span>
                            </label>
                        </div>
                        <Button size="lg" className="mt-5 h-12 w-full text-base" disabled={!leadValid || submitting} onClick={submitLead}>
                            {submitting ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Gönderiliyor...</> : "Gerçek Teklifimi Hazırla"}
                        </Button>
                        <div className="mt-3 flex items-center justify-center gap-1 text-center text-[11px] text-muted-foreground">
                            <Lock className="h-3 w-3" /> Bilgileriniz güvende; yalnızca teklifiniz için kullanılır.
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
