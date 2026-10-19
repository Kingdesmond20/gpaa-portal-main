/**
 * Thin, typed wrappers around Supabase auth + the foundation-phase tables
 * (profiles, invitations). Pages should call these instead of touching
 * `supabase` directly, so the auth/data shape stays in one place — same
 * "small typed surface" discipline as lib/votingApi.ts.
 */
import { isSupabaseConfigured, supabase } from './supabaseClient';
import type { Invitation, Profile, UserRole } from '../types';

/**
 * Without VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY baked into the build the
 * client points at a placeholder host, and every call fails with a cryptic
 * "Failed to fetch". Fail with the real reason instead.
 */
function assertConfigured() {
  if (!isSupabaseConfigured) {
    throw new Error(
      'The member portal is not configured on this deployment (missing VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY). Please contact GPAA.'
    );
  }
}

export async function signIn(email: string, password: string) {
  assertConfigured();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw new Error(error.message);
  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error(error.message);
}

export async function resetPasswordForEmail(email: string) {
  assertConfigured();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  });
  if (error) throw new Error(error.message);
}

export async function updatePassword(password: string) {
  assertConfigured();
  const { error } = await supabase.auth.updateUser({ password });
  if (error) throw new Error(error.message);
}

export async function getProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, email, full_name, role, created_at, membership_expiry_date')
    .eq('id', userId)
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) return null;
  return {
    id: data.id,
    email: data.email,
    fullName: data.full_name,
    role: data.role,
    createdAt: data.created_at,
    membershipExpiryDate: data.membership_expiry_date,
  };
}

/** Admin-only: invite a new user by email + role via the invite-user Edge Function. */
export async function inviteUser(email: string, role: UserRole) {
  const { data, error } = await supabase.functions.invoke('invite-user', {
    body: { email, role },
  });
  if (error) throw new Error(error.message);
  if (data?.error) throw new Error(data.error);
  return data;
}

/** Admin-only: list all invitations, most recent first. */
export async function getInvitations(): Promise<Invitation[]> {
  const { data, error } = await supabase
    .from('invitations')
    .select('id, email, role, status, invited_by, created_at, accepted_at')
    .order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []).map((row) => ({
    id: row.id,
    email: row.email,
    role: row.role,
    status: row.status,
    invitedBy: row.invited_by,
    createdAt: row.created_at,
    acceptedAt: row.accepted_at,
  }));
}
