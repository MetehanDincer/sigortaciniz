import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Sigorta Hizmetlerimiz ve Çözümlerimiz",
    description: "Trafik, Kasko, DASK, Konut, Tamamlayıcı Sağlık ve Özel Sağlık Sigortası ürünlerimizi inceleyin. En uygun teminatlarla kendinizi güvenceye alın.",
    keywords: ["sigorta hizmetleri", "en uygun sigortalar", "kasko ve trafik sigortası", "dask başvurusu", "sağlık sigortası türleri"],
}

export default function HizmetlerimizLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>
}
