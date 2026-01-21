-- Migration: Add slug column to blog_posts table
-- Run this in your Supabase SQL Editor

-- Add slug column (nullable initially for existing posts)
ALTER TABLE public.blog_posts 
ADD COLUMN IF NOT EXISTS slug TEXT;

-- Create unique index on slug (only for non-null values)
CREATE UNIQUE INDEX IF NOT EXISTS idx_blog_posts_slug ON public.blog_posts(slug) WHERE slug IS NOT NULL;

-- Generate slugs for existing posts from their titles
-- Step 1: Replace Spanish characters and convert to lowercase
UPDATE public.blog_posts
SET slug = LOWER(
  REPLACE(
    REPLACE(
      REPLACE(
        REPLACE(
          REPLACE(
            REPLACE(title, 'á', 'a'),
            'é', 'e'
          ),
          'í', 'i'
        ),
        'ó', 'o'
      ),
      'ú', 'u'
    ),
    'ñ', 'n'
  )
)
WHERE slug IS NULL OR slug = '';

-- Step 2: Replace non-alphanumeric characters with hyphens
UPDATE public.blog_posts
SET slug = REGEXP_REPLACE(slug, '[^a-z0-9]+', '-', 'g')
WHERE slug IS NOT NULL;

-- Step 3: Remove leading/trailing hyphens and collapse multiple hyphens
UPDATE public.blog_posts
SET slug = TRIM(BOTH '-' FROM REGEXP_REPLACE(slug, '-+', '-', 'g'))
WHERE slug IS NOT NULL;

-- Handle duplicate slugs by appending a number
DO $$
DECLARE
  post_record RECORD;
  base_slug TEXT;
  new_slug TEXT;
  counter INTEGER;
BEGIN
  FOR post_record IN 
    SELECT id, slug FROM public.blog_posts 
    WHERE slug IS NOT NULL AND slug != ''
    ORDER BY created_at
  LOOP
    base_slug := post_record.slug;
    new_slug := base_slug;
    counter := 1;
    
    -- Check for duplicates and append number if needed
    WHILE EXISTS (
      SELECT 1 FROM public.blog_posts 
      WHERE slug = new_slug AND id != post_record.id
    ) LOOP
      new_slug := base_slug || '-' || counter;
      counter := counter + 1;
    END LOOP;
    
    -- Update if slug changed
    IF new_slug != post_record.slug THEN
      UPDATE public.blog_posts 
      SET slug = new_slug 
      WHERE id = post_record.id;
    END IF;
  END LOOP;
END $$;

-- Add comment
COMMENT ON COLUMN public.blog_posts.slug IS 'URL-friendly slug for blog posts, generated from title';
