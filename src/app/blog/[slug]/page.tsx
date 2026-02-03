import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Calendar, Clock, User, Facebook, Twitter, Linkedin, Share2 } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"

// This would normally come from a database or CMS based on the slug
const blogPosts = {
    "trafik-sigortasi-nedir-neleri-kapsar": {
        title: "Trafik Sigortası Nedir? Neleri Kapsar?",
        category: "Trafik",
        date: "26 Ocak 2024",
        readTime: "6 dk okuma",
        author: "Sigorta Uzmanı",
        image: "/blog/traffic.png",
        content: `
      <p class="mb-4 text-lg">Trafiğe çıkan her araç sahibi için yasal bir zorunluluk olan Zorunlu Mali Sorumululuk Sigortası, bilinen adıyla <strong>Trafik Sigortası</strong>, sadece bir kağıt parçası değil; olası bir kaza anında sizi çok büyük mali yüklerden kurtaran bir kalkan gibidir.</p>
      
      <p class="mb-6">Gelin, "Trafik sigortası neden zorunlu? Neleri öder, neleri ödemez?" gibi soruların cevaplarını birlikte inceleyelim.</p>

      <h2 class="text-2xl font-bold mt-8 mb-4 text-primary">Trafik Sigortası Nedir?</h2>
      <p class="mb-4">Trafik sigortası, 2918 sayılı Karayolları Trafik Kanunu uyarınca her araç sahibinin yaptırması gereken bir sigorta türüdür. Bu sigortanın temel amacı, kaza anında <strong>karşı tarafa</strong> (üçüncü şahıslara) verebileceğiniz maddi ve bedensel zararları güvence altına almaktır.</p>
      
      <div class="bg-primary/5 p-6 rounded-2xl mb-8 border border-primary/10">
        <h3 class="text-lg font-bold mb-2">💡 Önemli Bir Fark!</h3>
        <p>Unutmayın, trafik sigortası <strong>sizin aracınızdaki hasarı ödemez.</strong> Karşı tarafın aracını, dükkanını, elektrik direğini veya kaza sırasında yaralanan kişilerin masraflarını karşılar. Kendi aracınızı korumak için Kasko yaptırmanız gerekir.</p>
      </div>

      <h2 class="text-2xl font-bold mt-8 mb-4 text-primary">Trafik Sigortası Neleri Kapsar?</h2>
      <p class="mb-4">Trafik sigortasının limitleri her yıl devlet tarafından belirlenir. İşte ana teminatlar:</p>
      <ul class="list-disc pl-6 mb-6 space-y-3">
        <li><strong>Maddi Hasarlar:</strong> Karşı tarafın aracında veya malvarlığında oluşan zararlar.</li>
        <li><strong>Sağlık Giderleri:</strong> Kaza sonucu yaralanan kişilerin muayene, tahlil ve tedavi masrafları.</li>
        <li><strong>Sakatlanma ve Ölüm Tazminatı:</strong> Kazada birinin sakat kalması veya vefatı durumunda ödenen tazminatlar.</li>
        <li><strong>Avukatlık Giderleri:</strong> Kaza sonrası açılan davalarda savunma masrafları (limitler dahilinde).</li>
      </ul>

      <h2 class="text-2xl font-bold mt-8 mb-4 text-primary">Trafik Sigortası Yaptırmazsanız Ne Olur?</h2>
      <p class="mb-4">Yasal zorunluluğa uymamanın ciddi sonuçları vardır:</p>
      <ul class="list-decimal pl-6 mb-6 space-y-2">
        <li>Aracınız trafikten men edilir ve otoparka çekilir.</li>
        <li>Sigortasızlık cezası ödersiniz.</li>
        <li>"Hasarsızlık indirimi" hakkınızı kaybedersiniz.</li>
        <li><strong>En Önemlisi:</strong> Bir kaza yapıp karşı tarafa 500.000 TL zarar verirseniz, sigortanız olmadığı için bu parayı cebinizden ödemek zorunda kalırsınız.</li>
      </ul>

      <p class="mt-8">Siz de yola güvenle çıkmak ve bütçenizi korumak için <strong>UygunSigortaci.com</strong> üzerinden en uygun trafik sigortası tekliflerini inceleyebilirsiniz.</p>
    `
    },
    "kasko-yaptirirken-dikkat-edilmesi-gerekenler": {
        title: "Kasko Yaptırırken Nelere Dikkat Etmelisiniz?",
        category: "Kasko",
        date: "24 Ocak 2024",
        readTime: "8 dk okuma",
        author: "Hasar Danışmanı",
        image: "/blog/kasko.png",
        content: `
      <p class="mb-4 text-lg">Kasko sigortası, aracınızın başına gelebilecek her türlü olumsuzluğa karşı verdiğiniz en mantıklı karardır. Ancak poliçeyi sadece "fiyat" üzerinden seçmek, kaza anında hüsrana yol açabilir.</p>
      
      <h2 class="text-2xl font-bold mt-8 mb-4 text-primary">Kasko Seçerken Hayati Kriterler</h2>
      
      <p class="mb-6 italic">Peki, en iyi kasko poliçesi hangisidir? İşte poliçenizi incelerken sormanız gereken kritik sorular:</p>

      <h3 class="text-xl font-bold mt-6 mb-3">1. İhtiyari Mali Mesuliyet (İMM) Limiti Nedir?</h3>
      <p class="mb-4 text-muted-foreground">Trafik sigortası karşı tarafa verdiğiniz zararı belirli bir limite kadar (Örn: 200.000 TL) öder. Eğer lüks bir araca çarparsanız ve zarar 1 milyon TL tutarsa, geriye kalan 800 bini cebinizden ödemeniz gerekebilir. İşte <strong>İMM teminatı</strong> bu farkı kapatır. Mümkünse "Limitsiz" İMM seçmenizi öneririm.</p>

      <h3 class="text-xl font-bold mt-6 mb-3">2. Yetkili Servis Mi, Özel Servis Mi?</h3>
      <p class="mb-4">Aracınızın markasının yetkili servisinde orijinal parçalarla onarılmasını istiyorsanız poliçenizde "Yetkili Servis" maddesi olduğundan emin olun. Bu, poliçe fiyatını biraz artırsa da aracınızın değerini korur.</p>

      <h3 class="text-xl font-bold mt-6 mb-3">3. İkame Araç Hizmeti Kaç Gün?</h3>
      <p class="mb-4">Aracınız kaza sonrası servisteyken yaya kalmamak için sigorta şirketinin size kaç gün araç vereceği önemlidir. Genellikle 7 veya 15 günlük seçenekler sunulur.</p>

      <div class="bg-muted p-6 rounded-2xl mb-8 border">
        <h4 class="font-bold mb-2">✔️ Bunları da Unutmayın:</h4>
        <ul class="list-disc pl-5 space-y-2">
            <li><strong>Cam Masrafı:</strong> Senede bir kez muafiyetsiz değişim hakkı var mı?</li>
            <li><strong>Manevi Tazminat:</strong> Çarpıştığınız kişilerin açabileceği manevi davaları kapsıyor mu?</li>
            <li><strong>Muafiyetli Kasko:</strong> "Hasarın ilk %2'sini ben öderim" diyerek poliçenizi %40'a kadar ucuzlatabilirsiniz.</li>
        </ul>
      </div>

      <p class="mb-4">Kasko uzmanlarımızla size en uygun teminatları belirlemek için teklif sayfamızı ziyaret edebilirsiniz.</p>
    `
    },
    "tamamlayici-saglik-sigortasi-avantajlari": {
        title: "Tamamlayıcı Sağlık Sigortası'nın Avantajları",
        category: "Sağlık",
        date: "20 Ocak 2024",
        readTime: "7 dk okuma",
        author: "Sağlık Editörü",
        image: "/blog/health.png",
        content: `
      <p class="mb-4 text-lg">Sağlık harcamalarının arttığı günümüzde, özel hastanelerin konforundan yararlanmak isteyip yüksek faturalarla karşılaşmaktan çekinenler için <strong>Tamamlayıcı Sağlık Sigortası (TSS)</strong> en güçlü çözüm olarak öne çıkıyor.</p>
      
      <p class="mb-6">Gelin, "TSS nedir, nasıl kullanılır ve avantajları nelerdir?" gibi aklınızdaki tüm sorulara birlikte yanıt verelim.</p>

      <h2 class="text-2xl font-bold mt-8 mb-4 text-primary">Tamamlayıcı Sağlık Sigortası (TSS) Nedir?</h2>
      <p class="mb-4">TSS; Sosyal Güvenlik Kurumu (SGK) kapsamında olan kişilerin, SGK anlaşmalı özel hastanelerden <strong>fark ücreti ödemeden</strong> hizmet almasını sağlayan devlet destekli bir sigorta türüdür.</p>

      <div class="bg-blue-50 dark:bg-blue-950/20 p-6 rounded-2xl mb-8 border border-blue-100 dark:border-blue-900/30 shadow-sm transition-all duration-300">
        <h3 class="text-lg font-bold mb-2 text-blue-700 dark:text-blue-400">💰 Örnekli Anlatım:</h3>
        <p>Hastaneye gittiniz ve muayene ücreti 1.500 TL. SGK bunun sadece 400 TL'sini ödüyor. Geriye kalan 1.100 TL'yi sizden istiyorlar. İşte <strong>TSS tam burada devreye girer</strong> ve o 1.100 TL'yi senin yerine sigorta şirketin öder. Sen sadece devletin zorunlu tuttuğu <strong>50 TL</strong> muayene katılım payını öder ve tedavini olursun.</p>
      </div>

      <h2 class="text-2xl font-bold mt-8 mb-4 text-primary">TSS'nin Temel Avantajları</h2>
      <ul class="list-disc pl-6 mb-6 space-y-3">
        <li><strong>Sıfır Fark Ücreti:</strong> Poliklinik muayenesi, tahlil, röntgen ve ameliyatlarda ekstra ücret ödemezsiniz.</li>
        <li><strong>Limitsiz Yatarak Tedavi:</strong> Ameliyat masrafları, oda ve refakatçi giderleri genellikle limitsiz karşılanır.</li>
        <li><strong>Vergi Avantajı:</strong> Bordrolu çalışansanız ödediğiniz primin %15-27 kadarını maaşınızdan vergi iadesi olarak alabilirsiniz.</li>
        <li><strong>Bütçe Dostu:</strong> Özel Sağlık Sigortası'na göre çok daha uygun fiyatlıdır.</li>
      </ul>

      <h2 class="text-2xl font-bold mt-8 mb-4 text-primary">Kimler Yararlanabilir?</h2>
      <p class="mb-4">SGK'lı olan (SSK, Bağ-Kur veya Emekli Sandığı), genellikle 60-65 yaş altındaki herkes bu sigortadan yararlanabilir.</p>
      
      <p class="mt-8 font-semibold">Tüm ailenizi güvence altına almak ve özel hastane konforuna ulaşmak için hemen teklif alın!</p>
    `
    },
    "dask-nedir-zorunlu-mu": {
        title: "Zorunlu Deprem Sigortası (DASK) Nedir?",
        category: "Konut",
        date: "15 Ocak 2024",
        readTime: "5 dk okuma",
        author: "Konut Uzmanı",
        image: "/blog/dask.png",
        content: `
      <p class="mb-4 text-lg">Deprem kuşağında yer alan ülkemizde, evinizi ve geleceğinizi korumanın en temel yolu <strong>Zorunlu Deprem Sigortası (DASK)</strong> yaptırmaktır.</p>
      
      <h2 class="text-2xl font-bold mt-8 mb-4 text-primary">DASK Neleri Kapsar?</h2>
      <p class="mb-4">DASK, depremin ve deprem sonucu meydana gelen yangın, tsunaminin binanızda neden olduğu maddi hasarları nakit olarak karşılar. Kapsama giren alanlar:</p>
      <ul class="list-disc pl-6 mb-6 space-y-2">
        <li>Temeller ve ana duvarlar</li>
        <li>Bağımsız bölümleri ayıran ortak duvarlar</li>
        <li>Tavan ve tabanlar, merdivenler, asansörler</li>
        <li>Çatı ve bacalar</li>
      </ul>

      <div class="bg-amber-50 dark:bg-amber-950/20 p-6 rounded-2xl mb-8 border border-amber-100 dark:border-amber-900/30">
        <h3 class="text-lg font-bold mb-2 text-amber-700 dark:text-amber-400">📢 Dikkat!</h3>
        <p>DASK sadece <strong>binanızı</strong> korur. Evin içindeki eşyalarınız (TV, mobilya vb.) DASK kapsamında değildir. Eşyalarınızı korumak için <strong>Konut Sigortası</strong> yaptırmanız gerekir.</p>
      </div>

      <h2 class="text-2xl font-bold mt-8 mb-4 text-primary">DASK Yaptırmanın Önemi ve Zorunluluğu</h2>
      <p class="mb-4">DASK, tapu işlemleri ile elektrik, su ve doğalgaz abonelikleri sırasında zorunlu tutulur. Ancak sadece bir "dosya masrafı" olarak görülmemelidir. Afet anında devletin sunduğu bu güvence, yeniden yuva kurmanız için en büyük maddi kaynağınız olacaktır.</p>
      
      <p class="mb-4">Poliçenizi her yıl yenilemeyi unutmayın; yenilenen poliçelerde indirim hakkınız olduğunu biliyor muydunuz?</p>
    `
    },
    "ozel-saglik-sigortasi-ve-tss-farki": {
        title: "Özel Sağlık Sigortası ile TSS Arasındaki Farklar",
        category: "Sağlık",
        date: "10 Ocak 2024",
        readTime: "9 dk okuma",
        author: "Sigorta Danışmanı",
        image: "/blog/health-2.png",
        content: `
      <p class="mb-4 text-lg">Sağlık sigortası yaptırmaya karar verdiniz ama karşınıza iki seçenek çıktı: Özel Sağlık Sigortası (ÖSS) ve Tamamlayıcı Sağlık Sigortası (TSS). Peki hangisi sizin için daha uygun?</p>
      
      <h2 class="text-2xl font-bold mt-8 mb-4 text-primary">En Temel Farklar</h2>
      
      <div class="overflow-x-auto mb-8">
        <table class="w-full border-collapse border rounded-xl overflow-hidden">
            <thead class="bg-muted">
                <tr>
                    <th class="p-4 text-left border">Özellik</th>
                    <th class="p-4 text-left border">TSS</th>
                    <th class="p-4 text-left border">ÖSS</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td class="p-4 border font-semibold">SGK Şartı</td>
                    <td class="p-4 border">Zorunlu</td>
                    <td class="p-4 border">Yok</td>
                </tr>
                <tr>
                    <td class="p-4 border font-semibold">Anlaşmalı Hastaneler</td>
                    <td class="p-4 border">Sadece SGK Anlaşmalılar</td>
                    <td class="p-4 border">Tüm Özel Hastaneler (Kurumsal)</td>
                </tr>
                <tr>
                    <td class="p-4 border font-semibold">Poliçe Primi</td>
                    <td class="p-4 border">Daha Ekonomik</td>
                    <td class="p-4 border">Daha Yüksek</td>
                </tr>
                <tr>
                    <td class="p-4 border font-semibold">Hastane Seçeneği</td>
                    <td class="p-4 border">Kapsamı Geniş</td>
                    <td class="p-4 border">En ÜST Grup Hastaneler Dahil</td>
                </tr>
            </tbody>
        </table>
      </div>

      <h2 class="text-2xl font-bold mt-8 mb-4 text-primary">Hangisini Seçmelisiniz?</h2>
      <p class="mb-4"><strong>Şu durumda TSS seçin:</strong> SGK'lıysanız, bütçeniz kısıtlıysa ve kaliteli ama çok yüksek maliyetli olmayan özel hastanelerde (Medicana, Medical Park vb.) tedavi olmak istiyorsanız.</p>
      <p class="mb-6"><strong>Şu durumda ÖSS seçin:</strong> SGK'lı değilseniz, bütçeniz müsaitse ve Amerikan Hastanesi, Acıbadem gibi en üst segment (A Plus) hastaneleri de kapsama dahil etmek istiyorsanız.</p>

      <p class="italic text-muted-foreground">İhtiyacınıza en uygun poliçeyi belirlemek için Uygun Sigortacı uzmanlarına Whatsapp hattımızdan ulaşabilirsiniz.</p>
    `
    },
    "konut-sigortasi-neden-gerekli": {
        title: "Konut Sigortası Sadece Ev Sahipleri İçin mi?",
        category: "Konut",
        date: "05 Ocak 2024",
        readTime: "7 dk okuma",
        author: "Müşteri İlişkileri",
        image: "/blog/home.png",
        content: `
      <p class="mb-4 text-lg">Konut sigortası dendiğinde genelde akla ev sahipleri gelse de, aslında bu sigorta türü <strong>kiracılar için de en az ev sahipleri kadar önemlidir.</strong></p>
      
      <h2 class="text-2xl font-bold mt-8 mb-4 text-primary">Ev Sahipleri İçin Konut Sigortası</h2>
      <p class="mb-4">Ev sahipleri için bina teminatı ile sadece evin dört duvarı değil; kombi, mutfak dolapları ve tesisat da korunur. Yangın, sel, hırsızlık gibi durumlarda binada oluşan hasarlar sigorta tarafından karşılanır.</p>

      <h2 class="text-2xl font-bold mt-8 mb-4 text-primary">Kiracılar İçin "Eşya Sigortası"</h2>
      <p class="mb-4">Kiracı olarak oturduğunuz evin binası size ait olmayabilir ama içindeki her şey size aittir. Konut sigortasının <strong>eşya teminatı</strong> ile;</p>
      <ul class="list-disc pl-6 mb-6 space-y-2">
        <li>Televizyon ve elektroniklerin arızalanması (elektrik dalgalanması),</li>
        <li>Hırsızlık sonucu çalınan eşyalar,</li>
        <li>Üst kattan su sızması sonucu mahvolan koltuklar ve boya badana masrafları güvence altına alınır.</li>
      </ul>

      <div class="bg-primary/10 p-6 rounded-2xl mb-8 border border-primary/20">
        <h3 class="text-lg font-bold mb-2">🏘️ Komşuluk Hukuku</h3>
        <p>Evinizde bir musluğu açık unuttunuz ve alt katı su bastı. Komşunuzun masrafını kim ödeyecek? Konut sigortasındaki <strong>Üçüncü Şahıs Mali Mesuliyet</strong> teminatı, komşularınıza verdiğiniz bu zararları da sizin yerinize öder. Bu, kiracılar için büyük bir güvencedir.</p>
      </div>

      <p class="mt-8">Cüzi bir yıllık primle (günlük bir kahve parasına), hem evinizi hem de komşuluk ilişkilerinizi güvenceye alabilirsiniz!</p>
    `
    }
}
export async function generateStaticParams() {
    return Object.keys(blogPosts).map((slug) => ({
        slug: slug,
    }))
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params
    const post = blogPosts[slug as keyof typeof blogPosts]

    if (!post) {
        return (
            <div className="flex flex-col min-h-screen">
                <Header />
                <div className="flex-1 flex items-center justify-center">Yazı bulunamadı.</div>
                <Footer />
            </div>
        )
    }

    return (
        <div className="flex flex-col min-h-screen">
            <Header />

            <main className="flex-1">
                {/* Article Hero */}
                <section className="bg-muted/30 py-12 md:py-16 border-b">
                    <div className="container px-4 max-w-4xl mx-auto">
                        <div className="flex flex-col items-center text-center">
                            <div className="flex items-center justify-center gap-2 text-sm font-medium text-primary mb-6">
                                <span className="bg-primary/10 px-3 py-1 rounded-full">{post.category}</span>
                                <span className="text-muted-foreground">•</span>
                                <span className="text-muted-foreground">{post.readTime}</span>
                            </div>

                            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-foreground mb-6 leading-tight">
                                {post.title}
                            </h1>

                            <div className="flex items-center justify-center gap-3 border-t border-border/50 pt-6 mt-4 w-full max-w-xs">
                                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                                    <User className="w-5 h-5" />
                                </div>
                                <div className="text-left">
                                    <div className="text-sm font-semibold">{post.author}</div>
                                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                                        <Calendar className="w-3 h-3" /> {post.date}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="container px-4 max-w-4xl mx-auto -mt-10 mb-12">
                    <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl border-8 border-background">
                        <Image
                            src={post.image}
                            alt={post.title}
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>
                </div>

                {/* Article Content */}
                <article className="pb-24">
                    <div className="container px-4 max-w-3xl mx-auto">
                        <div
                            className="prose prose-lg dark:prose-invert max-w-none text-muted-foreground leading-relaxed"
                            dangerouslySetInnerHTML={{ __html: post.content }}
                        />

                        {/* Social Share */}
                        <div className="mt-16 pt-8 border-t flex flex-col sm:flex-row justify-between items-center gap-6">
                            <div className="flex items-center gap-4 text-sm font-semibold text-foreground">
                                <Share2 className="w-5 h-5" /> Bu yazıyı paylaş:
                            </div>
                            <div className="flex gap-2">
                                <Button variant="outline" size="icon" className="rounded-full hover:bg-primary/10 hover:text-primary transition-all">
                                    <Facebook className="w-4 h-4" />
                                </Button>
                                <Button variant="outline" size="icon" className="rounded-full hover:bg-primary/10 hover:text-primary transition-all">
                                    <Twitter className="w-4 h-4" />
                                </Button>
                                <Button variant="outline" size="icon" className="rounded-full hover:bg-primary/10 hover:text-primary transition-all">
                                    <Linkedin className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </article>

                {/* CTA Section */}
                <section className="bg-primary/5 py-16 border-y">
                    <div className="container px-4 max-w-4xl mx-auto text-center">
                        <h2 className="text-3xl font-bold mb-4">Hemen Teklif Alın</h2>
                        <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
                            İhtiyacınıza en uygun sigorta tekliflerini saniyeler içinde karşılaştırın.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button size="lg" className="text-base px-8 h-14 font-bold shadow-lg shadow-primary/20" asChild>
                                <Link href="/hizmetlerimiz">Hemen Teklif Al</Link>
                            </Button>
                            <Button variant="outline" size="lg" className="text-base px-8 h-14 font-semibold" asChild>
                                <Link href="/blog">
                                    <ArrowLeft className="w-4 h-4 mr-2" /> Blog'a Dön
                                </Link>
                            </Button>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    )
}
