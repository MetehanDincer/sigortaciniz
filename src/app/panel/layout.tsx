import { PartnerChatWidget } from "@/components/chat/partner-chat-widget"

export default function PanelLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <>
            {children}
            <PartnerChatWidget />
        </>
    )
}
