/*
  # Create Comprehensive Underwriting System with KYC, KYB, and UBO

  ## 1. New Tables
  
  ### `kyc_verifications`
  - Complete KYC (Know Your Customer) verification records
  - Links to applications and employees
  - Tracks verification status and results
  - Stores personal identification information
  - Document references and verification notes
  
  ### `kyc_documents`
  - Individual document uploads for KYC
  - Multiple document types per verification
  - File metadata and verification status
  - Links to storage bucket
  
  ### `kyb_verifications`
  - Complete KYB (Know Your Business) verification records
  - Business entity verification
  - Registration and licensing information
  - Business structure and ownership details
  
  ### `kyb_documents`
  - Business-related document uploads
  - Articles of incorporation, licenses, etc.
  - Tax documents and financial statements
  
  ### `ubo_records`
  - Ultimate Beneficial Owner records
  - Individual ownership percentages
  - Personal information and verification
  - Links to both KYB and individual KYC
  
  ### `ubo_documents`
  - UBO-specific documentation
  - Proof of ownership and control
  - Identity verification documents
  
  ### `underwriting_reviews`
  - Employee review and approval workflow
  - Decision tracking and history
  - Risk assessment and scoring
  - Comments and internal notes
  
  ### `underwriting_checklists`
  - Configurable verification checklists
  - Track completion of required items
  - Department-specific requirements
  
  ## 2. Enums
  - Verification statuses
  - Document types
  - Review decisions
  - Risk levels
  
  ## 3. Security
  - Enable RLS on all tables
  - Policies for employee access based on role
  - Protect sensitive PII data
  - Audit trail for all changes
*/

-- Create enums for verification statuses
CREATE TYPE verification_status AS ENUM (
  'pending',
  'in_progress',
  'submitted',
  'under_review',
  'additional_info_required',
  'approved',
  'rejected',
  'expired'
);

CREATE TYPE document_type AS ENUM (
  'passport',
  'drivers_license',
  'national_id',
  'utility_bill',
  'bank_statement',
  'articles_of_incorporation',
  'business_license',
  'tax_certificate',
  'financial_statement',
  'proof_of_address',
  'board_resolution',
  'shareholder_agreement',
  'ubo_declaration',
  'other'
);

CREATE TYPE review_decision AS ENUM (
  'pending',
  'approved',
  'rejected',
  'needs_clarification',
  'escalated'
);

CREATE TYPE risk_level AS ENUM (
  'low',
  'medium',
  'high',
  'critical'
);

CREATE TYPE business_type AS ENUM (
  'sole_proprietorship',
  'partnership',
  'llc',
  'corporation',
  'non_profit',
  'trust',
  'other'
);

-- KYC Verifications Table
CREATE TABLE IF NOT EXISTS kyc_verifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id uuid REFERENCES applications(id) ON DELETE CASCADE,
  assigned_to uuid REFERENCES employees(id),
  status verification_status DEFAULT 'pending',
  
  -- Personal Information
  first_name text NOT NULL,
  middle_name text,
  last_name text NOT NULL,
  date_of_birth date NOT NULL,
  nationality text,
  country_of_residence text,
  
  -- Contact Information
  email text NOT NULL,
  phone text NOT NULL,
  address_line1 text NOT NULL,
  address_line2 text,
  city text NOT NULL,
  state_province text,
  postal_code text NOT NULL,
  country text NOT NULL,
  
  -- Identification
  id_type text,
  id_number text,
  id_expiry_date date,
  id_issuing_country text,
  
  -- Risk Assessment
  risk_level risk_level DEFAULT 'medium',
  risk_notes text,
  
  -- PEP/Sanctions Screening
  is_pep boolean DEFAULT false,
  pep_details text,
  sanctions_screening_result text,
  sanctions_screening_date timestamptz,
  
  -- Verification Results
  identity_verified boolean DEFAULT false,
  address_verified boolean DEFAULT false,
  documents_verified boolean DEFAULT false,
  screening_passed boolean DEFAULT false,
  
  -- Notes and Comments
  internal_notes text,
  rejection_reason text,
  
  -- Metadata
  submitted_at timestamptz,
  reviewed_at timestamptz,
  approved_at timestamptz,
  expires_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES employees(id),
  updated_by uuid REFERENCES employees(id)
);

