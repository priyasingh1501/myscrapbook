-- Run this SQL in your Supabase SQL Editor to create the notes table

CREATE TABLE IF NOT EXISTS notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  "visibleToOthers" BOOLEAN DEFAULT false,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (optional, but recommended)
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows anyone to read and insert notes
-- (You can customize this based on your security needs)
CREATE POLICY "Allow public read access" ON notes
  FOR SELECT USING (true);

CREATE POLICY "Allow public insert access" ON notes
  FOR INSERT WITH CHECK (true);

-- Create an index for better query performance
CREATE INDEX IF NOT EXISTS idx_notes_created_at ON notes("createdAt" DESC);
CREATE INDEX IF NOT EXISTS idx_notes_visible ON notes("visibleToOthers");

