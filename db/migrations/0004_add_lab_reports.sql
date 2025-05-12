
CREATE TABLE IF NOT EXISTS lab_reports (
  id SERIAL PRIMARY KEY,
  booking_id INTEGER REFERENCES lab_bookings(id),
  report_url TEXT NOT NULL,
  uploaded_at TIMESTAMP NOT NULL DEFAULT NOW(),
  status TEXT NOT NULL DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);
