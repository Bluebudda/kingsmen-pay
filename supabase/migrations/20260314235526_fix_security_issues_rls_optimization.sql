/*
  # Fix Security Issues - Part 2: Optimize RLS Policies

  This migration optimizes RLS policies by using SELECT subqueries to prevent
  re-evaluation of auth functions for each row, improving query performance.

  ## Changes

  1. Employee Table Policies
     - Optimize auth.uid() calls with SELECT subqueries
  
  2. Underwriting Services Policies
     - Optimize employee status checks

  3. Underwriting Rates Policies
     - Optimize employee status checks

  4. Applications Policies
     - Optimize employee checks
     - Fix overly permissive INSERT policy

  5. Merchants & Related Tables
     - Optimize all employee status checks

  6. Transactions Policies
     - Optimize employee status checks

  7. KYC/KYB/UBO Policies
     - Optimize all employee status checks
*/

DROP POLICY IF EXISTS "Authenticated users can insert employees" ON public.employees;
DROP POLICY IF EXISTS "Employees can update own record" ON public.employees;
DROP POLICY IF EXISTS "Admin employees can update any employee" ON public.employees;

CREATE POLICY "Authenticated users can insert employees"
  ON public.employees
  FOR INSERT
  TO authenticated
  WITH CHECK ((SELECT auth.uid()) IS NOT NULL);

CREATE POLICY "Employees can update own record"
  ON public.employees
  FOR UPDATE
  TO authenticated
  USING (user_id = (SELECT auth.uid()))
  WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY "Admin employees can update any employee"
  ON public.employees
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.employees e
      WHERE e.user_id = (SELECT auth.uid())
      AND e.role = 'admin'
      AND e.is_active = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.employees e
      WHERE e.user_id = (SELECT auth.uid())
      AND e.role = 'admin'
      AND e.is_active = true
    )
  );

DROP POLICY IF EXISTS "Active employees can view services" ON public.underwriting_services;
DROP POLICY IF EXISTS "Active employees can insert services" ON public.underwriting_services;
DROP POLICY IF EXISTS "Active employees can update services" ON public.underwriting_services;
DROP POLICY IF EXISTS "Admin employees can delete services" ON public.underwriting_services;

CREATE POLICY "Active employees can view services"
  ON public.underwriting_services
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.employees e
      WHERE e.user_id = (SELECT auth.uid())
      AND e.is_active = true
    )
  );

CREATE POLICY "Active employees can insert services"
  ON public.underwriting_services
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.employees e
      WHERE e.user_id = (SELECT auth.uid())
      AND e.is_active = true
    )
  );

CREATE POLICY "Active employees can update services"
  ON public.underwriting_services
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.employees e
      WHERE e.user_id = (SELECT auth.uid())
      AND e.is_active = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.employees e
      WHERE e.user_id = (SELECT auth.uid())
      AND e.is_active = true
    )
  );

CREATE POLICY "Admin employees can delete services"
  ON public.underwriting_services
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.employees e
      WHERE e.user_id = (SELECT auth.uid())
      AND e.role = 'admin'
      AND e.is_active = true
    )
  );

DROP POLICY IF EXISTS "Active employees can view rates" ON public.underwriting_rates;
DROP POLICY IF EXISTS "Active employees can insert rates" ON public.underwriting_rates;
DROP POLICY IF EXISTS "Active employees can update rates" ON public.underwriting_rates;
DROP POLICY IF EXISTS "Admin employees can delete rates" ON public.underwriting_rates;

CREATE POLICY "Active employees can view rates"
  ON public.underwriting_rates
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.employees e
      WHERE e.user_id = (SELECT auth.uid())
      AND e.is_active = true
    )
  );

CREATE POLICY "Active employees can insert rates"
  ON public.underwriting_rates
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.employees e
      WHERE e.user_id = (SELECT auth.uid())
      AND e.is_active = true
    )
  );

CREATE POLICY "Active employees can update rates"
  ON public.underwriting_rates
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.employees e
      WHERE e.user_id = (SELECT auth.uid())
      AND e.is_active = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.employees e
      WHERE e.user_id = (SELECT auth.uid())
      AND e.is_active = true
    )
  );

CREATE POLICY "Admin employees can delete rates"
  ON public.underwriting_rates
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.employees e
      WHERE e.user_id = (SELECT auth.uid())
      AND e.role = 'admin'
      AND e.is_active = true
    )
  );

