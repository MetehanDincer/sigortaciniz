import { CancellationForm } from "@/components/cancellation-form"

export const metadata = {
    title: "Trafik Sigortası İptali | UygunSigortaci.com",
    description: "Trafik sigortası iptal talebi oluşturun."
}

export default function TrafikIptalPage() {
    return <CancellationForm type="Trafik" title="Trafik Sigortası İptali" />
}
