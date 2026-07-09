import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Özel Sağlık Sigortası Teklifi",
    description: "Geniş anlaşmalı hastane ağımız ile dilediğiniz özel sağlık kurumunda kaliteli sağlık hizmeti alın. Kişiye özel sağlık sigortası teklifi.",
    keywords: ["özel sağlık sigortası", "sağlık sigortası teklif al", "bireysel sağlık sigortası", "en iyi özel sağlık sigortası"],
}

export default function OzelSaglikLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>
}
