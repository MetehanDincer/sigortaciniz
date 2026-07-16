import type { Metadata } from "next"
import { HealthQuotePage } from "@/components/health-quote-page"

export const metadata: Metadata = {
    title: "Özel Sağlık Sigortası Teklifi Al",
    description:
        "Özel sağlık sigortası (ÖSS) tekliflerini saniyeler içinde karşılaştırın. Geniş hastane ağı ve kapsamlı teminatlar için gösterge fiyatınızı hemen görün, uzmanımız sizi arasın.",
}

export default function OzelSaglikPage() {
    return <HealthQuotePage initialProduct="oss" productName="Özel Sağlık Sigortası" />
}
