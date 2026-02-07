"use client"

import { useState, useEffect, useRef } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageCircle, X, Send, Bot, User, HelpCircle, Loader2 } from "lucide-react"

// Types
import { ChatMessage, FAQItem } from "@/types/chat"

export function PartnerChatWidget() {
    const [isOpen, setIsOpen] = useState(false)
    const [messages, setMessages] = useState<ChatMessage[]>([])
    const [inputValue, setInputValue] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [sessionId, setSessionId] = useState<string | null>(null)
    const [sessionStatus, setSessionStatus] = useState<string | null>(null)
    const [faqs, setFaqs] = useState<FAQItem[]>([])
    const [userId, setUserId] = useState<string | null>(null)
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const supabase = createClient()

    // 1. Init: Check Auth & Get FAQs
    useEffect(() => {
        const init = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
                setUserId(user.id)
                // Fetch FAQs
                const { data: faqData } = await supabase
                    .from('faq_items')
                    .select('*')
                    .eq('is_active', true)
                    .order('display_order', { ascending: true })

                if (faqData) setFaqs(faqData)

                // Check active session
                const { data: sessionData } = await supabase
                    .from('support_sessions')
                    .select('id, status')
                    .eq('user_id', user.id)
                    .neq('status', 'closed')
                    .order('last_message_at', { ascending: false })
                    .limit(1)

                const session = sessionData?.[0]

                if (session) {
                    setSessionId(session.id)
                    setSessionStatus(session.status)
                    // Load messages
                    const { data: msgs } = await supabase
                        .from('chat_messages')
                        .select('*')
                        .eq('session_id', session.id)
                        .order('created_at', { ascending: true })

                    if (msgs) setMessages(msgs as any)
                }
            }
        }
        init()
    }, [supabase])

    // 2. Realtime Subscription (Messages & Session Status)
    useEffect(() => {
        if (!sessionId) return

        const channel = supabase
            .channel(`session-${sessionId}`)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'chat_messages',
                    filter: `session_id=eq.${sessionId}`
                },
                (payload) => {
                    const newMsg = payload.new as ChatMessage
                    setMessages((prev) => {
                        if (prev.find(m => m.id === newMsg.id)) return prev
                        // Duplicate check for optimistic updates
                        const filtered = prev.filter(m => !m.id.startsWith('temp-') || m.message !== newMsg.message)
                        return [...filtered, newMsg]
                    })
                }
            )
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'support_sessions',
                    filter: `id=eq.${sessionId}`
                },
                (payload) => {
                    setSessionStatus(payload.new.status)
                    if (payload.new.status === 'closed') {
                        setSessionId(null)
                        setMessages([])
                    }
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [sessionId, supabase])

    // Scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages, isOpen])

    const handleSendMessage = async (text?: string) => {
        const msgText = text || inputValue
        if (!msgText.trim() || !userId) return

        // Optimistic UI for User Message
        const tempId = 'temp-' + Date.now()
        const optimisticMsg: ChatMessage = {
            id: tempId,
            session_id: sessionId || 'new',
            sender_type: 'user',
            message: msgText,
            is_read: false,
            created_at: new Date().toISOString()
        }

        setMessages(prev => [...prev, optimisticMsg])

        if (!text) {
            setInputValue("")
        }

        setIsLoading(true)

        try {
            const response = await fetch('/api/chat/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId,
                    message: msgText,
                    sessionId
                })
            })

            const data = await response.json()

            if (data.sessionId) {
                const isNewSession = !sessionId;
                if (isNewSession) {
                    setSessionId(data.sessionId)
                    // If it's a new session, Realtime might have missed the first messages
                    // because the subscription started after the inserts.
                    // Fetch them manually once.
                    const { data: freshMsgs } = await supabase
                        .from('chat_messages')
                        .select('*')
                        .eq('session_id', data.sessionId)
                        .order('created_at', { ascending: true })

                    if (freshMsgs) {
                        setMessages(freshMsgs as any)
                    }
                }
            }
        } catch (error) {
            console.error("Chat error", error)
            // Remove optimistic message on error
            setMessages(prev => prev.filter(m => m.id !== tempId))
        } finally {
            setIsLoading(false)
        }
    }

    const handleUpdateSessionStatus = async (newStatus: string) => {
        if (!sessionId) return
        await supabase.from('support_sessions').update({ status: newStatus }).eq('id', sessionId)
        setSessionStatus(newStatus)
        if (newStatus === 'closed') {
            setSessionId(null)
            setMessages([])
        }
    }

    if (!userId) return null // Only for logged in users

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
            {/* Chat Window */}
            {isOpen && (
                <Card className="w-[350px] md:w-[400px] h-[500px] shadow-2xl border-indigo-100 flex flex-col animate-in slide-in-from-bottom-10 fade-in duration-200">
                    {/* Header */}
                    <CardHeader className="bg-indigo-900 text-white p-4 rounded-t-xl flex flex-row items-center justify-between shrink-0">
                        <div className="flex items-center gap-3">
                            <div className="bg-white/10 p-2 rounded-full">
                                <Bot className="h-5 w-5" />
                            </div>
                            <div>
                                <CardTitle className="text-sm font-bold text-slate-800">Uygun Sigortacı Asistan</CardTitle>
                                <p className="text-[10px] text-indigo-200">7/24 Yanınızdayız</p>
                            </div>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-indigo-200 hover:text-white hover:bg-white/10 h-8 w-8"
                            onClick={() => setIsOpen(false)}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </CardHeader>

                    {/* Messages Area */}
                    <CardContent className="flex-grow overflow-y-auto p-4 space-y-4 bg-slate-50">

                        {/* Initial Greeting */}
                        <div className="flex gap-3">
                            <div className="bg-indigo-100 p-2 rounded-full h-8 w-8 flex items-center justify-center shrink-0">
                                <Bot className="h-4 w-4 text-indigo-600" />
                            </div>
                            <div className="space-y-2">
                                <div className="bg-white border border-slate-200 p-3 rounded-2xl rounded-tl-none text-sm text-slate-700 shadow-sm">
                                    Merhaba! Size nasıl yardımcı olabilirim? Aşağıdaki konulardan hızlıca destek alabilirsiniz. 👋
                                </div>
                                {/* FAQ Chips */}
                                <div className="flex flex-wrap gap-2">
                                    {faqs.map(faq => (
                                        <button
                                            key={faq.id}
                                            onClick={() => handleSendMessage(faq.question)}
                                            className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold px-3 py-2 rounded-xl transition-colors text-left"
                                        >
                                            {faq.question}
                                        </button>
                                    ))}
                                    <button
                                        onClick={() => handleSendMessage("Canlı desteğe bağlanmak istiyorum.")}
                                        className="bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold px-3 py-2 rounded-xl transition-colors"
                                    >
                                        🎧 Canlı Destek
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Message History */}
                        {messages.map((msg) => {
                            const isUser = msg.sender_type === 'user'
                            const isAdmin = msg.sender_type === 'admin'
                            return (
                                <div key={msg.id} className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
                                    <div className={`
                                        h-8 w-8 rounded-full flex items-center justify-center shrink-0
                                        ${isUser ? 'bg-primary text-white' : isAdmin ? 'bg-green-100 text-green-600' : 'bg-indigo-100 text-indigo-600'}
                                    `}>
                                        {isUser ? <User className="h-4 w-4" /> : isAdmin ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                                    </div>
                                    <div className={`
                                        p-3 rounded-2xl text-sm shadow-sm max-w-[80%]
                                        ${isUser
                                            ? 'bg-primary text-white rounded-tr-none'
                                            : isAdmin
                                                ? 'bg-green-50 border border-green-200 text-green-900 rounded-tl-none'
                                                : 'bg-white border border-slate-200 text-slate-700 rounded-tl-none'}
                                    `}>
                                        {msg.message}
                                    </div>
                                </div>
                            )
                        })}
                        {isLoading && (
                            <div className="flex gap-3">
                                <div className="bg-indigo-100 p-2 rounded-full h-8 w-8 flex items-center justify-center shrink-0">
                                    <Bot className="h-4 w-4 text-indigo-600" />
                                </div>
                                <div className="bg-white border border-slate-200 p-3 rounded-2xl rounded-tl-none text-sm text-slate-500 shadow-sm flex items-center gap-2">
                                    <Loader2 className="h-3 w-3 animate-spin" /> Yazıyor...
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </CardContent>

                    {/* Closing Confirmation Overlay (Fixed at Bottom Above Footer) */}
                    {sessionStatus === 'closing_requested' && (
                        <div className="absolute inset-x-0 bottom-[60px] z-30 p-3 animate-in slide-in-from-bottom-5 duration-300">
                            <div className="bg-white border-2 border-indigo-50 shadow-[0_-8px_30px_rgb(0,0,0,0.15)] rounded-2xl p-4 text-center">
                                <div className="flex items-center justify-center gap-2 mb-2">
                                    <HelpCircle className="h-4 w-4 text-indigo-600" />
                                    <h4 className="font-bold text-sm text-slate-900">Görüşme Sonlandırılsın mı?</h4>
                                </div>
                                <p className="text-[11px] text-slate-600 leading-tight mb-4 px-2">
                                    Size yardımcı olacağım başka bir konu kalmadı ise görüşmemiz 1 dakika içerisinde sonlandırılacaktır.
                                </p>
                                <div className="flex gap-2">
                                    <Button
                                        onClick={() => handleUpdateSessionStatus('closed')}
                                        variant="ghost"
                                        size="sm"
                                        className="flex-1 font-bold text-slate-400 hover:text-red-600"
                                    >
                                        Sonlandır
                                    </Button>
                                    <Button
                                        onClick={() => handleUpdateSessionStatus('active')}
                                        variant="default"
                                        size="sm"
                                        className="flex-1 font-bold bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-100"
                                    >
                                        Devam Et
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Footer Input */}
                    <CardFooter className="p-3 bg-white border-t border-slate-100">
                        <form
                            className="flex w-full gap-2"
                            onSubmit={(e) => {
                                e.preventDefault()
                                handleSendMessage()
                            }}
                        >
                            <Input
                                placeholder="Mesajınızı yazın..."
                                className="bg-slate-50 border-slate-200 focus-visible:ring-indigo-500"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                            />
                            <Button type="submit" size="icon" className="bg-indigo-600 hover:bg-indigo-700 shrink-0">
                                <Send className="h-4 w-4" />
                            </Button>
                        </form>
                    </CardFooter>
                </Card>
            )}

            {/* Float Button */}
            {!isOpen && (
                <Button
                    onClick={() => setIsOpen(true)}
                    className="h-14 w-14 rounded-full shadow-2xl bg-indigo-600 hover:bg-indigo-700 text-white p-0 animate-in zoom-in duration-300"
                >
                    <MessageCircle className="h-7 w-7" />
                    <span className="absolute -top-1 -right-1 flex h-4 w-4">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500"></span>
                    </span>
                </Button>
            )}
        </div>
    )
}
