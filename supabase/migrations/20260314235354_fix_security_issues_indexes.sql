/*
  # Fix Security Issues - Part 1: Add Missing Indexes

  This migration addresses unindexed foreign keys to improve query performance.

  ## Changes

  1. Foreign Key Indexes
     - Add indexes for all unindexed foreign key columns
     - Improves join performance and foreign key constraint checks

  ## Tables Affected
  - applications
  - kyb_documents
  - kyb_verifications
  - kyc_documents
  - kyc_verifications
  - merchants
  - ubo_documents
  - ubo_records
  - underwriting_checklists
  - underwriting_rates
  - underwriting_reviews
  - underwriting_services
*/

CREATE INDEX IF NOT EXISTS idx_applications_user_id ON public.applications(user_id);

CREATE INDEX IF NOT EXISTS idx_kyb_documents_uploaded_by ON public.kyb_documents(uploaded_by);
CREATE INDEX IF NOT EXISTS idx_kyb_documents_verified_by ON public.kyb_documents(verified_by);

CREATE INDEX IF NOT EXISTS idx_kyb_verifications_created_by ON public.kyb_verifications(created_by);
CREATE INDEX IF NOT EXISTS idx_kyb_verifications_updated_by ON public.kyb_verifications(updated_by);

CREATE INDEX IF NOT EXISTS idx_kyc_documents_uploaded_by ON public.kyc_documents(uploaded_by);
CREATE INDEX IF NOT EXISTS idx_kyc_documents_verified_by ON public.kyc_documents(verified_by);

CREATE INDEX IF NOT EXISTS idx_kyc_verifications_created_by ON public.kyc_verifications(created_by);
CREATE INDEX IF NOT EXISTS idx_kyc_verifications_updated_by ON public.kyc_verifications(updated_by);

CREATE INDEX IF NOT EXISTS idx_merchants_onboarded_by ON public.merchants(onboarded_by);

CREATE INDEX IF NOT EXISTS idx_ubo_documents_uploaded_by ON public.ubo_documents(uploaded_by);
CREATE INDEX IF NOT EXISTS idx_ubo_documents_verified_by ON public.ubo_documents(verified_by);

CREATE INDEX IF NOT EXISTS idx_ubo_records_created_by ON public.ubo_records(created_by);
CREATE INDEX IF NOT EXISTS idx_ubo_records_verified_by ON public.ubo_records(verified_by);

CREATE INDEX IF NOT EXISTS idx_underwriting_checklists_completed_by ON public.underwriting_checklists(completed_by);

CREATE INDEX IF NOT EXISTS idx_underwriting_rates_created_by ON public.underwriting_rates(created_by);
CREATE INDEX IF NOT EXISTS idx_underwriting_rates_updated_by ON public.underwriting_rates(updated_by);

CREATE INDEX IF NOT EXISTS idx_underwriting_reviews_escalated_to ON public.underwriting_reviews(escalated_to);
CREATE INDEX IF NOT EXISTS idx_underwriting_reviews_kyb_verification_id ON public.underwriting_reviews(kyb_verification_id);
CREATE INDEX IF NOT EXISTS idx_underwriting_reviews_kyc_verification_id ON public.underwriting_reviews(kyc_verification_id);

CREATE INDEX IF NOT EXISTS idx_underwriting_services_created_by ON public.underwriting_services(created_by);
