/*
  # Employee and Underwriting System

  ## Overview
  This migration creates a comprehensive employee management and underwriting system with three-tier rate structures.

  ## 1. New Tables

  ### employees
  - `id` (uuid, primary key) - Employee identifier
  - `user_id` (uuid, foreign key) - Links to auth.users
  - `email` (text, unique) - Employee email
  - `full_name` (text) - Employee full name
  - `role` (text) - Employee role (admin, manager, analyst, etc.)
  - `department` (text) - Department name
  - `is_active` (boolean) - Employment status
  - `created_at` (timestamptz) - Record creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### underwriting_services
  - `id` (uuid, primary key) - Service identifier
  - `service_name` (text, unique) - Name of the service/PSP
  - `description` (text) - Service description
  - `is_active` (boolean) - Service availability status
  - `created_at` (timestamptz) - Record creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp
  - `created_by` (uuid, foreign key) - Employee who created the record

  ### underwriting_rates
  - `id` (uuid, primary key) - Rate record identifier
  - `service_id` (uuid, foreign key) - Links to underwriting_services
  - `payment_method` (text) - Credit Card, ACH, SEPA, Wallet
  - `country` (text) - Country code or name
  - `payin_channel` (text) - Payment channel description
  - `business_category` (text) - IG, FX, or custom category
  - `traffic_type` (text) - FTD, Trusted, or custom type
  
  ### Cost Rates (Tier 1 - Our Cost)
  - `cost_payin_rate` (decimal) - Our cost for payin
  - `cost_payin_min` (decimal) - Minimum payin transaction cost
  - `cost_payin_max` (decimal) - Maximum payin transaction cost
  - `cost_payout_rate` (decimal) - Our cost for payout
  - `cost_payout_min` (decimal) - Minimum payout transaction cost
  - `cost_payout_max` (decimal) - Maximum payout transaction cost
  - `cost_settlement_fee` (decimal) - Settlement fee cost
  
  ### Buy Rates (Tier 2 - Partner Rates)
  - `buy_payin_rate` (decimal) - Rate offered to partners for payin
  - `buy_payin_min` (decimal) - Minimum payin per transaction for partners
  - `buy_payin_max` (decimal) - Maximum payin per transaction for partners
  - `buy_payout_rate` (decimal) - Rate offered to partners for payout
  - `buy_payout_min` (decimal) - Minimum payout per transaction for partners
  - `buy_payout_max` (decimal) - Maximum payout per transaction for partners
  - `buy_settlement_fee` (decimal) - Settlement fee for partners
  
  ### Merchant Rates (Tier 3 - Client Suggested Rates)
  - `merchant_payin_rate` (decimal) - Suggested rate for merchants for payin
  - `merchant_payin_min` (decimal) - Minimum payin per transaction for merchants
  - `merchant_payin_max` (decimal) - Maximum payin per transaction for merchants
  - `merchant_payout_rate` (decimal) - Suggested rate for merchants for payout
  - `merchant_payout_min` (decimal) - Minimum payout per transaction for merchants
  - `merchant_payout_max` (decimal) - Maximum payout per transaction for merchants
  - `merchant_settlement_fee` (decimal) - Settlement fee for merchants
  
  ### Additional Fields
  - `success_rate` (decimal) - Success rate percentage
  - `settlement_time` (text) - T0, T+1, T+2, etc.
  - `rolling_reserve` (text) - Rolling reserve information
  - `country_restrictions` (text) - Restricted countries
  - `notes` (text) - Additional notes
  - `is_active` (boolean) - Rate availability status
  - `created_at` (timestamptz) - Record creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp
  - `created_by` (uuid, foreign key) - Employee who created the record
  - `updated_by` (uuid, foreign key) - Employee who last updated the record

  ## 2. Security
  - Enable RLS on all tables
  - Employees can only be managed by authenticated users
  - Only active employees can access underwriting data
  - Rate data requires authentication to view and modify

  ## 3. Important Notes
  - Three-tier rate structure: Cost (our cost), Buy (partner rates), Merchant (client rates)
  - All monetary values stored as decimal for precision
  - Timestamps automatically managed with triggers
  - Employee roles can be extended as needed
  - Business categories and traffic types allow custom values
*/

-- Create employees table
CREATE TABLE IF NOT EXISTS employees (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text NOT NULL,
  role text NOT NULL DEFAULT 'analyst',
  department text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create underwriting_services table
CREATE TABLE IF NOT EXISTS underwriting_services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_name text UNIQUE NOT NULL,
  description text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES employees(id)
);

