import type { Metadata } from "next"
import { HealthQuotePage } from "@/components/health-quote-page"

export const metadata: Metadata = {
    title: "Sağlık Sigortası Teklifi Al | Tamamlayıcı & Özel Sağlık",
    description:
        "Tamamlayıcı ve özel sağlık sigortası tekliflerini saniyeler içinde karşılaştırın. Size en uygun sağlık sigortası için hemen gösterge fiyat alın, uzmanımız sizi arasın.",
}

export default function SaglikTeklifPage() {
    return <HealthQuotePage initialProduct="tss" productName="Sağlık Sigortası" />
}
