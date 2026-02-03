import { CancellationForm } from "@/components/cancellation-form"

export const metadata = {
    title: "Kasko Sigortası İptali | UygunSigortaci.com",
    description: "Kasko sigortası iptal talebi oluşturun."
}

export default function KaskoIptalPage() {
    return <CancellationForm type="Kasko" title="Kasko Sigortası İptali" />
}
