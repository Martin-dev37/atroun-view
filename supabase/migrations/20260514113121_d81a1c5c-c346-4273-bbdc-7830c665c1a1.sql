
-- 1. Explicit admin-only SELECT policy on crm_contacts (defense in depth)
CREATE POLICY "Admins can view all contacts"
ON public.crm_contacts
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- 2. Tighten portal-documents storage SELECT policy
DROP POLICY IF EXISTS "Authorized users can download documents" ON storage.objects;

CREATE POLICY "Authorized users can download documents"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'portal-documents'
  AND (
    has_role(auth.uid(), 'admin'::app_role)
    OR EXISTS (
      SELECT 1 FROM public.portal_access pa
      WHERE pa.user_id = auth.uid()
        AND pa.portal_section = (storage.foldername(name))[1]
    )
  )
);
