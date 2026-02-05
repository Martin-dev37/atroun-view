 import { ReactNode } from 'react';
 import { usePage } from '@/hooks/useCMS';
 import NotFound from '@/pages/NotFound';
 
 interface PageGuardProps {
   slug: string;
   children: ReactNode;
   fallbackEnabled?: boolean; // Allow page to render if CMS fails
 }
 
 export function PageGuard({ slug, children, fallbackEnabled = true }: PageGuardProps) {
   const { data: page, isLoading, isError } = usePage(slug);
 
   // While loading, show children (prevents flash)
   if (isLoading) {
     return <>{children}</>;
   }
 
   // If CMS error and fallback is enabled, show page anyway
   if (isError && fallbackEnabled) {
     return <>{children}</>;
   }
 
   // If page doesn't exist or is not published, show 404
   if (!page) {
     return <NotFound />;
   }
 
   return <>{children}</>;
 }