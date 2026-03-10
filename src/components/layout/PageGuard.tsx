import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { usePublishedPages } from '@/hooks/useCMS';

interface PageGuardProps {
  slug: string;
  children: ReactNode;
}

export function PageGuard({ slug, children }: PageGuardProps) {
  const { data: pages, isLoading } = usePublishedPages();

  // While loading, render nothing to avoid flash
  if (isLoading) return null;

  const isPublished = pages?.some(p => p.slug === slug);

  if (!isPublished) {
    return <Navigate to="/not-found" replace />;
  }

  return <>{children}</>;
}
