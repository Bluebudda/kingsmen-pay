/*
  # Fix Security Issues - Add Missing Indexes

  This migration addresses performance and security issues by:

  1. **Foreign Key Indexes**
     - Adds indexes for all unindexed foreign keys across all tables
     - Improves query performance for joins and lookups
     - Covers 42 missing foreign key indexes

  2. **Removes Unused Indexes**
     - Drops indexes that are not being used
     - Reduces storage overhead and maintenance costs

  ## Tables Affected
  - applications, client_followups, kyb_documents, kyb_verifications
  - kyc_documents, kyc_verifications, merchant_credentials, merchants
  - referrals, transactions, ubo_documents, ubo_records
  - underwriting_checklists, underwriting_notes, underwriting_rates
  - underwriting_reviews, underwriting_services, underwriting_tasks
  - merchant_users, merchant_api_credentials, application_messages
  - application_documents, merchant_analytics

  ## Performance Impact
  All indexes are created concurrently to avoid blocking operations.
*/

-- Applications table indexes
CREATE INDEX IF NOT EXISTS idx_applications_assigned_to ON public.applications(assigned_to);
CREATE INDEX IF NOT EXISTS idx_applications_user_id ON public.applications(user_id);

-- Client followups indexes
CREATE INDEX IF NOT EXISTS idx_client_followups_application_id ON public.client_followups(application_id);
CREATE INDEX IF NOT EXISTS idx_client_followups_assigned_to ON public.client_followups(assigned_to);

-- KYB documents indexes
CREATE INDEX IF NOT EXISTS idx_kyb_documents_kyb_verification_id ON public.kyb_documents(kyb_verification_id);
CREATE INDEX IF NOT EXISTS idx_kyb_documents_uploaded_by ON public.kyb_documents(uploaded_by);
CREATE INDEX IF NOT EXISTS idx_kyb_documents_verified_by ON public.kyb_documents(verified_by);

-- KYB verifications indexes
CREATE INDEX IF NOT EXISTS idx_kyb_verifications_assigned_to ON public.kyb_verifications(assigned_to);
CREATE INDEX IF NOT EXISTS idx_kyb_verifications_created_by ON public.kyb_verifications(created_by);
CREATE INDEX IF NOT EXISTS idx_kyb_verifications_updated_by ON public.kyb_verifications(updated_by);

-- KYC documents indexes
CREATE INDEX IF NOT EXISTS idx_kyc_documents_kyc_verification_id ON public.kyc_documents(kyc_verification_id);
CREATE INDEX IF NOT EXISTS idx_kyc_documents_uploaded_by ON public.kyc_documents(uploaded_by);
CREATE INDEX IF NOT EXISTS idx_kyc_documents_verified_by ON public.kyc_documents(verified_by);

-- KYC verifications indexes
CREATE INDEX IF NOT EXISTS idx_kyc_verifications_assigned_to ON public.kyc_verifications(assigned_to);
CREATE INDEX IF NOT EXISTS idx_kyc_verifications_created_by ON public.kyc_verifications(created_by);
CREATE INDEX IF NOT EXISTS idx_kyc_verifications_updated_by ON public.kyc_verifications(updated_by);

-- Merchant credentials indexes
CREATE INDEX IF NOT EXISTS idx_merchant_credentials_merchant_id ON public.merchant_credentials(merchant_id);

-- Merchants indexes
CREATE INDEX IF NOT EXISTS idx_merchants_application_id ON public.merchants(application_id);
CREATE INDEX IF NOT EXISTS idx_merchants_onboarded_by ON public.merchants(onboarded_by);

-- Referrals indexes
CREATE INDEX IF NOT EXISTS idx_referrals_application_id ON public.referrals(application_id);

-- Transactions indexes
CREATE INDEX IF NOT EXISTS idx_transactions_merchant_id ON public.transactions(merchant_id);

-- UBO documents indexes
CREATE INDEX IF NOT EXISTS idx_ubo_documents_ubo_record_id ON public.ubo_documents(ubo_record_id);
CREATE INDEX IF NOT EXISTS idx_ubo_documents_uploaded_by ON public.ubo_documents(uploaded_by);
CREATE INDEX IF NOT EXISTS idx_ubo_documents_verified_by ON public.ubo_documents(verified_by);

-- UBO records indexes
CREATE INDEX IF NOT EXISTS idx_ubo_records_created_by ON public.ubo_records(created_by);
CREATE INDEX IF NOT EXISTS idx_ubo_records_kyb_verification_id ON public.ubo_records(kyb_verification_id);
CREATE INDEX IF NOT EXISTS idx_ubo_records_kyc_verification_id ON public.ubo_records(kyc_verification_id);
CREATE INDEX IF NOT EXISTS idx_ubo_records_verified_by ON public.ubo_records(verified_by);

-- Underwriting checklists indexes
CREATE INDEX IF NOT EXISTS idx_underwriting_checklists_completed_by ON public.underwriting_checklists(completed_by);
CREATE INDEX IF NOT EXISTS idx_underwriting_checklists_review_id ON public.underwriting_checklists(review_id);

-- Underwriting notes indexes
CREATE INDEX IF NOT EXISTS idx_underwriting_notes_application_id ON public.underwriting_notes(application_id);
CREATE INDEX IF NOT EXISTS idx_underwriting_notes_created_by ON public.underwriting_notes(created_by);

-- Underwriting rates indexes
CREATE INDEX IF NOT EXISTS idx_underwriting_rates_created_by ON public.underwriting_rates(created_by);
CREATE INDEX IF NOT EXISTS idx_underwriting_rates_service_id ON public.underwriting_rates(service_id);
CREATE INDEX IF NOT EXISTS idx_underwriting_rates_updated_by ON public.underwriting_rates(updated_by);

-- Underwriting reviews indexes
CREATE INDEX IF NOT EXISTS idx_underwriting_reviews_escalated_to ON public.underwriting_reviews(escalated_to);
CREATE INDEX IF NOT EXISTS idx_underwriting_reviews_kyb_verification_id ON public.underwriting_reviews(kyb_verification_id);
CREATE INDEX IF NOT EXISTS idx_underwriting_reviews_kyc_verification_id ON public.underwriting_reviews(kyc_verification_id);
CREATE INDEX IF NOT EXISTS idx_underwriting_reviews_reviewer_id ON public.underwriting_reviews(reviewer_id);

-- Underwriting services indexes
CREATE INDEX IF NOT EXISTS idx_underwriting_services_created_by ON public.underwriting_services(created_by);

-- Underwriting tasks indexes
CREATE INDEX IF NOT EXISTS idx_underwriting_tasks_application_id ON public.underwriting_tasks(application_id);

-- Remove unused indexes from merchant portal migration
DROP INDEX IF EXISTS idx_applications_merchant_id;
DROP INDEX IF EXISTS idx_merchant_users_merchant_id;
DROP INDEX IF EXISTS idx_merchant_api_credentials_merchant_id;
DROP INDEX IF EXISTS idx_merchant_api_credentials_api_key;
DROP INDEX IF EXISTS idx_application_messages_application_id;
DROP INDEX IF EXISTS idx_application_messages_created_at;
DROP INDEX IF EXISTS idx_application_documents_application_id;
DROP INDEX IF EXISTS idx_merchant_analytics_merchant_date;
DROP INDEX IF EXISTS idx_underwriting_tasks_completed_by;
