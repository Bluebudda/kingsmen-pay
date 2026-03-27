/*
  # Create Underwriting Tasks and Follow-up System

  1. New Tables
    - `underwriting_tasks`
      - `id` (uuid, primary key)
      - `application_id` (uuid, foreign key to applications)
      - `task_type` (text, type of task)
      - `task_description` (text, description)
      - `is_required` (boolean, whether task is required for approval)
      - `is_completed` (boolean, completion status)
      - `completed_at` (timestamptz, completion timestamp)
      - `completed_by` (uuid, employee who completed)
      - `due_date` (timestamptz, when task is due)
      - `created_at` (timestamptz, creation timestamp)
      - `order_index` (integer, display order)

    - `client_followups`
      - `id` (uuid, primary key)
      - `application_id` (uuid, foreign key to applications)
      - `followup_type` (text, type of follow-up needed)
      - `description` (text, what needs to be done)
      - `status` (text, pending/in_progress/completed/cancelled)
      - `priority` (text, low/medium/high/urgent)
      - `scheduled_date` (timestamptz, when to follow up)
      - `completed_at` (timestamptz, completion timestamp)
      - `assigned_to` (uuid, employee assigned)
      - `days_to_reschedule` (integer, days to wait before next follow-up)
      - `reschedule_count` (integer, how many times rescheduled)
      - `created_at` (timestamptz, creation timestamp)
      - `updated_at` (timestamptz, update timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for employees to manage tasks and follow-ups

  3. Important Notes
    - Tasks auto-generate based on application requirements
    - Follow-ups automatically reschedule based on days_to_reschedule
    - Required tasks must be completed before approval
*/

CREATE TABLE IF NOT EXISTS underwriting_tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id uuid NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
  task_type text NOT NULL,
  task_description text NOT NULL,
  is_required boolean NOT NULL DEFAULT true,
  is_completed boolean NOT NULL DEFAULT false,
  completed_at timestamptz,
  completed_by uuid REFERENCES employees(id) ON DELETE SET NULL,
  due_date timestamptz,
  created_at timestamptz DEFAULT now(),
  order_index integer DEFAULT 0
);

CREATE TABLE IF NOT EXISTS client_followups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id uuid NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
  followup_type text NOT NULL,
  description text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  priority text NOT NULL DEFAULT 'medium',
  scheduled_date timestamptz NOT NULL,
  completed_at timestamptz,
  assigned_to uuid REFERENCES employees(id) ON DELETE SET NULL,
  days_to_reschedule integer DEFAULT 3,
  reschedule_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE underwriting_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_followups ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Employees can view all tasks"
  ON underwriting_tasks
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM employees
      WHERE employees.user_id = auth.uid()
      AND employees.is_active = true
    )
  );

CREATE POLICY "Employees can create tasks"
  ON underwriting_tasks
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM employees
      WHERE employees.user_id = auth.uid()
      AND employees.is_active = true
    )
  );

CREATE POLICY "Employees can update tasks"
  ON underwriting_tasks
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM employees
      WHERE employees.user_id = auth.uid()
      AND employees.is_active = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM employees
      WHERE employees.user_id = auth.uid()
      AND employees.is_active = true
    )
  );

CREATE POLICY "Employees can view all followups"
  ON client_followups
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM employees
      WHERE employees.user_id = auth.uid()
      AND employees.is_active = true
    )
  );

CREATE POLICY "Employees can create followups"
  ON client_followups
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM employees
      WHERE employees.user_id = auth.uid()
      AND employees.is_active = true
    )
  );

CREATE POLICY "Employees can update followups"
  ON client_followups
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM employees
      WHERE employees.user_id = auth.uid()
      AND employees.is_active = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM employees
      WHERE employees.user_id = auth.uid()
      AND employees.is_active = true
    )
  );

CREATE INDEX IF NOT EXISTS idx_underwriting_tasks_application ON underwriting_tasks(application_id);
CREATE INDEX IF NOT EXISTS idx_underwriting_tasks_completed ON underwriting_tasks(is_completed);
CREATE INDEX IF NOT EXISTS idx_underwriting_tasks_due_date ON underwriting_tasks(due_date);
CREATE INDEX IF NOT EXISTS idx_underwriting_tasks_order ON underwriting_tasks(order_index);

CREATE INDEX IF NOT EXISTS idx_client_followups_application ON client_followups(application_id);
CREATE INDEX IF NOT EXISTS idx_client_followups_status ON client_followups(status);
CREATE INDEX IF NOT EXISTS idx_client_followups_scheduled ON client_followups(scheduled_date);
CREATE INDEX IF NOT EXISTS idx_client_followups_assigned ON client_followups(assigned_to);
