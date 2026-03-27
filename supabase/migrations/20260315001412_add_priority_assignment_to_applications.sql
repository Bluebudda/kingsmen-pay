/*
  # Add Priority and Assignment Fields to Applications

  1. Changes
    - Add `priority` field to applications table (low, medium, high, urgent)
    - Add `assigned_to` field to applications table (references employees)
    - Add indexes for better query performance

  2. Important Notes
    - Priority helps with application triage and workflow management
    - Assignment allows routing applications to specific employees
    - Both fields are optional and can be set at any time
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'applications' AND column_name = 'priority'
  ) THEN
    ALTER TABLE applications ADD COLUMN priority text DEFAULT 'medium';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'applications' AND column_name = 'assigned_to'
  ) THEN
    ALTER TABLE applications ADD COLUMN assigned_to uuid REFERENCES employees(id) ON DELETE SET NULL;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_applications_priority ON applications(priority);
CREATE INDEX IF NOT EXISTS idx_applications_assigned_to ON applications(assigned_to);
