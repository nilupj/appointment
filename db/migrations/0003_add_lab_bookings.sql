
CREATE TABLE IF NOT EXISTS lab_bookings (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  test_id INTEGER REFERENCES lab_tests(id),
  patient_name TEXT NOT NULL,
  patient_age TEXT NOT NULL,
  patient_gender TEXT NOT NULL,
  patient_phone TEXT NOT NULL,
  collection_address TEXT,
  booking_date TIMESTAMP NOT NULL,
  time_slot TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);
