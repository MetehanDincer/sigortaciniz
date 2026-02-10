import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Kasko Sigortası Fiyatları & Kasko Teklifi",
    description: "Aracınız için en geniş teminatlı kasko poliçesini en uygun fiyatla alın. 9 taksit imkanı ve hızlı teklif.",
    keywords: ["kasko sigortası", "kasko teklifi", "kasko fiyatları", "en ucuz kasko"],
}

export default function KaskoLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>
}