DROP POLICY IF EXISTS "Anyone can submit applications" ON public.applications;
DROP POLICY IF EXISTS "Employees can view all applications" ON public.applications;
DROP POLICY IF EXISTS "Employees can update applications" ON public.applications;

CREATE POLICY "Anyone can submit applications"
  ON public.applications
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    email IS NOT NULL
    AND company_name IS NOT NULL
    AND business_type IS NOT NULL
  );

CREATE POLICY "Employees can view all applications"
  ON public.applications
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.employees e
      WHERE e.user_id = (SELECT auth.uid())
      AND e.is_active = true
    )
  );

CREATE POLICY "Employees can update applications"
  ON public.applications
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.employees e
      WHERE e.user_id = (SELECT auth.uid())
      AND e.is_active = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.employees e
      WHERE e.user_id = (SELECT auth.uid())
      AND e.is_active = true
    )
  );

DROP POLICY IF EXISTS "Active employees can view merchants" ON public.merchants;
DROP POLICY IF EXISTS "Active employees can insert merchants" ON public.merchants;
DROP POLICY IF EXISTS "Active employees can update merchants" ON public.merchants;
DROP POLICY IF EXISTS "Admin employees can delete merchants" ON public.merchants;

CREATE POLICY "Active employees can view merchants"
  ON public.merchants
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.employees e
      WHERE e.user_id = (SELECT auth.uid())
      AND e.is_active = true
    )
  );

CREATE POLICY "Active employees can insert merchants"
  ON public.merchants
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.employees e
      WHERE e.user_id = (SELECT auth.uid())
      AND e.is_active = true
    )
  );

CREATE POLICY "Active employees can update merchants"
  ON public.merchants
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.employees e
      WHERE e.user_id = (SELECT auth.uid())
      AND e.is_active = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.employees e
      WHERE e.user_id = (SELECT auth.uid())
      AND e.is_active = true
    )
  );

CREATE POLICY "Admin employees can delete merchants"
  ON public.merchants
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.employees e
      WHERE e.user_id = (SELECT auth.uid())
      AND e.role = 'admin'
      AND e.is_active = true
    )
  );

DROP POLICY IF EXISTS "Active employees can view credentials" ON public.merchant_credentials;
DROP POLICY IF EXISTS "Active employees can insert credentials" ON public.merchant_credentials;
DROP POLICY IF EXISTS "Active employees can update credentials" ON public.merchant_credentials;
DROP POLICY IF EXISTS "Admin employees can delete credentials" ON public.merchant_credentials;

CREATE POLICY "Active employees can view credentials"
  ON public.merchant_credentials
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.employees e
      WHERE e.user_id = (SELECT auth.uid())
      AND e.is_active = true
    )
  );

CREATE POLICY "Active employees can insert credentials"
  ON public.merchant_credentials
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.employees e
      WHERE e.user_id = (SELECT auth.uid())
      AND e.is_active = true
    )
  );

CREATE POLICY "Active employees can update credentials"
  ON public.merchant_credentials
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.employees e
      WHERE e.user_id = (SELECT auth.uid())
      AND e.is_active = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.employees e
      WHERE e.user_id = (SELECT auth.uid())
      AND e.is_active = true
    )
  );

CREATE POLICY "Admin employees can delete credentials"
  ON public.merchant_credentials
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.employees e
      WHERE e.user_id = (SELECT auth.uid())
      AND e.role = 'admin'
      AND e.is_active = true
    )
  );

DROP POLICY IF EXISTS "Active employees can view transactions" ON public.transactions;
DROP POLICY IF EXISTS "Active employees can insert transactions" ON public.transactions;
DROP POLICY IF EXISTS "Active employees can update transactions" ON public.transactions;
DROP POLICY IF EXISTS "Admin employees can delete transactions" ON public.transactions;

CREATE POLICY "Active employees can view transactions"
  ON public.transactions
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.employees e
      WHERE e.user_id = (SELECT auth.uid())
      AND e.is_active = true
    )
  );

CREATE POLICY "Active employees can insert transactions"
  ON public.transactions
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.employees e
      WHERE e.user_id = (SELECT auth.uid())
      AND e.is_active = true
    )
  );

