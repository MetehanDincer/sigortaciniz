export type SenderType = 'user' | 'bot' | 'admin';
export type SessionStatus = 'bot' | 'waiting_admin' | 'active' | 'closed';

export interface FAQItem {
    id: string;
    question: string;
    answer: string;
    keywords: string[];
    display_order: number;
    is_active: boolean;
    created_at: string;
}

export interface SupportSession {
    id: string;
    user_id: string;
    assigned_admin_id: string | null;
    status: SessionStatus;
    last_message_at: string;
    created_at: string;
    updated_at: string;
}

export interface ChatMessage {
    id: string;
    session_id: string;
    sender_type: SenderType;
    message: string;
    is_read: boolean;
    created_at: string;
}
