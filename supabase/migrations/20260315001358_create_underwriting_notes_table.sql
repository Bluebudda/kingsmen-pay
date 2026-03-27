/*
  # Create Underwriting Notes System

  1. New Tables
    - `underwriting_notes`
      - `id` (uuid, primary key)
      - `application_id` (uuid, foreign key to applications)
      - `note_text` (text, the note content)
      - `note_type` (text, type of note: general, compliance, risk, follow_up)
      - `is_internal` (boolean, whether note is internal only)
      - `created_by` (uuid, foreign key to employees)
      - `created_at` (timestamptz, timestamp of creation)
      - `updated_at` (timestamptz, timestamp of last update)

  2. Security
    - Enable RLS on `underwriting_notes` table
    - Add policies for employees to manage notes

  3. Important Notes
    - Notes can be marked as internal (not visible to customers)
    - Different note types help categorize information
    - All notes are timestamped and attributed to an employee
*/

CREATE TABLE IF NOT EXISTS underwriting_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id uuid NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
  note_text text NOT NULL,
  note_type text NOT NULL DEFAULT 'general',
  is_internal boolean NOT NULL DEFAULT true,
  created_by uuid REFERENCES employees(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE underwriting_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Employees can view all notes"
  ON underwriting_notes
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM employees
      WHERE employees.user_id = auth.uid()
      AND employees.is_active = true
    )
  );

CREATE POLICY "Employees can create notes"
  ON underwriting_notes
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM employees
      WHERE employees.user_id = auth.uid()
      AND employees.is_active = true
      AND employees.id = created_by
    )
  );

CREATE POLICY "Employees can update their own notes"
  ON underwriting_notes
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM employees
      WHERE employees.user_id = auth.uid()
      AND employees.is_active = true
      AND employees.id = created_by
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM employees
      WHERE employees.user_id = auth.uid()
      AND employees.is_active = true
      AND employees.id = created_by
    )
  );

CREATE INDEX IF NOT EXISTS idx_underwriting_notes_application ON underwriting_notes(application_id);
CREATE INDEX IF NOT EXISTS idx_underwriting_notes_created_by ON underwriting_notes(created_by);
CREATE INDEX IF NOT EXISTS idx_underwriting_notes_created_at ON underwriting_notes(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_underwriting_notes_note_type ON underwriting_notes(note_type);
