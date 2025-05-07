
-- Add room_id, time_slot and patient_notes columns to appointments table
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS room_id TEXT;
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS time_slot TEXT;
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS patient_notes TEXT;
