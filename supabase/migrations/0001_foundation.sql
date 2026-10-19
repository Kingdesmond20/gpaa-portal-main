-- Foundation phase: roles, profiles, and admin-created invitations.
-- Run this once against a fresh Supabase project (SQL Editor, or
-- `supabase db push` if you've linked the Supabase CLI). See
-- supabase/README.md for full setup steps, including bootstrapping the
-- first admin.

create extension if not exists "pgcrypto";

create type public.user_role as enum ('member', 'admin');

-- One row per auth.users row, created automatically by the trigger below.
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  full_name text,
  role public.user_role not null default 'member',
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- SECURITY DEFINER so RLS policies can call it without recursively
-- re-evaluating RLS on profiles (the standard Supabase pattern).
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.profiles where id = auth.uid() and role = 'admin'
  );
$$;

create policy "Profiles are viewable by owner or admin"
  on public.profiles for select
  using (auth.uid() = id or public.is_admin());

create policy "Profiles are updatable by owner or admin"
  on public.profiles for update
  using (auth.uid() = id or public.is_admin());

grant select, update on public.profiles to authenticated;

-- Prevent a member from granting themselves admin via a direct table
-- update (the "owner" branch of the policy above only guards row
-- visibility/ownership, not which columns can change).
create or replace function public.prevent_role_self_escalation()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.role <> old.role and not public.is_admin() then
    raise exception 'Only admins can change roles';
  end if;
  return new;
end;
$$;

create trigger profiles_prevent_role_self_escalation
  before update on public.profiles
  for each row execute function public.prevent_role_self_escalation();

-- Populate profiles automatically on signup (including invite acceptance).
-- The role comes from user_metadata.role, set by the invite-user Edge
-- Function when an admin sends the invite; defaults to 'member' otherwise.
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

  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Admin-created invitations. Rows are normally written by the invite-user
-- Edge Function using the service-role key (bypasses RLS); the policies
-- below matter if an admin's own browser session ever reads/writes this
-- table directly.
create table public.invitations (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  role public.user_role not null default 'member',
  status text not null default 'pending' check (status in ('pending', 'accepted', 'revoked')),
  invited_by uuid references public.profiles (id),
  created_at timestamptz not null default now(),
  accepted_at timestamptz
);

alter table public.invitations enable row level security;

create policy "Invitations are viewable by admins"
  on public.invitations for select
  using (public.is_admin());

create policy "Invitations are insertable by admins"
  on public.invitations for insert
  with check (public.is_admin());

create policy "Invitations are updatable by admins"
  on public.invitations for update
  using (public.is_admin());

grant select, insert, update on public.invitations to authenticated;
