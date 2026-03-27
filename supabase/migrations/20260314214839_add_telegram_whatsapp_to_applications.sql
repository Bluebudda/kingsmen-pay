-- Add Telegram and WhatsApp fields to applications table
--
-- 1. Changes
--    - Add telegram field (optional)
--    - Add whatsapp field (optional)
--    - Add step_completed field to track progress
--
-- 2. Notes
--    - step_completed tracks which step user last saved (1-3)
--    - Allows for auto-save functionality

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'applications' AND column_name = 'telegram'
  ) THEN
    ALTER TABLE applications ADD COLUMN telegram text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'applications' AND column_name = 'whatsapp'
  ) THEN
    ALTER TABLE applications ADD COLUMN whatsapp text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'applications' AND column_name = 'step_completed'
  ) THEN
    ALTER TABLE applications ADD COLUMN step_completed integer DEFAULT 0;
  END IF;
END $$;
