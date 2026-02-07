"use client"

import { useState, useEffect, useRef } from "react"
import { createClient } from "@/lib/supabase/client"
import {
    Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { MessageCircle, User, Bot, Send, Search, CheckCircle, Clock, Lock, HelpCircle } from "lucide-react"
import { ChatMessage, SupportSession } from "@/types/chat"

export function AdminChatDialog() {
    const [isOpen, setIsOpen] = useState(false)
    const [sessions, setSessions] = useState<any[]>([])
    const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null)
    const [messages, setMessages] = useState<ChatMessage[]>([])
    const [inputValue, setInputValue] = useState("")
    const [adminId, setAdminId] = useState<string | null>(null)
    const [showCloseConfirm, setShowCloseConfirm] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const supabase = createClient()

    // 1. Fetch Sessions & Admin ID
    useEffect(() => {
        if (!isOpen) return

        const init = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (user) setAdminId(user.id)

            // Fetch sessions
            const { data: sessionsData, error: sessionsError } = await supabase
                .from('support_sessions')
                .select(`
                    *,
                    user:profiles(full_name, email),
                    assigned_admin:admin_profiles(full_name)
                `)
                .neq('status', 'closed')
                .order('last_message_at', { ascending: false })

            if (sessionsError) {
                console.error("❌ Mesajlaşma oturumları çekilirken hata oluştu:", sessionsError)
            }

            if (sessionsData) setSessions(sessionsData)
        }
        init()

        // Realtime Sessions Update
        const channel = supabase
            .channel('admin-sessions')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'support_sessions' },
                async () => {
                    // Refresh list
                    const { data, error } = await supabase
                        .from('support_sessions')
                        .select(`
                            *,
                            user:profiles(full_name, email),
                            assigned_admin:admin_profiles(full_name)
                        `)
                        .neq('status', 'closed')
                        .order('last_message_at', { ascending: false })

                    if (error) console.error("❌ Gerçek zamanlı oturum güncelleme hatası:", error)
                    if (data) setSessions(data)
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [isOpen, supabase])

    // 2. Fetch Messages for Selected Session
    useEffect(() => {
        if (!selectedSessionId) return

        const fetchMessages = async () => {
            const { data } = await supabase
                .from('chat_messages')
                .select('*')
                .eq('session_id', selectedSessionId)
                .order('created_at', { ascending: true })
            if (data) setMessages(data as any)
        }
        fetchMessages()

        // Realtime Messages
        const channel = supabase
            .channel(`session-${selectedSessionId}`)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'chat_messages',
                    filter: `session_id=eq.${selectedSessionId}`
                },
                (payload: any) => {
                    const newMsg = payload.new as ChatMessage
                    setMessages((prev) => {
                        // Prevent duplicates (especially important with optimistic updates)
                        if (prev.find(m => m.id === newMsg.id)) return prev
                        // Also try to replace optimistic messages if content matches (optional but safer)
                        const filtered = prev.filter(m => !m.id.startsWith('temp-') || m.message !== newMsg.message)
                        return [...filtered, newMsg]
                    })
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }

    }, [selectedSessionId, supabase])

    // Scroll
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages])

    const handleSendMessage = async () => {
        if (!inputValue.trim() || !selectedSessionId || !adminId) return

        const msgText = inputValue
        const tempId = 'temp-' + Date.now()

        // Optimistic Update
        const optimisticMsg: ChatMessage = {
            id: tempId,
            session_id: selectedSessionId,
            sender_type: 'admin',
            message: msgText,
            is_read: false,
            created_at: new Date().toISOString()
        }
        setMessages(prev => [...prev, optimisticMsg])
        setInputValue("")

        try {
            const { error } = await supabase.from('chat_messages').insert({
                session_id: selectedSessionId,
                sender_type: 'admin',
                message: msgText,
                is_read: false
            })

            if (error) throw error

            // Update session status
            await supabase.from('support_sessions')
                .update({
                    status: 'active',
                    last_message_at: new Date().toISOString(),
                    assigned_admin_id: adminId
                })
                .eq('id', selectedSessionId)

        } catch (error) {
            console.error("❌ Mesaj gönderilemedi:", error)
            setMessages(prev => prev.filter(m => m.id !== tempId))
        }
    }

    const handleCloseSession = async (sessionId: string) => {
        await supabase.from('support_sessions').update({
            status: 'closing_requested',
            last_message_at: new Date().toISOString()
        }).eq('id', sessionId)
        setShowCloseConfirm(false)
    }

    // Helper to format time
    const formatTime = (dateStr: string) => {
        return new Date(dateStr).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
    }

    const waitingCount = sessions.filter(s => s.status === 'waiting_admin').length

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="gap-2 relative">
                    <MessageCircle className="h-4 w-4" />
                    Canlı Destek
                    {waitingCount > 0 && (
                        <span className="absolute -top-1 -right-1 flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                        </span>
                    )}
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-5xl h-[80vh] flex flex-col p-0 gap-0 overflow-hidden bg-slate-50">
                <div className="flex flex-1 overflow-hidden">
                    {/* Sidebar: Session List */}
                    <div className="w-80 bg-white border-r border-slate-200 flex flex-col">
                        <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                            <h3 className="font-bold text-slate-800 flex items-center gap-2">
                                <MessageCircle className="h-4 w-4 text-indigo-600" />
                                Gelen Mesajlar
                            </h3>
                            <div className="relative mt-2">
                                <Search className="absolute left-2 top-2.5 h-3 w-3 text-slate-400" />
                                <Input placeholder="Ara..." className="pl-8 h-8 text-xs bg-white" />
                            </div>
                        </div>
                        <div className="flex-1 overflow-y-auto">
                            {sessions.length === 0 ? (
                                <div className="p-8 text-center text-xs text-slate-400 italic">
                                    Aktif görüşme yok.
                                </div>
                            ) : (
                                sessions.map(session => (
                                    <button
                                        key={session.id}
                                        onClick={() => setSelectedSessionId(session.id)}
                                        className={`w-full text-left p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors flex items-start gap-3
                                            ${selectedSessionId === session.id ? 'bg-indigo-50 border-r-4 border-r-indigo-600' : ''}
                                        `}
                                    >
                                        <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center shrink-0">
                                            <User className="h-4 w-4 text-slate-500" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start mb-0.5">
                                                <span className="font-bold text-sm text-slate-900 truncate">
                                                    {session.user?.full_name || 'İsimsiz Kullanıcı'}
                                                </span>
                                                <span className="text-[10px] text-slate-400">
                                                    {formatTime(session.last_message_at)}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {session.status === 'waiting_admin' && (
                                                    <span className="px-1.5 py-0.5 rounded bg-red-100 text-red-600 text-[10px] font-black uppercase">Bekliyor</span>
                                                )}
                                                {session.status === 'bot' && (
                                                    <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 text-[10px] font-bold uppercase">Bot</span>
                                                )}
                                                {session.status === 'closing_requested' && (
                                                    <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-600 text-[10px] font-black uppercase">Sonlandırma Onayı Bekleniyor</span>
                                                )}
                                                {session.status === 'active' && (
                                                    <span className="px-1.5 py-0.5 rounded bg-green-100 text-green-600 text-[10px] font-bold uppercase flex items-center gap-1">
                                                        {session.assigned_admin_id && session.assigned_admin_id !== adminId && (
                                                            <Lock className="h-3 w-3" />
                                                        )}
                                                        {session.assigned_admin?.full_name?.split(' ')[0] || 'Aktif'}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </button>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Chat Area */}
                    <div className="flex-1 flex flex-col bg-slate-50 relative">
                        {selectedSessionId ? (
                            <>
                                {/* Chat Header */}
                                <div className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0">
                                    <div className="flex items-center gap-2">
                                        <div className="h-2 w-2 rounded-full bg-green-500" />
                                        <span className="font-bold text-slate-700">Canlı Destek Görüşmesi</span>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-red-500 hover:text-red-700 hover:bg-red-50 mr-12 font-bold"
                                        onClick={() => setShowCloseConfirm(true)}
                                    >
                                        Görüşmeyi Sonlandır
                                    </Button>
                                </div>

                                {/* Messages */}
                                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                                    {/* System Notification for New Requests */}
                                    <div className="flex justify-center mb-6">
                                        <div className="bg-amber-50 border border-amber-200 text-amber-800 text-[11px] font-bold px-4 py-1.5 rounded-full flex items-center gap-2 shadow-sm">
                                            <span className="flex h-2 w-2 relative">
                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                                                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                                            </span>
                                            CANLI DESTEK TALEBİ BAŞLATILDI
                                        </div>
                                    </div>

                                    {messages.filter(m => m.sender_type !== 'bot').map((msg) => {
                                        const isAdmin = msg.sender_type === 'admin'
                                        const isBot = msg.sender_type === 'bot'
                                        return (
                                            <div key={msg.id} className={`flex gap-3 ${isAdmin ? 'flex-row-reverse' : ''}`}>
                                                <div className={`
                                                    h-8 w-8 rounded-full flex items-center justify-center shrink-0
                                                    ${isAdmin ? 'bg-indigo-600 text-white' : isBot ? 'bg-slate-200 text-slate-600' : 'bg-slate-900 text-white'}
                                                `}>
                                                    {isAdmin ? <User className="h-4 w-4" /> : isBot ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
                                                </div>
                                                <div className={`
                                                    p-3 rounded-2xl text-sm shadow-sm max-w-[80%]
                                                    ${isAdmin
                                                        ? 'bg-indigo-600 text-white rounded-tr-none'
                                                        : 'bg-white border border-slate-200 text-slate-700 rounded-tl-none'}
                                                `}>
                                                    {msg.message}
                                                </div>
                                                <span className="text-[10px] text-slate-300 self-end">
                                                    {formatTime(msg.created_at)}
                                                </span>
                                            </div>
                                        )
                                    })}
                                    <div ref={messagesEndRef} />
                                </div>

                                {/* Custom Close Confirmation Overlay */}
                                {showCloseConfirm && (
                                    <div className="absolute inset-0 z-40 bg-slate-900/10 backdrop-blur-[2px] flex items-center justify-center p-6 animate-in fade-in duration-200">
                                        <div className="bg-white rounded-3xl p-8 shadow-2xl border border-slate-100 max-w-sm w-full text-center">
                                            <div className="bg-red-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                                                <HelpCircle className="h-8 w-8 text-red-500" />
                                            </div>
                                            <h3 className="text-lg font-bold text-slate-900 mb-2">Görüşme Sonlandırılsın mı?</h3>
                                            <p className="text-sm text-slate-500 mb-8 leading-relaxed">
                                                İş ortağına görüşmeyi sonlandırma talebi gönderilecektir. Emin misiniz?
                                            </p>
                                            <div className="flex flex-col gap-3">
                                                <Button
                                                    className="w-full bg-red-600 hover:bg-red-700 text-white font-bold h-11 rounded-xl shadow-lg shadow-red-100"
                                                    onClick={() => handleCloseSession(selectedSessionId)}
                                                >
                                                    Evet, Talebi Gönder
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    className="w-full text-slate-400 font-bold h-11 rounded-xl"
                                                    onClick={() => setShowCloseConfirm(false)}
                                                >
                                                    İptal
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Input */}
                                <div className="p-4 bg-white border-t border-slate-200">
                                    {sessions.find(s => s.id === selectedSessionId)?.assigned_admin_id &&
                                        sessions.find(s => s.id === selectedSessionId)?.assigned_admin_id !== adminId ? (
                                        <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg flex items-center gap-3 text-amber-800 text-sm">
                                            <Lock className="h-4 w-4" />
                                            <span>
                                                Bu görüşme <strong>{sessions.find(s => s.id === selectedSessionId)?.assigned_admin?.full_name}</strong> tarafından yürütülüyor.
                                            </span>
                                        </div>
                                    ) : (
                                        <form
                                            className="flex gap-2"
                                            onSubmit={(e) => {
                                                e.preventDefault()
                                                handleSendMessage()
                                            }}
                                        >
                                            <Input
                                                placeholder="Cevabınızı yazın..."
                                                className="bg-slate-50 border-slate-200"
                                                value={inputValue}
                                                onChange={(e) => setInputValue(e.target.value)}
                                            />
                                            <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 px-6">
                                                <Send className="h-4 w-4" />
                                            </Button>
                                        </form>
                                    )}
                                </div>
                            </>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
                                <MessageCircle className="h-12 w-12 mb-4 opacity-20" />
                                <p>Görüntülemek için soldan bir görüşme seçin.</p>
                            </div>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
