import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Kullanım Koşulları",
    description: "Web sitemizi kullanım şartları, sorumluluk sınırları ve yasal hak yükümlülüklerimize Kullanım Koşulları sayfamızdan ulaşabilirsiniz.",
    robots: {
        index: false,
        follow: true,
    }
}

export default function KullanimKosullariLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>
}
