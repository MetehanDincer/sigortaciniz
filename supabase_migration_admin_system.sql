-- Phase 1: Infrastructure & Schema

-- 1. Create admin_profiles table
CREATE TABLE IF NOT EXISTS public.admin_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    admin_code TEXT UNIQUE NOT NULL,
    full_name TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create lead_logs table
CREATE TABLE IF NOT EXISTS public.lead_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
    admin_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    action TEXT NOT NULL, -- e.g., 'ASSIGNED', 'STATUS_CHANGE', 'PREMIUM_ADDED', 'VOICE_PAYMENT_REQUEST'
    details TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Update leads table schema
ALTER TABLE public.leads 
ADD COLUMN IF NOT EXISTS assigned_admin_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS total_premium NUMERIC,
ADD COLUMN IF NOT EXISTS partner_commission NUMERIC;

-- 4. Enable RLS (Row Level Security)
ALTER TABLE public.admin_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_logs ENABLE ROW LEVEL SECURITY;

-- 5. Policies for admin_profiles
-- Only users in admin_profiles can read other admin_profiles (simplified for now)
CREATE POLICY "Admins can view admin profiles" 
ON public.admin_profiles 
FOR SELECT 
USING (EXISTS (SELECT 1 FROM public.admin_profiles WHERE id = auth.uid()));

-- Users can view their own admin profile
CREATE POLICY "Users can view their own admin profile" 
ON public.admin_profiles 
FOR SELECT 
USING (auth.uid() = id);

-- 6. Policies for lead_logs
-- Admins can view and create all logs
CREATE POLICY "Admins can view all logs" 
ON public.lead_logs 
FOR SELECT 
USING (EXISTS (SELECT 1 FROM public.admin_profiles WHERE id = auth.uid()));

CREATE POLICY "Admins can create logs" 
ON public.lead_logs 
FOR INSERT 
WITH CHECK (EXISTS (SELECT 1 FROM public.admin_profiles WHERE id = auth.uid()));

-- Partners can view logs related to their leads (for transparency)
-- Assuming leads has affiliate_id (uuid) or partner_id
-- We might need to join leads to verify. 
-- For now, let's keep logs internal to admins unless needed.

-- 7. Add comments for clarity
COMMENT ON TABLE public.admin_profiles IS 'Stores information about system administrators and their operational codes.';
COMMENT ON TABLE public.lead_logs IS 'Audit trail for all actions taken on leads by admins.';
