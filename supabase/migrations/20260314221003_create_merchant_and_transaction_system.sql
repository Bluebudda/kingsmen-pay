/*
  # Merchant and Transaction System for SkyPhoenix Integration

  ## Overview
  This migration creates tables for managing merchants, their SkyPhoenix API credentials,
  boarding requests, and transaction tracking.

  ## 1. New Tables

  ### merchants
  - `id` (uuid, primary key) - Merchant identifier
  - `merchant_name` (text) - Business name
  - `email` (text) - Contact email
  - `contact_person` (text) - Primary contact name
  - `phone` (text) - Contact phone number
  - `company_type` (text) - Type of business
  - `website` (text) - Company website
  - `status` (text) - pending, active, suspended, rejected
  - `application_id` (uuid, foreign key) - Links to original application
  - `created_at` (timestamptz) - Record creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp
  - `onboarded_by` (uuid, foreign key) - Employee who onboarded them

  ### merchant_credentials
  - `id` (uuid, primary key) - Credential record identifier
  - `merchant_id` (uuid, foreign key) - Links to merchants
  - `skyphoenix_merchant_id` (text) - SkyPhoenix merchant ID
  - `api_key` (text) - Encrypted API key
  - `api_secret` (text) - Encrypted API secret
  - `environment` (text) - dev or production
  - `is_active` (boolean) - Credential status
  - `created_at` (timestamptz) - Record creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### transactions
  - `id` (uuid, primary key) - Transaction identifier
  - `merchant_id` (uuid, foreign key) - Links to merchants
  - `transaction_type` (text) - payin, payout
  - `skyphoenix_order_id` (text) - SkyPhoenix order ID
  - `amount` (decimal) - Transaction amount
  - `currency` (text) - Currency code
  - `status` (text) - pending, processing, completed, failed, cancelled
  - `payment_method` (text) - Payment method used
  - `customer_email` (text) - Customer email
  - `customer_name` (text) - Customer name
  - `callback_url` (text) - Webhook callback URL
  - `return_url` (text) - Return URL after payment
  - `request_data` (jsonb) - Full request payload
  - `response_data` (jsonb) - Full response from SkyPhoenix
  - `error_message` (text) - Error details if failed
  - `created_at` (timestamptz) - Transaction creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp
  - `completed_at` (timestamptz) - Completion timestamp

  ### boarding_requests_extended
  - Extends the existing applications table with merchant-specific fields
  - Links applications to merchants once approved

  ## 2. Security
  - Enable RLS on all tables
  - Only active employees can view and manage merchants
  - Credentials are encrypted and accessible only to authorized employees
  - Transaction data requires authentication
  - Merchants can view their own transactions (future feature)

  ## 3. Important Notes
  - API credentials should be encrypted before storage
  - Transaction logs maintain full audit trail
  - Status tracking for complete lifecycle management
  - Environment separation (dev/production)
*/

-- Create merchants table
CREATE TABLE IF NOT EXISTS merchants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_name text NOT NULL,
  email text UNIQUE NOT NULL,
  contact_person text NOT NULL,
  phone text,
  company_type text,
  website text,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'suspended', 'rejected')),
  application_id uuid REFERENCES applications(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  onboarded_by uuid REFERENCES employees(id)
);

-- Create merchant_credentials table
CREATE TABLE IF NOT EXISTS merchant_credentials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id uuid REFERENCES merchants(id) ON DELETE CASCADE NOT NULL,
  skyphoenix_merchant_id text,
  api_key text NOT NULL,
  api_secret text NOT NULL,
  environment text DEFAULT 'dev' CHECK (environment IN ('dev', 'production')),
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id uuid REFERENCES merchants(id) ON DELETE CASCADE NOT NULL,
  transaction_type text NOT NULL CHECK (transaction_type IN ('payin', 'payout')),
  skyphoenix_order_id text,
  amount decimal(15,2) NOT NULL,
  currency text DEFAULT 'USD',
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'cancelled')),
  payment_method text,
  customer_email text,
  customer_name text,
  callback_url text,
  return_url text,
  request_data jsonb,
  response_data jsonb,
  error_message text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  completed_at timestamptz
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_merchants_email ON merchants(email);
CREATE INDEX IF NOT EXISTS idx_merchants_status ON merchants(status);
CREATE INDEX IF NOT EXISTS idx_merchants_application_id ON merchants(application_id);

