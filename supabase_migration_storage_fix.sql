-- SUPABASE STORAGE RLS FIX
-- Bu kodu Supabase SQL Editor'de çalıştırın.

-- 1. 'leads' bucket'ını oluştur (yoksa)
INSERT INTO storage.buckets (id, name, public)
VALUES ('leads', 'leads', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Mevcut hatalı politikaları temizle (varsa)
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Admin Upload" ON storage.objects;
DROP POLICY IF EXISTS "Admin Update/Delete" ON storage.objects;

-- 3. Genel Okuma İzni (Herkes dosyaları görebilir)
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'leads' );

-- 4. Admin Yükleme İzni (Sadece admin_profiles tablosundaki kullanıcılar yükleyebilir)
CREATE POLICY "Admin Upload"
ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'leads' AND
    (EXISTS (SELECT 1 FROM public.admin_profiles WHERE id = auth.uid()))
);

-- 5. Admin Yönetim İzni (Sadece adminler silebilir veya güncelleyebilir)
CREATE POLICY "Admin Update/Delete"
ON storage.objects FOR ALL
TO authenticated
USING (
    bucket_id = 'leads' AND
    (EXISTS (SELECT 1 FROM public.admin_profiles WHERE id = auth.uid()))
);
