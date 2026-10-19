-- Documents & Payments phase: an admin-curated document library with
-- public/members-only visibility, Paystack payment tracking, generated
-- membership certificates, and the profile columns that drive membership
-- standing (expiry date, reminder tracking). Run after 0002. See
-- supabase/README.md.

-- ---------------------------------------------------------------------------
-- Document library
-- ---------------------------------------------------------------------------

create table public.documents (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  category text not null check (category in ('Financial', 'Reports', 'Calendar', 'Policies', 'Forms')),
  storage_path text not null unique,
  file_size_bytes bigint,
  visibility text not null default 'public' check (visibility in ('public', 'members')),
  uploaded_by uuid references public.profiles (id),
  created_at timestamptz not null default now()
);

alter table public.documents enable row level security;

-- 'members' visibility means "any authenticated user" (this org has no
-- finer-grained tiering) — public docs are visible to everyone including
-- logged-out visitors.
create policy "Documents are visible per their visibility"
  on public.documents for select
  using (visibility = 'public' or auth.role() = 'authenticated');

create policy "Admins manage documents"
  on public.documents for all
  using (public.is_admin())
  with check (public.is_admin());

grant select on public.documents to anon;
grant select, insert, update, delete on public.documents to authenticated;

insert into storage.buckets (id, name, public)
values ('documents', 'documents', false)
on conflict (id) do nothing;

create policy "Public document files are downloadable by anyone"
  on storage.objects for select
  using (
    bucket_id = 'documents'
    and exists (
      select 1 from public.documents d
      where d.storage_path = storage.objects.name and d.visibility = 'public'
    )
  );

create policy "Members-only document files are downloadable by authenticated users"
  on storage.objects for select
  using (
    bucket_id = 'documents'
    and auth.role() = 'authenticated'
    and exists (
      select 1 from public.documents d
      where d.storage_path = storage.objects.name and d.visibility = 'members'
    )
  );

create policy "Admins manage document files"
  on storage.objects for all
  using (bucket_id = 'documents' and public.is_admin())
  with check (bucket_id = 'documents' and public.is_admin());

-- ---------------------------------------------------------------------------
-- Payments (Paystack)
-- ---------------------------------------------------------------------------

create table public.payments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id),
  application_id uuid references public.membership_applications (id),
  category text not null,
  amount_pesewas integer not null,
  currency text not null default 'GHS',
  paystack_reference text not null unique,
  status text not null default 'pending' check (status in ('pending', 'success', 'failed')),
  period_start date,
  period_end date,
  created_at timestamptz not null default now(),
  paid_at timestamptz
);

alter table public.payments enable row level security;

create policy "Users view their own payments, admins any"
  on public.payments for select
  using (auth.uid() = user_id or public.is_admin());

-- No insert/update policy for anon/authenticated: rows are written only by
-- the create-payment / verify-payment Edge Functions via the service-role
-- key (which bypasses RLS), so a client can never fabricate a 'success'
-- payment or set its own amount.
grant select on public.payments to authenticated;

-- ---------------------------------------------------------------------------
-- Membership certificates
-- ---------------------------------------------------------------------------

create table public.membership_certificates (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id),
  payment_id uuid references public.payments (id),
  certificate_number text not null unique,
  category text not null,
  issued_at timestamptz not null default now(),
  valid_from date not null,
  valid_until date not null,
  storage_path text not null
);

alter table public.membership_certificates enable row level security;

create policy "Users view their own certificates, admins any"
  on public.membership_certificates for select
  using (auth.uid() = user_id or public.is_admin());

grant select on public.membership_certificates to authenticated;

insert into storage.buckets (id, name, public)
values ('certificates', 'certificates', false)
on conflict (id) do nothing;

-- Certificate files are stored at "{user_id}/{certificate_id}.pdf".
create policy "Users download their own certificate files, admins any"
  on storage.objects for select
  using (
    bucket_id = 'certificates'
    and (public.is_admin() or (storage.foldername(name))[1] = auth.uid()::text)
  );

-- No client insert policy on the certificates bucket either — only the
-- verify-payment Edge Function (service role) writes certificate files.

-- ---------------------------------------------------------------------------
-- Membership standing on profiles
-- ---------------------------------------------------------------------------

alter table public.profiles
  add column membership_expiry_date date,
  add column expiry_reminder_sent_at timestamptz;
