-- =============================================
-- MASTER RESET & RELOAD (AcentePortal RLS Fix)
-- =============================================

-- 1. CLEAN ALL EXISTING POLICIES (DANGEROUS BUT NECESSARY TO FIX CONFLICTS)
DO $$ 
DECLARE 
    target_tables TEXT[] := ARRAY['admin_profiles', 'profiles', 'leads', 'support_sessions', 'agencies'];
    t TEXT;
    pol RECORD;
BEGIN 
    FOREACH t IN ARRAY target_tables LOOP
        -- public şemasındaki her tablo için var olan tüm politikaları bul ve sil
        FOR pol IN (SELECT policyname FROM pg_policies WHERE schemaname = 'public' AND tablename = t) LOOP
            EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', pol.policyname, t);
        END LOOP;
    END LOOP;
END $$;

-- 2. DROP OLD FUNCTIONS
DROP FUNCTION IF EXISTS public.check_is_super_admin();
DROP FUNCTION IF EXISTS public.check_is_admin();
DROP FUNCTION IF EXISTS public.get_my_agency_id();
DROP FUNCTION IF EXISTS public.check_agency_id();

-- 3. CREATE STABLE HELPER FUNCTIONS (SECURITY DEFINER)
-- Bypasses RLS to avoid "Infinite Recursion Detected" error
CREATE OR REPLACE FUNCTION public.check_is_super_admin()
RETURNS boolean AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.admin_profiles
        WHERE id = auth.uid() AND role = 'super_admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION public.check_is_admin()
RETURNS boolean AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.admin_profiles
        WHERE id = auth.uid() AND (role = 'super_admin' OR role = 'agency_admin')
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION public.get_my_agency_id()
RETURNS uuid AS $$
BEGIN
    RETURN (SELECT agency_id FROM public.admin_profiles WHERE id = auth.uid());
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 4. APPLY CLEAN & OPTIMIZED POLICIES

-- Agencies: Herkes okuyabilir (Branding için)
ALTER TABLE public.agencies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "agencies_read_v1" ON public.agencies FOR SELECT USING (true);

-- Admin Profiles:
ALTER TABLE public.admin_profiles ENABLE ROW LEVEL SECURITY;
-- SELECT
CREATE POLICY "admin_profiles_select_self" ON public.admin_profiles FOR SELECT USING (id = auth.uid());
CREATE POLICY "admin_profiles_select_super" ON public.admin_profiles FOR SELECT USING (public.check_is_super_admin());
CREATE POLICY "admin_profiles_select_agency" ON public.admin_profiles FOR SELECT USING (public.get_my_agency_id() = agency_id);
-- INSERT (Only Super Admins or Agency Admins can add to their agency)
CREATE POLICY "admin_profiles_insert_super" ON public.admin_profiles FOR INSERT WITH CHECK (public.check_is_super_admin());
CREATE POLICY "admin_profiles_insert_agency" ON public.admin_profiles FOR INSERT WITH CHECK (
    public.check_is_admin() AND (public.get_my_agency_id() = agency_id)
);
-- UPDATE
CREATE POLICY "admin_profiles_update_super" ON public.admin_profiles FOR UPDATE USING (public.check_is_super_admin());
CREATE POLICY "admin_profiles_update_agency" ON public.admin_profiles FOR UPDATE USING (
    public.check_is_admin() AND (public.get_my_agency_id() = agency_id)
);
-- DELETE
CREATE POLICY "admin_profiles_delete_super" ON public.admin_profiles FOR DELETE USING (public.check_is_super_admin());
CREATE POLICY "admin_profiles_delete_agency" ON public.admin_profiles FOR DELETE USING (
    public.check_is_admin() AND (public.get_my_agency_id() = agency_id)
);

-- Profiles:
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "profiles_select_self" ON public.profiles FOR SELECT USING (id = auth.uid());
CREATE POLICY "profiles_select_admin" ON public.profiles FOR SELECT USING (public.check_is_admin()); -- Admins can see profiles to link them as reps
CREATE POLICY "profiles_update_self" ON public.profiles FOR UPDATE USING (id = auth.uid());
CREATE POLICY "profiles_update_admin" ON public.profiles FOR UPDATE USING (
    public.check_is_super_admin() OR (public.check_is_admin() AND public.get_my_agency_id() = agency_id)
);

-- Leads:
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "leads_partner_v1" ON public.leads FOR SELECT USING (
    affiliate_id = (SELECT affiliate_id FROM public.profiles WHERE id = auth.uid())
);
CREATE POLICY "leads_admin_v1" ON public.leads FOR SELECT USING (public.check_is_super_admin() OR public.get_my_agency_id() = agency_id);

-- Support Sessions:
ALTER TABLE public.support_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "sessions_self_v1" ON public.support_sessions FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "sessions_admin_v1" ON public.support_sessions FOR SELECT USING (public.check_is_super_admin() OR public.get_my_agency_id() = agency_id);

-- 5. FINAL STEP: ENSURE test@test.com IS SUPER ADMIN
DO $$
DECLARE
    target_id UUID;
    default_agency_id UUID;
BEGIN
    SELECT id INTO target_id FROM auth.users WHERE email = 'test@test.com' LIMIT 1;
    SELECT id INTO default_agency_id FROM public.agencies ORDER BY created_at ASC LIMIT 1;
    
    IF target_id IS NOT NULL THEN
        INSERT INTO public.admin_profiles (id, admin_code, full_name, role, agency_id, is_active)
        VALUES (target_id, 'ADM-001', 'Metehan Dincer', 'super_admin', default_agency_id, true)
        ON CONFLICT (id) DO UPDATE SET 
            admin_code = EXCLUDED.admin_code,
            role = 'super_admin',
            agency_id = default_agency_id,
            is_active = true;
    END IF;
END $$;
