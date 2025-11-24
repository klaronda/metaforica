-- Create email_subscribers table
CREATE TABLE IF NOT EXISTS email_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true,
  pref_blog_posts BOOLEAN DEFAULT true,
  pref_books BOOLEAN DEFAULT true,
  pref_podcast BOOLEAN DEFAULT true,
  pref_workshops BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_email_subscribers_email ON email_subscribers(email);
CREATE INDEX IF NOT EXISTS idx_email_subscribers_active ON email_subscribers(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_email_subscribers_subscribed_at ON email_subscribers(subscribed_at DESC);

-- Enable Row Level Security
ALTER TABLE email_subscribers ENABLE ROW LEVEL SECURITY;

-- Create policy: Anyone can insert (for public subscribe forms)
CREATE POLICY "Anyone can insert email subscribers"
  ON email_subscribers
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Create policy: Only authenticated users can read email subscribers
CREATE POLICY "Authenticated users can read email subscribers"
  ON email_subscribers
  FOR SELECT
  TO authenticated
  USING (true);

-- Create policy: Anyone can update their own preferences by email (for preferences page)
CREATE POLICY "Anyone can update email subscribers by email"
  ON email_subscribers
  FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_email_subscribers_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_email_subscribers_updated_at
  BEFORE UPDATE ON email_subscribers
  FOR EACH ROW
  EXECUTE FUNCTION update_email_subscribers_updated_at();

