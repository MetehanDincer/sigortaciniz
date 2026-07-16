import Link from "next/link"
import Image from "next/image"
import { ShieldCheck, Car, Heart, Home, ArrowRight, BadgeCheck, Clock, Users, Menu, X, HeartPulse, Stethoscope, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { FaqSection, type FaqItem } from "@/components/faq-section"
import { getAgencyConfig } from "@/lib/agency"

export default async function LandingPage() {
  const agency = await getAgencyConfig()
  const name = agency?.name || "Uygun Sigortacı"

  const faqs: FaqItem[] = [
    {
      q: "Tamamlayıcı Sağlık Sigortası (TSS) nedir?",
      a: "Tamamlayıcı Sağlık Sigortası, SGK ile anlaşmalı özel hastanelerde SGK'nızı kullanarak muayene ve tedavi olmanızı sağlar; SGK'nın karşılamadığı fark ücretlerini poliçe şartları dahilinde karşılar. Böylece anlaşmalı özel hastanelerde cebinizden ek ödeme yapmadan hizmet alırsınız.",
    },
    {
      q: "Tamamlayıcı Sağlık (TSS) ile Özel Sağlık Sigortası (ÖSS) arasındaki fark nedir?",
      a: "TSS, SGK ile birlikte çalışır ve yalnızca SGK ile anlaşmalı özel sağlık kuruluşlarında geçerlidir; primleri daha uygundur. Özel Sağlık Sigortası ise SGK'dan bağımsız çalışır, daha geniş hastane ağı, daha yüksek limitler ve daha kapsamlı teminatlar sunar; primleri de buna göre daha yüksektir.",
    },
    {
      q: "TSS'den yararlanmak için SGK'lı olmam şart mı?",
      a: "Evet. Tamamlayıcı Sağlık Sigortası, aktif Genel Sağlık Sigortası (SGK) ile birlikte çalıştığı için SGK'nızın aktif olması gerekir. Özel Sağlık Sigortası'nda ise SGK şartı aranmaz.",
    },
    {
      q: "Hangi tedaviler kapsanır?",
      a: "Yatarak tedavi (ameliyat, yatış, yoğun bakım, kemoterapi, radyoterapi gibi) anlaşmalı kurumlarda genellikle limitsiz karşılanır. Ayakta tedavi (muayene, tahlil, röntgen, ileri tanı yöntemleri) yıllık belirli sayıda geçerlidir. Poliçeye göre check-up, diş paketi, psikolog/diyetisyen, online doktor ve 7/24 sağlık danışmanlığı gibi ek teminatlar da sunulabilir.",
    },
    {
      q: "Hastanede ödemeyi ben mi yapıyorum?",
      a: "Hayır. Anlaşmalı kurumlarda işlemleriniz, poliçe kapsamı dahilinde doğrudan sigorta şirketi tarafından provizyon ile karşılanır. Ücreti cebinizden ödeyip sonra iade beklemezsiniz.",
    },
    {
      q: "Bekleme süresi var mı? Mevcut hastalıklarım kapsanır mı?",
      a: "Bazı teminatlarda kısa bekleme süreleri olabilir (örneğin bazı ek teminatlarda 30 gün; doğum gibi teminatlarda daha uzun süreler). Poliçe başlangıcından önce var olan (mevcut) hastalıklar ise genellikle kapsam dışıdır. Bu koşullar poliçe özel şartlarında belirtilir.",
    },
    {
      q: "Poliçe yurt dışında geçerli mi?",
      a: "Tamamlayıcı Sağlık Sigortası Türkiye Cumhuriyeti sınırları içinde geçerlidir; yurt dışı tedavi giderleri kapsam dışıdır. Özel Sağlık Sigortası'nda ise seçtiğiniz plana göre yurt dışı teminat seçenekleri bulunabilir.",
    },
    {
      q: "Fikrimi değiştirirsem poliçemi iptal edebilir miyim?",
      a: "Evet. Genellikle ilk 30 gün içinde ve herhangi bir tazminat ödemesi gerçekleşmemişse ödediğiniz primler iade edilir. Sonraki iptallerde ise sigortacının sorumlu olduğu süreye denk gelen kısım gün esasına göre hesaplanır ve kalanı iade edilir.",
    },
  ]

  return (
    <div className="flex flex-col min-h-screen">
      <Header agency={agency} />

      <main className="flex-1">
        {/* Hero Section */}
        {/* Hero Section */}
        <section className="relative overflow-hidden py-20 lg:py-24 bg-gradient-to-b from-primary/5 via-background to-background">
          {/* Decorative Scattered Logos Background */}
          <div className="absolute inset-0 pointer-events-none select-none overflow-hidden opacity-10">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute grayscale rounded-full overflow-hidden"
                style={{
                  top: `${(i * 13) % 100}%`,
                  left: `${(i * 17) % 100}%`,
                  width: `${50 + (i % 5) * 10}px`,
                  height: `${50 + (i % 5) * 10}px`,
                  transform: `rotate(${(i * 45) % 360}deg) translate(-50%, -50%)`,
                  opacity: 0.1,
                }}
              >
                <Image
                  src={agency?.logo_url || "/logo.png"}
                  alt="logo background"
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>

          <div className="container relative z-10 px-4 md:px-6 max-w-screen-xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center justify-items-center">
              {/* Left Column: Text & CTA */}
              <div className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-8 max-w-2xl">
                <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80">
                  🚀 Hızlı ve Güvenilir Sigorta
                </div>
                <h1 className="text-4xl font-extrabold tracking-tight lg:text-6xl max-w-4xl text-foreground">
                  {agency?.name ? <>{agency.name} ile Geleceğinizi <span className="text-primary">Güvence</span> Altına Alın</> : <>Geleceğinizi <span className="text-primary">Güvence</span> Altına Alın</>}
                </h1>
                <p className="max-w-[700px] text-muted-foreground md:text-xl">
                  Aracınız, sağlığınız ve eviniz için en uygun sigorta tekliflerini saniyeler içinde alın.
                  Uzman ekibimizle her zaman yanınızdayız.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button size="lg" className="h-12 px-8 text-lg" asChild>
                    <Link href="/hizmetlerimiz">
                      Hemen Teklif Al <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button variant="outline" size="lg" className="h-12 px-8 text-lg" asChild>
                    <Link href="/iletisim">
                      Bize Ulaşın
                    </Link>
                  </Button>
                </div>
              </div>

              {/* Right Column: Phone Mockup / Product Showcase */}
              <div className="relative w-full flex justify-center lg:justify-end">
                {/* Phone Frame */}
                <div className="relative rounded-[2.5rem] border-[8px] border-slate-900 bg-slate-900 shadow-2xl overflow-hidden w-[300px] sm:w-[320px] lg:w-[340px]">
                  {/* Notch */}
                  <div className="absolute top-0 inset-x-0 h-6 bg-slate-900 z-20 flex justify-center">
                    <div className="w-1/3 h-4 bg-black rounded-b-xl"></div>
                  </div>

                  {/* Screen Content */}
                  <div className="relative bg-white h-[650px] overflow-hidden flex flex-col pt-8">
                    {/* Header inside phone */}
                    <div className="px-4 pb-4 border-b flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="relative h-8 w-8 overflow-hidden rounded-md">
                          <Image
                            src={agency?.logo_url || "/logo.png"}
                            alt="Logo"
                            fill
                            className="object-cover"
                          />
                        </div>
                        <span className="font-bold text-primary text-sm">
                          {name}<span className="text-foreground">.</span>com
                        </span>
                      </div>
                      <Menu className="h-4 w-4 text-gray-400" />
                    </div>

                    {/* Offer Cards Container */}
                    <div className="flex-1 bg-gray-50 p-4 space-y-4 overflow-y-auto hide-scrollbar">
                      <div className="text-sm font-semibold text-gray-500 mb-2">Size Özel Teklifler</div>

                      {/* Card 1: En Ucuz */}
                      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm relative">
                        <div className="absolute top-0 right-0 bg-gray-100 text-[10px] font-bold px-2 py-1 rounded-bl-lg rounded-tr-lg text-gray-600">
                          EN UCUZ
                        </div>
                        <div className="font-bold text-gray-900 mb-1">A Sigorta</div>
                        <div className="text-2xl font-bold text-primary mb-3">5.000 TL</div>
                        <div className="space-y-2 mb-4">
                          <div className="flex items-center text-xs text-gray-500">
                            <BadgeCheck className="h-3 w-3 text-green-500 mr-2" /> İMM: 3.000.000 TL
                          </div>
                          <div className="flex items-center text-xs text-gray-500">
                            <BadgeCheck className="h-3 w-3 text-green-500 mr-2" /> Anlaşmalı Servisler
                          </div>
                        </div>
                        <Button size="sm" variant="outline" className="w-full text-xs h-8 text-primary border-primary hover:bg-primary/5">Satın Al</Button>
                      </div>

                      {/* Card 2: Önerilen (Highlighted) */}
                      <div className="bg-white p-4 rounded-xl border-2 border-primary shadow-md relative transform scale-105 z-10">
                        <div className="absolute top-0 right-0 bg-primary text-[10px] font-bold px-2 py-1 rounded-bl-lg text-white">
                          ÖNERİLEN
                        </div>
                        <div className="font-bold text-gray-900 mb-1">B Sigorta</div>
                        <div className="text-2xl font-bold text-primary mb-3">8.000 TL</div>
                        <div className="space-y-2 mb-4">
                          <div className="flex items-center text-xs text-gray-600 font-medium">
                            <BadgeCheck className="h-3 w-3 text-primary mr-2" /> İMM: 5.000.000 TL
                          </div>
                          <div className="flex items-center text-xs text-gray-600 font-medium">
                            <BadgeCheck className="h-3 w-3 text-primary mr-2" /> Geniş Servis Ağı
                          </div>
                          <div className="flex items-center text-xs text-gray-600 font-medium">
                            <BadgeCheck className="h-3 w-3 text-primary mr-2" /> Orijinal Cam
                          </div>
                        </div>
                        <Button size="sm" className="w-full text-xs h-8">Satın Al</Button>
                      </div>

                      {/* Card 3: En Kapsamlı */}
                      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm relative">
                        <div className="absolute top-0 right-0 bg-gray-100 text-[10px] font-bold px-2 py-1 rounded-bl-lg rounded-tr-lg text-gray-600">
                          EN KAPSAMLI
                        </div>
                        <div className="font-bold text-gray-900 mb-1">C Sigorta</div>
                        <div className="text-2xl font-bold text-primary mb-3">11.000 TL</div>
                        <div className="space-y-2 mb-4">
                          <div className="flex items-center text-xs text-gray-500">
                            <BadgeCheck className="h-3 w-3 text-green-500 mr-2" /> İMM: Limitsiz
                          </div>
                          <div className="flex items-center text-xs text-gray-500">
                            <BadgeCheck className="h-3 w-3 text-green-500 mr-2" /> Yetkili Servisler
                          </div>
                        </div>
                        <Button size="sm" variant="outline" className="w-full text-xs h-8 text-primary border-primary hover:bg-primary/5">Satın Al</Button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Blob/Glow behind phone */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-primary/20 rounded-full blur-3xl -z-10 animate-pulse" />
              </div>
            </div>
          </div>
        </section>

        {/* Sağlık Sigortası Spotlight */}
        <section className="relative overflow-hidden py-24 border-y bg-gradient-to-br from-primary/5 via-background to-primary/10">
          {/* Silik yüzen sağlık emojileri */}
          <div aria-hidden className="absolute inset-0 pointer-events-none select-none overflow-hidden">
            {[
              { e: "🩺", top: "12%", left: "6%", size: 64, d: "0s" },
              { e: "❤️", top: "68%", left: "9%", size: 52, d: "1.2s" },
              { e: "➕", top: "30%", left: "19%", size: 40, d: "0.6s" },
              { e: "🏥", top: "80%", left: "38%", size: 58, d: "1.8s" },
              { e: "💊", top: "16%", left: "52%", size: 44, d: "0.9s" },
              { e: "🚑", top: "58%", left: "60%", size: 60, d: "2.1s" },
              { e: "🩹", top: "8%", left: "78%", size: 46, d: "1.5s" },
              { e: "❤️", top: "42%", left: "90%", size: 50, d: "0.3s" },
              { e: "➕", top: "86%", left: "86%", size: 38, d: "2.4s" },
              { e: "🩺", top: "50%", left: "43%", size: 46, d: "1s" },
            ].map((it, i) => (
              <span
                key={i}
                className="absolute animate-float-slow"
                style={{ top: it.top, left: it.left, fontSize: `${it.size}px`, opacity: 0.07, animationDelay: it.d }}
              >
                {it.e}
              </span>
            ))}
          </div>

          <div className="container relative z-10 px-4 md:px-6 max-w-screen-xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              {/* Sol: Metin */}
              <div className="space-y-7">
                <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary">
                  <HeartPulse className="h-4 w-4" /> Sağlıkta İddialıyız
                </div>
                <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-foreground leading-tight">
                  Sağlığınız İçin <span className="text-primary">En Kapsamlı</span> Güvence
                </h2>
                <p className="text-muted-foreground text-lg max-w-xl">
                  Özel ve tamamlayıcı sağlık sigortalarında iddialıyız. Anlaşmalı özel hastanelerde
                  yüksek farkları ödemeden, ameliyattan tetkike kadar tüm süreçte yanınızdayız.
                </p>
                <ul className="space-y-3">
                  {[
                    { icon: Stethoscope, t: "Anlaşmalı hastanelerde yalnızca 152 TL muayene farkı" },
                    { icon: HeartPulse, t: "Ameliyat, yatış ve tetkiklerde geniş teminat" },
                    { icon: Plus, t: "Türkiye geneli 3000+ anlaşmalı hastane" },
                    { icon: ShieldCheck, t: "Kronik hastalık ve doğum teminatı seçenekleri" },
                  ].map((b, i) => (
                    <li key={i} className="flex items-center gap-3 text-foreground">
                      <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <b.icon className="h-5 w-5" />
                      </span>
                      <span className="font-medium">{b.t}</span>
                    </li>
                  ))}
                </ul>
                <div className="flex flex-col sm:flex-row gap-4 pt-2">
                  <Button size="lg" className="h-12 px-8 text-base" asChild>
                    <Link href="/teklif/tamamlayici-saglik">
                      Tamamlayıcı Sağlık Teklifi <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button size="lg" className="h-12 px-8 text-base btn-health shadow-sm" asChild>
                    <Link href="/teklif/ozel-saglik">Özel Sağlık Teklifi</Link>
                  </Button>
                </div>
                {/* İstatistikler */}
                <div className="grid grid-cols-3 gap-4 pt-6 border-t max-w-lg">
                  <div>
                    <div className="text-2xl md:text-3xl font-extrabold text-primary">3000+</div>
                    <div className="text-xs text-muted-foreground">Anlaşmalı Hastane</div>
                  </div>
                  <div>
                    <div className="text-2xl md:text-3xl font-extrabold text-primary">152 TL</div>
                    <div className="text-xs text-muted-foreground">Muayene Farkı</div>
                  </div>
                  <div>
                    <div className="text-2xl md:text-3xl font-extrabold text-primary">7/24</div>
                    <div className="text-xs text-muted-foreground">Sağlık Danışmanı</div>
                  </div>
                </div>
              </div>

              {/* Sağ: Sağlık Güvence Kartı */}
              <div className="relative flex justify-center lg:justify-end">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] bg-primary/20 rounded-full blur-3xl -z-10 animate-pulse" />
                <div className="relative w-full max-w-sm rounded-3xl border border-white/10 bg-gradient-to-br from-primary to-purple-900 p-7 text-white shadow-2xl overflow-hidden">
                  {/* Kart üst */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 backdrop-blur">
                        <HeartPulse className="h-6 w-6" />
                      </span>
                      <div>
                        <div className="text-xs text-white/70 leading-none">Uygunsigortacı</div>
                        <div className="font-bold leading-tight">Sağlık Güvencesi</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold bg-white/15 px-2 py-1 rounded-full tracking-wider">PREMIUM</span>
                  </div>

                  {/* ECG kalp atışı çizgisi */}
                  <div className="relative h-16 mb-6">
                    <svg viewBox="0 0 400 80" className="w-full h-full" preserveAspectRatio="none">
                      <path
                        d="M0,40 L120,40 L140,40 L150,14 L166,66 L182,40 L205,40 L218,26 L232,54 L246,40 L400,40"
                        fill="none"
                        stroke="rgba(255,255,255,0.95)"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="animate-ecg"
                      />
                    </svg>
                  </div>

                  {/* Teminatlar */}
                  <div className="space-y-3 mb-6">
                    {[
                      "Yatarak ve ayakta tedavi",
                      "Ameliyat ve yoğun bakım",
                      "MR, tomografi ve tüm tetkikler",
                      "Doğum ve kronik hastalık",
                    ].map((t, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm text-white/90">
                        <BadgeCheck className="h-4 w-4 text-white shrink-0" /> {t}
                      </div>
                    ))}
                  </div>

                  {/* Alt: Muayene Farkı — kalp ritmiyle vurgu */}
                  <div className="pt-5 border-t border-white/15">
                    <div className="flex flex-col items-center">
                      <div className="flex items-center gap-2.5">
                        <Heart className="h-8 w-8 shrink-0 text-white animate-heartbeat" fill="#fff" />
                        <span className="text-5xl font-black leading-none tracking-tight animate-heartbeat">152 TL</span>
                      </div>
                      <span className="mt-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/80">
                        Muayene Farkı
                      </span>
                    </div>
                    <p className="mt-4 text-center text-[11px] text-white/60">
                      Anlaşmalı özel hastanelerde yalnızca devletin belirlediği 152 TL muayene farkını ödersiniz
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Services / Cards Section */}
        <section id="hizmetlerimiz" className="py-24 bg-background">
          <div className="container px-4 md:px-6 max-w-screen-2xl">
            <div className="text-center mb-16 space-y-4">
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl text-foreground">
                Size Özel Sigorta Çözümleri
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                İhtiyacınız olan sigorta türünü seçin, size özel en uygun teklifi hazırlayalım.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Trafik Insurance Card */}
              <Link href="/teklif/trafik" className="group relative overflow-hidden rounded-2xl border bg-card p-8 shadow-sm transition-all hover:shadow-lg hover:border-primary/50">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Car className="h-24 w-24 text-primary" />
                </div>
                <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <Car className="h-7 w-7 text-primary" />
                </div>
                <h3 className="mb-3 text-2xl font-bold">Trafik Sigortası</h3>
                <p className="text-muted-foreground mb-6">
                  Zorunlu trafik sigortanız için en uygun teklifi alırken poliçeniz hakkında bilgi edinin.
                </p>
                <div className="inline-flex items-center text-primary font-semibold group-hover:translate-x-1 transition-transform">
                  Teklif Al <ArrowRight className="ml-2 h-4 w-4" />
                </div>
              </Link>

              {/* Kasko Insurance Card */}
              <Link href="/teklif/kasko" className="group relative overflow-hidden rounded-2xl border bg-card p-8 shadow-sm transition-all hover:shadow-lg hover:border-primary/50">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Car className="h-24 w-24 text-primary" />
                </div>
                <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <Car className="h-7 w-7 text-primary" />
                </div>
                <h3 className="mb-3 text-2xl font-bold">Kasko Sigortası</h3>
                <p className="text-muted-foreground mb-6">
                  Aracınız için en kapsamlı kasko teklifini bütcenize uygun şekilde 9 vade farksız imkanı ile satın alın.
                </p>
                <div className="inline-flex items-center text-primary font-semibold group-hover:translate-x-1 transition-transform">
                  Teklif Al <ArrowRight className="ml-2 h-4 w-4" />
                </div>
              </Link>

              {/* Tamamlayıcı Sağlık Insurance Card */}
              <Link href="/teklif/tamamlayici-saglik" className="group relative overflow-hidden rounded-2xl border bg-card p-8 shadow-sm transition-all hover:shadow-lg hover:border-primary/50">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Heart className="h-24 w-24 text-primary" />
                </div>
                <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <Heart className="h-7 w-7 text-primary" />
                </div>
                <h3 className="mb-3 text-2xl font-bold">Tamamlayıcı Sağlık</h3>
                <p className="text-muted-foreground mb-6">
                  Özel hastanelerde ücret ödemeden muayene olurken doktorunuz talep ettiği testleri ücretsiz yaptırın.
                </p>
                <div className="inline-flex items-center text-primary font-semibold group-hover:translate-x-1 transition-transform">
                  Teklif Al <ArrowRight className="ml-2 h-4 w-4" />
                </div>
              </Link>

              {/* Özel Sağlık Insurance Card */}
              <Link href="/teklif/ozel-saglik" className="group relative overflow-hidden rounded-2xl border bg-card p-8 shadow-sm transition-all hover:shadow-lg hover:border-primary/50">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Heart className="h-24 w-24 text-primary" />
                </div>
                <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <Heart className="h-7 w-7 text-primary" />
                </div>
                <h3 className="mb-3 text-2xl font-bold">Özel Sağlık</h3>
                <p className="text-muted-foreground mb-6">
                  Kapsamlı özel sağlık sigortanız ile tüm Türkiyede geçerli hastane ağından faydalabilirsiniz.
                </p>
                <div className="inline-flex items-center text-primary font-semibold group-hover:translate-x-1 transition-transform">
                  Teklif Al <ArrowRight className="ml-2 h-4 w-4" />
                </div>
              </Link>

              {/* DASK Insurance Card */}
              <Link href="/teklif/dask" className="group relative overflow-hidden rounded-2xl border bg-card p-8 shadow-sm transition-all hover:shadow-lg hover:border-primary/50">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Home className="h-24 w-24 text-primary" />
                </div>
                <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <Home className="h-7 w-7 text-primary" />
                </div>
                <h3 className="mb-3 text-2xl font-bold">DASK</h3>
                <p className="text-muted-foreground mb-6">
                  Zorunlu deprem sigortanızı en uygun tekliflerle alırken poliçe detaylarını tarafınıza sunuyoruz.
                </p>
                <div className="inline-flex items-center text-primary font-semibold group-hover:translate-x-1 transition-transform">
                  Teklif Al <ArrowRight className="ml-2 h-4 w-4" />
                </div>
              </Link>

              {/* Konut Insurance Card */}
              <Link href="/teklif/konut-sigortasi" className="group relative overflow-hidden rounded-2xl border bg-card p-8 shadow-sm transition-all hover:shadow-lg hover:border-primary/50">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Home className="h-24 w-24 text-primary" />
                </div>
                <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <Home className="h-7 w-7 text-primary" />
                </div>
                <h3 className="mb-3 text-2xl font-bold">Konut Sigortası</h3>
                <p className="text-muted-foreground mb-6">
                  Evinizi ve eşyalarınızı hırsızlık, yangın ve su baskını ihtimallerine karşı korurken poliçe detayları ile hukuksal korumaya kadar yanınızdayız.
                </p>
                <div className="inline-flex items-center text-primary font-semibold group-hover:translate-x-1 transition-transform">
                  Teklif Al <ArrowRight className="ml-2 h-4 w-4" />
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* SSS (SEO için FAQPage yapısal verisi + görsel accordion) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: faqs.map((f) => ({
                "@type": "Question",
                name: f.q,
                acceptedAnswer: { "@type": "Answer", text: f.a },
              })),
            }),
          }}
        />
        <FaqSection items={faqs} />

        {/* About Us Section */}
        <section id="hakkimizda" className="py-24 bg-muted/40 border-t">
          <div className="container px-4 md:px-6 max-w-screen-2xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight text-foreground mb-4">Hakkımızda</h2>
              <div className="w-20 h-1 bg-primary mx-auto rounded-full"></div>
            </div>

            <div className="max-w-4xl mx-auto space-y-8 text-center">
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-foreground">Uygun Sigortacı ile Geleceğiniz Güvende</h3>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Sigorta sektöründeki deneyimimiz ve müşteri odaklı yaklaşımımızla,
                  sizlere en uygun ve en kapsamlı sigorta ürünlerini sunmanın gururunu yaşıyoruz.
                  <span className="text-primary font-semibold"> Uygun Sigortacı</span>, sadece bir poliçe satıcısı değil,
                  hayatınızın her anında yanınızda olan güvenilir bir dostunuzdur.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8 text-left">
                <div className="bg-background p-6 rounded-xl border shadow-sm">
                  <h4 className="text-xl font-bold mb-3 text-primary">En Uygun Fiyat, En Kapsamlı Teminat</h4>
                  <p className="text-muted-foreground">
                    Kasko, Trafik, Sağlık, DASK ve Konut sigortası gibi geniş ürün yelpazemizdeki
                    her bir teklifi, bütçenize uygun olmasının yanı sıra size en geniş korumayı
                    sağlayacak şekilde özenle hazırlıyoruz. Gereksiz teminatlarla bütçenizi
                    yormadan, ihtiyacınız olan her şeyi kapsayan çözümler sunuyoruz.
                  </p>
                </div>

                <div className="bg-background p-6 rounded-xl border shadow-sm">
                  <h4 className="text-xl font-bold mb-3 text-primary">7/24 Hasar Destek Ekibimiz</h4>
                  <p className="text-muted-foreground">
                    Hasar anı, en çok desteğe ihtiyaç duyduğunuz andır. Profesyonel hasar destek
                    ekibimiz, haftanın 7 günü 24 saat hizmetinizdedir. Bir telefon kadar yakınınızdayız;
                    hasar sürecinizi baştan sona takip ediyor, tüm işlemlerinizde yanınızda oluyoruz.
                    Çünkü biz, sigorta sadece poliçe satmak değil, ihtiyaç anında yanınızda olmaktır diye düşünüyoruz.
                  </p>
                </div>
              </div>

              <div className="bg-primary/5 p-8 rounded-xl border border-primary/20">
                <p className="text-lg text-foreground leading-relaxed">
                  <span className="font-bold text-primary">{name}</span> olarak,
                  müşterilerimizin memnuniyetini her şeyin üstünde tutuyoruz.
                  Değişen ihtiyaçlarınıza göre ürün ve hizmetlerimizi sürekli geliştiriyor,
                  teknolojik altyapımızı güçlendirerek size daha hızlı ve kolay hizmet sunmanın
                  yollarını arıyoruz. Güveniniz bizim en büyük motivasyonumuz.
                </p>
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center mt-16">
              <div className="flex flex-col items-center space-y-4">
                <div className="h-16 w-16 rounded-full bg-background border flex items-center justify-center shadow-sm">
                  <BadgeCheck className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Güvenilir Hizmet</h3>
                <p className="text-muted-foreground">
                  Yılların verdiği tecrübe ile size en doğru poliçeyi sunuyoruz.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4">
                <div className="h-16 w-16 rounded-full bg-background border flex items-center justify-center shadow-sm">
                  <Clock className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold">7/24 Destek</h3>
                <p className="text-muted-foreground">
                  Hasar anında veya aklınıza takılan her soruda yanınızdayız.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4">
                <div className="h-16 w-16 rounded-full bg-background border flex items-center justify-center shadow-sm">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Kişiye Özel Çözümler</h3>
                <p className="text-muted-foreground">
                  Sadece ihtiyacınız olan teminatları içerir, bütçenizi yormaz.
                </p>
              </div>
            </div>

            {/* Insurance Partners Section */}
            <div className="mt-24 pt-16 border-t">
              <div className="text-center mb-12">
                <h3 className="text-2xl font-bold text-foreground mb-3">
                  20'den Fazla Anlaşmalı Sigorta Şirketi ile En Doğru Ürünü Bulmaktayız
                </h3>
                <p className="text-muted-foreground">
                  Güvenilir sigorta şirketleriyle çalışarak size en uygun teklifi sunuyoruz
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                {[
                  "Acıbadem Sigorta",
                  "AK Sigorta",
                  "Allianz Sigorta",
                  "Anadolu Sigorta",
                  "Anadolu Hayat Emeklilik",
                  "Ankara Sigorta",
                  "AXA Sigorta",
                  "AXA Hayat Emeklilik",
                  "Corpus Sigorta",
                  "Demir Sigorta",
                  "Doğa Sigorta",
                  "Eureko Sigorta",
                  "Fiba Sigorta",
                  "GIG Sigorta",
                  "HDI Sigorta",
                  "Hepiyi Sigorta",
                  "Katılım Sağlık",
                  "Magdeburger Sigorta",
                  "MAPFRE Sigorta",
                  "Neova Sigorta",
                  "Quick Sigorta",
                  "Ray Sigorta",
                  "Sompo Sigorta",
                  "Türk Nippon Sigorta",
                  "Türkiye Katılım Sigorta",
                  "Türkiye Sigorta",
                ].map((company, index) => (
                  <div
                    key={index}
                    className="group bg-background border rounded-lg p-6 flex items-center justify-center min-h-[100px] transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer"
                  >
                    <span className="text-sm font-medium text-center text-muted-foreground group-hover:text-primary transition-colors">
                      {company}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer agency={agency} />
    </div>
  )
}
