-- Complete blog_posts table schema for Metaforica
-- Run this in your Supabase SQL Editor

-- Create the blog_posts table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Core content fields
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  
  -- Metadata
  category TEXT,
  tags TEXT[] DEFAULT '{}',
  
  -- Publishing
  publish_date DATE NOT NULL DEFAULT CURRENT_DATE,
  is_published BOOLEAN DEFAULT false,
  
  -- SEO
  seo_title TEXT,
  seo_description TEXT,
  
  -- Images
  featured_image_url TEXT,
  featured_image_path TEXT,
  
  -- Metrics
  read_time INTEGER DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON public.blog_posts(is_published);
CREATE INDEX IF NOT EXISTS idx_blog_posts_publish_date ON public.blog_posts(publish_date DESC);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON public.blog_posts(category);

-- Enable Row Level Security
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read published posts
DROP POLICY IF EXISTS "Public posts are viewable by everyone" ON public.blog_posts;
CREATE POLICY "Public posts are viewable by everyone"
ON public.blog_posts FOR SELECT
USING (is_published = true);

-- Policy: Authenticated users can manage all posts (for CMS)
DROP POLICY IF EXISTS "Authenticated users can manage posts" ON public.blog_posts;
CREATE POLICY "Authenticated users can manage posts"
ON public.blog_posts FOR ALL
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

-- Add comment
COMMENT ON TABLE public.blog_posts IS 'Blog posts for Metaforica website, including imported Medium posts';

