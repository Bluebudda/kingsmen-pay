import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Employee = {
  id: string;
  user_id: string;
  email: string;
  full_name: string;
  role: string;
  department: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type UnderwritingService = {
  id: string;
  service_name: string;
  description: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  created_by: string | null;
};

export type UnderwritingRate = {
  id: string;
  service_id: string;
  payment_method: string;
  country: string;
  payin_channel: string | null;
  business_category: string | null;
  traffic_type: string | null;

  cost_payin_rate: number | null;
  cost_payin_min: number | null;
  cost_payin_max: number | null;
  cost_payout_rate: number | null;
  cost_payout_min: number | null;
  cost_payout_max: number | null;
  cost_settlement_fee: number | null;

  buy_payin_rate: number | null;
  buy_payin_min: number | null;
  buy_payin_max: number | null;
  buy_payout_rate: number | null;
  buy_payout_min: number | null;
  buy_payout_max: number | null;
  buy_settlement_fee: number | null;

  merchant_payin_rate: number | null;
  merchant_payin_min: number | null;
  merchant_payin_max: number | null;
  merchant_payout_rate: number | null;
  merchant_payout_min: number | null;
  merchant_payout_max: number | null;
  merchant_settlement_fee: number | null;

  success_rate: number | null;
  settlement_time: string | null;
  rolling_reserve: string | null;
  country_restrictions: string | null;
  notes: string | null;

  is_active: boolean;
  created_at: string;
  updated_at: string;
  created_by: string | null;
  updated_by: string | null;
};

export type Application = {
  id: string;
  company_name: string;
  contact_name: string;
  email: string;
  phone: string;
  telegram?: string;
  whatsapp?: string;
  website: string;
  business_type: string;
  monthly_volume: string;
  description: string;
  status: 'pending' | 'approved' | 'rejected';
  reviewed_by?: string;
  reviewed_at?: string;
  notes?: string;
  created_at: string;
};

export type Merchant = {
  id: string;
  merchant_name: string;
  email: string;
  contact_person: string;
  phone: string | null;
  company_type: string | null;
  website: string | null;
  status: 'pending' | 'active' | 'suspended' | 'rejected';
  application_id: string | null;
  created_at: string;
  updated_at: string;
  onboarded_by: string | null;
};

export type MerchantCredential = {
  id: string;
  merchant_id: string;
  skyphoenix_merchant_id: string | null;
  api_key: string;
  api_secret: string;
  environment: 'dev' | 'production';
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type Transaction = {
  id: string;
  merchant_id: string;
  transaction_type: 'payin' | 'payout';
  skyphoenix_order_id: string | null;
  amount: number;
  currency: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  payment_method: string | null;
  customer_email: string | null;
  customer_name: string | null;
  callback_url: string | null;
  return_url: string | null;
  request_data: any;
  response_data: any;
  error_message: string | null;
  created_at: string;
  updated_at: string;
  completed_at: string | null;
};
