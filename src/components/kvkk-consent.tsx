"use client"

import Link from "next/link"

interface KvkkConsentProps {
    checked: boolean
    onCheckedChange: (checked: boolean) => void
    id?: string
}

/**
 * Teklif formlarında KVKK aydınlatma/açık rıza onay kutusu.
 * İşaretlenmeden form gönderilemez (submit butonu bu değere bağlı disable edilir).
 */
export function KvkkConsent({ checked, onCheckedChange, id = "kvkk-onay" }: KvkkConsentProps) {
    return (
        <label
            htmlFor={id}
            className="flex items-start gap-2 text-xs text-muted-foreground cursor-pointer select-none mb-1"
        >
            <input
                id={id}
                type="checkbox"
                checked={checked}
                onChange={(e) => onCheckedChange(e.target.checked)}
                className="mt-0.5 h-4 w-4 shrink-0 accent-primary cursor-pointer"
            />
            <span>
                Kişisel verilerimin, sigorta teklif talebimin değerlendirilmesi ve tarafıma dönüş
                yapılması amacıyla işlenmesine ilişkin{" "}
                <Link
                    href="/gizlilik-politikasi"
                    target="_blank"
                    className="text-primary underline hover:no-underline"
                >
                    Aydınlatma Metni
                </Link>
                &apos;ni okudum ve onaylıyorum.
            </span>
        </label>
    )
}
