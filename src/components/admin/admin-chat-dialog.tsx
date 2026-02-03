"use client"

import { useState, useEffect, useRef } from "react"
import { createClient } from "@/lib/supabase/client"
import {
    Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { MessageCircle, User, Bot, Send, Search, CheckCircle, Clock, Lock } from "lucide-react"
import { ChatMessage, SupportSession } from "@/types/chat"

export function AdminChatDialog() {
    const [isOpen, setIsOpen] = useState(false)
    const [sessions, setSessions] = useState<any[]>([])
    const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null)
    const [messages, setMessages] = useState<ChatMessage[]>([])
    const [inputValue, setInputValue] = useState("")
    const [adminId, setAdminId] = useState<string | null>(null)
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const supabase = createClient()

    // 1. Fetch Sessions & Admin ID
    useEffect(() => {
        if (!isOpen) return

        const init = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (user) setAdminId(user.id)

            // Fetch sessions
            const { data: sessionsData } = await supabase
                .from('support_sessions')
                .select('*, user:profiles!user_id(full_name, email), assigned_admin:admin_profiles!assigned_admin_id(full_name)') // Assuming 'profiles' relation
                .neq('status', 'closed')
                .order('last_message_at', { ascending: false })

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
                    const { data } = await supabase
                        .from('support_sessions')
                        .select('*, user:profiles!user_id(full_name, email), assigned_admin:admin_profiles!assigned_admin_id(full_name)')
                        .neq('status', 'closed')
                        .order('last_message_at', { ascending: false })
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
                (payload) => {
                    const newMsg = payload.new as ChatMessage
                    setMessages((prev) => [...prev, newMsg])
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

        await supabase.from('chat_messages').insert({
            session_id: selectedSessionId,
            sender_type: 'admin',
            message: inputValue,
            is_read: false
        })

        // Update session to 'active' if it was 'waiting_admin'
        await supabase.from('support_sessions')
            .update({
                status: 'active',
                last_message_at: new Date().toISOString(),
                assigned_admin_id: adminId
            })
            .eq('id', selectedSessionId)

        setInputValue("")
    }

    const handleCloseSession = async (sessionId: string) => {
        if (confirm("Bu görüşmeyi sonlandırmak istediğinize emin misiniz?")) {
            await supabase.from('support_sessions').update({ status: 'closed' }).eq('id', sessionId)
            setSelectedSessionId(null)
            setSessions(prev => prev.filter(s => s.id !== sessionId))
        }
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
                                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                        onClick={() => handleCloseSession(selectedSessionId)}
                                    >
                                        Görüşmeyi Sonlandır
                                    </Button>
                                </div>

                                {/* Messages */}
                                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                                    {messages.map((msg) => {
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
