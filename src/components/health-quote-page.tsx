import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { HealthQuoteWizard } from "@/components/health-quote-wizard"
import { getAgencyConfig } from "@/lib/agency"
import { HeartPulse, Building2, Clock, ShieldCheck } from "lucide-react"
import type { Product } from "@/lib/health-pricing"

export async function HealthQuotePage({
    initialProduct = "tss",
    productName = "Sağlık Sigortası",
    subtitle = "Tamamlayıcı ve özel sağlık sigortası seçeneklerini karşılaştırın, size en yakın teklifi hemen görün. Uzmanımız size en uygun poliçe için dönüş yapsın.",
}: {
    initialProduct?: Product
    productName?: string
    subtitle?: string
}) {
    const agency = await getAgencyConfig()

    return (
        <div className="flex min-h-screen flex-col">
            <Header agency={agency} />

            <main className="flex-1">
                {/* Hero + Sihirbaz */}
                <section className="relative overflow-hidden bg-gradient-to-b from-primary/10 via-background to-background py-14 lg:py-20">
                    <div className="container relative z-10 mx-auto max-w-screen-xl px-4 md:px-6">
                        <div className="mx-auto mb-8 max-w-3xl text-center">
                            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary">
                                <HeartPulse className="h-4 w-4" /> Sağlıkta İddialıyız
                            </div>
                            <h1 className="text-3xl font-extrabold tracking-tight text-foreground md:text-5xl">
                                Size En Uygun <span className="text-primary">{productName}</span> Teklifini Saniyeler İçinde Alın
                            </h1>
                            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground md:text-lg">{subtitle}</p>
                        </div>

                        <div className="mx-auto max-w-4xl">
                            <HealthQuoteWizard initialProduct={initialProduct} />
                        </div>
                    </div>
                </section>

                {/* Güven şeridi */}
                <section className="border-t bg-background py-12">
                    <div className="container mx-auto max-w-screen-lg px-4">
                        <div className="grid grid-cols-1 gap-8 text-center sm:grid-cols-3">
                            <div className="flex flex-col items-center gap-2">
                                <Building2 className="h-8 w-8 text-primary" />
                                <div className="text-2xl font-extrabold text-primary">3000+</div>
                                <div className="text-sm text-muted-foreground">Anlaşmalı Hastane</div>
                            </div>
                            <div className="flex flex-col items-center gap-2">
                                <ShieldCheck className="h-8 w-8 text-primary" />
                                <div className="text-2xl font-extrabold text-primary">152 TL</div>
                                <div className="text-sm text-muted-foreground">Anlaşmalı Hastanede Muayene Farkı</div>
                            </div>
                            <div className="flex flex-col items-center gap-2">
                                <Clock className="h-8 w-8 text-primary" />
                                <div className="text-2xl font-extrabold text-primary">7/24</div>
                                <div className="text-sm text-muted-foreground">Sağlık Danışmanlığı</div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <Footer agency={agency} />
        </div>
    )
}
