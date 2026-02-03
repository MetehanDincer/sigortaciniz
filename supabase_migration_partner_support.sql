-- =============================================
-- PARTNER SUPPORT SYSTEM (Chat & FAQ) MIGRATION
-- =============================================

-- 1. Create table for FAQ Items
create table if not exists faq_items (
    id uuid default gen_random_uuid() primary key,
    question text not null,
    answer text not null,
    keywords text[] default '{}',
    display_order integer default 0,
    is_active boolean default true,
    created_at timestamptz default now()
);

-- Enable RLS for faq_items
alter table faq_items enable row level security;

-- Policies for faq_items
create policy "FAQ items are viewable by everyone" 
    on faq_items for select 
    using (true);

create policy "Admins can manage FAQ items" 
    on faq_items for all 
    to authenticated 
    using (exists (select 1 from admin_profiles where id = auth.uid()));


-- 2. Create table for Support Sessions
create type session_status as enum ('bot', 'waiting_admin', 'active', 'closed');

create table if not exists support_sessions (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references auth.users(id) not null,
    assigned_admin_id uuid references admin_profiles(id),
    status session_status default 'bot',
    last_message_at timestamptz default now(),
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- Enable RLS for support_sessions
alter table support_sessions enable row level security;

-- Policies for support_sessions
create policy "Users can view their own sessions" 
    on support_sessions for select 
    to authenticated 
    using (auth.uid() = user_id);

create policy "Users can insert their own sessions" 
    on support_sessions for insert 
    to authenticated 
    with check (auth.uid() = user_id);

create policy "Users can update their own session status" 
    on support_sessions for update
    to authenticated
    using (auth.uid() = user_id);

create policy "Admins can view all sessions" 
    on support_sessions for select 
    to authenticated 
    using (exists (select 1 from admin_profiles where id = auth.uid()));

create policy "Admins can update all sessions" 
    on support_sessions for update 
    to authenticated 
    using (exists (select 1 from admin_profiles where id = auth.uid()));


-- 3. Create table for Chat Messages
create type sender_type as enum ('user', 'bot', 'admin');

create table if not exists chat_messages (
    id uuid default gen_random_uuid() primary key,
    session_id uuid references support_sessions(id) on delete cascade not null,
    sender_type sender_type not null,
    message text not null,
    is_read boolean default false,
    created_at timestamptz default now()
);

-- Enable RLS for chat_messages
alter table chat_messages enable row level security;

-- Policies for chat_messages
create policy "Users can view messages in their sessions" 
    on chat_messages for select 
    to authenticated 
    using (exists (select 1 from support_sessions where id = session_id and user_id = auth.uid()));

create policy "Users can insert messages in their sessions" 
    on chat_messages for insert 
    to authenticated 
    with check (exists (select 1 from support_sessions where id = session_id and user_id = auth.uid()));

create policy "Admins can view all messages" 
    on chat_messages for select 
    to authenticated 
    using (exists (select 1 from admin_profiles where id = auth.uid()));

create policy "Admins can insert messages" 
    on chat_messages for insert 
    to authenticated 
    with check (exists (select 1 from admin_profiles where id = auth.uid()));


-- 4. Insert Initial Knowledge Base (FAQs)
insert into faq_items (question, answer, keywords, display_order) values
('Trafik sigortasında taksit var mı?', 'Evet, trafik sigortalarında kredi kartına taksit imkanı sunabiliyoruz. Ancak taksit sayısı sigorta şirketine ve anlaşmalı bankalara göre değişiklik gösterebilir.', ARRAY['trafik', 'taksit', 'ödeme'], 1),
('Kasko teklifi ne kadar sürede çıkar?', 'Kasko teklifleri genellikle tüm bilgiler girildikten sonra 5-10 dakika içerisinde hazırlanır ve panelinize düşer.', ARRAY['kasko', 'süre', 'teklif', 'zaman'], 2),
('Komisyon ödemeleri ne zaman yapılır?', 'Komisyon hakedişleriniz, poliçenin kesildiği ayı takip eden ayın 15''ine kadar "Cüzdanım" sayfasında belirtilen IBAN adresinize yatırılır.', ARRAY['komisyon', 'ödeme', 'para', 'ne zaman'], 3),
('İptal işlemi nasıl yaparım?', 'İptal işlemleri için "İptal İşlemleri" menüsünden ilgili poliçeyi seçerek iade talebi oluşturabilirsiniz. Noter satış belgesini yüklemeyi unutmayınız.', ARRAY['iptal', 'iade', 'satış'], 4),
('Şifremi unuttum ne yapmalıyım?', 'Giriş ekranındaki "Şifremi Unuttum" bağlantısını kullanarak e-posta adresinize sıfırlama linki gönderebilirsiniz.', ARRAY['şifre', 'unuttum', 'giriş'], 5);
