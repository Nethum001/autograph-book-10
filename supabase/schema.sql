-- Run this in Supabase SQL Editor.
create table if not exists public.autographs (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 60),
  message text not null check (char_length(message) between 1 and 500),
  status text not null default 'pending' check (status in ('pending','approved','rejected')),
  created_at timestamptz not null default now()
);
alter table public.autographs enable row level security;

-- Visitors can submit only pending notes.
create policy "Anyone can submit pending autographs"
on public.autographs for insert to anon, authenticated
with check (status = 'pending');

-- Visitors can only read approved notes.
create policy "Anyone can read approved autographs"
on public.autographs for select to anon, authenticated
using (status = 'approved');

-- Replace admin@example.com below with the exact email used for the admin account.
-- This lets that signed-in admin view pending submissions and approve/reject them.
create policy "Admin can read all autographs"
on public.autographs for select to authenticated
using ((auth.jwt() ->> 'email') = 'admin@example.com');

create policy "Admin can moderate autographs"
on public.autographs for update to authenticated
using ((auth.jwt() ->> 'email') = 'admin@example.com')
with check ((auth.jwt() ->> 'email') = 'admin@example.com');

-- Optional anti-spam: configure Supabase Auth / edge rate limits before public launch.
