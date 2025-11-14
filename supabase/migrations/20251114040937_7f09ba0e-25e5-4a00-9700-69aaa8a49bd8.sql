-- Add header column to gallery_items table to store service type
ALTER TABLE public.gallery_items 
ADD COLUMN IF NOT EXISTS header text NOT NULL DEFAULT 'Wedding Makeup';

-- Add index for better query performance when filtering by header
CREATE INDEX IF NOT EXISTS idx_gallery_items_header ON public.gallery_items(header);