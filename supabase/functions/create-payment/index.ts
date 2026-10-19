// Authenticated: start a membership-fee payment. The amount is never taken
// from the client — it's looked up server-side from the caller's own
// approved membership application's category. Returns a reference + amount
// for the frontend to hand to Paystack Inline; see lib/paymentsApi.ts's
// createPayment() and pages/portal/MemberDashboard.tsx.
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

function json(body: unknown, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

// Mirrors constants.tsx's MEMBERSHIP_CATEGORIES fees. Edge Functions can't
// import from the main app, so this is kept in lockstep by hand — same
// discipline as lib/supabaseClient.ts's hand-written Database type.
const MEMBERSHIP_FEES_PESEWAS: Record<string, number> = {
  'Professional Member': 20000,
  'Private Member': 25000,
  'Junior Physician Assistant': 10000,
  Retired: 5000,
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) return json({ error: 'Missing Authorization header' }, 401);

    const callerClient = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: userError } = await callerClient.auth.getUser();
    if (userError || !user) return json({ error: 'Not authenticated' }, 401);

    const adminClient = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const { data: application, error: appError } = await adminClient
      .from('membership_applications')
      .select('id, category')
      .eq('user_id', user.id)
      .eq('status', 'approved')
      .order('submitted_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (appError) return json({ error: appError.message }, 500);
    if (!application) {
      return json({ error: 'No approved membership application found for your account.' }, 400);
    }

    const amountPesewas = MEMBERSHIP_FEES_PESEWAS[application.category];
    if (!amountPesewas) {
      return json({ error: `No fee configured for category "${application.category}".` }, 400);
    }

    // PAYMENT_MODE=simulated (a server-side secret, never client-controlled)
    // skips Paystack entirely — see verify-payment. References are prefixed
    // so simulated rows are always distinguishable from real charges.
    const simulated = Deno.env.get('PAYMENT_MODE') === 'simulated';
    const reference = simulated ? `sim_${crypto.randomUUID()}` : crypto.randomUUID();
    const { error: insertError } = await adminClient.from('payments').insert({
      user_id: user.id,
      application_id: application.id,
      category: application.category,
      amount_pesewas: amountPesewas,
      currency: 'GHS',
      paystack_reference: reference,
      status: 'pending',
    });
    if (insertError) return json({ error: insertError.message }, 500);

    return json({ reference, amountPesewas, email: user.email, mode: simulated ? 'simulated' : 'paystack' }, 200);
  } catch (err) {
    return json({ error: err instanceof Error ? err.message : 'Unexpected error' }, 500);
  }
});