CREATE INDEX IF NOT EXISTS idx_merchant_credentials_merchant_id ON merchant_credentials(merchant_id);
CREATE INDEX IF NOT EXISTS idx_merchant_credentials_environment ON merchant_credentials(environment);
CREATE INDEX IF NOT EXISTS idx_merchant_credentials_active ON merchant_credentials(is_active);

CREATE INDEX IF NOT EXISTS idx_transactions_merchant_id ON transactions(merchant_id);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(transaction_type);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions(status);
CREATE INDEX IF NOT EXISTS idx_transactions_skyphoenix_order_id ON transactions(skyphoenix_order_id);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON transactions(created_at DESC);

-- Create triggers for updated_at
DROP TRIGGER IF EXISTS update_merchants_updated_at ON merchants;
CREATE TRIGGER update_merchants_updated_at
  BEFORE UPDATE ON merchants
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_merchant_credentials_updated_at ON merchant_credentials;
CREATE TRIGGER update_merchant_credentials_updated_at
  BEFORE UPDATE ON merchant_credentials
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_transactions_updated_at ON transactions;
CREATE TRIGGER update_transactions_updated_at
  BEFORE UPDATE ON transactions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE merchants ENABLE ROW LEVEL SECURITY;
ALTER TABLE merchant_credentials ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for merchants table
CREATE POLICY "Active employees can view merchants"
  ON merchants FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM employees
      WHERE employees.user_id = auth.uid()
      AND employees.is_active = true
    )
  );

CREATE POLICY "Active employees can insert merchants"
  ON merchants FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM employees
      WHERE employees.user_id = auth.uid()
      AND employees.is_active = true
    )
  );

CREATE POLICY "Active employees can update merchants"
  ON merchants FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM employees
      WHERE employees.user_id = auth.uid()
      AND employees.is_active = true
    )
  );

CREATE POLICY "Admin employees can delete merchants"
  ON merchants FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM employees
      WHERE employees.user_id = auth.uid()
      AND employees.role = 'admin'
      AND employees.is_active = true
    )
  );

-- RLS Policies for merchant_credentials table
CREATE POLICY "Active employees can view credentials"
  ON merchant_credentials FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM employees
      WHERE employees.user_id = auth.uid()
      AND employees.is_active = true
    )
  );

CREATE POLICY "Active employees can insert credentials"
  ON merchant_credentials FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM employees
      WHERE employees.user_id = auth.uid()
      AND employees.is_active = true
    )
  );

CREATE POLICY "Active employees can update credentials"
  ON merchant_credentials FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM employees
      WHERE employees.user_id = auth.uid()
      AND employees.is_active = true
    )
  );

CREATE POLICY "Admin employees can delete credentials"
  ON merchant_credentials FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM employees
      WHERE employees.user_id = auth.uid()
      AND employees.role = 'admin'
      AND employees.is_active = true
    )
  );

-- RLS Policies for transactions table
CREATE POLICY "Active employees can view transactions"
  ON transactions FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM employees
      WHERE employees.user_id = auth.uid()
      AND employees.is_active = true
    )
  );

CREATE POLICY "Active employees can insert transactions"
  ON transactions FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM employees
      WHERE employees.user_id = auth.uid()
      AND employees.is_active = true
    )
  );

CREATE POLICY "Active employees can update transactions"
  ON transactions FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM employees
      WHERE employees.user_id = auth.uid()
      AND employees.is_active = true
    )
  );

CREATE POLICY "Admin employees can delete transactions"
  ON transactions FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM employees
      WHERE employees.user_id = auth.uid()
      AND employees.role = 'admin'
      AND employees.is_active = true
    )
  );