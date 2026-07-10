"use client"

import { useEffect } from "react"

/**
 * Reklam/kaynak bilgisini (UTM + gclid) yakalar ve çereze yazar.
 * /api/contact bu çerezleri okuyup lead kaydına (details) ekler; böylece
 * her talebin hangi kampanya/anahtar kelimeden geldiği bilinir.
 *
 * Mantık: URL'de gclid veya herhangi bir utm parametresi varsa (yani ziyaretçi
 * bir reklam/kampanya ile geldiyse) çerezler güncellenir (son tıklama kazanır).
 * Parametre yoksa mevcut çerezlere dokunulmaz (doğrudan gezinmede kayıp olmaz).
 */
const PARAMS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "gclid"]
const MAX_AGE = 60 * 60 * 24 * 90 // 90 gün

export function AttributionCapture() {
    useEffect(() => {
        try {
            const url = new URL(window.location.href)
            const values: Record<string, string> = {}
            let hasAny = false
            for (const key of PARAMS) {
                const v = url.searchParams.get(key)
                if (v) {
                    values[key] = v
                    hasAny = true
                }
            }
            if (!hasAny) return
            for (const key of PARAMS) {
                // Sadece bu ziyarette gelen değerleri yaz (gelmeyeni temizle ki
                // eski kampanya bilgisi yeni tıklamaya karışmasın).
                const val = values[key] ?? ""
                document.cookie = `${key}=${encodeURIComponent(val)}; path=/; max-age=${MAX_AGE}; SameSite=Lax`
            }
        } catch {
            // sessizce geç
        }
    }, [])

    return null
}