-- KYC Documents Table
CREATE TABLE IF NOT EXISTS kyc_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kyc_verification_id uuid REFERENCES kyc_verifications(id) ON DELETE CASCADE NOT NULL,
  document_type document_type NOT NULL,
  document_name text NOT NULL,
  file_path text NOT NULL,
  file_size bigint,
  mime_type text,
  
  -- Verification
  is_verified boolean DEFAULT false,
  verified_by uuid REFERENCES employees(id),
  verified_at timestamptz,
  verification_notes text,
  
  -- Metadata
  uploaded_at timestamptz DEFAULT now(),
  uploaded_by uuid REFERENCES employees(id)
);

-- KYB Verifications Table
CREATE TABLE IF NOT EXISTS kyb_verifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id uuid REFERENCES applications(id) ON DELETE CASCADE,
  assigned_to uuid REFERENCES employees(id),
  status verification_status DEFAULT 'pending',
  
  -- Business Information
  legal_business_name text NOT NULL,
  trade_name text,
  business_type business_type NOT NULL,
  registration_number text,
  tax_id text,
  incorporation_date date,
  incorporation_country text NOT NULL,
  
  -- Business Address
  business_address_line1 text NOT NULL,
  business_address_line2 text,
  business_city text NOT NULL,
  business_state_province text,
  business_postal_code text NOT NULL,
  business_country text NOT NULL,
  
  -- Contact Information
  business_email text NOT NULL,
  business_phone text NOT NULL,
  website text,
  
  -- Industry and Activity
  industry_sector text,
  business_description text,
  annual_revenue_range text,
  number_of_employees integer,
  
  -- Regulatory Information
  regulated_entity boolean DEFAULT false,
  regulatory_body text,
  license_numbers text[],
  
  -- Risk Assessment
  risk_level risk_level DEFAULT 'medium',
  risk_notes text,
  
  -- Verification Results
  business_verified boolean DEFAULT false,
  documents_verified boolean DEFAULT false,
  ownership_verified boolean DEFAULT false,
  regulatory_check_passed boolean DEFAULT false,
  
  -- Notes
  internal_notes text,
  rejection_reason text,
  
  -- Metadata
  submitted_at timestamptz,
  reviewed_at timestamptz,
  approved_at timestamptz,
  expires_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES employees(id),
  updated_by uuid REFERENCES employees(id)
);

-- KYB Documents Table
CREATE TABLE IF NOT EXISTS kyb_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kyb_verification_id uuid REFERENCES kyb_verifications(id) ON DELETE CASCADE NOT NULL,
  document_type document_type NOT NULL,
  document_name text NOT NULL,
  file_path text NOT NULL,
  file_size bigint,
  mime_type text,
  
  -- Verification
  is_verified boolean DEFAULT false,
  verified_by uuid REFERENCES employees(id),
  verified_at timestamptz,
  verification_notes text,
  
  -- Metadata
  uploaded_at timestamptz DEFAULT now(),
  uploaded_by uuid REFERENCES employees(id)
);

-- UBO Records Table
CREATE TABLE IF NOT EXISTS ubo_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kyb_verification_id uuid REFERENCES kyb_verifications(id) ON DELETE CASCADE NOT NULL,
  kyc_verification_id uuid REFERENCES kyc_verifications(id),
  
  -- Personal Information
  first_name text NOT NULL,
  middle_name text,
  last_name text NOT NULL,
  date_of_birth date NOT NULL,
  nationality text NOT NULL,
  
  -- Contact Information
  email text,
  phone text,
  residential_address text,
  country_of_residence text,
  
  -- Ownership Information
  ownership_percentage numeric(5,2) NOT NULL CHECK (ownership_percentage >= 0 AND ownership_percentage <= 100),
  ownership_type text,
  control_type text[],
  is_direct_owner boolean DEFAULT true,
  
  -- Identification
  id_type text,
  id_number text,
  id_expiry_date date,
  id_issuing_country text,
  
  -- PEP/Sanctions
  is_pep boolean DEFAULT false,
  pep_details text,
  sanctions_screening_result text,
  sanctions_screening_date timestamptz,
  
  -- Verification
  is_verified boolean DEFAULT false,
  verified_by uuid REFERENCES employees(id),
  verified_at timestamptz,
  verification_notes text,
  
  -- Metadata
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES employees(id)
);

-- UBO Documents Table
CREATE TABLE IF NOT EXISTS ubo_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ubo_record_id uuid REFERENCES ubo_records(id) ON DELETE CASCADE NOT NULL,
  document_type document_type NOT NULL,
  document_name text NOT NULL,
  file_path text NOT NULL,
  file_size bigint,
  mime_type text,
  
  -- Verification
  is_verified boolean DEFAULT false,
  verified_by uuid REFERENCES employees(id),
  verified_at timestamptz,
  verification_notes text,
  
  -- Metadata
  uploaded_at timestamptz DEFAULT now(),
  uploaded_by uuid REFERENCES employees(id)
);

