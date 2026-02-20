import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Verify caller is authenticated admin
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: corsHeaders });

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    // Verify the caller is an admin
    const userClient = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } }
    );
    const { data: { user } } = await userClient.auth.getUser();
    if (!user) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: corsHeaders });

    const { data: roleData } = await supabaseAdmin.from('user_roles').select('role').eq('user_id', user.id).eq('role', 'admin').single();
    if (!roleData) return new Response(JSON.stringify({ error: 'Forbidden — admin only' }), { status: 403, headers: corsHeaders });

    const body = await req.json();
    const { action } = body;

    // --- List users with pagination ---
    if (action === 'list') {
      const page = body.page ?? 1;
      const pageSize = body.pageSize ?? 50;
      const search = body.search ?? '';

      // Get all profiles with pagination from DB
      let query = supabaseAdmin.from('profiles').select('*', { count: 'exact' });
      if (search) query = query.or(`email.ilike.%${search}%,display_name.ilike.%${search}%`);
      const { data: profiles, count } = await query
        .order('created_at', { ascending: false })
        .range((page - 1) * pageSize, page * pageSize - 1);

      if (!profiles) return new Response(JSON.stringify({ users: [], total: 0 }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

      const userIds = profiles.map((p: any) => p.user_id);
      const [rolesRes, accessRes] = await Promise.all([
        supabaseAdmin.from('user_roles').select('*').in('user_id', userIds),
        supabaseAdmin.from('portal_access').select('*').in('user_id', userIds),
      ]);

      const rolesMap: Record<string, string[]> = {};
      const accessMap: Record<string, string[]> = {};
      rolesRes.data?.forEach((r: any) => {
        if (!rolesMap[r.user_id]) rolesMap[r.user_id] = [];
        rolesMap[r.user_id].push(r.role);
      });
      accessRes.data?.forEach((a: any) => {
        if (!accessMap[a.user_id]) accessMap[a.user_id] = [];
        accessMap[a.user_id].push(a.portal_section);
      });

      const users = profiles.map((p: any) => ({
        user_id: p.user_id,
        email: p.email ?? '',
        display_name: p.display_name ?? '',
        created_at: p.created_at,
        roles: rolesMap[p.user_id] ?? [],
        portal_access: accessMap[p.user_id] ?? [],
      }));

      return new Response(JSON.stringify({ users, total: count ?? 0, page, pageSize }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // --- Create single user ---
    if (action === 'create') {
      const { email, displayName, password, role, portalSections } = body;
      if (!email) return new Response(JSON.stringify({ error: 'Email required' }), { status: 400, headers: corsHeaders });

      // Check existing
      const { data: existing } = await supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 1 });
      // Use search approach — list all and filter (Supabase admin doesn't support email search directly)
      const allUsersRes = await supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 10000 });
      const existingUser = allUsersRes.data?.users?.find((u: any) => u.email === email);

      let userId: string;
      if (existingUser) {
        userId = existingUser.id;
        if (password) await supabaseAdmin.auth.admin.updateUserById(userId, { password });
      } else {
        const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
          email,
          password: password || Math.random().toString(36).slice(-12) + 'A1!',
          email_confirm: true,
          user_metadata: { display_name: displayName || email.split('@')[0] },
        });
        if (createError) throw createError;
        userId = newUser.user.id;

        // Profile is auto-created by trigger, but ensure it
        await supabaseAdmin.from('profiles').upsert(
          { user_id: userId, email, display_name: displayName || email.split('@')[0] },
          { onConflict: 'user_id' }
        );
      }

      // Set role
      if (role) {
        await supabaseAdmin.from('user_roles').upsert({ user_id: userId, role }, { onConflict: 'user_id,role' });
      }

      // Set portal sections
      if (portalSections && portalSections.length > 0) {
        const rows = portalSections.map((section: string) => ({
          user_id: userId,
          portal_section: section,
          granted_by: user.id,
        }));
        await supabaseAdmin.from('portal_access').upsert(rows, { onConflict: 'user_id,portal_section' });
      }

      return new Response(JSON.stringify({ success: true, userId, isNew: !existingUser }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // --- Bulk create from CSV data ---
    if (action === 'bulk_create') {
      const { users: userList, defaultRole, defaultPortalSections } = body;
      if (!Array.isArray(userList)) return new Response(JSON.stringify({ error: 'users array required' }), { status: 400, headers: corsHeaders });

      const results = { created: 0, updated: 0, errors: [] as string[] };

      // Fetch all existing users once for lookup
      const allUsersRes = await supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 10000 });
      const existingMap = new Map((allUsersRes.data?.users || []).map((u: any) => [u.email, u]));

      for (const u of userList.slice(0, 500)) { // cap at 500 per batch
        try {
          const email = u.email?.trim();
          if (!email) continue;
          const displayName = u.name || u.display_name || email.split('@')[0];

          let userId: string;
          const existingUser = existingMap.get(email);

          if (existingUser) {
            userId = existingUser.id;
            results.updated++;
          } else {
            const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
              email,
              password: Math.random().toString(36).slice(-12) + 'A1!',
              email_confirm: true,
              user_metadata: { display_name: displayName },
            });
            if (createError) { results.errors.push(`${email}: ${createError.message}`); continue; }
            userId = newUser.user.id;
            await supabaseAdmin.from('profiles').upsert(
              { user_id: userId, email, display_name: displayName },
              { onConflict: 'user_id' }
            );
            results.created++;
          }

          const role = u.role || defaultRole;
          if (role) {
            await supabaseAdmin.from('user_roles').upsert({ user_id: userId, role }, { onConflict: 'user_id,role' });
          }

          const sections = u.portal_sections ? u.portal_sections.split(',').map((s: string) => s.trim()) : defaultPortalSections || [];
          if (sections.length > 0) {
            const rows = sections.map((section: string) => ({
              user_id: userId,
              portal_section: section,
              granted_by: user.id,
            }));
            await supabaseAdmin.from('portal_access').upsert(rows, { onConflict: 'user_id,portal_section' });
          }
        } catch (e: any) {
          results.errors.push(`${u.email}: ${e.message}`);
        }
      }

      return new Response(JSON.stringify({ success: true, ...results }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // --- Delete user ---
    if (action === 'delete') {
      const { userId: targetId } = body;
      if (!targetId) return new Response(JSON.stringify({ error: 'userId required' }), { status: 400, headers: corsHeaders });

      await supabaseAdmin.auth.admin.deleteUser(targetId);
      return new Response(JSON.stringify({ success: true }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    // --- Get total counts ---
    if (action === 'stats') {
      const [profileCount, adminCount, portalCount] = await Promise.all([
        supabaseAdmin.from('profiles').select('*', { count: 'exact', head: true }),
        supabaseAdmin.from('user_roles').select('*', { count: 'exact', head: true }).eq('role', 'admin'),
        supabaseAdmin.from('portal_access').select('user_id').then(r => {
          const unique = new Set(r.data?.map((x: any) => x.user_id));
          return { count: unique.size };
        }),
      ]);
      return new Response(JSON.stringify({
        total: profileCount.count ?? 0,
        admins: adminCount.count ?? 0,
        portalUsers: portalCount.count ?? 0,
      }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    return new Response(JSON.stringify({ error: 'Unknown action' }), { status: 400, headers: corsHeaders });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
