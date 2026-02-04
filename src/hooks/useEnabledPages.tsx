import { useEffect, useState } from 'react';

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
    // Use default pages (Supabase will be enabled later)
    setPages(defaultPages.map(p => ({
      name: p.title,
      href: p.slug === '' ? '/' : `/${p.slug}`,
    })));
    setLoading(false);
  }, []);

  return { pages, loading };
};