CREATE POLICY "Active employees can update transactions"
  ON public.transactions
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.employees e
      WHERE e.user_id = (SELECT auth.uid())
      AND e.is_active = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.employees e
      WHERE e.user_id = (SELECT auth.uid())
      AND e.is_active = true
    )
  );

CREATE POLICY "Admin employees can delete transactions"
  ON public.transactions
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.employees e
      WHERE e.user_id = (SELECT auth.uid())
      AND e.role = 'admin'
      AND e.is_active = true
    )
  );

DROP POLICY IF EXISTS "Employees can view KYC verifications" ON public.kyc_verifications;
DROP POLICY IF EXISTS "Employees can create KYC verifications" ON public.kyc_verifications;
DROP POLICY IF EXISTS "Employees can update KYC verifications" ON public.kyc_verifications;

CREATE POLICY "Employees can view KYC verifications"
  ON public.kyc_verifications
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.employees e
      WHERE e.user_id = (SELECT auth.uid())
      AND e.is_active = true
    )
  );

CREATE POLICY "Employees can create KYC verifications"
  ON public.kyc_verifications
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.employees e
      WHERE e.user_id = (SELECT auth.uid())
      AND e.is_active = true
    )
  );

CREATE POLICY "Employees can update KYC verifications"
  ON public.kyc_verifications
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.employees e
      WHERE e.user_id = (SELECT auth.uid())
      AND e.is_active = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.employees e
      WHERE e.user_id = (SELECT auth.uid())
      AND e.is_active = true
    )
  );

DROP POLICY IF EXISTS "Employees can view KYC documents" ON public.kyc_documents;
DROP POLICY IF EXISTS "Employees can upload KYC documents" ON public.kyc_documents;
DROP POLICY IF EXISTS "Employees can update KYC documents" ON public.kyc_documents;

CREATE POLICY "Employees can view KYC documents"
  ON public.kyc_documents
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.employees e
      WHERE e.user_id = (SELECT auth.uid())
      AND e.is_active = true
    )
  );

CREATE POLICY "Employees can upload KYC documents"
  ON public.kyc_documents
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.employees e
      WHERE e.user_id = (SELECT auth.uid())
      AND e.is_active = true
    )
  );

CREATE POLICY "Employees can update KYC documents"
  ON public.kyc_documents
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.employees e
      WHERE e.user_id = (SELECT auth.uid())
      AND e.is_active = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.employees e
      WHERE e.user_id = (SELECT auth.uid())
      AND e.is_active = true
    )
  );

DROP POLICY IF EXISTS "Employees can view KYB verifications" ON public.kyb_verifications;
DROP POLICY IF EXISTS "Employees can create KYB verifications" ON public.kyb_verifications;
DROP POLICY IF EXISTS "Employees can update KYB verifications" ON public.kyb_verifications;

CREATE POLICY "Employees can view KYB verifications"
  ON public.kyb_verifications
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.employees e
      WHERE e.user_id = (SELECT auth.uid())
      AND e.is_active = true
    )
  );

CREATE POLICY "Employees can create KYB verifications"
  ON public.kyb_verifications
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.employees e
      WHERE e.user_id = (SELECT auth.uid())
      AND e.is_active = true
    )
  );

CREATE POLICY "Employees can update KYB verifications"
  ON public.kyb_verifications
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.employees e
      WHERE e.user_id = (SELECT auth.uid())
      AND e.is_active = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.employees e
      WHERE e.user_id = (SELECT auth.uid())
      AND e.is_active = true
    )
  );

DROP POLICY IF EXISTS "Employees can view KYB documents" ON public.kyb_documents;
DROP POLICY IF EXISTS "Employees can upload KYB documents" ON public.kyb_documents;
DROP POLICY IF EXISTS "Employees can update KYB documents" ON public.kyb_documents;

CREATE POLICY "Employees can view KYB documents"
  ON public.kyb_documents
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.employees e
      WHERE e.user_id = (SELECT auth.uid())
      AND e.is_active = true
    )
  );

CREATE POLICY "Employees can upload KYB documents"
  ON public.kyb_documents
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.employees e
      WHERE e.user_id = (SELECT auth.uid())
      AND e.is_active = true
    )
  );

CREATE POLICY "Employees can update KYB documents"
  ON public.kyb_documents
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.employees e
      WHERE e.user_id = (SELECT auth.uid())
      AND e.is_active = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.employees e
      WHERE e.user_id = (SELECT auth.uid())
      AND e.is_active = true
    )
  );

