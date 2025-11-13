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
CREATE TABLE public.gallery_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  header service_type NOT NULL,
  image_url TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.gallery_items ENABLE ROW LEVEL SECURITY;

-- Allow public read access to gallery
CREATE POLICY "Anyone can view gallery items"
  ON public.gallery_items
  FOR SELECT
  USING (true);

-- Create storage bucket for gallery images
INSERT INTO storage.buckets (id, name, public)
VALUES ('gallery', 'gallery', true);

-- Storage policies for gallery bucket
CREATE POLICY "Public can view gallery images"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'gallery');

-- Create user roles enum and table
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check admin role
CREATE OR REPLACE FUNCTION public.is_admin(check_user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = check_user_id
    AND role = 'admin'
  )
$$;

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

-- Storage policies for admin uploads
CREATE POLICY "Admins can upload gallery images"
  ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'gallery' AND public.is_admin(auth.uid()));

CREATE POLICY "Admins can update gallery images"
  ON storage.objects
  FOR UPDATE
  USING (bucket_id = 'gallery' AND public.is_admin(auth.uid()));

CREATE POLICY "Admins can delete gallery images"
  ON storage.objects
  FOR DELETE
  USING (bucket_id = 'gallery' AND public.is_admin(auth.uid()));

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for gallery_items
CREATE TRIGGER update_gallery_items_updated_at
BEFORE UPDATE ON public.gallery_items
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();