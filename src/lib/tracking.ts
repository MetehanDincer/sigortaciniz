// Ölçüm / dönüşüm takibi yardımcıları.
// GA4 event'leri window.gtag üzerinden gönderilir. Google Ads conversion'ları
// ortam değişkenleriyle (NEXT_PUBLIC_ADS_*) opsiyoneldir; tanımlı değilse
// güvenle atlanır (no-op). Böylece GA ID / Ads hesabı olmasa bile hata olmaz.

const ADS_ID = process.env.NEXT_PUBLIC_ADS_ID // örn. "AW-123456789"
const ADS_LEAD_LABEL = process.env.NEXT_PUBLIC_ADS_LEAD_LABEL
const ADS_CALL_LABEL = process.env.NEXT_PUBLIC_ADS_CALL_LABEL
const ADS_WHATSAPP_LABEL = process.env.NEXT_PUBLIC_ADS_WHATSAPP_LABEL

type GtagArgs = [string, string, Record<string, unknown>?]

function gtag(...args: GtagArgs) {
    if (typeof window !== "undefined") {
        const w = window as unknown as { gtag?: (...a: unknown[]) => void }
        if (typeof w.gtag === "function") {
            w.gtag(...args)
        }
    }
}

/** Teklif talebi başarıyla oluşturulduğunda çağrılır. */
export function trackLead(leadType: string) {
    // GA4 standart lead event'i
    gtag("event", "generate_lead", {
        currency: "TRY",
        value: 0,
        lead_type: leadType,
    })
    // Google Ads dönüşümü (id + label tanımlıysa)
    if (ADS_ID && ADS_LEAD_LABEL) {
        gtag("event", "conversion", {
            send_to: `${ADS_ID}/${ADS_LEAD_LABEL}`,
            value: 0,
            currency: "TRY",
        })
    }
}

/** Telefon (tel:) bağlantısına tıklandığında. */
export function trackPhoneClick(source: string = "site") {
    gtag("event", "phone_click", { source })
    if (ADS_ID && ADS_CALL_LABEL) {
        gtag("event", "conversion", { send_to: `${ADS_ID}/${ADS_CALL_LABEL}` })
    }
}

/** WhatsApp bağlantısına tıklandığında. */
export function trackWhatsAppClick(source: string = "site") {
    gtag("event", "whatsapp_click", { source })
    if (ADS_ID && ADS_WHATSAPP_LABEL) {
        gtag("event", "conversion", { send_to: `${ADS_ID}/${ADS_WHATSAPP_LABEL}` })
    }
}
