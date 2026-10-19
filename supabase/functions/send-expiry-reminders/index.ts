// Cron-only: email members whose membership expires within the next 30
// days and haven't been reminded yet this cycle. Not invoked from the
// frontend — triggered by a pg_cron schedule (see supabase/README.md) or
// manually for testing via `supabase functions invoke send-expiry-reminders`.
// Rejects any request without the matching CRON_SECRET header so it can't
// be triggered by hitting its public URL.
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

function json(body: unknown, status: number) {
  return new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });
}

Deno.serve(async (req) => {
  const cronSecret = Deno.env.get('CRON_SECRET');
  if (!cronSecret || req.headers.get('x-cron-secret') !== cronSecret) {
    return json({ error: 'Unauthorized' }, 401);
  }

  try {
    const adminClient = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const today = new Date();
    const in30Days = new Date(today);
    in30Days.setUTCDate(in30Days.getUTCDate() + 30);
    const todayStr = today.toISOString().slice(0, 10);
    const in30DaysStr = in30Days.toISOString().slice(0, 10);

    const { data: profiles, error } = await adminClient
      .from('profiles')
      .select('id, email, full_name, membership_expiry_date')
      .gte('membership_expiry_date', todayStr)
      .lte('membership_expiry_date', in30DaysStr)
      .is('expiry_reminder_sent_at', null);

    if (error) return json({ error: error.message }, 500);

    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    const fromEmail = Deno.env.get('FROM_EMAIL') ?? 'GPAA <onboarding@resend.dev>';
    let sent = 0;

    for (const profile of profiles ?? []) {
      if (resendApiKey) {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: { Authorization: `Bearer ${resendApiKey}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            from: fromEmail,
            to: profile.email,
            subject: 'Your GPAA membership is expiring soon',
            html: `<div style="font-family: sans-serif; font-size: 15px; line-height: 1.6;">
              <p>Dear ${profile.full_name ?? 'Member'},</p>
              <p>Your GPAA membership expires on <strong>${profile.membership_expiry_date}</strong>.
              Log in to your member portal to renew and keep your membership active.</p>
              <p>— GPAA Membership Team</p>
            </div>`,
          }),
        }).catch(() => {});
      }
      await adminClient
        .from('profiles')
        .update({ expiry_reminder_sent_at: new Date().toISOString() })
        .eq('id', profile.id);
      sent += 1;
    }

    return json({ success: true, remindersSent: sent }, 200);
  } catch (err) {
    return json({ error: err instanceof Error ? err.message : 'Unexpected error' }, 500);
  }
});
