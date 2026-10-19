/**
 * Membership fee payments (Paystack Inline on the client, server-verified)
 * and certificate access. Same thin-wrapper discipline as lib/authApi.ts —
 * pages call these instead of touching `supabase` or Paystack directly.
 */
import { supabase } from './supabaseClient';

const PAYSTACK_PUBLIC_KEY = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY;
const PAYSTACK_SCRIPT_URL = 'https://js.paystack.co/v1/inline.js';

interface PaystackHandler {
  openIframe: () => void;
}

interface PaystackPopSetupOptions {
  key: string;
  email: string;
  amount: number;
  ref: string;
  currency?: string;
  onClose?: () => void;
  callback?: (response: { reference: string }) => void;
}

declare global {
  interface Window {
    PaystackPop?: { setup: (options: PaystackPopSetupOptions) => PaystackHandler };
  }
}

let paystackScriptPromise: Promise<void> | null = null;

function loadPaystackScript(): Promise<void> {
  if (window.PaystackPop) return Promise.resolve();
  if (paystackScriptPromise) return paystackScriptPromise;

  paystackScriptPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = PAYSTACK_SCRIPT_URL;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Could not load Paystack checkout. Check your connection and try again.'));
    document.body.appendChild(script);
  });
  return paystackScriptPromise;
}

/** Start a membership-fee payment; the amount is determined server-side from the caller's approved application. */
export async function createPayment(): Promise<{ reference: string; amountPesewas: number; email: string; mode: 'paystack' | 'simulated' }> {
  const { data, error } = await supabase.functions.invoke('create-payment', { body: {} });
  if (error) throw new Error(error.message);
  if (data?.error) throw new Error(data.error);
  return data;
}

/** Server-side confirmation of a Paystack payment; extends membership and issues a certificate. */
export async function verifyPayment(reference: string): Promise<{ success: boolean; membershipExpiryDate?: string; certificateNumber?: string; simulated?: boolean }> {
  const { data, error } = await supabase.functions.invoke('verify-payment', { body: { reference } });
  if (error) throw new Error(error.message);
  if (data?.error) throw new Error(data.error);
  return data;
}

/**
 * Opens the Paystack Inline checkout for a payment created via
 * createPayment(), then calls verifyPayment() once Paystack reports success.
 * Throws if the popup is closed without completing payment.
 */
export async function payMembershipFee(): Promise<{ membershipExpiryDate?: string; certificateNumber?: string; simulated?: boolean }> {
  const { reference, amountPesewas, email, mode } = await createPayment();

  // The server is in test mode (PAYMENT_MODE=simulated): no card is charged and
  // no Paystack popup is shown — the server just confirms the payment. Switch to
  // real payments by unsetting that secret and setting PAYSTACK_SECRET_KEY.
  if (mode === 'simulated') return verifyPayment(reference);

  if (!PAYSTACK_PUBLIC_KEY) {
    throw new Error('Payments are not configured yet (VITE_PAYSTACK_PUBLIC_KEY is not set).');
  }
  await loadPaystackScript();

  return new Promise((resolve, reject) => {
    const handler = window.PaystackPop!.setup({
      key: PAYSTACK_PUBLIC_KEY,
      email,
      amount: amountPesewas,
      ref: reference,
      currency: 'GHS',
      callback: (response) => {
        verifyPayment(response.reference).then(resolve).catch(reject);
      },
      onClose: () => reject(new Error('Payment cancelled.')),
    });
    handler.openIframe();
  });
}

/** A signed, time-limited URL to the member's most recently issued certificate, if any. */
export async function getMyCertificateUrl(userId: string): Promise<string | null> {
  const { data: certificate, error } = await supabase
    .from('membership_certificates')
    .select('storage_path')
    .eq('user_id', userId)
    .order('issued_at', { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!certificate) return null;

  const { data: signed, error: signError } = await supabase.storage
    .from('certificates')
    .createSignedUrl(certificate.storage_path, 60 * 10);
  if (signError) throw new Error(signError.message);
  return signed.signedUrl;
}