-- Underwriting Reviews Table
CREATE TABLE IF NOT EXISTS underwriting_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id uuid REFERENCES applications(id) ON DELETE CASCADE NOT NULL,
  kyc_verification_id uuid REFERENCES kyc_verifications(id),
  kyb_verification_id uuid REFERENCES kyb_verifications(id),
  
  reviewer_id uuid REFERENCES employees(id) NOT NULL,
  review_type text NOT NULL,
  decision review_decision DEFAULT 'pending',
  
  -- Risk Assessment
  overall_risk_level risk_level,
  risk_score numeric(5,2),
  risk_factors text[],
  
  -- Review Details
  review_notes text,
  recommendations text,
  conditions text[],
  
  -- Checklist Completion
  checklist_completed boolean DEFAULT false,
  checklist_items jsonb,
  
  -- Decision Information
  approved_limits jsonb,
  approved_terms jsonb,
  rejection_reasons text[],
  
  -- Escalation
  escalated boolean DEFAULT false,
  escalated_to uuid REFERENCES employees(id),
  escalation_reason text,
  escalation_date timestamptz,
  
  -- Metadata
  started_at timestamptz DEFAULT now(),
  completed_at timestamptz,
  decision_date timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Underwriting Checklists Table
CREATE TABLE IF NOT EXISTS underwriting_checklists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  review_id uuid REFERENCES underwriting_reviews(id) ON DELETE CASCADE NOT NULL,
  
  item_name text NOT NULL,
  item_description text,
  item_category text,
  is_required boolean DEFAULT true,
  is_completed boolean DEFAULT false,
  
  completed_by uuid REFERENCES employees(id),
  completed_at timestamptz,
  notes text,
  
  -- Metadata
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_kyc_verifications_application ON kyc_verifications(application_id);
CREATE INDEX IF NOT EXISTS idx_kyc_verifications_status ON kyc_verifications(status);
CREATE INDEX IF NOT EXISTS idx_kyc_verifications_assigned ON kyc_verifications(assigned_to);
CREATE INDEX IF NOT EXISTS idx_kyc_documents_verification ON kyc_documents(kyc_verification_id);

CREATE INDEX IF NOT EXISTS idx_kyb_verifications_application ON kyb_verifications(application_id);
CREATE INDEX IF NOT EXISTS idx_kyb_verifications_status ON kyb_verifications(status);
CREATE INDEX IF NOT EXISTS idx_kyb_verifications_assigned ON kyb_verifications(assigned_to);
CREATE INDEX IF NOT EXISTS idx_kyb_documents_verification ON kyb_documents(kyb_verification_id);

CREATE INDEX IF NOT EXISTS idx_ubo_records_kyb ON ubo_records(kyb_verification_id);
CREATE INDEX IF NOT EXISTS idx_ubo_records_kyc ON ubo_records(kyc_verification_id);
CREATE INDEX IF NOT EXISTS idx_ubo_documents_ubo ON ubo_documents(ubo_record_id);

CREATE INDEX IF NOT EXISTS idx_underwriting_reviews_application ON underwriting_reviews(application_id);
CREATE INDEX IF NOT EXISTS idx_underwriting_reviews_reviewer ON underwriting_reviews(reviewer_id);
CREATE INDEX IF NOT EXISTS idx_underwriting_reviews_decision ON underwriting_reviews(decision);
CREATE INDEX IF NOT EXISTS idx_underwriting_checklists_review ON underwriting_checklists(review_id);

-- Enable Row Level Security
ALTER TABLE kyc_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE kyc_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE kyb_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE kyb_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE ubo_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE ubo_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE underwriting_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE underwriting_checklists ENABLE ROW LEVEL SECURITY;

-- RLS Policies for KYC Verifications
CREATE POLICY "Employees can view KYC verifications"
  ON kyc_verifications FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM employees
      WHERE employees.user_id = auth.uid()
      AND employees.is_active = true
      AND employees.role IN ('superadmin', 'admin', 'underwriter')
    )
  );

CREATE POLICY "Employees can create KYC verifications"
  ON kyc_verifications FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM employees
      WHERE employees.user_id = auth.uid()
      AND employees.is_active = true
      AND employees.role IN ('superadmin', 'admin', 'underwriter')
    )
  );

