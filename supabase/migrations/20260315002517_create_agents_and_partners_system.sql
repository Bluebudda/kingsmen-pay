/*
  # Create Agents and Partners System

  1. New Tables
    - `agents`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `agent_code` (text, unique agent identifier)
      - `full_name` (text, agent name)
      - `email` (text, unique)
      - `phone` (text, contact number)
      - `commission_rate` (numeric, commission percentage)
      - `status` (text, active/inactive/suspended)
      - `territory` (text, assigned territory)
      - `total_referrals` (integer, count of referrals)
      - `total_earnings` (numeric, total earnings)
      - `created_at` (timestamptz, creation timestamp)
      - `updated_at` (timestamptz, update timestamp)

    - `partners`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `partner_code` (text, unique partner identifier)
      - `company_name` (text, partner company)
      - `full_name` (text, contact person name)
      - `email` (text, unique)
      - `phone` (text, contact number)
      - `partnership_type` (text, referral/reseller/integration)
      - `commission_rate` (numeric, commission percentage)
      - `status` (text, active/inactive/suspended)
      - `api_key` (text, API access key)
      - `total_referrals` (integer, count of referrals)
      - `total_earnings` (numeric, total earnings)
      - `created_at` (timestamptz, creation timestamp)
      - `updated_at` (timestamptz, update timestamp)

    - `referrals`
      - `id` (uuid, primary key)
      - `application_id` (uuid, foreign key to applications)
      - `referrer_type` (text, agent/partner)
      - `referrer_id` (uuid, foreign key to agents or partners)
      - `commission_amount` (numeric, commission earned)
      - `commission_paid` (boolean, payment status)
      - `created_at` (timestamptz, creation timestamp)

  2. Security
    - Enable RLS on all tables
    - Agents can only view their own data
    - Partners can only view their own data
    - Employees can view all agent/partner data

  3. Important Notes
    - Agents and partners have separate login flows
    - Commission tracking for referrals
    - API access for partners
*/

CREATE TABLE IF NOT EXISTS agents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  agent_code text UNIQUE NOT NULL,
  full_name text NOT NULL,
  email text UNIQUE NOT NULL,
  phone text,
  commission_rate numeric DEFAULT 0,
  status text NOT NULL DEFAULT 'active',
  territory text,
  total_referrals integer DEFAULT 0,
  total_earnings numeric DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS partners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  partner_code text UNIQUE NOT NULL,
  company_name text NOT NULL,
  full_name text NOT NULL,
  email text UNIQUE NOT NULL,
  phone text,
  partnership_type text NOT NULL DEFAULT 'referral',
  commission_rate numeric DEFAULT 0,
  status text NOT NULL DEFAULT 'active',
  api_key text,
  total_referrals integer DEFAULT 0,
  total_earnings numeric DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS referrals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id uuid REFERENCES applications(id) ON DELETE CASCADE,
  referrer_type text NOT NULL,
  referrer_id uuid NOT NULL,
  commission_amount numeric DEFAULT 0,
  commission_paid boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Agents can view own data"
  ON agents
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Agents can update own data"
  ON agents
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Employees can view all agents"
  ON agents
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM employees
      WHERE employees.user_id = auth.uid()
      AND employees.is_active = true
    )
  );

CREATE POLICY "Employees can manage agents"
  ON agents
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM employees
      WHERE employees.user_id = auth.uid()
      AND employees.is_active = true
    )
  );

CREATE POLICY "Partners can view own data"
  ON partners
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Partners can update own data"
  ON partners
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Employees can view all partners"
  ON partners
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM employees
      WHERE employees.user_id = auth.uid()
      AND employees.is_active = true
    )
  );

CREATE POLICY "Employees can manage partners"
  ON partners
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM employees
      WHERE employees.user_id = auth.uid()
      AND employees.is_active = true
    )
  );

CREATE POLICY "Agents can view own referrals"
  ON referrals
  FOR SELECT
  TO authenticated
  USING (
    referrer_type = 'agent' AND referrer_id IN (
      SELECT id FROM agents WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Partners can view own referrals"
  ON referrals
  FOR SELECT
  TO authenticated
  USING (
    referrer_type = 'partner' AND referrer_id IN (
      SELECT id FROM partners WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Employees can view all referrals"
  ON referrals
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM employees
      WHERE employees.user_id = auth.uid()
      AND employees.is_active = true
    )
  );

CREATE POLICY "Employees can manage referrals"
  ON referrals
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM employees
      WHERE employees.user_id = auth.uid()
      AND employees.is_active = true
    )
  );

CREATE INDEX IF NOT EXISTS idx_agents_user_id ON agents(user_id);
CREATE INDEX IF NOT EXISTS idx_agents_email ON agents(email);
CREATE INDEX IF NOT EXISTS idx_agents_agent_code ON agents(agent_code);
CREATE INDEX IF NOT EXISTS idx_agents_status ON agents(status);

CREATE INDEX IF NOT EXISTS idx_partners_user_id ON partners(user_id);
CREATE INDEX IF NOT EXISTS idx_partners_email ON partners(email);
CREATE INDEX IF NOT EXISTS idx_partners_partner_code ON partners(partner_code);
CREATE INDEX IF NOT EXISTS idx_partners_status ON partners(status);

CREATE INDEX IF NOT EXISTS idx_referrals_application ON referrals(application_id);
CREATE INDEX IF NOT EXISTS idx_referrals_referrer ON referrals(referrer_type, referrer_id);
