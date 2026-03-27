/*
  # Fix Security Issues - Optimize RLS Policies

  This migration optimizes Row Level Security policies by:

  1. **RLS Performance Optimization**
     - Replaces auth.uid() with (select auth.uid()) in all policies
     - Prevents re-evaluation of auth functions for each row
     - Significantly improves query performance at scale

  2. **Tables Optimized**
     - merchant_users, merchant_api_credentials, application_messages
     - application_documents, merchant_analytics, applications

  ## Performance Impact
  This change ensures auth functions are evaluated once per query instead of once per row.
*/

-- Merchant Users Policies
DROP POLICY IF EXISTS "Merchants can view their own user records" ON public.merchant_users;
CREATE POLICY "Merchants can view their own user records"
  ON public.merchant_users FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Employees can manage merchant users" ON public.merchant_users;
CREATE POLICY "Employees can manage merchant users"
  ON public.merchant_users FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM employees
      WHERE employees.user_id = (select auth.uid())
      AND employees.is_active = true
    )
  );

-- Merchant API Credentials Policies
DROP POLICY IF EXISTS "Merchants can view their API credentials" ON public.merchant_api_credentials;
CREATE POLICY "Merchants can view their API credentials"
  ON public.merchant_api_credentials FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM merchant_users
      WHERE merchant_users.merchant_id = merchant_api_credentials.merchant_id
      AND merchant_users.user_id = (select auth.uid())
    )
  );

DROP POLICY IF EXISTS "Employees can manage API credentials" ON public.merchant_api_credentials;
CREATE POLICY "Employees can manage API credentials"
  ON public.merchant_api_credentials FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM employees
      WHERE employees.user_id = (select auth.uid())
      AND employees.is_active = true
    )
  );

-- Application Messages Policies
DROP POLICY IF EXISTS "Merchants can view messages for their applications" ON public.application_messages;
CREATE POLICY "Merchants can view messages for their applications"
  ON public.application_messages FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM applications a
      JOIN merchant_users mu ON mu.merchant_id = a.merchant_id
      WHERE a.id = application_messages.application_id
      AND mu.user_id = (select auth.uid())
    )
  );

DROP POLICY IF EXISTS "Merchants can create messages for their applications" ON public.application_messages;
CREATE POLICY "Merchants can create messages for their applications"
  ON public.application_messages FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM applications a
      JOIN merchant_users mu ON mu.merchant_id = a.merchant_id
      WHERE a.id = application_messages.application_id
      AND mu.user_id = (select auth.uid())
    )
  );

DROP POLICY IF EXISTS "Employees can manage all messages" ON public.application_messages;
CREATE POLICY "Employees can manage all messages"
  ON public.application_messages FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM employees
      WHERE employees.user_id = (select auth.uid())
      AND employees.is_active = true
    )
  );

-- Application Documents Policies
DROP POLICY IF EXISTS "Merchants can view documents for their applications" ON public.application_documents;
CREATE POLICY "Merchants can view documents for their applications"
  ON public.application_documents FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM applications a
      JOIN merchant_users mu ON mu.merchant_id = a.merchant_id
      WHERE a.id = application_documents.application_id
      AND mu.user_id = (select auth.uid())
    )
  );

DROP POLICY IF EXISTS "Merchants can upload documents for their applications" ON public.application_documents;
CREATE POLICY "Merchants can upload documents for their applications"
  ON public.application_documents FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM applications a
      JOIN merchant_users mu ON mu.merchant_id = a.merchant_id
      WHERE a.id = application_documents.application_id
      AND mu.user_id = (select auth.uid())
    )
  );

DROP POLICY IF EXISTS "Employees can manage all documents" ON public.application_documents;
CREATE POLICY "Employees can manage all documents"
  ON public.application_documents FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM employees
      WHERE employees.user_id = (select auth.uid())
      AND employees.is_active = true
    )
  );

-- Merchant Analytics Policies
DROP POLICY IF EXISTS "Merchants can view their own analytics" ON public.merchant_analytics;
CREATE POLICY "Merchants can view their own analytics"
  ON public.merchant_analytics FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM merchant_users
      WHERE merchant_users.merchant_id = merchant_analytics.merchant_id
      AND merchant_users.user_id = (select auth.uid())
    )
  );

DROP POLICY IF EXISTS "Employees can manage analytics" ON public.merchant_analytics;
CREATE POLICY "Employees can manage analytics"
  ON public.merchant_analytics FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM employees
      WHERE employees.user_id = (select auth.uid())
      AND employees.is_active = true
    )
  );

-- Applications Policies
DROP POLICY IF EXISTS "Merchants can view their applications" ON public.applications;
CREATE POLICY "Merchants can view their applications"
  ON public.applications FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM merchant_users
      WHERE merchant_users.merchant_id = applications.merchant_id
      AND merchant_users.user_id = (select auth.uid())
    )
  );
