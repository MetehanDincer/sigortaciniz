import { Metadata } from "next"

export const metadata: Metadata = {
    title: "En Uygun Trafik Sigortası Teklifi Al",
    description: "Zorunlu trafik sigortanız için en uygun fiyat garantisiyle teklif alın. 20'den fazla sigorta şirketini karşılaştırın.",
    keywords: ["trafik sigortası", "en ucuz trafik sigortası", "trafik sigortası fiyatları", "trafik sigortası teklif al"],
}

export default function TrafikLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>
}
