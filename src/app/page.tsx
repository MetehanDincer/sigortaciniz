import Link from "next/link"
import Image from "next/image"
import { ShieldCheck, Car, Heart, Home, ArrowRight, BadgeCheck, Clock, Users, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { getAgencyConfig } from "@/lib/agency"

export default async function LandingPage() {
  const agency = await getAgencyConfig()
  const name = agency?.name || "Uygun Sigortacı"

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
