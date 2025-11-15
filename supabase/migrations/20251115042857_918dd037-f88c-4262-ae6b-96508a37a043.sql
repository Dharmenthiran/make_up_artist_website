-- Create gallery_images table to support multiple images per gallery item
CREATE TABLE IF NOT EXISTS public.gallery_images (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  gallery_item_id UUID NOT NULL REFERENCES public.gallery_items(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on gallery_images
ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;

-- RLS Policies for gallery_images
CREATE POLICY "Anyone can view gallery images"
  ON public.gallery_images
  FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert gallery images"
  ON public.gallery_images
  FOR INSERT
  WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Admins can update gallery images"
  ON public.gallery_images
  FOR UPDATE
  USING (is_admin(auth.uid()));

CREATE POLICY "Admins can delete gallery images"
  ON public.gallery_images
  FOR DELETE
  USING (is_admin(auth.uid()));

-- Create index for faster queries
CREATE INDEX idx_gallery_images_item_id ON public.gallery_images(gallery_item_id);
CREATE INDEX idx_gallery_images_order ON public.gallery_images(gallery_item_id, display_order);