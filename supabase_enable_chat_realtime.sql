-- CANLI DESTEK GERÇEK ZAMANLI (REALTIME) AKTİFLEŞTİRME
-- Eğer mesajlar anlık olarak ekrana düşmüyorsa bu kodu Supabase SQL Editor'de çalıştırın.

-- 1. Realtime yayınını kontrol et ve tabloları ekle
-- Not: Bu komutlar hata verirse tablolar zaten realtime listesindedir.
-- Önce yayını silip tekrar oluşturmak en garantisidir:
DROP PUBLICATION IF EXISTS supabase_realtime;
CREATE PUBLICATION supabase_realtime FOR TABLE chat_messages, support_sessions;

-- 2. Replica Identity Full ayarı (Filtrelerin ve Realtime'ın kusursuz çalışması için ŞART)
ALTER TABLE public.chat_messages REPLICA IDENTITY FULL;
ALTER TABLE public.support_sessions REPLICA IDENTITY FULL;

-- 3. RLS Kontrolü (Güvenlik Politikaları)
-- Not: Hata alırsanız politikalar zaten mevcuttur.
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admins can view all messages') THEN
        CREATE POLICY "Admins can view all messages" ON public.chat_messages FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid()));
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admins can insert messages') THEN
        CREATE POLICY "Admins can insert messages" ON public.chat_messages FOR INSERT TO authenticated WITH CHECK (exists (select 1 from admin_profiles where id = auth.uid()));
    END IF;
END $$;
