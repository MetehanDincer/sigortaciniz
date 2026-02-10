-- =============================================
-- SAAS MULTI-TENANCY MIGRATION (AcentePortal)
-- =============================================

-- 1. Create Agencies Table
CREATE TABLE IF NOT EXISTS public.agencies (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    domain TEXT UNIQUE, -- e.g., 'uygunsigortaci.com' or 'prestijsigorta.com'
    logo_url TEXT,
    primary_color TEXT DEFAULT '#4f46e5',
    secondary_color TEXT DEFAULT '#4338ca',
    whatsapp_number TEXT,
    support_email TEXT,
    address TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS for agencies
ALTER TABLE public.agencies ENABLE ROW LEVEL SECURITY;

-- Policies for agencies (Publicly readable for branding, Admin manageable)
DROP POLICY IF EXISTS "Agencies are viewable by everyone" ON public.agencies;
CREATE POLICY "Agencies are viewable by everyone" ON public.agencies FOR SELECT USING (true);

-- 2. Update admin_profiles for Roles and Agency ID
DO $$ 
BEGIN
    -- Add agency_id if not exists
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='admin_profiles' AND column_name='agency_id') THEN
        ALTER TABLE public.admin_profiles ADD COLUMN agency_id UUID REFERENCES public.agencies(id);
    END IF;

    -- Add role if not exists
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='admin_profiles' AND column_name='role') THEN
        ALTER TABLE public.admin_profiles ADD COLUMN role TEXT DEFAULT 'rep' CHECK (role IN ('super_admin', 'agency_admin', 'rep'));
    END IF;
END $$;

-- 3. Insert Default Agency (Uygunsigortacı)
INSERT INTO public.agencies (name, slug, domain, primary_color, support_email)
VALUES ('Uygunsigortacı', 'uygun-sigortaci', 'uygunsigortaci.com', '#4f46e5', 'destek@uygunsigortaci.com')
ON CONFLICT (slug) DO NOTHING;

-- 4. Add agency_id to existing tables
DO $$ 
DECLARE 
    default_agency_id UUID;
BEGIN
    SELECT id INTO default_agency_id FROM public.agencies WHERE slug = 'uygun-sigortaci' LIMIT 1;

    -- Profiles
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='agency_id') THEN
        ALTER TABLE public.profiles ADD COLUMN agency_id UUID REFERENCES public.agencies(id);
        UPDATE public.profiles SET agency_id = default_agency_id WHERE agency_id IS NULL;
    END IF;

    -- Leads
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='leads' AND column_name='agency_id') THEN
        ALTER TABLE public.leads ADD COLUMN agency_id UUID REFERENCES public.agencies(id);
        UPDATE public.leads SET agency_id = default_agency_id WHERE agency_id IS NULL;
    END IF;

    -- Support Sessions
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='support_sessions' AND column_name='agency_id') THEN
        ALTER TABLE public.support_sessions ADD COLUMN agency_id UUID REFERENCES public.agencies(id);
        UPDATE public.support_sessions SET agency_id = default_agency_id WHERE agency_id IS NULL;
    END IF;

    -- Auto-assign existing admins to default agency as super_admin
    UPDATE public.admin_profiles 
    SET 
        agency_id = COALESCE(agency_id, default_agency_id),
        role = 'super_admin' 
    WHERE role = 'rep' OR role IS NULL;
END $$;

-- 5. Strict RLS Policies for Data Isolation (Faz 2)

-- Helper functions to avoid RLS recursion (using SECURITY DEFINER to bypass RLS inside the function)
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

-- Profiles: 
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
CREATE POLICY "Users can view their own profile" ON public.profiles 
    FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Admins can view profiles of their agency" ON public.profiles;
CREATE POLICY "Admins can view profiles of their agency" ON public.profiles 
    FOR SELECT TO authenticated 
    USING (public.check_is_super_admin() OR public.get_my_agency_id() = agency_id);

-- Leads: 
DROP POLICY IF EXISTS "Partners can view their own leads" ON public.leads;
CREATE POLICY "Partners can view their own leads" ON public.leads 
    FOR SELECT USING (
        affiliate_id = (SELECT affiliate_id FROM public.profiles WHERE id = auth.uid())
    );

DROP POLICY IF EXISTS "Admins can view leads of their agency" ON public.leads;
CREATE POLICY "Admins can view leads of their agency" ON public.leads 
    FOR SELECT TO authenticated 
    USING (public.check_is_super_admin() OR public.get_my_agency_id() = agency_id);

-- Support Sessions:
DROP POLICY IF EXISTS "Users can view their own sessions" ON public.support_sessions;
CREATE POLICY "Users can view their own sessions" ON public.support_sessions 
    FOR SELECT USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Admins can view sessions of their agency" ON public.support_sessions;
CREATE POLICY "Admins can view sessions of their agency" ON public.support_sessions 
    FOR SELECT TO authenticated 
    USING (public.check_is_super_admin() OR public.get_my_agency_id() = agency_id);

-- Admin Profiles Isolation
ALTER TABLE public.admin_profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can view their own admin profile" ON public.admin_profiles;
CREATE POLICY "Admins can view their own admin profile" ON public.admin_profiles
    FOR SELECT TO authenticated
    USING (auth.uid() = id);

DROP POLICY IF EXISTS "Super admins can view all admin profiles" ON public.admin_profiles;
CREATE POLICY "Super admins can view all admin profiles" ON public.admin_profiles
    FOR SELECT TO authenticated
    USING (public.check_is_super_admin());

DROP POLICY IF EXISTS "Agency admins can view their agency admin profiles" ON public.admin_profiles;
CREATE POLICY "Agency admins can view their agency admin profiles" ON public.admin_profiles
    FOR SELECT TO authenticated
    USING (public.get_my_agency_id() = agency_id);
