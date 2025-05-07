
-- Add columns for video consultations
DO $$ 
BEGIN
    -- Add room_id column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name='appointments' AND column_name='room_id') THEN
        ALTER TABLE appointments ADD COLUMN room_id TEXT;
    END IF;

    -- Add time_slot column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name='appointments' AND column_name='time_slot') THEN
        ALTER TABLE appointments ADD COLUMN time_slot TEXT;
    END IF;

    -- Add patient_notes column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name='appointments' AND column_name='patient_notes') THEN
        ALTER TABLE appointments ADD COLUMN patient_notes TEXT;
    END IF;
END $$;
