/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Base URL of gpaa-voting-platform's API (e.g. https://api.vote.gpaa.org). Falls back to that same default if unset — see lib/votingApi.ts. */
  /** Supabase project URL. See lib/supabaseClient.ts. */
  readonly VITE_SUPABASE_URL?: string;
  /** Supabase anon (public) API key. See lib/supabaseClient.ts. */
  readonly VITE_SUPABASE_ANON_KEY?: string;
  /** Paystack public key (checkout only — safe to expose). See lib/paymentsApi.ts. */
  readonly VITE_PAYSTACK_PUBLIC_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
