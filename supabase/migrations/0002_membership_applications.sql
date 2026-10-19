-- Membership workflow phase: persist membership applications, and let the
-- handle_new_user() trigger from 0001 also link a new profile back to any
-- application submitted under that email before they had an account. Run
-- this after 0001_foundation.sql. See supabase/README.md.

create table public.membership_applications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles (id),
  category text not null,
  first_name text not null,
  last_name text not null,
  email text not null,
  phone text not null,
  gender text not null,
  date_of_birth date not null,
  mdc_license_number text not null,
  staff_id text not null,
  employer text not null,
  region text not null,
  district text not null,
  facility text not null,
  address text not null,
  status text not null default 'pending'
    check (status in ('pending', 'approved', 'rejected', 'needs_correction')),
  admin_notes text,
  correction_message text,
  reviewed_by uuid references public.profiles (id),
  reviewed_at timestamptz,
  submitted_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.membership_applications enable row level security;

-- Public application form: anyone (including anon) can submit, but only as
-- a fresh 'pending' row with no review fields set — a client can't self-approve.
create policy "Anyone can submit a membership application"
  on public.membership_applications for insert
  with check (
    status = 'pending'
    and admin_notes is null
    and correction_message is null
    and reviewed_by is null
    and reviewed_at is null
  );

create policy "Applications are viewable by their owner or an admin"
  on public.membership_applications for select
  using (auth.uid() = user_id or public.is_admin());

-- No self-service edit in this phase (see plan's "assumption to flag") —
-- only admins update applications, via the review-application Edge
-- Function (using the service-role key) or directly in this phase.
create policy "Applications are updatable by admins"
  on public.membership_applications for update
  using (public.is_admin());

grant select, insert on public.membership_applications to anon;
grant select, insert, update on public.membership_applications to authenticated;

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger membership_applications_touch_updated_at
  before update on public.membership_applications
  for each row execute function public.touch_updated_at();

-- Redefine handle_new_user() (from 0001) to also backfill user_id onto any
-- application(s) submitted under this email before the applicant had an
-- account — e.g. they applied anonymously, got approved, and are now
-- accepting their invite.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  assigned_role public.user_role;
begin
  begin
    assigned_role := (new.raw_user_meta_data ->> 'role')::public.user_role;
  exception when others then
    assigned_role := null;
  end;
  if assigned_role is null then
    assigned_role := 'member';
  end if;

  insert into public.profiles (id, email, full_name, role)
  values (new.id, new.email, new.raw_user_meta_data ->> 'full_name', assigned_role);

  update public.invitations
  set status = 'accepted', accepted_at = now()
  where email = new.email and status = 'pending';

  update public.membership_applications
  set user_id = new.id
  where email = new.email and user_id is null;

  return new;
end;
$$;
