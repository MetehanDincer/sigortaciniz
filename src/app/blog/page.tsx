import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Calendar, User, Clock, ChevronRight } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"

// Dummy data for blog posts
const blogPosts = [
    {
        id: 1,
        slug: "trafik-sigortasi-nedir-neleri-kapsar",
        title: "Trafik Sigortası Nedir? Neleri Kapsar?",
        excerpt: "Zorunlu trafik sigortası hakkında bilmeniz gereken her şey. Teminat limitleri, kapsam dışı durumlar ve fiyatlandırma detayları.",
        date: "26 Ocak 2024",
        readTime: "5 dk okuma",
        category: "Trafik",
        image: "/blog/traffic.png"
    },
    {
        id: 2,
        slug: "kasko-yaptirirken-dikkat-edilmesi-gerekenler",
        title: "Kasko Yaptırırken Nelere Dikkat Etmelisiniz?",
        excerpt: "Aracınızı güvence altına alırken doğru kasko poliçesini nasıl seçersiniz? IMM tutarı, yetkili servis ağı ve muafiyet nedir?",
        date: "24 Ocak 2024",
        readTime: "7 dk okuma",
        category: "Kasko",
        image: "/blog/kasko.png"
    },
    {
        id: 3,
        slug: "tamamlayici-saglik-sigortasi-avantajlari",
        title: "Tamamlayıcı Sağlık Sigortası'nın Avantajları",
        excerpt: "SGK anlaşmalı özel hastanelerde fark ücreti ödemeden tedavi olmanın yolları. Hangi hastanelerde geçerli, neleri kapsıyor?",
        date: "20 Ocak 2024",
        readTime: "4 dk okuma",
        category: "Sağlık",
        image: "/blog/health.png"
    },
    {
        id: 4,
        slug: "dask-nedir-zorunlu-mu",
        title: "Zorunlu Deprem Sigortası (DASK) Nedir?",
        excerpt: "Deprem kuşağındaki ülkemizde DASK neden hayati önem taşıyor? Poliçe yenileme, hasar ihbarı ve tazminat süreci.",
        date: "15 Ocak 2024",
        readTime: "3 dk okuma",
        category: "Konut",
        image: "/blog/dask.png"
    },
    {
        id: 5,
        slug: "ozel-saglik-sigortasi-ve-tss-farki",
        title: "Özel Sağlık Sigortası ile TSS Arasındaki Farklar",
        excerpt: "İhtiyacınıza en uygun sağlık sigortası hangisi? Kapsam, hastane ağı ve fiyat açısından detaylı karşılaştırma.",
        date: "10 Ocak 2024",
        readTime: "6 dk okuma",
        category: "Sağlık",
        image: "/blog/health-2.png"
    },
    {
        id: 6,
        slug: "konut-sigortasi-neden-gerekli",
        title: "Konut Sigortası Sadece Ev Sahipleri İçin mi?",
        excerpt: "Kiracılar konut sigortası yaptırabilir mi? Eşya sigortası ve konut sigortası arasındaki farklar nelerdir?",
        date: "05 Ocak 2024",
        readTime: "4 dk okuma",
        category: "Konut",
        image: "/blog/home.png"
    }
]

export default function BlogPage() {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />

            <main className="flex-1 bg-muted/20">
                {/* Hero Section */}
                <section className="relative bg-primary/5 py-16 md:py-24 border-b overflow-hidden">
                    {/* Decorative Scattered Logos Background */}
                    <div className="absolute inset-0 pointer-events-none select-none overflow-hidden opacity-5">
                        {[...Array(40)].map((_, i) => (
                            <div
                                key={i}
                                className="absolute grayscale rounded-full overflow-hidden"
                                style={{
                                    top: `${Math.random() * 100}%`,
                                    left: `${Math.random() * 100}%`,
                                    width: `${20 + Math.random() * 50}px`,
                                    height: `${20 + Math.random() * 50}px`,
                                    transform: `rotate(${Math.random() * 360}deg) translate(-50%, -50%)`,
                                    opacity: 0.2 + Math.random() * 0.5,
                                }}
                            >
                                <Image
                                    src="/logo.jpg"
                                    alt="logo background"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        ))}
                    </div>

                    <div className="container relative z-10 px-4 max-w-screen-2xl text-center">
                        <div className="max-w-3xl mx-auto">
                            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground mb-6">
                                Sigorta Dünyasından <span className="text-primary">En Güncel Bilgiler</span>
                            </h1>
                            <p className="text-xl text-muted-foreground leading-relaxed">
                                Sigorta ürünleri hakkında merak ettiğiniz her şey, ipuçları ve rehber niteliğindeki makalelerimizle yanınızdayız.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Blog Post Grid */}
                <section className="py-16">
                    <div className="container px-4 max-w-screen-2xl">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {blogPosts.map((post) => (
                                <article key={post.id} className="group bg-card rounded-2xl border shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col h-full">
                                    {/* Image Placeholder - In a real app, use next/image with actual src */}
                                    <div className="relative h-48 w-full overflow-hidden">
                                        <Image
                                            src={post.image}
                                            alt={post.title}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                        <div className="absolute top-4 left-4 bg-background/90 backdrop-blur px-3 py-1 rounded-full text-xs font-semibold text-primary border">
                                            {post.category}
                                        </div>
                                    </div>

                                    <div className="p-6 flex flex-col flex-1">
                                        <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                                            <div className="flex items-center gap-1">
                                                <Calendar className="w-3 h-3" />
                                                {post.date}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                {post.readTime}
                                            </div>
                                        </div>

                                        <h2 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors line-clamp-2">
                                            {post.title}
                                        </h2>

                                        <p className="text-muted-foreground text-sm line-clamp-3 mb-6 flex-1">
                                            {post.excerpt}
                                        </p>

                                        <Link href={`/blog/${post.slug}`} className="inline-flex items-center text-primary font-semibold text-sm hover:underline mt-auto">
                                            Devamını Oku <ArrowRight className="ml-1 h-3 w-3" />
                                        </Link>
                                    </div>
                                </article>
                            ))}
                        </div>

                        <div className="mt-16 text-center">
                            <Button variant="outline" size="lg" className="min-w-[200px]">
                                Daha Fazla Göster
                            </Button>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    )
}
