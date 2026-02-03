-- Finance & Earnings Algorithm - Database Migration
-- Run this in Supabase SQL Editor

-- ============================================
-- 1. ADD CFU AUTHORIZATION TO ADMIN PROFILES
-- ============================================

ALTER TABLE public.admin_profiles 
ADD COLUMN IF NOT EXISTS cfu_authorized BOOLEAN DEFAULT false;

COMMENT ON COLUMN public.admin_profiles.cfu_authorized IS 'Indicates if admin has Central Financial Unit (CFU) privileges for financial operations';

-- ============================================
-- 2. CREATE EARNINGS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS public.earnings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID NOT NULL REFERENCES public.leads(id) ON DELETE RESTRICT,
    partner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
    affiliate_id TEXT NOT NULL,
    
    -- Product & Premium Info
    product_type TEXT NOT NULL CHECK (product_type IN ('trafik', 'kasko', 'tss', 'oss', 'dask', 'konut')),
    total_premium NUMERIC(12, 2) NOT NULL CHECK (total_premium > 0),
    
    -- Commission Calculation
    commission_rate NUMERIC(5, 4) NOT NULL,
    base_commission NUMERIC(12, 2) NOT NULL,
    company_share NUMERIC(12, 2) NOT NULL,
    partner_earning NUMERIC(12, 2) NOT NULL,
    
    -- Audit Trail
    calculated_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
    calculated_at TIMESTAMPTZ DEFAULT NOW(),
    is_correction BOOLEAN DEFAULT false,
    corrects_earning_id UUID REFERENCES public.earnings(id) ON DELETE SET NULL,
    correction_reason TEXT,
    
    -- Status
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'corrected', 'voided')),
    
    CONSTRAINT unique_lead_earning UNIQUE (lead_id, status) WHERE status = 'active'
);

CREATE INDEX idx_earnings_partner ON public.earnings(partner_id);
CREATE INDEX idx_earnings_affiliate ON public.earnings(affiliate_id);
CREATE INDEX idx_earnings_calculated_at ON public.earnings(calculated_at DESC);
CREATE INDEX idx_earnings_status ON public.earnings(status);

COMMENT ON TABLE public.earnings IS 'Stores all partner earnings calculations with full audit trail';
COMMENT ON COLUMN public.earnings.commission_rate IS 'Product-specific commission rate (hard-coded in application)';
COMMENT ON COLUMN public.earnings.partner_earning IS 'Final amount credited to partner wallet';
COMMENT ON COLUMN public.earnings.is_correction IS 'True if this is a CFU correction of a previous earning';

-- ============================================
-- 3. ADD WALLET BALANCE TO PROFILES
-- ============================================

ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS wallet_balance NUMERIC(12, 2) DEFAULT 0.00 CHECK (wallet_balance >= 0);

COMMENT ON COLUMN public.profiles.wallet_balance IS 'Current wallet balance for partner earnings';

-- ============================================
-- 4. CREATE WALLET TRANSACTIONS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS public.wallet_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    partner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
    earning_id UUID REFERENCES public.earnings(id) ON DELETE SET NULL,
    
    -- Transaction Details
    amount NUMERIC(12, 2) NOT NULL,
    transaction_type TEXT NOT NULL CHECK (transaction_type IN ('earning_credit', 'withdrawal', 'correction', 'refund')),
    balance_before NUMERIC(12, 2) NOT NULL,
    balance_after NUMERIC(12, 2) NOT NULL,
    
    -- Audit
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    notes TEXT
);

CREATE INDEX idx_wallet_partner ON public.wallet_transactions(partner_id, created_at DESC);

COMMENT ON TABLE public.wallet_transactions IS 'Complete transaction history for partner wallets';

-- ============================================
-- 5. ENABLE ROW LEVEL SECURITY
-- ============================================

ALTER TABLE public.earnings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallet_transactions ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 6. RLS POLICIES FOR EARNINGS
-- ============================================

-- Only CFU admins can insert earnings
CREATE POLICY "CFU admins can create earnings"
ON public.earnings FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.admin_profiles
    WHERE id = auth.uid() AND cfu_authorized = true
  )
);

-- All admins can view earnings
CREATE POLICY "Admins can view earnings"
ON public.earnings FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.admin_profiles
    WHERE id = auth.uid()
  )
);

-- Only CFU admins can update earnings (for corrections)
CREATE POLICY "CFU admins can update earnings"
ON public.earnings FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.admin_profiles
    WHERE id = auth.uid() AND cfu_authorized = true
  )
);

-- Partners can view their own earnings
CREATE POLICY "Partners can view their own earnings"
ON public.earnings FOR SELECT
USING (auth.uid() = partner_id);

-- ============================================
-- 7. RLS POLICIES FOR WALLET TRANSACTIONS
-- ============================================

-- Admins can view all wallet transactions
CREATE POLICY "Admins can view wallet transactions"
ON public.wallet_transactions FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.admin_profiles
    WHERE id = auth.uid()
  )
);

-- Partners can view their own transactions
CREATE POLICY "Partners can view their own transactions"
ON public.wallet_transactions FOR SELECT
USING (auth.uid() = partner_id);

-- Only CFU admins can insert transactions
CREATE POLICY "CFU admins can create transactions"
ON public.wallet_transactions FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.admin_profiles
    WHERE id = auth.uid() AND cfu_authorized = true
  )
);

-- ============================================
-- 8. GRANT CFU AUTHORIZATION (EXAMPLE)
-- ============================================

-- Uncomment and modify to grant CFU authorization to specific admin
-- UPDATE admin_profiles 
-- SET cfu_authorized = true 
-- WHERE admin_code = 'YOUR_ADMIN_CODE';

-- ============================================
-- MIGRATION COMPLETE
-- ============================================
