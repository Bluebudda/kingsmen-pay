import { createClient } from 'npm:@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

const SKYPHOENIX_BASE_URL = 'https://dev-api.skyphoenix.net/api/v3';

interface PayInRequest {
  merchantId: string;
  amount: number;
  currency: string;
  customerEmail: string;
  customerName: string;
  paymentMethod: string;
  callbackUrl: string;
  returnUrl: string;
}

interface PayOutRequest {
  merchantId: string;
  amount: number;
  currency: string;
  beneficiaryEmail: string;
  beneficiaryName: string;
  beneficiaryAccount: string;
  callbackUrl: string;
}

interface CancelRequest {
  orderId: string;
  merchantId: string;
}

interface CallbackPayload {
  orderId: string;
  status: string;
  amount: number;
  currency: string;
  transactionId?: string;
  timestamp: number;
  signature: string;
}

async function generateHashSignature(data: string, secretKey: string): Promise<string> {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secretKey);
  const messageData = encoder.encode(data);

  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const signature = await crypto.subtle.sign('HMAC', cryptoKey, messageData);
  const hashArray = Array.from(new Uint8Array(signature));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

async function verifyHashSignature(data: string, secretKey: string, providedSignature: string): Promise<boolean> {
  const calculatedSignature = await generateHashSignature(data, secretKey);
  return calculatedSignature === providedSignature;
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const url = new URL(req.url);
    const path = url.pathname.split('/skyphoenix-api')[1] || '/';

    if (path === '/callback' && req.method === 'POST') {
      const body: CallbackPayload = await req.json();

      const { data: transaction } = await supabase
        .from('transactions')
        .select('*, merchant_credentials!inner(api_secret)')
        .eq('skyphoenix_order_id', body.orderId)
        .maybeSingle();

      if (!transaction) {
        throw new Error('Transaction not found');
      }

      const signatureData = `${body.timestamp}${body.orderId}${body.status}${body.amount}`;
      const isValid = await verifyHashSignature(
        signatureData,
        transaction.merchant_credentials.api_secret,
        body.signature
      );

      if (!isValid) {
        throw new Error('Invalid signature');
      }

      const statusMap: Record<string, string> = {
        'success': 'completed',
        'completed': 'completed',
        'failed': 'failed',
        'cancelled': 'cancelled',
        'pending': 'processing',
        'processing': 'processing',
      };

      const newStatus = statusMap[body.status.toLowerCase()] || 'processing';

      await supabase
        .from('transactions')
        .update({
          status: newStatus,
          response_data: body,
          completed_at: newStatus === 'completed' ? new Date().toISOString() : null,
          error_message: newStatus === 'failed' ? body.transactionId : null,
        })
        .eq('id', transaction.id);

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Missing authorization header');
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    if (path === '/payin' && req.method === 'POST') {
      const body: PayInRequest = await req.json();

      const { data: credentials } = await supabase
        .from('merchant_credentials')
        .select('*')
        .eq('merchant_id', body.merchantId)
        .eq('environment', 'dev')
        .eq('is_active', true)
        .maybeSingle();

      if (!credentials) {
        throw new Error('Merchant credentials not found');
      }

      const { data: merchant } = await supabase
        .from('merchants')
        .select('email')
        .eq('id', body.merchantId)
        .maybeSingle();

      if (!merchant) {
        throw new Error('Merchant not found');
      }

      const { data: transactionRecord } = await supabase
        .from('transactions')
        .insert({
          merchant_id: body.merchantId,
          transaction_type: 'payin',
          amount: body.amount,
          currency: body.currency,
          status: 'pending',
          payment_method: body.paymentMethod,
          customer_email: body.customerEmail,
          customer_name: body.customerName,
          callback_url: body.callbackUrl,
          return_url: body.returnUrl,
          request_data: body,
        })
        .select()
        .single();

      const timestamp = Math.floor(Date.now() / 1000);
      const signatureString = `${timestamp}${merchant.email}`;
      const signature = await generateHashSignature(signatureString, credentials.api_secret);

      const skyPhoenixResponse = await fetch(`${SKYPHOENIX_BASE_URL}/payinorder`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-App-Access-Time': timestamp.toString(),
          'X-App-Access-Email': merchant.email,
          'X-App-Access-Sig': signature,
        },
        body: JSON.stringify({
          amount: body.amount,
          currency: body.currency,
          customer_email: body.customerEmail,
          customer_name: body.customerName,
          payment_method: body.paymentMethod,
          callback_url: body.callbackUrl,
          return_url: body.returnUrl,
        }),
      });

      const responseData = await skyPhoenixResponse.json();

      await supabase
        .from('transactions')
        .update({
          skyphoenix_order_id: responseData.order_id || responseData.orderId,
          status: skyPhoenixResponse.ok ? 'processing' : 'failed',
          response_data: responseData,
          error_message: skyPhoenixResponse.ok ? null : responseData.message,
        })
        .eq('id', transactionRecord.id);

      return new Response(JSON.stringify(responseData), {
        status: skyPhoenixResponse.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (path === '/payout' && req.method === 'POST') {
      const body: PayOutRequest = await req.json();

      const { data: credentials } = await supabase
        .from('merchant_credentials')
        .select('*')
        .eq('merchant_id', body.merchantId)
        .eq('environment', 'dev')
        .eq('is_active', true)
        .maybeSingle();

      if (!credentials) {
        throw new Error('Merchant credentials not found');
      }

      const { data: merchant } = await supabase
        .from('merchants')
        .select('email')
        .eq('id', body.merchantId)
        .maybeSingle();

      if (!merchant) {
        throw new Error('Merchant not found');
      }

      const { data: transactionRecord } = await supabase
        .from('transactions')
        .insert({
          merchant_id: body.merchantId,
          transaction_type: 'payout',
          amount: body.amount,
          currency: body.currency,
          status: 'pending',
          customer_email: body.beneficiaryEmail,
          customer_name: body.beneficiaryName,
          callback_url: body.callbackUrl,
          request_data: body,
        })
        .select()
        .single();

      const timestamp = Math.floor(Date.now() / 1000);
      const signatureString = `${timestamp}${merchant.email}`;
      const signature = await generateHashSignature(signatureString, credentials.api_secret);

      const skyPhoenixResponse = await fetch(`${SKYPHOENIX_BASE_URL}/payoutorder`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-App-Access-Time': timestamp.toString(),
          'X-App-Access-Email': merchant.email,
          'X-App-Access-Sig': signature,
        },
        body: JSON.stringify({
          amount: body.amount,
          currency: body.currency,
          beneficiary_email: body.beneficiaryEmail,
          beneficiary_name: body.beneficiaryName,
          beneficiary_account: body.beneficiaryAccount,
          callback_url: body.callbackUrl,
        }),
      });

      const responseData = await skyPhoenixResponse.json();

      await supabase
        .from('transactions')
        .update({
          skyphoenix_order_id: responseData.order_id || responseData.orderId,
          status: skyPhoenixResponse.ok ? 'processing' : 'failed',
          response_data: responseData,
          error_message: skyPhoenixResponse.ok ? null : responseData.message,
        })
        .eq('id', transactionRecord.id);

      return new Response(JSON.stringify(responseData), {
        status: skyPhoenixResponse.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (path === '/cancel-payin' && req.method === 'POST') {
      const body: CancelRequest = await req.json();

      const { data: credentials } = await supabase
        .from('merchant_credentials')
        .select('*')
        .eq('merchant_id', body.merchantId)
        .eq('environment', 'dev')
        .eq('is_active', true)
        .maybeSingle();

      if (!credentials) {
        throw new Error('Merchant credentials not found');
      }

      const { data: merchant } = await supabase
        .from('merchants')
        .select('email')
        .eq('id', body.merchantId)
        .maybeSingle();

      if (!merchant) {
        throw new Error('Merchant not found');
      }

      const timestamp = Math.floor(Date.now() / 1000);
      const signatureString = `${timestamp}${merchant.email}`;
      const signature = await generateHashSignature(signatureString, credentials.api_secret);

      const skyPhoenixResponse = await fetch(`${SKYPHOENIX_BASE_URL}/CancelPayInOrder`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-App-Access-Time': timestamp.toString(),
          'X-App-Access-Email': merchant.email,
          'X-App-Access-Sig': signature,
        },
        body: JSON.stringify({
          order_id: body.orderId,
        }),
      });

      const responseData = await skyPhoenixResponse.json();

      await supabase
        .from('transactions')
        .update({
          status: 'cancelled',
          response_data: responseData,
        })
        .eq('skyphoenix_order_id', body.orderId);

      return new Response(JSON.stringify(responseData), {
        status: skyPhoenixResponse.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (path === '/cancel-payout' && req.method === 'POST') {
      const body: CancelRequest = await req.json();

      const { data: credentials } = await supabase
        .from('merchant_credentials')
        .select('*')
        .eq('merchant_id', body.merchantId)
        .eq('environment', 'dev')
        .eq('is_active', true)
        .maybeSingle();

      if (!credentials) {
        throw new Error('Merchant credentials not found');
      }

      const { data: merchant } = await supabase
        .from('merchants')
        .select('email')
        .eq('id', body.merchantId)
        .maybeSingle();

      if (!merchant) {
        throw new Error('Merchant not found');
      }

      const timestamp = Math.floor(Date.now() / 1000);
      const signatureString = `${timestamp}${merchant.email}`;
      const signature = await generateHashSignature(signatureString, credentials.api_secret);

      const skyPhoenixResponse = await fetch(`${SKYPHOENIX_BASE_URL}/CancelPayOutOrder`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-App-Access-Time': timestamp.toString(),
          'X-App-Access-Email': merchant.email,
          'X-App-Access-Sig': signature,
        },
        body: JSON.stringify({
          order_id: body.orderId,
        }),
      });

      const responseData = await skyPhoenixResponse.json();

      await supabase
        .from('transactions')
        .update({
          status: 'cancelled',
          response_data: responseData,
        })
        .eq('skyphoenix_order_id', body.orderId);

      return new Response(JSON.stringify(responseData), {
        status: skyPhoenixResponse.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ error: 'Not found' }), {
      status: 404,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
