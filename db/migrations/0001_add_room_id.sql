
-- Add room_id and time_slot columns to appointments table
ALTER TABLE appointments
ADD COLUMN room_id text,
ADD COLUMN time_slot text;
