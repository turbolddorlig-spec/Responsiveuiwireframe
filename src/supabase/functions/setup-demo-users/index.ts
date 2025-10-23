// Supabase Edge Function to setup demo users
// This should be run once to create the demo users

import { createClient } from 'jsr:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Demo users to create
    const demoUsers = [
      { phone: '99000000', password: 'super123', name: 'Супер Админ', role: 'super_admin' },
      { phone: '99000001', password: 'admin123', name: 'Админ Дорж', role: 'admin' },
      { phone: '99000002', password: 'operator123', name: 'Оператор Болд', role: 'operator' },
      { phone: '99112233', password: 'driver123', name: 'Жолооч Бат', role: 'driver' },
      { phone: '99112234', password: 'lead123', name: 'Ахлагч Цэрэн', role: 'driver_lead' },
      { phone: '99112235', password: 'account123', name: 'Нягтлан Сара', role: 'accounting' },
      { phone: '99112236', password: 'warehouse123', name: 'Агуулах Ганбат', role: 'warehouse' }
    ];

    const results = [];

    for (const user of demoUsers) {
      const email = `${user.phone}@logistics.mn`;
      
      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email,
        password: user.password,
        email_confirm: true, // Auto-confirm since we don't have email server
        user_metadata: {
          phone: user.phone,
          name: user.name,
          role: user.role
        }
      });

      if (authError) {
        console.error(`Error creating user ${user.phone}:`, authError);
        results.push({ phone: user.phone, success: false, error: authError.message });
        continue;
      }

      // Create user profile
      const { error: profileError } = await supabase
        .from('user_profiles')
        .insert([{
          id: authData.user.id,
          phone: user.phone,
          name: user.name,
          role: user.role
        }]);

      if (profileError) {
        console.error(`Error creating profile for ${user.phone}:`, profileError);
        results.push({ phone: user.phone, success: false, error: profileError.message });
        continue;
      }

      results.push({ phone: user.phone, success: true, name: user.name });
    }

    return new Response(
      JSON.stringify({ 
        message: 'Demo users setup completed',
        results 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('Error in setup-demo-users:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
