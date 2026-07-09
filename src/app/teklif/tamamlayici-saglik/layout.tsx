import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Tamamlayıcı Sağlık Sigortası Teklifi",
    description: "SGK anlaşmalı özel hastanelerde ek ücret ödemeden tedavi olun. En uygun tamamlayıcı sağlık sigortası teklifini saniyeler içinde alın.",
    keywords: ["tamamlayıcı sağlık sigortası", "tss teklif al", "sağlık sigortası fiyatları", "en ucuz tamamlayıcı sağlık", "özel hastane sigortası"],
}

export default function TamamlayiciSaglikLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>
}
