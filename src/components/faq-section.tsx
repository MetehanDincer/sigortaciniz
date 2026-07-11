"use client"

import { useState } from "react"
import { ChevronDown, HelpCircle } from "lucide-react"

export interface FaqItem {
    q: string
    a: string
}

export function FaqSection({ items }: { items: FaqItem[] }) {
    const [open, setOpen] = useState<number | null>(0)

    return (
        <section className="py-24 bg-muted/30 border-t">
            <div className="container px-4 md:px-6 max-w-3xl mx-auto">
                <div className="text-center mb-12 space-y-3">
                    <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary">
                        <HelpCircle className="h-4 w-4" /> Sıkça Sorulan Sorular
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
                        Tamamlayıcı &amp; Özel Sağlık Sigortası
                    </h2>
                    <p className="text-muted-foreground">
                        Merak ettiklerinizi sizin için yanıtladık.
                    </p>
                </div>

                <div className="space-y-3">
                    {items.map((it, i) => {
                        const isOpen = open === i
                        return (
                            <div key={i} className="rounded-xl border bg-background shadow-sm overflow-hidden">
                                <button
                                    onClick={() => setOpen(isOpen ? null : i)}
                                    className="flex w-full items-center justify-between gap-4 p-5 text-left font-semibold text-foreground hover:text-primary transition-colors"
                                    aria-expanded={isOpen}
                                >
                                    <span>{it.q}</span>
                                    <ChevronDown
                                        className={`h-5 w-5 shrink-0 text-primary transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                                    />
                                </button>
                                {isOpen && (
                                    <div className="animate-in fade-in-0 slide-in-from-top-1 duration-200">
                                        <p className="px-5 pb-5 text-muted-foreground leading-relaxed">{it.a}</p>
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>

                <p className="mt-8 text-center text-xs text-muted-foreground">
                    Teminat, limit ve şartlar sigorta şirketine ve poliçeye göre değişebilir. Size en uygun poliçe için bizimle iletişime geçin.
                </p>
            </div>
        </section>
    )
}
