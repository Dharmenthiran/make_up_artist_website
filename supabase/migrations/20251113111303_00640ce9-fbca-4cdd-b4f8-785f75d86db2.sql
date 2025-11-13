-- Drop existing enum if needed and recreate
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'service_type') THEN
    DROP TYPE public.service_type CASCADE;
  END IF;
END $$;

-- Create enum for service types
CREATE TYPE public.service_type AS ENUM (
  'Wedding Makeup',
  'Reception Makeup',
  'Baby Shower Makeup',
  'Engagement Makeup',
  'Guest Makeup',
  'Saree Draping',
  'Saree Pre-Pleating',
  'Hairstyle'
);

-- Create gallery items table
CREATE TABLE IF NOT EXISTS public.gallery_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  header service_type NOT NULL,
  image_url TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.gallery_items ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can view gallery items" ON public.gallery_items;
DROP POLICY IF EXISTS "Admins can insert gallery items" ON public.gallery_items;
DROP POLICY IF EXISTS "Admins can update gallery items" ON public.gallery_items;
DROP POLICY IF EXISTS "Admins can delete gallery items" ON public.gallery_items;

-- Allow public read access to gallery
CREATE POLICY "Anyone can view gallery items"
  ON public.gallery_items
  FOR SELECT
  USING (true);

-- Only admins can insert/update/delete gallery items
CREATE POLICY "Admins can insert gallery items"
  ON public.gallery_items
  FOR INSERT
  WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update gallery items"
  ON public.gallery_items
  FOR UPDATE
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can delete gallery items"
  ON public.gallery_items
  FOR DELETE
  USING (public.is_admin(auth.uid()));

-- Trigger for gallery_items
DROP TRIGGER IF EXISTS update_gallery_items_updated_at ON public.gallery_items;
CREATE TRIGGER update_gallery_items_updated_at
BEFORE UPDATE ON public.gallery_items
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();