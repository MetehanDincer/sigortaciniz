"use client"

import Link from "next/link"
import { Car, Heart, Home, ArrowRight } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function ServicesPage() {
    const services = [
        {
            title: "Trafik Sigortası",
            description: "Zorunlu trafik sigortanız için en uygun teklifi alırken poliçeniz hakkında bilgi edinin.",
            href: "/teklif/trafik",
            icon: Car,
        },
        {
            title: "Kasko Sigortası",
            description: "Aracınız için en kapsamlı kasko teklifini bütcenize uygun şekilde 9 vade farksız imkanı ile satın alın.",
            href: "/teklif/kasko",
            icon: Car,
        },
        {
            title: "Tamamlayıcı Sağlık",
            description: "Özel hastanelerde ücret ödemeden muayene olurken doktorunuz talep ettiği testleri ücretsiz yaptırın.",
            href: "/teklif/tamamlayici-saglik",
            icon: Heart,
        },
        {
            title: "Özel Sağlık",
            description: "Kapsamlı özel sağlık sigortanız ile tüm Türkiyede geçerli hastane ağından faydalabilirsiniz.",
            href: "/teklif/ozel-saglik",
            icon: Heart,
        },
        {
            title: "DASK",
            description: "Zorunlu deprem sigortanızı en uygun tekliflerle alırken poliçe detaylarını tarafınıza sunuyoruz.",
            href: "/teklif/dask",
            icon: Home,
        },
        {
            title: "Konut Sigortası",
            description: "Evinizi ve eşyalarınızı hırsızlık, yangın ve su baskını ihtimallerine karşı korurken poliçe detayları ile hukuksal korumaya kadar yanınızdayız.",
            href: "/teklif/konut-sigortasi",
            icon: Home,
        },
    ];

    return (
        <div className="flex flex-col min-h-screen">
            <Header />

            <main className="flex-1 py-12 bg-background">
                <div className="container px-4 md:px-6 max-w-screen-2xl">
                    <div className="text-center mb-16 space-y-4">
                        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl text-foreground">
                            Hizmetlerimiz
                        </h1>
                        <p className="text-muted-foreground text-xl max-w-3xl mx-auto">
                            Uygun Sigortacı olarak sizlere sunduğumuz geniş kapsamlı sigorta çözümlerini aşağıda görebilirsiniz.
                            Size en uygun teklifi almak için ilgili hizmeti seçmeniz yeterlidir.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {services.map((service, index) => (
                            <Link
                                key={index}
                                href={service.href}
                                className="group relative overflow-hidden rounded-2xl border bg-card p-8 shadow-sm transition-all hover:shadow-lg hover:border-primary/50"
                            >
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <service.icon className="h-24 w-24 text-primary" />
                                </div>
                                <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                                    <service.icon className="h-7 w-7 text-primary" />
                                </div>
                                <h3 className="mb-3 text-2xl font-bold">{service.title}</h3>
                                <p className="text-muted-foreground mb-6">
                                    {service.description}
                                </p>
                                <div className="inline-flex items-center text-primary font-semibold group-hover:translate-x-1 transition-transform">
                                    Teklif Al <ArrowRight className="ml-2 h-4 w-4" />
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}
