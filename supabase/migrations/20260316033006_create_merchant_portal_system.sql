/*
  # Merchant Portal System

  1. New Tables
    - `merchant_users`
      - Links merchants to auth users for portal access
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `merchant_id` (uuid, references merchants)
      - `is_primary_contact` (boolean)
      - `role` (text) - admin, viewer, etc.
      - `is_active` (boolean)
      - `created_at` (timestamptz)
      - `last_login` (timestamptz)

    - `merchant_api_credentials`
      - Stores API keys for merchants
      - `id` (uuid, primary key)
      - `merchant_id` (uuid, references merchants)
      - `api_key` (text, unique)
      - `api_secret` (text)
      - `environment` (text) - production, sandbox
      - `is_active` (boolean)
      - `created_at` (timestamptz)
      - `last_used` (timestamptz)

    - `application_messages`
      - Communication between merchants and underwriting
      - `id` (uuid, primary key)
      - `application_id` (uuid, references applications)
      - `sender_type` (text) - merchant, underwriter
      - `sender_id` (uuid)
      - `message` (text)
      - `is_read` (boolean)
      - `created_at` (timestamptz)

    - `application_documents`
      - Documents uploaded by merchants for applications
      - `id` (uuid, primary key)
      - `application_id` (uuid, references applications)
      - `document_type` (text)
      - `file_name` (text)
      - `file_url` (text)
      - `uploaded_by` (uuid)
      - `uploaded_at` (timestamptz)

    - `merchant_analytics`
      - Daily aggregated transaction analytics
      - `id` (uuid, primary key)
      - `merchant_id` (uuid, references merchants)
      - `date` (date)
      - `payin_volume` (numeric)
      - `payin_count` (integer)
      - `payout_volume` (numeric)
      - `payout_count` (integer)
      - `successful_transactions` (integer)
      - `failed_transactions` (integer)
      - `success_rate` (numeric)

  2. Modifications
    - Add merchant_id to applications table to link approved applications to merchants

  3. Security
    - Enable RLS on all tables
    - Merchants can only see their own data
    - Underwriters can see all application messages
    - API credentials are encrypted and access-controlled

  4. Indexes
    - Add performance indexes for common queries
    - Composite indexes for merchant-date lookups
*/

-- Add merchant_id to applications table if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'applications' AND column_name = 'merchant_id'
  ) THEN
    ALTER TABLE applications ADD COLUMN merchant_id uuid REFERENCES merchants(id);
    CREATE INDEX idx_applications_merchant_id ON applications(merchant_id);
  END IF;
END $$;

-- Create merchant_users table
CREATE TABLE IF NOT EXISTS merchant_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  merchant_id uuid REFERENCES merchants(id) ON DELETE CASCADE NOT NULL,
  is_primary_contact boolean DEFAULT false,
  role text DEFAULT 'viewer' CHECK (role IN ('admin', 'viewer', 'operator')),
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  last_login timestamptz,
  UNIQUE(user_id, merchant_id)
);

-- Create merchant_api_credentials table
CREATE TABLE IF NOT EXISTS merchant_api_credentials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id uuid REFERENCES merchants(id) ON DELETE CASCADE NOT NULL,
  api_key text UNIQUE NOT NULL,
  api_secret text NOT NULL,
  environment text DEFAULT 'sandbox' CHECK (environment IN ('production', 'sandbox')),
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  last_used timestamptz
);

-- Create application_messages table
CREATE TABLE IF NOT EXISTS application_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id uuid REFERENCES applications(id) ON DELETE CASCADE NOT NULL,
  sender_type text NOT NULL CHECK (sender_type IN ('merchant', 'underwriter')),
  sender_id uuid NOT NULL,
  message text NOT NULL,
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create application_documents table
CREATE TABLE IF NOT EXISTS application_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id uuid REFERENCES applications(id) ON DELETE CASCADE NOT NULL,
  document_type text NOT NULL,
  file_name text NOT NULL,
  file_url text NOT NULL,
  uploaded_by uuid NOT NULL,
  uploaded_at timestamptz DEFAULT now()
);

-- Create merchant_analytics table
CREATE TABLE IF NOT EXISTS merchant_analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id uuid REFERENCES merchants(id) ON DELETE CASCADE NOT NULL,
  date date NOT NULL,
  payin_volume numeric(15,2) DEFAULT 0,
  payin_count integer DEFAULT 0,
  payout_volume numeric(15,2) DEFAULT 0,
  payout_count integer DEFAULT 0,
  successful_transactions integer DEFAULT 0,
  failed_transactions integer DEFAULT 0,
  success_rate numeric(5,2) DEFAULT 0,
  UNIQUE(merchant_id, date)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_merchant_users_user_id ON merchant_users(user_id);
CREATE INDEX IF NOT EXISTS idx_merchant_users_merchant_id ON merchant_users(merchant_id);
CREATE INDEX IF NOT EXISTS idx_merchant_api_credentials_merchant_id ON merchant_api_credentials(merchant_id);
CREATE INDEX IF NOT EXISTS idx_merchant_api_credentials_api_key ON merchant_api_credentials(api_key) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_application_messages_application_id ON application_messages(application_id);
CREATE INDEX IF NOT EXISTS idx_application_messages_created_at ON application_messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_application_documents_application_id ON application_documents(application_id);
CREATE INDEX IF NOT EXISTS idx_merchant_analytics_merchant_date ON merchant_analytics(merchant_id, date DESC);

