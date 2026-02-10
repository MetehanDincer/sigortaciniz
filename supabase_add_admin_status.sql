-- Add status column to admin_profiles table
ALTER TABLE admin_profiles ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'Pasif';

-- Add check constraint to ensure valid statuses
-- permissible: 'Aktif', 'Pasif', 'Mola', 'Yemekte'
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'admin_profiles_status_check') THEN
        ALTER TABLE admin_profiles ADD CONSTRAINT admin_profiles_status_check 
        CHECK (status IN ('Aktif', 'Pasif', 'Mola', 'Yemekte'));
    END IF;
END $$;
