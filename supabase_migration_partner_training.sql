-- =============================================
-- PARTNER TRAINING SYSTEM MIGRATION
-- =============================================

-- 1. Create table for Partner Trainings
create table if not exists partner_trainings (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references auth.users(id) not null,
    training_type text not null,
    completed_at timestamptz default now(),
    unique(user_id, training_type)
);

-- Enable RLS for partner_trainings
alter table partner_trainings enable row level security;

-- Policies for partner_trainings
create policy "Users can view their own training records" 
    on partner_trainings for select 
    to authenticated 
    using (auth.uid() = user_id);

create policy "Users can insert their own training records" 
    on partner_trainings for insert 
    to authenticated 
    with check (auth.uid() = user_id);

-- Optional: Allow admins to view all training records
create policy "Admins can view all training records" 
    on partner_trainings for select 
    to authenticated 
    using (exists (select 1 from admin_profiles where id = auth.uid()));
