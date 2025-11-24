-- Create wattpad_stories table
CREATE TABLE IF NOT EXISTS wattpad_stories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  wattpad_id VARCHAR UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  cover_image_url TEXT,
  story_url TEXT NOT NULL,
  tags TEXT[],
  read_count INTEGER DEFAULT 0,
  vote_count INTEGER DEFAULT 0,
  comment_count INTEGER DEFAULT 0,
  part_count INTEGER DEFAULT 0,
  language VARCHAR DEFAULT 'es',
  is_completed BOOLEAN DEFAULT false,
  is_visible BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  last_synced_at TIMESTAMP
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_wattpad_stories_wattpad_id ON wattpad_stories(wattpad_id);
CREATE INDEX IF NOT EXISTS idx_wattpad_stories_is_visible ON wattpad_stories(is_visible);
CREATE INDEX IF NOT EXISTS idx_wattpad_stories_is_featured ON wattpad_stories(is_featured);

-- Enable Row Level Security
ALTER TABLE wattpad_stories ENABLE ROW LEVEL SECURITY;

-- Policy: Allow public read access to visible stories
CREATE POLICY "Public can view visible Wattpad stories"
  ON wattpad_stories
  FOR SELECT
  USING (is_visible = true);

-- Policy: Authenticated users can do everything (for CMS)
CREATE POLICY "Authenticated users can manage Wattpad stories"
  ON wattpad_stories
  FOR ALL
  USING (auth.role() = 'authenticated');

-- Comment on table
COMMENT ON TABLE wattpad_stories IS 'Stores synced stories from Wattpad profile @SoyMetaforica';


