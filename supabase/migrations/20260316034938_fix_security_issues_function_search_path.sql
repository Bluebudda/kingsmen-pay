/*
  # Fix Security Issues - Function Search Path

  This migration fixes security issues with functions:

  1. **Function Search Path**
     - Sets immutable search_path for update_merchant_last_login function
     - Prevents potential SQL injection via search_path manipulation

  2. **Security Impact**
     - Ensures function operates in a secure, predictable schema context
     - Follows PostgreSQL security best practices
*/

-- Drop and recreate the function with proper security settings
DROP FUNCTION IF EXISTS public.update_merchant_last_login() CASCADE;

CREATE OR REPLACE FUNCTION public.update_merchant_last_login()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public, pg_temp
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE public.merchant_users
  SET last_login = now()
  WHERE user_id = NEW.id;
  
  RETURN NEW;
END;
$$;

-- Recreate the trigger if it existed
DROP TRIGGER IF EXISTS on_auth_user_merchant_login ON auth.users;

CREATE TRIGGER on_auth_user_merchant_login
  AFTER UPDATE OF last_sign_in_at ON auth.users
  FOR EACH ROW
  WHEN (OLD.last_sign_in_at IS DISTINCT FROM NEW.last_sign_in_at)
  EXECUTE FUNCTION public.update_merchant_last_login();
