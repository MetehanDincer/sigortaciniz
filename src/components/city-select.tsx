"use client"

import { useState } from "react"
import { ChevronDown, Search } from "lucide-react"

export function CitySelect({
    value,
    onChange,
    cities,
}: {
    value: string
    onChange: (v: string) => void
    cities: string[]
}) {
    const [open, setOpen] = useState(false)
    const [q, setQ] = useState("")
    const nq = q.toLocaleLowerCase("tr")
    const filtered = q ? cities.filter((c) => c.toLocaleLowerCase("tr").includes(nq)) : cities

    return (
        <div className="relative">
            <button
                type="button"
                onClick={() => setOpen((o) => !o)}
                className="flex w-full items-center justify-between rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
            >
                <span className={value ? "" : "text-muted-foreground"}>{value || "Seçiniz"}</span>
                <ChevronDown className="h-4 w-4 shrink-0 opacity-60" />
            </button>

            {open && (
                <>
                    <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
                    <div className="absolute left-0 right-0 z-50 mt-1 rounded-xl border bg-white shadow-xl">
                        <div className="border-b p-2">
                            <div className="flex items-center gap-2 rounded-lg border border-input px-2.5 py-1.5">
                                <Search className="h-4 w-4 shrink-0 opacity-50" />
                                <input
                                    autoFocus
                                    value={q}
                                    onChange={(e) => setQ(e.target.value)}
                                    placeholder="Şehir ara..."
                                    className="w-full bg-transparent text-sm outline-none"
                                />
                            </div>
                        </div>
                        <div className="max-h-56 overflow-y-auto p-1">
                            {filtered.map((c) => (
                                <button
                                    key={c}
                                    type="button"
                                    onClick={() => {
                                        onChange(c)
                                        setOpen(false)
                                        setQ("")
                                    }}
                                    className={`block w-full rounded-md px-3 py-2 text-left text-sm hover:bg-primary/5 ${c === value ? "font-semibold text-primary" : "text-foreground"}`}
                                >
                                    {c}
                                </button>
                            ))}
                            {filtered.length === 0 && (
                                <div className="px-3 py-2 text-sm text-muted-foreground">Sonuç bulunamadı</div>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}
