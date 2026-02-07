-- CANLI DESTEK GERÇEK ZAMANLI (REALTIME) AKTİFLEŞTİRME
-- Eğer mesajlar anlık olarak ekrana düşmüyorsa bu kodu Supabase SQL Editor'de çalıştırın.

-- 1. Realtime yayınını kontrol et ve tabloları ekle
-- Not: Bu komutlar hata verirse tablolar zaten realtime listesindedir.
ALTER PUBLICATION supabase_realtime ADD TABLE support_sessions;
ALTER PUBLICATION supabase_realtime ADD TABLE chat_messages;

-- 2. Replica Identity Full ayarı (Filtrelerin daha sağlıklı çalışması için)
ALTER TABLE public.chat_messages REPLICA IDENTITY FULL;
ALTER TABLE public.support_sessions REPLICA IDENTITY FULL;

-- 3. RLS Kontrolü (Mesajların herkes tarafından değil sadece ilgili kişilerce okunması için)
-- Bu politikaların varlığından emin olun (Zaten migration dosyasında vardı ama teyit amaçlı)
-- Not: Hata alırsanız politikalar zaten mevcuttur.
CREATE POLICY "Admins can view all messages" ON public.chat_messages FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid()));
CREATE POLICY "Admins can insert messages" ON public.chat_messages FOR INSERT TO authenticated WITH CHECK (exists (select 1 from admin_profiles where id = auth.uid()));