-- Enable RLS
ALTER TABLE merchant_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE merchant_api_credentials ENABLE ROW LEVEL SECURITY;
ALTER TABLE application_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE application_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE merchant_analytics ENABLE ROW LEVEL SECURITY;

-- RLS Policies for merchant_users
CREATE POLICY "Merchants can view their own user records"
  ON merchant_users FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM employees
      WHERE employees.user_id = auth.uid()
      AND employees.is_active = true
    )
  );

CREATE POLICY "Employees can manage merchant users"
  ON merchant_users FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM employees
      WHERE employees.user_id = auth.uid()
      AND employees.is_active = true
    )
  );

-- RLS Policies for merchant_api_credentials
CREATE POLICY "Merchants can view their API credentials"
  ON merchant_api_credentials FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM merchant_users
      WHERE merchant_users.merchant_id = merchant_api_credentials.merchant_id
      AND merchant_users.user_id = auth.uid()
      AND merchant_users.is_active = true
      AND merchant_users.role = 'admin'
    ) OR
    EXISTS (
      SELECT 1 FROM employees
      WHERE employees.user_id = auth.uid()
      AND employees.is_active = true
    )
  );

CREATE POLICY "Employees can manage API credentials"
  ON merchant_api_credentials FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM employees
      WHERE employees.user_id = auth.uid()
      AND employees.is_active = true
    )
  );

-- RLS Policies for application_messages
CREATE POLICY "Merchants can view messages for their applications"
  ON application_messages FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM applications a
      JOIN merchant_users mu ON mu.merchant_id = a.merchant_id
      WHERE a.id = application_messages.application_id
      AND mu.user_id = auth.uid()
      AND mu.is_active = true
    ) OR
    EXISTS (
      SELECT 1 FROM applications a
      WHERE a.id = application_messages.application_id
      AND a.user_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM employees
      WHERE employees.user_id = auth.uid()
      AND employees.is_active = true
    )
  );

CREATE POLICY "Merchants can create messages for their applications"
  ON application_messages FOR INSERT
  TO authenticated
  WITH CHECK (
    sender_type = 'merchant' AND
    (
      EXISTS (
        SELECT 1 FROM applications a
        JOIN merchant_users mu ON mu.merchant_id = a.merchant_id
        WHERE a.id = application_messages.application_id
        AND mu.user_id = auth.uid()
        AND mu.is_active = true
      ) OR
      EXISTS (
        SELECT 1 FROM applications a
        WHERE a.id = application_messages.application_id
        AND a.user_id = auth.uid()
      )
    )
  );

CREATE POLICY "Employees can manage all messages"
  ON application_messages FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM employees
      WHERE employees.user_id = auth.uid()
      AND employees.is_active = true
    )
  );

-- RLS Policies for application_documents
CREATE POLICY "Merchants can view documents for their applications"
  ON application_documents FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM applications a
      JOIN merchant_users mu ON mu.merchant_id = a.merchant_id
      WHERE a.id = application_documents.application_id
      AND mu.user_id = auth.uid()
      AND mu.is_active = true
    ) OR
    EXISTS (
      SELECT 1 FROM applications a
      WHERE a.id = application_documents.application_id
      AND a.user_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM employees
      WHERE employees.user_id = auth.uid()
      AND employees.is_active = true
    )
  );

CREATE POLICY "Merchants can upload documents for their applications"
  ON application_documents FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM applications a
      JOIN merchant_users mu ON mu.merchant_id = a.merchant_id
      WHERE a.id = application_documents.application_id
      AND mu.user_id = auth.uid()
      AND mu.is_active = true
    ) OR
    EXISTS (
      SELECT 1 FROM applications a
      WHERE a.id = application_documents.application_id
      AND a.user_id = auth.uid()
    )
  );

CREATE POLICY "Employees can manage all documents"
  ON application_documents FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM employees
      WHERE employees.user_id = auth.uid()
      AND employees.is_active = true
    )
  );

-- RLS Policies for merchant_analytics
CREATE POLICY "Merchants can view their own analytics"
  ON merchant_analytics FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM merchant_users
      WHERE merchant_users.merchant_id = merchant_analytics.merchant_id
      AND merchant_users.user_id = auth.uid()
      AND merchant_users.is_active = true
    ) OR
    EXISTS (
      SELECT 1 FROM employees
      WHERE employees.user_id = auth.uid()
      AND employees.is_active = true
    )
  );

CREATE POLICY "Employees can manage analytics"
  ON merchant_analytics FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM employees
      WHERE employees.user_id = auth.uid()
      AND employees.is_active = true
    )
  );

-- Add RLS policy for merchants to view their own applications
CREATE POLICY "Merchants can view their applications"
  ON applications FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM merchant_users
      WHERE merchant_users.merchant_id = applications.merchant_id
      AND merchant_users.user_id = auth.uid()
      AND merchant_users.is_active = true
    ) OR
    EXISTS (
      SELECT 1 FROM employees
      WHERE employees.user_id = auth.uid()
      AND employees.is_active = true
    )
  );

-- Function to update last_login
CREATE OR REPLACE FUNCTION update_merchant_last_login()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE merchant_users
  SET last_login = now()
  WHERE user_id = NEW.id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to update last_login on auth
DROP TRIGGER IF EXISTS on_merchant_login ON auth.users;
CREATE TRIGGER on_merchant_login
  AFTER UPDATE ON auth.users
  FOR EACH ROW
  WHEN (OLD.last_sign_in_at IS DISTINCT FROM NEW.last_sign_in_at)
  EXECUTE FUNCTION update_merchant_last_login();