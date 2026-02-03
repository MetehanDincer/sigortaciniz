import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
    const supabase = await createClient()
    const { userId, message, sessionId } = await request.json()

    if (!userId || !message) {
        return NextResponse.json({ error: "Missing fields" }, { status: 400 })
    }

    // 1. Get or Create Session
    let currentSessionId = sessionId;
    let sessionStatus = 'bot';

    if (!currentSessionId) {
        // Check if there is an open session for this user
        const { data: existingSession } = await supabase
            .from('support_sessions')
            .select('*')
            .eq('user_id', userId)
            .neq('status', 'closed')
            .single()

        if (existingSession) {
            currentSessionId = existingSession.id
            sessionStatus = existingSession.status
        } else {
            // Create new session
            const { data: newSession, error: createError } = await supabase
                .from('support_sessions')
                .insert({ user_id: userId, status: 'bot' })
                .select()
                .single()

            if (createError) {
                return NextResponse.json({ error: "Failed to create session" }, { status: 500 })
            }
            currentSessionId = newSession.id
        }
    } else {
        // Verify session exists and get status
        const { data: session } = await supabase
            .from('support_sessions')
            .select('status')
            .eq('id', currentSessionId)
            .single()

        if (session) {
            sessionStatus = session.status
        }
    }

    // 2. Save User Message
    const { error: msgError } = await supabase
        .from('chat_messages')
        .insert({
            session_id: currentSessionId,
            sender_type: 'user',
            message: message,
            is_read: false
        })

    if (msgError) {
        return NextResponse.json({ error: "Failed to save message" }, { status: 500 })
    }

    // Update session last_message_at
    await supabase.from('support_sessions').update({ last_message_at: new Date().toISOString() }).eq('id', currentSessionId)

    // 3. Bot Logic (Only if status is 'bot')
    let botReply = null;

    if (sessionStatus === 'bot') {
        const lowerMsg = message.toLowerCase()

        // Search in FAQ
        const { data: faqs } = await supabase
            .from('faq_items')
            .select('*')
            .eq('is_active', true)

        let match = null
        if (faqs) {
            // Simple keyword matching
            match = faqs.find(faq =>
                faq.keywords && faq.keywords.some((k: string) => lowerMsg.includes(k.toLowerCase()))
            )
        }

        if (match) {
            botReply = match.answer
        } else {
            // Fallback for "temsilci" request
            if (lowerMsg.includes('temsilci') || lowerMsg.includes('canlı destek') || lowerMsg.includes('insan')) {
                botReply = "Sizi hemen bir temsilcimize yönlendiriyorum. Lütfen bekleyin..."
                // Auto-escalate
                await supabase.from('support_sessions').update({ status: 'waiting_admin' }).eq('id', currentSessionId)
            } else {
                botReply = "Bunu tam anlayamadım. Aşağıdaki hızlı butonları kullanabilir veya 'Temsilci' yazarak canlı desteğe bağlanabilirsiniz."
            }
        }

        // Send Bot Reply
        if (botReply) {
            await supabase.from('chat_messages').insert({
                session_id: currentSessionId,
                sender_type: 'bot',
                message: botReply,
                is_read: true
            })
        }
    }

    return NextResponse.json({ success: true, sessionId: currentSessionId })
}
