-- CHAT SİSTEMİ VERİTABANI İLİŞKİ DÜZELTME
-- Bu kodu Supabase SQL Editor'de çalıştırın.

-- 1. Mevcut user_id'yi profiles tablosuna bağlayan bir yabancı anahtar ekle
-- (Eğer daha önce auth.users'a bağlıysa önce o kısıtı temizleyip buna geçmek daha sağlıklıdır)
ALTER TABLE public.support_sessions
DROP CONSTRAINT IF EXISTS support_sessions_user_id_fkey,
ADD CONSTRAINT support_sessions_user_id_fkey 
FOREIGN KEY (user_id) 
REFERENCES public.profiles(id) 
ON DELETE CASCADE;

-- 2. İsim bazlı aramalar ve joinler için indeksleri güçlendir
CREATE INDEX IF NOT EXISTS idx_support_sessions_user_id ON public.support_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_support_sessions_status ON public.support_sessions(status);
CREATE INDEX IF NOT EXISTS idx_chat_messages_session_id ON public.chat_messages(session_id);

-- 3. Adminlerin profil verilerini (full_name, email) okuma yetkisini doğrula
-- Eğer bu politika yoksa adminler join yapamaz.
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
CREATE POLICY "Admins can view all profiles" 
ON public.profiles FOR SELECT 
TO authenticated 
USING (EXISTS (SELECT 1 FROM public.admin_profiles WHERE id = auth.uid()));

-- Alternatif: Bazı durumlarda auth.uid() eşlemesi için public.profiles'da RLS zaten açıktır.
-- Yukarıdaki politika adminlerin tüm partner bilgilerini çekmesini garantiler.
