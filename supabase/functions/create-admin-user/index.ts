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
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    const email = 'atroun.bd@gmail.com';
    const password = '1234567';

    // Check if user already exists
    const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers();
    const exists = existingUsers?.users?.find(u => u.email === email);

    let userId: string;

    if (exists) {
      userId = exists.id;
      // Update password if user exists
      await supabaseAdmin.auth.admin.updateUserById(userId, { password });
    } else {
      // Create user via admin API (proper auth flow)
      const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { display_name: 'Admin' },
      });

      if (createError) throw createError;
      userId = newUser.user.id;
    }

    // Ensure admin role is assigned
    await supabaseAdmin
      .from('user_roles')
      .upsert({ user_id: userId, role: 'admin' }, { onConflict: 'user_id,role' });

    // Ensure profile exists
    await supabaseAdmin
      .from('profiles')
      .upsert(
        { user_id: userId, email, display_name: 'Admin' },
        { onConflict: 'user_id' }
      );

    return new Response(
      JSON.stringify({ success: true, userId }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
