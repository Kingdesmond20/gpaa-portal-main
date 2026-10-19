// Admin-only: invite a new user by email + role.
//
// Runs server-side (Supabase Edge Function, Deno) because
// auth.admin.inviteUserByEmail requires the service-role key, which must
// never ship to the browser. Called from the admin dashboard via
// supabase.functions.invoke('invite-user', { body: { email, role } }) — see
// lib/authApi.ts's inviteUser().
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

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) return json({ error: 'Missing Authorization header' }, 401);

    // Scoped to the caller's own JWT — used only to verify who's calling
    // and that they're an admin, via the RLS-protected profiles table.
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
      return json({ error: 'Only admins can send invitations' }, 403);
    }

    const { email, role } = await req.json();
    if (!email || typeof email !== 'string') return json({ error: 'email is required' }, 400);
    if (role !== 'member' && role !== 'admin') {
      return json({ error: "role must be 'member' or 'admin'" }, 400);
    }

    // Service-role key — bypasses RLS, never exposed to the browser.
    const adminClient = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // The pending invitation MUST exist before inviteUserByEmail: that call
    // creates the auth.users row immediately, and the handle_new_user()
    // trigger reads the role from this table (not from user metadata, which
    // anyone can set via the public sign-up endpoint — see migration 0004).
    const { data: invitation, error: logError } = await adminClient
      .from('invitations')
      .insert({ email, role, invited_by: user.id })
      .select('id')
      .single();

    if (logError || !invitation) {
      return json({ error: `Could not record invitation: ${logError?.message ?? 'unknown error'}` }, 500);
    }

    const siteUrl = Deno.env.get('SITE_URL');
    const { error: inviteError } = await adminClient.auth.admin.inviteUserByEmail(email, {
      ...(siteUrl ? { redirectTo: `${siteUrl}/accept-invite` } : {}),
    });

    if (inviteError) {
      // Roll back so a failed invite (e.g. the user already exists) doesn't
      // leave a pending row that could grant a role to a later sign-up.
      await adminClient.from('invitations').delete().eq('id', invitation.id);
      return json({ error: inviteError.message }, 400);
    }

    return json({ success: true }, 200);
  } catch (err) {
    return json({ error: err instanceof Error ? err.message : 'Unexpected error' }, 500);
  }
});
