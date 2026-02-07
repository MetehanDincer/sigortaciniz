-- GUEST (ANONYMOUS) KULLANICILARIN TALEP OLUŞTURABİLMESİ İÇİN GÜVENLİK AYARLARI

-- 1. Admin listesinin (sadece ID ve Kod) anonim kullanıcılar tarafından okunabilmesini sağla.
-- Bu sayede talep oluşturulurken otomatik atama (Round-Robin) mantığı çalışabilir.
DROP POLICY IF EXISTS "Anyone can view admin codes" ON public.admin_profiles;
CREATE POLICY "Anyone can view admin codes" 
ON public.admin_profiles FOR SELECT 
TO anon, authenticated
USING (true);

-- 2. Leads tablosuna anonim kullanıcıların INSERT yapabilmesini zaten sağlamıştık ama SELECT yetkisi yoktu.
-- .select().single() metodunun hata vermemesi için anonim kullanıcıların kendi ekledikleri satırı 
-- (en azından o anlık) görebilmesi gerekir. Ancak anonim kullanıcılarda 'kendi satırı' takibi zordur.
-- Bu yüzden API tarafında .select() kullanmadan kayıt yapacak bir fallback ekleyeceğiz.
