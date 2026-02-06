-- TABLO: LEADS (TEKLİFLER) VE LOGLAR İÇİN GÜVENLİK POLİTİKALARI
-- Bu kod, adminlerin tüm teklifleri görmesini, ziyaretçilerin ise form doldurabilmesini sağlar.

-- 1. RLS (Satır Bazlı Güvenlik) özelliğini aktif et
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_logs ENABLE ROW LEVEL SECURITY;

-- 2. Eski kısıtlamaları temizle (Hata payını sıfırlamak için)
DO $$ 
BEGIN
    DROP POLICY IF EXISTS "Admins can view all leads" ON public.leads;
    DROP POLICY IF EXISTS "Admins can update all leads" ON public.leads;
    DROP POLICY IF EXISTS "Admins can delete leads" ON public.leads;
    DROP POLICY IF EXISTS "Anyone can insert leads" ON public.leads;
    DROP POLICY IF EXISTS "Partners can view their own leads" ON public.leads;
    DROP POLICY IF EXISTS "Enable read access for all users" ON public.leads;
    DROP POLICY IF EXISTS "Admins can view all logs" ON public.lead_logs;
    DROP POLICY IF EXISTS "Admins can create logs" ON public.lead_logs;
END $$;

-- 3. POLİTİKA: SİSTEM YÖNETİCİLERİ (ADMİNLER)
-- Admin yetkisi olanlar (admin_profiles tablosunda kaydı olanlar) leads tablosunda her şeyi yapabilir.
CREATE POLICY "Admins can view all leads" 
ON public.leads FOR SELECT 
TO authenticated 
USING (EXISTS (SELECT 1 FROM public.admin_profiles WHERE id = auth.uid()));

CREATE POLICY "Admins can update all leads" 
ON public.leads FOR UPDATE 
TO authenticated 
USING (EXISTS (SELECT 1 FROM public.admin_profiles WHERE id = auth.uid()));

CREATE POLICY "Admins can delete leads" 
ON public.leads FOR DELETE 
TO authenticated 
USING (EXISTS (SELECT 1 FROM public.admin_profiles WHERE id = auth.uid()));

-- 4. POLİTİKA: ZİYARETÇİLER VE SİSTEM (YENİ TEKLİF EKLEME)
-- Web sitesinden form dolduran herkes (ve otomatik atama sistemi) yeni teklif oluşturabilir.
CREATE POLICY "Anyone can insert leads" 
ON public.leads FOR INSERT 
WITH CHECK (true);

-- 5. POLİTİKA: İŞ ORTAKLARI (PARTNERLER)
-- İş ortakları sadece kendi 'affiliate_id' kodlarına sahip teklifleri görebilir.
CREATE POLICY "Partners can view their own leads" 
ON public.leads FOR SELECT 
TO authenticated 
USING (
    EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = auth.uid() AND profiles.affiliate_id = leads.affiliate_id
    )
);

-- 6. POLİTİKA: İŞLEM GÜNLÜKLERİ (LEAD_LOGS)
-- Adminler tüm günlükleri görebilir. Herkes (ziyaretçiler dahil) başlangıç günlüğü ekleyebilir.
CREATE POLICY "Admins can view all logs" 
ON public.lead_logs FOR SELECT 
TO authenticated 
USING (EXISTS (SELECT 1 FROM public.admin_profiles WHERE id = auth.uid()));

CREATE POLICY "Anyone can insert logs" 
ON public.lead_logs FOR INSERT 
WITH CHECK (true);

-- 7. Açıklama ekle
COMMENT ON TABLE public.leads IS 'Sigorta teklif taleplerinin tutulduğu ana tablo. Admin ve Partner erişim yetkileri tanımlanmıştır.';