CREATE POLICY "Employees can update KYC verifications"
  ON kyc_verifications FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM employees
      WHERE employees.user_id = auth.uid()
      AND employees.is_active = true
      AND employees.role IN ('superadmin', 'admin', 'underwriter')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM employees
      WHERE employees.user_id = auth.uid()
      AND employees.is_active = true
      AND employees.role IN ('superadmin', 'admin', 'underwriter')
    )
  );

-- RLS Policies for KYC Documents
CREATE POLICY "Employees can view KYC documents"
  ON kyc_documents FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM employees
      WHERE employees.user_id = auth.uid()
      AND employees.is_active = true
      AND employees.role IN ('superadmin', 'admin', 'underwriter')
    )
  );

CREATE POLICY "Employees can upload KYC documents"
  ON kyc_documents FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM employees
      WHERE employees.user_id = auth.uid()
      AND employees.is_active = true
      AND employees.role IN ('superadmin', 'admin', 'underwriter')
    )
  );

CREATE POLICY "Employees can update KYC documents"
  ON kyc_documents FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM employees
      WHERE employees.user_id = auth.uid()
      AND employees.is_active = true
      AND employees.role IN ('superadmin', 'admin', 'underwriter')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM employees
      WHERE employees.user_id = auth.uid()
      AND employees.is_active = true
      AND employees.role IN ('superadmin', 'admin', 'underwriter')
    )
  );

-- RLS Policies for KYB Verifications
CREATE POLICY "Employees can view KYB verifications"
  ON kyb_verifications FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM employees
      WHERE employees.user_id = auth.uid()
      AND employees.is_active = true
      AND employees.role IN ('superadmin', 'admin', 'underwriter')
    )
  );

CREATE POLICY "Employees can create KYB verifications"
  ON kyb_verifications FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM employees
      WHERE employees.user_id = auth.uid()
      AND employees.is_active = true
      AND employees.role IN ('superadmin', 'admin', 'underwriter')
    )
  );

CREATE POLICY "Employees can update KYB verifications"
  ON kyb_verifications FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM employees
      WHERE employees.user_id = auth.uid()
      AND employees.is_active = true
      AND employees.role IN ('superadmin', 'admin', 'underwriter')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM employees
      WHERE employees.user_id = auth.uid()
      AND employees.is_active = true
      AND employees.role IN ('superadmin', 'admin', 'underwriter')
    )
  );

-- RLS Policies for KYB Documents
CREATE POLICY "Employees can view KYB documents"
  ON kyb_documents FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM employees
      WHERE employees.user_id = auth.uid()
      AND employees.is_active = true
      AND employees.role IN ('superadmin', 'admin', 'underwriter')
    )
  );

CREATE POLICY "Employees can upload KYB documents"
  ON kyb_documents FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM employees
      WHERE employees.user_id = auth.uid()
      AND employees.is_active = true
      AND employees.role IN ('superadmin', 'admin', 'underwriter')
    )
  );

CREATE POLICY "Employees can update KYB documents"
  ON kyb_documents FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM employees
      WHERE employees.user_id = auth.uid()
      AND employees.is_active = true
      AND employees.role IN ('superadmin', 'admin', 'underwriter')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM employees
      WHERE employees.user_id = auth.uid()
      AND employees.is_active = true
      AND employees.role IN ('superadmin', 'admin', 'underwriter')
    )
  );

-- RLS Policies for UBO Records
CREATE POLICY "Employees can view UBO records"
  ON ubo_records FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM employees
      WHERE employees.user_id = auth.uid()
      AND employees.is_active = true
      AND employees.role IN ('superadmin', 'admin', 'underwriter')
    )
  );

CREATE POLICY "Employees can create UBO records"
  ON ubo_records FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM employees
      WHERE employees.user_id = auth.uid()
      AND employees.is_active = true
      AND employees.role IN ('superadmin', 'admin', 'underwriter')
    )
  );

CREATE POLICY "Employees can update UBO records"
  ON ubo_records FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM employees
      WHERE employees.user_id = auth.uid()
      AND employees.is_active = true
      AND employees.role IN ('superadmin', 'admin', 'underwriter')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM employees
      WHERE employees.user_id = auth.uid()
      AND employees.is_active = true
      AND employees.role IN ('superadmin', 'admin', 'underwriter')
    )
  );

CREATE POLICY "Employees can delete UBO records"
  ON ubo_records FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM employees
      WHERE employees.user_id = auth.uid()
      AND employees.is_active = true
      AND employees.role IN ('superadmin', 'admin', 'underwriter')
    )
  );

