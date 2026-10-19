/**
 * Thin, typed wrappers around the membership_applications table and the
 * review-application Edge Function. Same "small typed surface" discipline
 * as lib/authApi.ts — pages call these instead of touching `supabase`
 * directly.
 */
import { supabase } from './supabaseClient';
import type { ApplicationStatus, MembershipApplication, MembershipApplicationInput } from '../types';

function mapRow(row: {
  id: string;
  user_id: string | null;
  category: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  gender: string;
  date_of_birth: string;
  mdc_license_number: string;
  staff_id: string;
  employer: string;
  region: string;
  district: string;
  facility: string;
  address: string;
  status: ApplicationStatus;
  admin_notes: string | null;
  correction_message: string | null;
  reviewed_by: string | null;
  reviewed_at: string | null;
  submitted_at: string;
  updated_at: string;
}): MembershipApplication {
  return {
    id: row.id,
    userId: row.user_id,
    category: row.category,
    firstName: row.first_name,
    lastName: row.last_name,
    email: row.email,
    phone: row.phone,
    gender: row.gender,
    dateOfBirth: row.date_of_birth,
    mdcLicenseNumber: row.mdc_license_number,
    staffId: row.staff_id,
    employer: row.employer,
    region: row.region,
    district: row.district,
    facility: row.facility,
    address: row.address,
    status: row.status,
    adminNotes: row.admin_notes,
    correctionMessage: row.correction_message,
    reviewedBy: row.reviewed_by,
    reviewedAt: row.reviewed_at,
    submittedAt: row.submitted_at,
    updatedAt: row.updated_at,
  };
}

// A single string literal (not built via concatenation) so postgrest-js's
// select-string type parser can infer the row shape at compile time instead
// of falling back to `GenericStringError`.
const SELECT_COLUMNS = 'id, user_id, category, first_name, last_name, email, phone, gender, date_of_birth, mdc_license_number, staff_id, employer, region, district, facility, address, status, admin_notes, correction_message, reviewed_by, reviewed_at, submitted_at, updated_at';

/** Public: submit a membership application. `userId` is set only if the visitor is already logged in. */
export async function submitApplication(input: MembershipApplicationInput, userId?: string) {
  const { error } = await supabase.from('membership_applications').insert({
    user_id: userId ?? null,
    category: input.category,
    first_name: input.firstName,
    last_name: input.lastName,
    email: input.email,
    phone: input.phone,
    gender: input.gender,
    date_of_birth: input.dateOfBirth,
    mdc_license_number: input.mdcLicenseNumber,
    staff_id: input.staffId,
    employer: input.employer,
    region: input.region,
    district: input.district,
    facility: input.facility,
    address: input.address,
  });
  if (error) throw new Error(error.message);
}

/** Member portal: the logged-in user's most recent application, if any. */
export async function getMyApplication(userId: string): Promise<MembershipApplication | null> {
  const { data, error } = await supabase
    .from('membership_applications')
    .select(SELECT_COLUMNS)
    .eq('user_id', userId)
    .order('submitted_at', { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data ? mapRow(data) : null;
}

/** Admin-only: all applications, most recent first. */
export async function getApplications(): Promise<MembershipApplication[]> {
  const { data, error } = await supabase
    .from('membership_applications')
    .select(SELECT_COLUMNS)
    .order('submitted_at', { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []).map(mapRow);
}

/** Admin-only: approve, reject, or request a correction via the review-application Edge Function. */
export async function reviewApplication(
  applicationId: string,
  decision: 'approved' | 'rejected' | 'needs_correction',
  message?: string
) {
  const { data, error } = await supabase.functions.invoke('review-application', {
    body: { applicationId, decision, message },
  });
  if (error) throw new Error(error.message);
  if (data?.error) throw new Error(data.error);
  return data;
}
