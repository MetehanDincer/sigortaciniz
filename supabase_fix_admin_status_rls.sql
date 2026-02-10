-- Allow admins to update their own profile (necessary for status updates)
DROP POLICY IF EXISTS "Admins can update their own profile" ON public.admin_profiles;
CREATE POLICY "Admins can update their own profile" ON public.admin_profiles
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- Ensure the status column exists (re-running this just in case)
ALTER TABLE public.admin_profiles ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'Pasif';

-- Ensure the status check constraint exists
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'admin_profiles_status_check') THEN
        ALTER TABLE public.admin_profiles ADD CONSTRAINT admin_profiles_status_check 
        CHECK (status IN ('Aktif', 'Pasif', 'Mola', 'Yemekte'));
    END IF;
END $$;
