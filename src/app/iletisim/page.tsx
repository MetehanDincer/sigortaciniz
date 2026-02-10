import { getAgencyConfig } from "@/lib/agency"
import { ContactContent } from "@/components/contact/contact-content"

export default async function Page() {
    const agency = await getAgencyConfig()

    return <ContactContent agency={agency} />
}
