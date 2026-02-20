-- Create media assets storage bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'media-assets',
  'media-assets',
  true,
  10485760, -- 10MB
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']
) ON CONFLICT (id) DO NOTHING;

-- Public read policy for media assets
CREATE POLICY "Public read media assets"
ON storage.objects FOR SELECT
USING (bucket_id = 'media-assets');

-- Admins can upload media assets
CREATE POLICY "Admins upload media assets"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'media-assets' AND
  has_role(auth.uid(), 'admin'::app_role)
);

-- Admins can delete media assets
CREATE POLICY "Admins delete media assets"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'media-assets' AND
  has_role(auth.uid(), 'admin'::app_role)
);