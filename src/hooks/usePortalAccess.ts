import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function usePortalAccess(userId: string | undefined) {
  const [accessibleSections, setAccessibleSections] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }
    supabase
      .from('portal_access')
      .select('portal_section')
      .eq('user_id', userId)
      .then(({ data }) => {
        setAccessibleSections(data?.map(r => r.portal_section) ?? []);
        setLoading(false);
      });
  }, [userId]);

  const hasAccess = (section: string) => accessibleSections.includes(section);

  return { accessibleSections, hasAccess, loading };
}
