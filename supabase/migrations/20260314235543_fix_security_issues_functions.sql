/*
  # Fix Security Issues - Part 3: Function Search Paths

  This migration fixes function search paths to prevent security vulnerabilities
  by explicitly setting search_path to prevent malicious schema injection.

  ## Changes

  1. Fix search_path for trigger functions
     - update_updated_at_column
     - handle_new_user
     - update_applications_updated_at

  ## Security Notes
  Setting search_path explicitly prevents attacks where a malicious user
  could create a schema that shadows pg_catalog or public functions.
*/

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  INSERT INTO public.employees (user_id, email, full_name, role, is_active)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    COALESCE(NEW.raw_user_meta_data->>'role', 'analyst'),
    true
  );
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_applications_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$;
