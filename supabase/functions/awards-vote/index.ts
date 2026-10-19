// Public voting for the GPAA Prestigious Awards. Unauthenticated by design —
// anyone can vote — so every rule is enforced HERE, server-side:
//
//   POST { action: 'create-intent',       campaignSlug, categoryId, contestantId, quantity, phoneNumber, idempotencyKey? }
//   POST { action: 'initialize-payment',  voteIntentId }
//   POST { action: 'verify-payment',      reference }
//
// - The price is computed here from the campaign (the client never sends an amount).
// - The phone number is normalised and stored ONLY as an HMAC-SHA256 hash
//   (secret VOTER_PHONE_PEPPER); the function refuses to run without it.
// - A vote counts only when its order reaches PAYMENT_SUCCESS, which only
//   verify-payment can do: via Paystack (PAYSTACK_SECRET_KEY) or, in test mode,
//   PAYMENT_MODE=simulated (no charge; orders flagged is_simulated).
// - The return URL comes from the SITE_URL secret, never from the request, so
//   this can't be used as an open redirect.
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

class HttpError extends Error {
  constructor(readonly status: number, readonly code: string, message: string) {
    super(message);
  }
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

const PUBLIC_STATUSES = ['SCHEDULED', 'OPEN', 'PAUSED', 'CLOSED'];
const MAX_PENDING_PER_PHONE_PER_10_MIN = 10;

const isSimulated = () => Deno.env.get('PAYMENT_MODE') === 'simulated';
const toPesewas = (cedis: number | string) => Math.round(Number(cedis) * 100);

/** Ghana mobile: 0XXXXXXXXX, 233XXXXXXXXX or +233XXXXXXXXX (9 digits after the country code). */
function normalisePhone(raw: unknown): string {
  const compact = String(raw ?? '').replace(/[\s\-().]/g, '');
  const match = compact.match(/^(?:\+?233|0)(\d{9})$/);
  if (!match) throw new HttpError(422, 'INVALID_PHONE', 'Enter a valid Ghana mobile number, e.g. 0241234567.');
  return `233${match[1]}`;
}

async function hashPhone(phone: string): Promise<string> {
  const pepper = Deno.env.get('VOTER_PHONE_PEPPER');
  if (!pepper) throw new HttpError(500, 'NOT_CONFIGURED', 'Voting is not configured yet. Please try again later.');
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(pepper), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(phone));
  return [...new Uint8Array(sig)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

function votingOpen(c: { status: string; starts_at: string | null; ends_at: string | null }): boolean {
  const now = Date.now();
  return (
    c.status === 'OPEN' &&
    (!c.starts_at || now >= Date.parse(c.starts_at)) &&
    (!c.ends_at || now < Date.parse(c.ends_at))
  );
}

function intentShape(o: Record<string, any>) {
  return {
    id: o.id,
    campaignId: o.campaign_id,
    categoryId: o.category_id,
    contestantId: o.contestant_id,
    quantity: o.quantity,
    unitPrice: Number(o.unit_price),
    amount: Number(o.amount),
    currency: o.currency,
    status: o.status === 'PAYMENT_SUCCESS' ? 'PAYMENT_SUCCESS' : 'PENDING_PAYMENT',
    createdAt: new Date(o.created_at).toISOString(),
  };
}

type Db = ReturnType<typeof createClient>;

// --------------------------------------------------------------------------
async function createIntent(db: Db, body: Record<string, any>) {
  const { campaignSlug, categoryId, contestantId, quantity, idempotencyKey } = body;
  if (typeof campaignSlug !== 'string' || typeof categoryId !== 'string' || typeof contestantId !== 'string') {
    throw new HttpError(400, 'BAD_REQUEST', 'campaignSlug, categoryId and contestantId are required.');
  }
  if (!Number.isInteger(quantity) || quantity < 1) {
    throw new HttpError(422, 'INVALID_QUANTITY', 'Number of votes must be a whole number of at least 1.');
  }
  if (idempotencyKey !== undefined && (typeof idempotencyKey !== 'string' || idempotencyKey.length < 8 || idempotencyKey.length > 100)) {
    throw new HttpError(400, 'BAD_REQUEST', 'Invalid idempotency key.');
  }

  const phone = normalisePhone(body.phoneNumber);
  const phoneHash = await hashPhone(phone);

  const { data: campaign } = await db.from('award_campaigns').select('*').eq('slug', campaignSlug).maybeSingle();
  if (!campaign || !PUBLIC_STATUSES.includes(campaign.status)) {
    throw new HttpError(404, 'CAMPAIGN_NOT_FOUND', 'This awards campaign was not found.');
  }
  if (!votingOpen(campaign)) throw new HttpError(409, 'VOTING_CLOSED', 'Voting is not open for this campaign right now.');

  const { data: contestant } = await db
    .from('award_contestants')
    .select('id, campaign_id, status')
    .eq('id', contestantId)
    .eq('campaign_id', campaign.id)
    .maybeSingle();
  if (!contestant) throw new HttpError(404, 'CONTESTANT_NOT_FOUND', 'This nominee was not found.');
  if (contestant.status !== 'ACTIVE') throw new HttpError(409, 'CONTESTANT_UNAVAILABLE', 'This nominee is no longer eligible for votes.');

  const { data: link } = await db
    .from('award_contestant_categories')
    .select('category_id, award_categories!inner(campaign_id)')
    .eq('contestant_id', contestantId)
    .eq('category_id', categoryId)
    .maybeSingle();
  if (!link || (link as any).award_categories?.campaign_id !== campaign.id) {
    throw new HttpError(422, 'INVALID_CATEGORY', 'This nominee is not listed in that category.');
  }

  if (quantity > campaign.max_quantity_per_transaction) {
    throw new HttpError(422, 'QUANTITY_TOO_HIGH', `You can buy at most ${campaign.max_quantity_per_transaction} votes at a time.`);
  }
  const unitPesewas = toPesewas(campaign.vote_unit_price);
  const amountPesewas = unitPesewas * quantity;
  if (amountPesewas > toPesewas(campaign.max_transaction_amount)) {
    throw new HttpError(422, 'AMOUNT_TOO_HIGH', 'That is above the maximum amount per transaction. Try fewer votes.');
  }

  // Replay-safe: the same key + same request returns the same order.
  if (idempotencyKey) {
    const { data: existing } = await db
      .from('award_vote_orders')
      .select('*')
      .eq('campaign_id', campaign.id)
      .eq('idempotency_key', idempotencyKey)
      .maybeSingle();
    if (existing) {
      const same =
        existing.contestant_id === contestantId &&
        existing.category_id === categoryId &&
        existing.quantity === quantity &&
        existing.phone_hash === phoneHash;
      if (!same) throw new HttpError(409, 'IDEMPOTENCY_CONFLICT', 'That request key was already used for a different vote.');
      return { voteIntent: intentShape(existing), nextStep: 'INITIALIZE_PAYMENT' as const };
    }
  }

  // Basic abuse guard: cap unpaid orders per phone in a short window.
  const since = new Date(Date.now() - 10 * 60 * 1000).toISOString();
  const { count } = await db
    .from('award_vote_orders')
    .select('id', { count: 'exact', head: true })
    .eq('phone_hash', phoneHash)
    .eq('status', 'PENDING_PAYMENT')
    .gte('created_at', since);
  if ((count ?? 0) >= MAX_PENDING_PER_PHONE_PER_10_MIN) {
    throw new HttpError(429, 'TOO_MANY_REQUESTS', 'Too many pending votes for this number. Please complete a payment or wait a few minutes.');
  }

  const reference = `${isSimulated() ? 'sim_' : 'gv_'}${crypto.randomUUID()}`;
  const { data: order, error } = await db
    .from('award_vote_orders')
    .insert({
      campaign_id: campaign.id,
      category_id: categoryId,
      contestant_id: contestantId,
      quantity,
      unit_price: unitPesewas / 100,
      amount: amountPesewas / 100,
      currency: campaign.currency,
      phone_hash: phoneHash,
      payment_reference: reference,
      idempotency_key: idempotencyKey ?? null,
    })
    .select('*')
    .single();
  if (error || !order) throw new HttpError(500, 'INTERNAL_ERROR', 'Could not reserve your votes. Please try again.');

  return { voteIntent: intentShape(order), nextStep: 'INITIALIZE_PAYMENT' as const };
}

// --------------------------------------------------------------------------
async function initializePayment(db: Db, body: Record<string, any>) {
  const { voteIntentId } = body;
  if (typeof voteIntentId !== 'string') throw new HttpError(400, 'BAD_REQUEST', 'voteIntentId is required.');

  const { data: order } = await db.from('award_vote_orders').select('*').eq('id', voteIntentId).maybeSingle();
  if (!order) throw new HttpError(404, 'INTENT_NOT_FOUND', 'That vote reservation was not found.');
  if (order.status !== 'PENDING_PAYMENT') throw new HttpError(409, 'ALREADY_PROCESSED', 'This vote has already been processed.');

  const siteUrl = Deno.env.get('SITE_URL');
  if (!siteUrl) throw new HttpError(500, 'NOT_CONFIGURED', 'Payments are not configured yet. Please try again later.');
  const returnUrl = `${siteUrl.replace(/\/$/, '')}/awards/payment/return`;

  const payment = (provider: string) => ({
    id: order.id,
    voteIntentId: order.id,
    provider,
    status: 'INITIALIZED',
    amount: Number(order.amount),
    currency: order.currency,
    createdAt: new Date().toISOString(),
  });

  if (isSimulated()) {
    // Test mode: no provider. The return page confirms the order directly.
    return { payment: payment('simulated'), redirectUrl: `${returnUrl}?reference=${encodeURIComponent(order.payment_reference)}` };
  }

  // Live: Paystack hosted checkout. Paystack needs an email; voters only give a
  // phone number, so use a stable non-personal placeholder derived from the hash.
  const secret = Deno.env.get('PAYSTACK_SECRET_KEY');
  if (!secret) throw new HttpError(500, 'NOT_CONFIGURED', 'Payments are not configured yet. Please try again later.');
  const res = await fetch('https://api.paystack.co/transaction/initialize', {
    method: 'POST',
    headers: { Authorization: `Bearer ${secret}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: `voter-${order.phone_hash.slice(0, 16)}@votes.gpaa.invalid`,
      amount: toPesewas(order.amount),
      currency: order.currency,
      reference: order.payment_reference,
      callback_url: returnUrl,
      metadata: { voteIntentId: order.id, kind: 'award-vote' },
    }),
  });
  const out = await res.json().catch(() => null);
  if (!res.ok || !out?.status || !out?.data?.authorization_url) {
    console.error('Paystack initialize failed', res.status, JSON.stringify(out));
    throw new HttpError(502, 'PAYMENT_PROVIDER_ERROR', 'Could not start the payment. Please try again.');
  }
  return { payment: payment('paystack'), redirectUrl: out.data.authorization_url as string };
}

// --------------------------------------------------------------------------
async function verifyPayment(db: Db, body: Record<string, any>) {
  const { reference } = body;
  if (typeof reference !== 'string' || reference.length < 8 || reference.length > 100) {
    throw new HttpError(400, 'BAD_REQUEST', 'A payment reference is required.');
  }

  const load = () =>
    db
      .from('award_vote_orders')
      .select('*, award_contestants(full_name), award_categories(name), award_campaigns(name, slug)')
      .eq('payment_reference', reference)
      .maybeSingle();

  let { data: order } = await load();
  if (!order) throw new HttpError(404, 'INTENT_NOT_FOUND', 'That payment reference was not found.');

  if (order.status === 'PENDING_PAYMENT') {
    const simulated = isSimulated();
    let confirmed = false;
    let failed = false;

    if (simulated) {
      // Only orders created in test mode may be confirmed in test mode.
      if (!reference.startsWith('sim_')) {
        throw new HttpError(400, 'NOT_SIMULATED', 'Only test-mode votes can be confirmed while PAYMENT_MODE=simulated.');
      }
      confirmed = true;
    } else {
      if (reference.startsWith('sim_')) throw new HttpError(400, 'NOT_SIMULATED', 'Test-mode votes cannot be confirmed in live mode.');
      const res = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
        headers: { Authorization: `Bearer ${Deno.env.get('PAYSTACK_SECRET_KEY')}` },
      });
      const out = await res.json().catch(() => null);
      const tx = out?.data;
      if (res.ok && tx?.status === 'success') {
        if (tx.amount !== toPesewas(order.amount) || tx.currency !== order.currency) {
          console.error('Vote payment mismatch', reference, tx.amount, tx.currency);
          failed = true;
        } else {
          confirmed = true;
        }
      } else if (res.ok && (tx?.status === 'failed' || tx?.status === 'reversed')) {
        failed = true;
      }
      // Otherwise (abandoned / pending / unknown): leave PENDING_PAYMENT; the
      // voter may still be completing checkout.
    }

    if (confirmed) {
      // The status guard makes this idempotent: a second confirm updates nothing.
      await db
        .from('award_vote_orders')
        .update({ status: 'PAYMENT_SUCCESS', paid_at: new Date().toISOString(), is_simulated: simulated })
        .eq('id', order.id)
        .eq('status', 'PENDING_PAYMENT');
    } else if (failed) {
      await db.from('award_vote_orders').update({ status: 'FAILED' }).eq('id', order.id).eq('status', 'PENDING_PAYMENT');
    }
    ({ data: order } = await load());
  }

  const o = order!;
  return {
    status: o.status as 'PENDING_PAYMENT' | 'PAYMENT_SUCCESS' | 'FAILED',
    reference: o.payment_reference,
    quantity: o.quantity,
    amount: Number(o.amount),
    currency: o.currency,
    simulated: o.is_simulated,
    contestantName: o.award_contestants?.full_name ?? '',
    categoryName: o.award_categories?.name ?? '',
    campaignName: o.award_campaigns?.name ?? '',
    campaignSlug: o.award_campaigns?.slug ?? '',
  };
}

// --------------------------------------------------------------------------
Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (req.method !== 'POST') return json({ error: { code: 'METHOD_NOT_ALLOWED', message: 'Use POST.' } }, 405);

  try {
    const body = await req.json().catch(() => null);
    if (!body || typeof body !== 'object') throw new HttpError(400, 'BAD_REQUEST', 'Invalid request body.');

    const db = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);

    switch (body.action) {
      case 'create-intent':
        return json(await createIntent(db, body), 201);
      case 'initialize-payment':
        return json(await initializePayment(db, body), 200);
      case 'verify-payment':
        return json(await verifyPayment(db, body), 200);
      default:
        throw new HttpError(400, 'BAD_REQUEST', 'Unknown action.');
    }
  } catch (err) {
    if (err instanceof HttpError) return json({ error: { code: err.code, message: err.message } }, err.status);
    console.error('awards-vote unexpected error', err);
    return json({ error: { code: 'INTERNAL_ERROR', message: 'Something went wrong. Please try again.' } }, 500);
  }
});
