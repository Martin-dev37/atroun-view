import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Page {
  id: string;
  slug: string;
  title: string;
  is_enabled: boolean;
  is_custom: boolean;
}

// Default pages that always exist in the navigation
const defaultPages = [
  { slug: '', title: 'Home' },
  { slug: 'about', title: 'About' },
  { slug: 'what-we-do', title: 'What We Do' },
  { slug: 'technology', title: 'Technology' },
  { slug: 'markets', title: 'Markets' },
  { slug: 'sustainability', title: 'Sustainability' },
  { slug: 'investors', title: 'Investors' },
  { slug: 'contact', title: 'Contact' },
];

export const useEnabledPages = () => {
  const [pages, setPages] = useState<{ name: string; href: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPages = async () => {
      const { data, error } = await supabase
        .from('pages')
        .select('id, slug, title, is_enabled, is_custom')
        .eq('is_enabled', true)
        .order('display_order', { ascending: true });

      if (error || !data || data.length === 0) {
        // Fallback to default pages if database is empty or error
        setPages(defaultPages.map(p => ({
          name: p.title,
          href: p.slug === '' ? '/' : `/${p.slug}`,
        })));
      } else {
        setPages(data.map((page: Page) => ({
          name: page.title,
          href: page.slug === '' || page.slug === 'home' ? '/' : `/${page.slug}`,
        })));
      }
      setLoading(false);
    };

    fetchPages();

    // Subscribe to realtime updates
    const channel = supabase
      .channel('pages-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'pages' },
        () => {
          fetchPages();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { pages, loading };
};
