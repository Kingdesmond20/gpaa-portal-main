// Authenticated: verify a Paystack payment server-side (never trust the
// client's "it succeeded" callback alone), then extend membership standing
// and issue a certificate. Called from pages/portal/MemberDashboard.tsx via
// lib/paymentsApi.ts's verifyPayment() once Paystack Inline's own callback
// fires client-side.
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { PDFDocument, StandardFonts, rgb } from 'https://esm.sh/pdf-lib@1.17.1';

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

// Calendar year, not 365 days: adding 365 days across a leap day (e.g. renewing
// on 2027-09-26 → 2028-09-25) would cut a day off the membership.
function addYears(date: Date, years: number): Date {
  const result = new Date(date);
  result.setUTCFullYear(result.getUTCFullYear() + years);
  return result;
}

function toDateString(date: Date): string {
  return date.toISOString().slice(0, 10);
}

async function buildCertificatePdf(opts: {
  memberName: string;
  category: string;
  certificateNumber: string;
  validFrom: string;
  validUntil: string;
  simulated?: boolean;
}): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  const page = doc.addPage([595, 420]); // A5 landscape-ish
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);
  const regular = await doc.embedFont(StandardFonts.Helvetica);
  const green = rgb(0.008, 0.373, 0.184); // ghana-green

  const centerText = (text: string, y: number, font: typeof bold, size: number, color = rgb(0.07, 0.08, 0.09)) => {
    const width = font.widthOfTextAtSize(text, size);
    page.drawText(text, { x: (595 - width) / 2, y, size, font, color });
  };

  page.drawRectangle({ x: 20, y: 20, width: 555, height: 380, borderColor: green, borderWidth: 3 });
  centerText('Ghana Physician Assistants Association', 350, bold, 18, green);
  centerText('Certificate of Membership', 310, bold, 26);
  centerText('This certifies that', 265, regular, 12);
  centerText(opts.memberName, 235, bold, 22, green);
  centerText(`is a registered ${opts.category} of GPAA`, 205, regular, 13);
  centerText(`Valid from ${opts.validFrom} to ${opts.validUntil}`, 170, regular, 12);
  centerText(`Certificate No. ${opts.certificateNumber}`, 140, regular, 11);
  centerText(`Issued ${toDateString(new Date())}`, 100, regular, 10);
  if (opts.simulated) {
    centerText('TEST MODE - SIMULATED PAYMENT - NOT A VALID CERTIFICATE', 55, bold, 10, rgb(0.8, 0.1, 0.1));
  }

  return doc.save();
}

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

    const { reference } = await req.json();
    if (!reference || typeof reference !== 'string') {
      return json({ error: 'reference is required' }, 400);
    }

    const adminClient = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const { data: payment, error: paymentError } = await adminClient
      .from('payments')
      .select('id, user_id, application_id, category, amount_pesewas, currency, status')
      .eq('paystack_reference', reference)
      .maybeSingle();

    if (paymentError || !payment) return json({ error: 'Payment not found' }, 404);
    if (payment.user_id !== user.id) return json({ error: 'Not your payment' }, 403);
    if (payment.status === 'success') return json({ success: true, alreadyProcessed: true }, 200);

    // Decided by the SERVER's PAYMENT_MODE secret, never by anything the client
    // sends. In simulated mode no charge happens at all: only references issued
    // by create-payment in simulated mode (sim_ prefix) are accepted, and the
    // resulting payment/certificate are clearly marked as test data.
    const simulated = Deno.env.get('PAYMENT_MODE') === 'simulated';

    if (simulated) {
      if (!reference.startsWith('sim_')) {
        return json({ error: 'Only simulated payments can be confirmed while PAYMENT_MODE=simulated' }, 400);
      }
    } else {
      const paystackRes = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
        headers: { Authorization: `Bearer ${Deno.env.get('PAYSTACK_SECRET_KEY')}` },
      });
      const paystackBody = await paystackRes.json().catch(() => null);
      const txData = paystackBody?.data;

      if (!paystackRes.ok || !txData || txData.status !== 'success') {
        await adminClient.from('payments').update({ status: 'failed' }).eq('id', payment.id);
        return json({ error: 'Payment was not successful' }, 400);
      }
      if (txData.amount !== payment.amount_pesewas || txData.currency !== payment.currency) {
        await adminClient.from('payments').update({ status: 'failed' }).eq('id', payment.id);
        return json({ error: 'Payment amount/currency mismatch' }, 400);
      }
    }

    const { data: profile, error: profileError } = await adminClient
      .from('profiles')
      .select('membership_expiry_date, full_name, email')
      .eq('id', user.id)
      .single();
    if (profileError || !profile) return json({ error: 'Profile not found' }, 500);

    const today = new Date();
    const currentExpiry = profile.membership_expiry_date ? new Date(profile.membership_expiry_date) : null;
    const periodStartDate = currentExpiry && currentExpiry > today ? currentExpiry : today;
    const periodEndDate = addYears(periodStartDate, 1);
    const periodStart = toDateString(periodStartDate);
    const periodEnd = toDateString(periodEndDate);

    const { error: updatePaymentError } = await adminClient
      .from('payments')
      .update({ status: 'success', paid_at: new Date().toISOString(), period_start: periodStart, period_end: periodEnd })
      .eq('id', payment.id);
    if (updatePaymentError) return json({ error: updatePaymentError.message }, 500);

    await adminClient
      .from('profiles')
      .update({ membership_expiry_date: periodEnd, expiry_reminder_sent_at: null })
      .eq('id', user.id);

    let memberName = profile.full_name ?? profile.email;
    if (payment.application_id) {
      const { data: application } = await adminClient
        .from('membership_applications')
        .select('first_name, last_name')
        .eq('id', payment.application_id)
        .maybeSingle();
      if (application) memberName = `${application.first_name} ${application.last_name}`;
    }

    const certificateId = crypto.randomUUID();
    const certificateNumber = `GPAA-${new Date().getUTCFullYear()}-${certificateId.slice(0, 8).toUpperCase()}`;
    const pdfBytes = await buildCertificatePdf({
      memberName,
      category: payment.category,
      certificateNumber,
      validFrom: periodStart,
      validUntil: periodEnd,
      simulated,
    });

    const storagePath = `${user.id}/${certificateId}.pdf`;
    const { error: uploadError } = await adminClient.storage
      .from('certificates')
      .upload(storagePath, pdfBytes, { contentType: 'application/pdf', upsert: true });
    if (uploadError) return json({ error: uploadError.message }, 500);

    const { error: certError } = await adminClient.from('membership_certificates').insert({
      id: certificateId,
      user_id: user.id,
      payment_id: payment.id,
      certificate_number: certificateNumber,
      category: payment.category,
      valid_from: periodStart,
      valid_until: periodEnd,
      storage_path: storagePath,
    });
    if (certError) return json({ error: certError.message }, 500);

    return json({ success: true, membershipExpiryDate: periodEnd, certificateNumber, simulated }, 200);
  } catch (err) {
    return json({ error: err instanceof Error ? err.message : 'Unexpected error' }, 500);
  }
});
