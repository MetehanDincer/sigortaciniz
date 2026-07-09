import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Sigortacılık Eğitimleri ve Bilgi Merkezi",
    description: "Sigorta ürünleri, poliçe iptal süreçleri, hasar işlemleri ve genel sigortacılık konularında bilgilendirici eğitimlerimizi inceleyin.",
    keywords: ["sigortacılık eğitimi", "sigorta eğitimleri", "sigorta bilgi merkezi", "hasar süreçleri eğitimi"],
}

export default function KurumsalEgitimLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>
}
