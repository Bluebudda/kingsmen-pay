import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const testAccounts = [
      {
        email: 'employee@test.com',
        password: 'Test123!@#',
        role: 'employee',
        metadata: {
          full_name: 'Test Employee',
          role: 'analyst',
          department: 'Underwriting'
        }
      },
      {
        email: 'agent@test.com',
        password: 'Test123!@#',
        role: 'agent',
        metadata: {
          full_name: 'Test Agent',
          agent_code: 'AGT-001',
          commission_rate: 5.0,
          territory: 'North America'
        }
      },
      {
        email: 'partner@test.com',
        password: 'Test123!@#',
        role: 'partner',
        metadata: {
          full_name: 'Test Partner',
          company_name: 'Test Partner Company',
          partner_code: 'PTR-001',
          commission_rate: 10.0,
          partnership_type: 'referral'
        }
      },
      {
        email: 'merchant@test.com',
        password: 'Test123!@#',
        role: 'merchant',
        metadata: {
          merchant_name: 'Test Merchant Business',
          business_name: 'Test Merchant Business',
          contact_person: 'Test Merchant Contact',
          phone: '+1234567890'
        }
      }
    ];

    const results = [];

    for (const account of testAccounts) {
      // Check if user already exists
      const { data: existingUsers } = await supabase
        .from('auth.users')
        .select('email')
        .eq('email', account.email);

      if (existingUsers && existingUsers.length > 0) {
        results.push({
          email: account.email,
          status: 'already_exists',
          password: account.password
        });
        continue;
      }

      // Create user in auth.users
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: account.email,
        password: account.password,
        email_confirm: true,
        user_metadata: account.metadata
      });

      if (authError) {
        results.push({
          email: account.email,
          status: 'error',
          error: authError.message
        });
        continue;
      }

      const userId = authData.user.id;

      // Create role-specific record
      if (account.role === 'employee') {
        await supabase.from('employees').insert({
          user_id: userId,
          email: account.email,
          full_name: account.metadata.full_name,
          role: account.metadata.role,
          department: account.metadata.department,
          is_active: true
        });
      } else if (account.role === 'agent') {
        await supabase.from('agents').insert({
          user_id: userId,
          email: account.email,
          full_name: account.metadata.full_name,
          agent_code: account.metadata.agent_code,
          commission_rate: account.metadata.commission_rate,
          territory: account.metadata.territory,
          status: 'active'
        });
      } else if (account.role === 'partner') {
        await supabase.from('partners').insert({
          user_id: userId,
          email: account.email,
          full_name: account.metadata.full_name,
          company_name: account.metadata.company_name,
          partner_code: account.metadata.partner_code,
          commission_rate: account.metadata.commission_rate,
          partnership_type: account.metadata.partnership_type,
          status: 'active'
        });
      } else if (account.role === 'merchant') {
        // Create merchant record
        const { data: merchantData } = await supabase.from('merchants').insert({
          merchant_name: account.metadata.merchant_name,
          email: account.email,
          contact_person: account.metadata.contact_person,
          phone: account.metadata.phone,
          status: 'active'
        }).select().single();

        if (merchantData) {
          // Create merchant_users link
          await supabase.from('merchant_users').insert({
            user_id: userId,
            merchant_id: merchantData.id,
            is_primary_contact: true,
            role: 'admin',
            is_active: true
          });
        }
      }

      results.push({
        email: account.email,
        role: account.role,
        status: 'created',
        password: account.password,
        user_id: userId
      });
    }

    return new Response(
      JSON.stringify({
        success: true,
        accounts: results
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
});
