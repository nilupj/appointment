
-- Add room_id and time_slot columns to appointments table
ALTER TABLE appointments 
ADD COLUMN IF NOT EXISTS room_id TEXT,
ADD COLUMN IF NOT EXISTS time_slot TEXT;
