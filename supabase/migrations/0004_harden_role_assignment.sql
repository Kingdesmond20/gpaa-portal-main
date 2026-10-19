-- Security fix: stop trusting user-supplied metadata for the role.
--
-- handle_new_user() (0001, redefined in 0002) read the new user's role from
-- raw_user_meta_data.role. Supabase's public sign-up endpoint accepts
-- arbitrary metadata from anyone holding the anon key (which ships in the
-- site's JavaScript), so anyone could sign up with { role: 'admin' } and
-- become an admin.
--
-- The role now comes from the `invitations` table, which only admins (or the
-- service-role Edge Functions) can write. invite-user and review-application
-- insert the pending invitation BEFORE calling inviteUserByEmail, so the row
-- exists by the time this trigger fires. No pending invitation => 'member'.
--
-- Also fixes invitations never leaving 'pending': inviteUserByEmail creates
-- the auth.users row immediately, so marking the invite accepted in the
-- insert trigger happened at invite time. It now happens on first sign-in.

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  assigned_role public.user_role;
begin
  select role into assigned_role
  from public.invitations
  where lower(email) = lower(new.email) and status = 'pending'
  order by created_at desc
  limit 1;

  if assigned_role is null then
    assigned_role := 'member';
  end if;

  insert into public.profiles (id, email, full_name, role)
  values (new.id, new.email, new.raw_user_meta_data ->> 'full_name', assigned_role);

  -- Backfill user_id onto applications submitted before the account existed.
  update public.membership_applications
  set user_id = new.id
  where lower(email) = lower(new.email) and user_id is null;

  return new;
end;
$$;

create or replace function public.mark_invitation_accepted()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if old.last_sign_in_at is null and new.last_sign_in_at is not null then
    update public.invitations
    set status = 'accepted', accepted_at = now()
    where lower(email) = lower(new.email) and status = 'pending';
  end if;
  return new;
end;
$$;

drop trigger if exists on_auth_user_first_sign_in on auth.users;
create trigger on_auth_user_first_sign_in
  after update of last_sign_in_at on auth.users
  for each row execute function public.mark_invitation_accepted();

-- Backfill: invitations for people who have already signed in.
update public.invitations i
set status = 'accepted', accepted_at = coalesce(i.accepted_at, now())
from auth.users u
where lower(u.email) = lower(i.email)
  and u.last_sign_in_at is not null
  and i.status = 'pending';

-- Bootstrap fix: the README's first-admin step (`update public.profiles set
-- role = 'admin' ...` in the SQL Editor) was blocked by
-- prevent_role_self_escalation(): with no user JWT auth.uid() is null, so
-- is_admin() is false and the trigger raised. Only block role changes made
-- through a signed-in user's session; direct database access (SQL Editor,
-- service role) has auth.uid() null and is allowed. The `anon` role has no
-- UPDATE grant on profiles, so this doesn't open a path for the public.
create or replace function public.prevent_role_self_escalation()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.role <> old.role and auth.uid() is not null and not public.is_admin() then
    raise exception 'Only admins can change roles';
  end if;
  return new;
end;
$$;