DROP POLICY IF EXISTS "Employees can view UBO records" ON public.ubo_records;
DROP POLICY IF EXISTS "Employees can create UBO records" ON public.ubo_records;
DROP POLICY IF EXISTS "Employees can update UBO records" ON public.ubo_records;
DROP POLICY IF EXISTS "Employees can delete UBO records" ON public.ubo_records;

CREATE POLICY "Employees can view UBO records"
  ON public.ubo_records
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.employees e
      WHERE e.user_id = (SELECT auth.uid())
      AND e.is_active = true
    )
  );

CREATE POLICY "Employees can create UBO records"
  ON public.ubo_records
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.employees e
      WHERE e.user_id = (SELECT auth.uid())
      AND e.is_active = true
    )
  );

CREATE POLICY "Employees can update UBO records"
  ON public.ubo_records
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.employees e
      WHERE e.user_id = (SELECT auth.uid())
      AND e.is_active = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.employees e
      WHERE e.user_id = (SELECT auth.uid())
      AND e.is_active = true
    )
  );

CREATE POLICY "Employees can delete UBO records"
  ON public.ubo_records
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.employees e
      WHERE e.user_id = (SELECT auth.uid())
      AND e.is_active = true
    )
  );

DROP POLICY IF EXISTS "Employees can view UBO documents" ON public.ubo_documents;
DROP POLICY IF EXISTS "Employees can upload UBO documents" ON public.ubo_documents;
DROP POLICY IF EXISTS "Employees can update UBO documents" ON public.ubo_documents;

CREATE POLICY "Employees can view UBO documents"
  ON public.ubo_documents
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.employees e
      WHERE e.user_id = (SELECT auth.uid())
      AND e.is_active = true
    )
  );

CREATE POLICY "Employees can upload UBO documents"
  ON public.ubo_documents
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.employees e
      WHERE e.user_id = (SELECT auth.uid())
      AND e.is_active = true
    )
  );

CREATE POLICY "Employees can update UBO documents"
  ON public.ubo_documents
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.employees e
      WHERE e.user_id = (SELECT auth.uid())
      AND e.is_active = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.employees e
      WHERE e.user_id = (SELECT auth.uid())
      AND e.is_active = true
    )
  );

DROP POLICY IF EXISTS "Employees can view underwriting reviews" ON public.underwriting_reviews;
DROP POLICY IF EXISTS "Employees can create underwriting reviews" ON public.underwriting_reviews;
DROP POLICY IF EXISTS "Employees can update underwriting reviews" ON public.underwriting_reviews;

CREATE POLICY "Employees can view underwriting reviews"
  ON public.underwriting_reviews
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.employees e
      WHERE e.user_id = (SELECT auth.uid())
      AND e.is_active = true
    )
  );

CREATE POLICY "Employees can create underwriting reviews"
  ON public.underwriting_reviews
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.employees e
      WHERE e.user_id = (SELECT auth.uid())
      AND e.is_active = true
    )
  );

CREATE POLICY "Employees can update underwriting reviews"
  ON public.underwriting_reviews
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.employees e
      WHERE e.user_id = (SELECT auth.uid())
      AND e.is_active = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.employees e
      WHERE e.user_id = (SELECT auth.uid())
      AND e.is_active = true
    )
  );

DROP POLICY IF EXISTS "Employees can view underwriting checklists" ON public.underwriting_checklists;
DROP POLICY IF EXISTS "Employees can create underwriting checklists" ON public.underwriting_checklists;
DROP POLICY IF EXISTS "Employees can update underwriting checklists" ON public.underwriting_checklists;

CREATE POLICY "Employees can view underwriting checklists"
  ON public.underwriting_checklists
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.employees e
      WHERE e.user_id = (SELECT auth.uid())
      AND e.is_active = true
    )
  );

CREATE POLICY "Employees can create underwriting checklists"
  ON public.underwriting_checklists
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.employees e
      WHERE e.user_id = (SELECT auth.uid())
      AND e.is_active = true
    )
  );

CREATE POLICY "Employees can update underwriting checklists"
  ON public.underwriting_checklists
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.employees e
      WHERE e.user_id = (SELECT auth.uid())
      AND e.is_active = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.employees e
      WHERE e.user_id = (SELECT auth.uid())
      AND e.is_active = true
    )
  );
