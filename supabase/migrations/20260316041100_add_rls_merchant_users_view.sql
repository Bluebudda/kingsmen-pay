/*
  # Add RLS policies for merchant_users_with_email view
  
  1. Security
    - Add policy for merchants to view users in their organization
    - Add policy for admins to manage users
*/

CREATE POLICY "Merchants can view users in their organization"
  ON merchant_users
  FOR SELECT
  TO authenticated
  USING (
    merchant_id IN (
      SELECT merchant_id FROM merchant_users WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Admin merchants can update user roles"
  ON merchant_users
  FOR UPDATE
  TO authenticated
  USING (
    merchant_id IN (
      SELECT merchant_id FROM merchant_users 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  )
  WITH CHECK (
    merchant_id IN (
      SELECT merchant_id FROM merchant_users 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admin merchants can manage user status"
  ON merchant_users
  FOR UPDATE
  TO authenticated
  USING (
    merchant_id IN (
      SELECT merchant_id FROM merchant_users 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );
