// Admin-only: approve, reject, or request a correction on a membership
// application. Does the whole thing server-side in one call — update the
// row, email the applicant via Resend, and (on approval, only if they don't
// already have a portal account) send them a portal invite — so a partial
// failure across separate client-side calls can't leave things half-done.
// Called from pages/admin/ApplicationsQueue.tsx via
// supabase.functions.invoke('review-application', { body: {...} }) — see
// lib/membershipApi.ts's reviewApplication().
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

type Decision = 'approved' | 'rejected' | 'needs_correction';

const SUBJECTS: Record<Decision, string> = {
  approved: 'Your GPAA membership application has been approved',
  rejected: 'Update on your GPAA membership application',
  needs_correction: 'Action needed on your GPAA membership application',
};

// The first name comes from a public form and the message from an admin: both
// are interpolated into HTML below, so escape them — otherwise an applicant
// could get markup or links delivered from GPAA's own sending domain.
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function buildEmailHtml(
  decision: Decision,
  rawFirstName: string,
  rawMessage: string | undefined,
  inviteSent: boolean,
  supportEmail: string,
  siteUrl: string | undefined
) {
  const firstName = escapeHtml(rawFirstName);
  const message = rawMessage ? escapeHtml(rawMessage) : undefined;
  const greeting = `<p>Dear ${firstName},</p>`;
  let body: string;
  switch (decision) {
    case 'approved':
      body = `
        <p>Congratulations — your GPAA membership application has been approved!</p>
        ${inviteSent
          ? `<p>You'll receive a separate email shortly with a link to set up your member portal login.</p>`
          : `<p>You can log in to your existing GPAA member portal account${siteUrl ? ` at <a href="${escapeHtml(siteUrl)}/login">${escapeHtml(siteUrl)}/login</a>` : ''} to see your updated membership status.</p>`}
      `;
      break;
    case 'rejected':
      body = `
        <p>Thank you for applying to GPAA. After review, we're unable to approve your application at this time.</p>
        ${message ? `<p><strong>Reason:</strong> ${message}</p>` : ''}
        <p>If you have questions, please contact <a href="mailto:${escapeHtml(supportEmail)}">${escapeHtml(supportEmail)}</a>.</p>
      `;
      break;
    case 'needs_correction':
      body = `
        <p>We've reviewed your GPAA membership application and need a bit more information before we can proceed.</p>
        ${message ? `<p><strong>What needs fixing:</strong> ${message}</p>` : ''}
        <p>Please submit a new application with the corrected details${siteUrl ? ` at <a href="${escapeHtml(siteUrl)}/membership/join">${escapeHtml(siteUrl)}/membership/join</a>` : ' at the GPAA membership application page'}.</p>
      `;
      break;
  }
  return `<div style="font-family: sans-serif; font-size: 15px; line-height: 1.6; color: #111418;">${greeting}${body}<p>— GPAA Membership Team</p></div>`;
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

    const { data: callerProfile, error: profileError } = await callerClient
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profileError || callerProfile?.role !== 'admin') {
      return json({ error: 'Only admins can review applications' }, 403);
    }

    const { applicationId, decision, message } = await req.json();
    if (!applicationId || typeof applicationId !== 'string') {
      return json({ error: 'applicationId is required' }, 400);
    }
    if (decision !== 'approved' && decision !== 'rejected' && decision !== 'needs_correction') {
      return json({ error: "decision must be 'approved', 'rejected', or 'needs_correction'" }, 400);
    }

    const adminClient = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const { data: application, error: fetchError } = await adminClient
      .from('membership_applications')
      .select('id, email, first_name, last_name')
      .eq('id', applicationId)
      .single();

    if (fetchError || !application) return json({ error: 'Application not found' }, 404);

    const { error: updateError } = await adminClient
      .from('membership_applications')
      .update({
        status: decision,
        admin_notes: decision === 'rejected' ? message ?? null : null,
        correction_message: decision === 'needs_correction' ? message ?? null : null,
        reviewed_by: user.id,
        reviewed_at: new Date().toISOString(),
      })
      .eq('id', applicationId);

    if (updateError) return json({ error: updateError.message }, 500);

    let inviteSent = false;
    let inviteError: string | undefined;
    if (decision === 'approved') {
      const fullName = `${application.first_name} ${application.last_name}`.trim();
      const { data: existingProfile } = await adminClient
        .from('profiles')
        .select('id, full_name')
        .eq('email', application.email)
        .maybeSingle();

      if (existingProfile && !existingProfile.full_name) {
        await adminClient.from('profiles').update({ full_name: fullName }).eq('id', existingProfile.id);
      }

      if (!existingProfile) {
        // Insert the pending invitation first — handle_new_user() reads the
        // role from it when inviteUserByEmail creates the account (migration 0004).
        const { data: invitation } = await adminClient
          .from('invitations')
          .insert({ email: application.email, role: 'member', invited_by: user.id })
          .select('id')
          .single();

        if (invitation) {
          const siteUrl = Deno.env.get('SITE_URL');
          // full_name in metadata is copied onto the profile by handle_new_user().
          // (The role is deliberately NOT taken from metadata — see migration 0004.)
          const { error: inviteFailure } = await adminClient.auth.admin.inviteUserByEmail(application.email, {
            data: { full_name: fullName },
            ...(siteUrl ? { redirectTo: `${siteUrl}/accept-invite` } : {}),
          });
          if (inviteFailure) {
            inviteError = inviteFailure.message;
            await adminClient.from('invitations').delete().eq('id', invitation.id);
          } else {
            inviteSent = true;
          }
        }
      }
    }

    // Resend answers 4xx (bad key, unverified sending domain, ...) with a normal
    // HTTP response rather than throwing, so check the status — otherwise a
    // misconfigured mailer would look like success. The review itself already
    // succeeded, so a failed email is reported, not fatal.
    let emailSent = false;
    let emailError: string | undefined;
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    if (!resendApiKey) {
      emailError = 'Email is not configured (RESEND_API_KEY is not set).';
    } else {
      const fromEmail = Deno.env.get('FROM_EMAIL') ?? 'GPAA <onboarding@resend.dev>';
      try {
        const res = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${resendApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: fromEmail,
            to: application.email,
            subject: SUBJECTS[decision as Decision],
            html: buildEmailHtml(
              decision as Decision,
              application.first_name,
              message,
              inviteSent,
              Deno.env.get('SUPPORT_EMAIL') ?? 'gpaanational@gmail.com',
              Deno.env.get('SITE_URL')
            ),
          }),
        });
        if (res.ok) {
          emailSent = true;
        } else {
          const body = await res.json().catch(() => null);
          emailError = body?.message ?? `Resend responded with HTTP ${res.status}`;
          console.error('Resend error', res.status, JSON.stringify(body));
        }
      } catch (err) {
        emailError = err instanceof Error ? err.message : 'Could not reach Resend';
        console.error('Resend request failed', emailError);
      }
    }

    return json({ success: true, inviteSent, inviteError, emailSent, emailError }, 200);
  } catch (err) {
    return json({ error: err instanceof Error ? err.message : 'Unexpected error' }, 500);
  }
});
