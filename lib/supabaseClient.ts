/**
 * Supabase client — backend for the member portal (auth, Postgres, storage).
 *
 * The `Database` type below is hand-written to match
 * supabase/migrations/0001_foundation.sql, 0002_membership_applications.sql,
 * and 0003_documents_and_payments.sql exactly. Keep them in lockstep by hand
 * (same discipline lib/votingApi.ts uses for its Zod schemas against a
 * separate repo's contracts) until later phases add enough tables that
 * `supabase gen types typescript --linked` is worth wiring into a script.
 */
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

// createClient() throws at import time on a non-http(s) URL, which would blank
// the whole site (it runs before React mounts) — so validate first.
const isHttpUrl = (value: string | undefined): value is string => {
  if (!value) return false;
  try {
    const { protocol } = new URL(value);
    return protocol === 'http:' || protocol === 'https:';
  } catch {
    return false;
  }
};

export const isSupabaseConfigured = isHttpUrl(SUPABASE_URL) && Boolean(SUPABASE_ANON_KEY);

if (!isSupabaseConfigured) {
  // Don't throw — the rest of the site (marketing pages, awards voting)
  // works fine with no Supabase project configured yet. Only auth/portal
  // features will fail, with a clear error, when actually used.
  console.warn(
    '[supabaseClient] VITE_SUPABASE_URL (must be a valid https:// URL) / VITE_SUPABASE_ANON_KEY are not set — ' +
    'login, signup, and the member/admin portals will not work until they are. See .env.example.'
  );
}

export type UserRole = 'member' | 'admin';
export type ApplicationStatus = 'pending' | 'approved' | 'rejected' | 'needs_correction';
export type DocumentCategory = 'Financial' | 'Reports' | 'Calendar' | 'Policies' | 'Forms';
export type DocumentVisibility = 'public' | 'members';
export type PaymentStatus = 'pending' | 'success' | 'failed';

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          role: UserRole;
          created_at: string;
          membership_expiry_date: string | null;
          expiry_reminder_sent_at: string | null;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          role?: UserRole;
        };
        Update: {
          full_name?: string | null;
          role?: UserRole;
          membership_expiry_date?: string | null;
          expiry_reminder_sent_at?: string | null;
        };
        Relationships: [];
      };
      invitations: {
        Row: {
          id: string;
          email: string;
          role: UserRole;
          status: 'pending' | 'accepted' | 'revoked';
          invited_by: string | null;
          created_at: string;
          accepted_at: string | null;
        };
        Insert: {
          email: string;
          role: UserRole;
          invited_by?: string | null;
        };
        Update: {
          status?: 'pending' | 'accepted' | 'revoked';
          accepted_at?: string | null;
        };
        Relationships: [];
      };
      membership_applications: {
        Row: {
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
        };
        Insert: {
          user_id?: string | null;
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
        };
        Update: {
          status?: ApplicationStatus;
          admin_notes?: string | null;
          correction_message?: string | null;
          reviewed_by?: string | null;
          reviewed_at?: string | null;
        };
        Relationships: [];
      };
      documents: {
        Row: {
          id: string;
          title: string;
          description: string;
          category: DocumentCategory;
          storage_path: string;
          file_size_bytes: number | null;
          visibility: DocumentVisibility;
          uploaded_by: string | null;
          created_at: string;
        };
        Insert: {
          title: string;
          description: string;
          category: DocumentCategory;
          storage_path: string;
          file_size_bytes?: number | null;
          visibility?: DocumentVisibility;
          uploaded_by?: string | null;
        };
        Update: {
          title?: string;
          description?: string;
          category?: DocumentCategory;
          visibility?: DocumentVisibility;
        };
        Relationships: [];
      };
      payments: {
        Row: {
          id: string;
          user_id: string;
          application_id: string | null;
          category: string;
          amount_pesewas: number;
          currency: string;
          paystack_reference: string;
          status: PaymentStatus;
          period_start: string | null;
          period_end: string | null;
          created_at: string;
          paid_at: string | null;
        };
        Insert: never;
        Update: never;
        Relationships: [];
      };
      membership_certificates: {
        Row: {
          id: string;
          user_id: string;
          payment_id: string | null;
          certificate_number: string;
          category: string;
          issued_at: string;
          valid_from: string;
          valid_until: string;
          storage_path: string;
        };
        Insert: never;
        Update: never;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
  };
}

export const supabase = createClient<Database>(
  isSupabaseConfigured ? SUPABASE_URL : 'https://supabase-not-configured.invalid',
  isSupabaseConfigured ? SUPABASE_ANON_KEY : 'supabase-not-configured'
);
