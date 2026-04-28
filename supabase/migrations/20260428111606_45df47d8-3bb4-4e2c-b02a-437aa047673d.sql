-- 1. Revoke public EXECUTE on SECURITY DEFINER helpers
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon, authenticated;
-- has_role is still callable from RLS policies (executes as definer in policy context)

-- 2. Replace overly broad public SELECT on media-assets bucket so listing is blocked
DROP POLICY IF EXISTS "Public read media assets" ON storage.objects;

-- Allow public read of individual objects (needed for <img src> from the bucket)
-- but disallow listing/enumeration via storage.objects queries by anon users.
CREATE POLICY "Public can read media asset objects"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'media-assets');

-- Note: anonymous users can still load files via the public CDN URL because the
-- bucket is public; they just can't enumerate the table.