-- RLS Policies for UBO Documents
CREATE POLICY "Employees can view UBO documents"
  ON ubo_documents FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM employees
      WHERE employees.user_id = auth.uid()
      AND employees.is_active = true
      AND employees.role IN ('superadmin', 'admin', 'underwriter')
    )
  );

CREATE POLICY "Employees can upload UBO documents"
  ON ubo_documents FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM employees
      WHERE employees.user_id = auth.uid()
      AND employees.is_active = true
      AND employees.role IN ('superadmin', 'admin', 'underwriter')
    )
  );

CREATE POLICY "Employees can update UBO documents"
  ON ubo_documents FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM employees
      WHERE employees.user_id = auth.uid()
      AND employees.is_active = true
      AND employees.role IN ('superadmin', 'admin', 'underwriter')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM employees
      WHERE employees.user_id = auth.uid()
      AND employees.is_active = true
      AND employees.role IN ('superadmin', 'admin', 'underwriter')
    )
  );

-- RLS Policies for Underwriting Reviews
CREATE POLICY "Employees can view underwriting reviews"
  ON underwriting_reviews FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM employees
      WHERE employees.user_id = auth.uid()
      AND employees.is_active = true
      AND employees.role IN ('superadmin', 'admin', 'underwriter')
    )
  );

CREATE POLICY "Employees can create underwriting reviews"
  ON underwriting_reviews FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM employees
      WHERE employees.user_id = auth.uid()
      AND employees.is_active = true
      AND employees.role IN ('superadmin', 'admin', 'underwriter')
    )
  );

CREATE POLICY "Employees can update underwriting reviews"
  ON underwriting_reviews FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM employees
      WHERE employees.user_id = auth.uid()
      AND employees.is_active = true
      AND employees.role IN ('superadmin', 'admin', 'underwriter')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM employees
      WHERE employees.user_id = auth.uid()
      AND employees.is_active = true
      AND employees.role IN ('superadmin', 'admin', 'underwriter')
    )
  );

-- RLS Policies for Underwriting Checklists
CREATE POLICY "Employees can view underwriting checklists"
  ON underwriting_checklists FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM employees
      WHERE employees.user_id = auth.uid()
      AND employees.is_active = true
      AND employees.role IN ('superadmin', 'admin', 'underwriter')
    )
  );

CREATE POLICY "Employees can create underwriting checklists"
  ON underwriting_checklists FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM employees
      WHERE employees.user_id = auth.uid()
      AND employees.is_active = true
      AND employees.role IN ('superadmin', 'admin', 'underwriter')
    )
  );

CREATE POLICY "Employees can update underwriting checklists"
  ON underwriting_checklists FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM employees
      WHERE employees.user_id = auth.uid()
      AND employees.is_active = true
      AND employees.role IN ('superadmin', 'admin', 'underwriter')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM employees
      WHERE employees.user_id = auth.uid()
      AND employees.is_active = true
      AND employees.role IN ('superadmin', 'admin', 'underwriter')
    )
  );

-- Create storage bucket for documents
INSERT INTO storage.buckets (id, name, public) 
VALUES ('underwriting-documents', 'underwriting-documents', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for document uploads
CREATE POLICY "Employees can upload underwriting documents"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'underwriting-documents' AND
    EXISTS (
      SELECT 1 FROM employees
      WHERE employees.user_id = auth.uid()
      AND employees.is_active = true
      AND employees.role IN ('superadmin', 'admin', 'underwriter')
    )
  );

CREATE POLICY "Employees can view underwriting documents"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'underwriting-documents' AND
    EXISTS (
      SELECT 1 FROM employees
      WHERE employees.user_id = auth.uid()
      AND employees.is_active = true
      AND employees.role IN ('superadmin', 'admin', 'underwriter')
    )
  );

CREATE POLICY "Employees can update underwriting documents"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'underwriting-documents' AND
    EXISTS (
      SELECT 1 FROM employees
      WHERE employees.user_id = auth.uid()
      AND employees.is_active = true
      AND employees.role IN ('superadmin', 'admin', 'underwriter')
    )
  )
  WITH CHECK (
    bucket_id = 'underwriting-documents' AND
    EXISTS (
      SELECT 1 FROM employees
      WHERE employees.user_id = auth.uid()
      AND employees.is_active = true
      AND employees.role IN ('superadmin', 'admin', 'underwriter')
    )
  );

CREATE POLICY "Employees can delete underwriting documents"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'underwriting-documents' AND
    EXISTS (
      SELECT 1 FROM employees
      WHERE employees.user_id = auth.uid()
      AND employees.is_active = true
      AND employees.role IN ('superadmin', 'admin', 'underwriter')
    )
  );
