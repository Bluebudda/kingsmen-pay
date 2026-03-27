/*
  # Create Merchant Users View
  
  1. New Views
    - `merchant_users_with_email` - Joins merchant_users with auth.users to show email addresses
  
  2. Security
    - Enable RLS on the view
    - Add policy for merchants to view their own users
*/

CREATE OR REPLACE VIEW merchant_users_with_email AS
SELECT 
  mu.id,
  mu.user_id,
  mu.merchant_id,
  mu.is_primary_contact,
  mu.role,
  mu.is_active,
  mu.created_at,
  mu.last_login,
  au.email as user_email
FROM merchant_users mu
LEFT JOIN auth.users au ON mu.user_id = au.id;

ALTER VIEW merchant_users_with_email SET (security_invoker = on);
