import type { Metadata } from "next"
import { HealthQuotePage } from "@/components/health-quote-page"

export const metadata: Metadata = {
    title: "Tamamlayıcı Sağlık Sigortası Teklifi Al",
    description:
        "Tamamlayıcı sağlık sigortası (TSS) tekliflerini saniyeler içinde karşılaştırın. Anlaşmalı özel hastanelerde yüksek farkları ödemeden hizmet alın; size en yakın teklifi hemen görün, uzmanımız sizi arasın.",
}

export default function TamamlayiciSaglikPage() {
    return <HealthQuotePage initialProduct="tss" productName="Tamamlayıcı Sağlık Sigortası" />
}
