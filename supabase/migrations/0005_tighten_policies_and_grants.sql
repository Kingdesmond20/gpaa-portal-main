-- Found by the end-to-end test run against the live project.
--
-- 1. Application spoofing: the "Anyone can submit" insert policy (0002) never
--    checked user_id, so a signed-in user could file an application under
--    ANOTHER user's account (it would then show up on the victim's dashboard
--    and could be approved into their profile). Now an application is either
--    anonymous (user_id null) or owned by the caller.
drop policy if exists "Anyone can submit a membership application" on public.membership_applications;

create policy "Anyone can submit a membership application"
  on public.membership_applications for insert
  with check (
    status = 'pending'
    and admin_notes is null
    and correction_message is null
    and reviewed_by is null
    and reviewed_at is null
    and (user_id is null or user_id = auth.uid())
  );

-- 2. Defense in depth on table privileges. Supabase grants anon/authenticated
--    every privilege on new public tables by default, leaving RLS as the ONLY
--    guard. Revoke what no client flow needs, so a missing/loosened policy
--    can't silently become a write path.

-- Payments and certificates are written only by Edge Functions (service role).
revoke all on public.payments from anon, authenticated;
revoke all on public.membership_certificates from anon, authenticated;
grant select on public.payments to authenticated;
grant select on public.membership_certificates to authenticated;

-- Anonymous visitors need nothing on these.
revoke all on public.profiles from anon;
revoke all on public.invitations from anon;

-- Anonymous visitors may only submit applications and read public documents.
revoke all on public.membership_applications from anon;
grant insert on public.membership_applications to anon;
revoke all on public.documents from anon;
grant select on public.documents to anon;

-- TRUNCATE ignores RLS entirely; nobody on the client side needs it (or
-- REFERENCES/TRIGGER), and applications are never hard-deleted by clients.
revoke truncate, references, trigger on all tables in schema public from anon, authenticated;
revoke delete on public.membership_applications from authenticated;
