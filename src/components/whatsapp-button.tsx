"use client"

import { MessageCircle } from "lucide-react"

export function WhatsAppButton() {
    const phoneNumber = "905379473464"
    const message = encodeURIComponent("Merhaba, sigorta teklifi hakkında bilgi almak istiyorum.")
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`

    return (
        <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-8 right-8 z-50 group flex items-center gap-3"
            aria-label="WhatsApp üzerinden iletişime geçin"
        >
            {/* Tooltip Label */}
            <span className="bg-white text-foreground font-semibold px-4 py-2 rounded-full shadow-lg border text-sm opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-4 group-hover:translate-x-0 hidden md:block">
                WhatsApp Destek Hattı
            </span>

            {/* Pulsing Button Background */}
            <div className="relative">
                <div className="absolute inset-0 bg-[#25D366] rounded-full blur-md opacity-40 group-hover:opacity-75 animate-pulse" />
                <div className="relative h-14 w-14 lg:h-16 lg:w-16 bg-[#25D366] rounded-full shadow-2xl flex items-center justify-center transition-transform hover:scale-110 active:scale-95">
                    <MessageCircle className="h-7 w-7 lg:h-8 lg:w-8 text-white fill-white" />
                </div>
            </div>
        </a>
    )
}