-- Create underwriting_rates table with three-tier rate structure
CREATE TABLE IF NOT EXISTS underwriting_rates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id uuid REFERENCES underwriting_services(id) ON DELETE CASCADE NOT NULL,
  
  -- Classification fields
  payment_method text NOT NULL,
  country text NOT NULL,
  payin_channel text,
  business_category text,
  traffic_type text,
  
  -- Tier 1: Cost Rates (Our Cost)
  cost_payin_rate decimal(10,4),
  cost_payin_min decimal(15,2),
  cost_payin_max decimal(15,2),
  cost_payout_rate decimal(10,4),
  cost_payout_min decimal(15,2),
  cost_payout_max decimal(15,2),
  cost_settlement_fee decimal(15,2),
  
  -- Tier 2: Buy Rates (Partner Rates)
  buy_payin_rate decimal(10,4),
  buy_payin_min decimal(15,2),
  buy_payin_max decimal(15,2),
  buy_payout_rate decimal(10,4),
  buy_payout_min decimal(15,2),
  buy_payout_max decimal(15,2),
  buy_settlement_fee decimal(15,2),
  
  -- Tier 3: Merchant Rates (Client Suggested Rates)
  merchant_payin_rate decimal(10,4),
  merchant_payin_min decimal(15,2),
  merchant_payin_max decimal(15,2),
  merchant_payout_rate decimal(10,4),
  merchant_payout_min decimal(15,2),
  merchant_payout_max decimal(15,2),
  merchant_settlement_fee decimal(15,2),
  
  -- Additional fields
  success_rate decimal(5,2),
  settlement_time text,
  rolling_reserve text,
  country_restrictions text,
  notes text,
  
  -- Metadata
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES employees(id),
  updated_by uuid REFERENCES employees(id)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_employees_user_id ON employees(user_id);
CREATE INDEX IF NOT EXISTS idx_employees_email ON employees(email);
CREATE INDEX IF NOT EXISTS idx_employees_is_active ON employees(is_active);

CREATE INDEX IF NOT EXISTS idx_underwriting_services_name ON underwriting_services(service_name);
CREATE INDEX IF NOT EXISTS idx_underwriting_services_active ON underwriting_services(is_active);

CREATE INDEX IF NOT EXISTS idx_underwriting_rates_service_id ON underwriting_rates(service_id);
CREATE INDEX IF NOT EXISTS idx_underwriting_rates_payment_method ON underwriting_rates(payment_method);
CREATE INDEX IF NOT EXISTS idx_underwriting_rates_country ON underwriting_rates(country);
CREATE INDEX IF NOT EXISTS idx_underwriting_rates_business_category ON underwriting_rates(business_category);
CREATE INDEX IF NOT EXISTS idx_underwriting_rates_active ON underwriting_rates(is_active);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
DROP TRIGGER IF EXISTS update_employees_updated_at ON employees;
CREATE TRIGGER update_employees_updated_at
  BEFORE UPDATE ON employees
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_underwriting_services_updated_at ON underwriting_services;
CREATE TRIGGER update_underwriting_services_updated_at
  BEFORE UPDATE ON underwriting_services
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_underwriting_rates_updated_at ON underwriting_rates;
CREATE TRIGGER update_underwriting_rates_updated_at
  BEFORE UPDATE ON underwriting_rates
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE underwriting_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE underwriting_rates ENABLE ROW LEVEL SECURITY;

-- RLS Policies for employees table
CREATE POLICY "Authenticated users can view employees"
  ON employees FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert employees"
  ON employees FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Employees can update own record"
  ON employees FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admin employees can update any employee"
  ON employees FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM employees
      WHERE employees.user_id = auth.uid()
      AND employees.role = 'admin'
      AND employees.is_active = true
    )
  );

-- RLS Policies for underwriting_services table
CREATE POLICY "Active employees can view services"
  ON underwriting_services FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM employees
      WHERE employees.user_id = auth.uid()
      AND employees.is_active = true
    )
  );

CREATE POLICY "Active employees can insert services"
  ON underwriting_services FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM employees
      WHERE employees.user_id = auth.uid()
      AND employees.is_active = true
    )
  );

CREATE POLICY "Active employees can update services"
  ON underwriting_services FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM employees
      WHERE employees.user_id = auth.uid()
      AND employees.is_active = true
    )
  );

CREATE POLICY "Admin employees can delete services"
  ON underwriting_services FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM employees
      WHERE employees.user_id = auth.uid()
      AND employees.role = 'admin'
      AND employees.is_active = true
    )
  );

-- RLS Policies for underwriting_rates table
CREATE POLICY "Active employees can view rates"
  ON underwriting_rates FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM employees
      WHERE employees.user_id = auth.uid()
      AND employees.is_active = true
    )
  );

CREATE POLICY "Active employees can insert rates"
  ON underwriting_rates FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM employees
      WHERE employees.user_id = auth.uid()
      AND employees.is_active = true
    )
  );

CREATE POLICY "Active employees can update rates"
  ON underwriting_rates FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM employees
      WHERE employees.user_id = auth.uid()
      AND employees.is_active = true
    )
  );

CREATE POLICY "Admin employees can delete rates"
  ON underwriting_rates FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM employees
      WHERE employees.user_id = auth.uid()
      AND employees.role = 'admin'
      AND employees.is_active = true
    )
  );