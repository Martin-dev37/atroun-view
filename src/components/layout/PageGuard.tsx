import { ReactNode } from 'react';
import { usePage } from '@/hooks/useCMS';
import NotFound from '@/pages/NotFound';

interface PageGuardProps {
  slug: string;
  children: ReactNode;
}

/**
 * Wrapper component that checks if a page is published in the CMS.
 * If the page exists but is_published is false, shows 404.
 * If page doesn't exist in CMS or is published, renders children normally.
 */
export function PageGuard({ slug, children }: PageGuardProps) {
  const { data: page, isLoading } = usePage(slug);
  
  // While loading, render children to avoid flash
  if (isLoading) {
    return <>{children}</>;
  }
  
  // If page exists in CMS and is explicitly not published, show 404
  // Note: usePage already filters by is_published=true, so if page is null
  // it could mean either: page doesn't exist OR page exists but is unpublished
  // We treat both cases the same - if no published page found, show 404
  if (page === null) {
    return <NotFound />;
  }
  
  return <>{children}</>;
}
