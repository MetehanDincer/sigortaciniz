"use client"

import { Suspense } from "react"
import dynamic from "next/dynamic"

const DashboardPageContent = dynamic(
    () => import('@/components/panel/dashboard-content').then(mod => ({ default: mod.DashboardPageContent })),
    {
        ssr: false,
        loading: () => (
            <div className="min-h-screen flex items-center justify-center font-bold">
                Yükleniyor...
            </div>
        )
    }
)

export default function DashboardPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center font-bold">Yükleniyor...</div>}>
            <DashboardPageContent />
        </Suspense>
    )
}
