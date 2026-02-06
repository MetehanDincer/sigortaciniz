-- LEADS TABLOSUNA EKSİK SÜTUNLARI EKLE
-- Bu kodu Supabase SQL Editor'de çalıştırın.

ALTER TABLE public.leads 
ADD COLUMN IF NOT EXISTS offer_url TEXT,
ADD COLUMN IF NOT EXISTS policy_url TEXT;

-- Eğer RLS politikaları nedeniyle bu sütunlara erişim sorunu olursa:
-- (Opsiyonel: Eğer temsilciler hala hata alırsa bu kısmı da çalıştırın)
COMMENT ON COLUMN public.leads.offer_url IS 'Yüklenen teklif belgesinin URL adresi';
COMMENT ON COLUMN public.leads.policy_url IS 'Yüklenen poliçe belgesinin URL adresi';
