import { Metadata } from "next"

export const metadata: Metadata = {
    title: "En Uygun Konut Sigortası Teklifi",
    description: "Evinizi ve eşyalarınızı deprem, yangın, hırsızlık ve su baskını gibi risklere karşı güvenceye alın. Hızlı konut sigortası teklifi alın.",
    keywords: ["konut sigortası", "konut sigortası fiyatları", "ev sigortası teklif al", "en ucuz konut sigortası", "eşya sigortası"],
}

export default function KonutSigortasiLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>
}
