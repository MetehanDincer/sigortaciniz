import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Zorunlu Deprem Sigortası (DASK) Başvurusu",
    description: "Evinizi güvenli kılın. Zorunlu deprem sigortası DASK teklifinizi saniyeler içinde alın ve poliçenizi başlatın.",
    keywords: ["dask", "deprem sigortası", "dask teklif", "dask başvurusu"],
}

export default function DaskLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>
}
