import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Gizlilik Politikası",
    description: "Kişisel verilerinizin korunması, işlenmesi ve gizlilik haklarınız hakkında detaylı bilgilere Gizlilik Politikası sayfamızdan ulaşabilirsiniz.",
    robots: {
        index: false,
        follow: true,
    }
}

export default function GizlilikPolitikasiLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>
}
