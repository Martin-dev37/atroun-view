import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { AdminSidebar } from './AdminSidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Loader2 } from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  requiredPortalSection?: string;
}

export function AdminLayout({ children, requireAdmin = false, requiredPortalSection }: AdminLayoutProps) {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();

  // Ensure native pointer cursor on admin routes (no avocado cursor)
  useEffect(() => {
    document.body.classList.add('admin-route');
    return () => {
      document.body.classList.remove('admin-route');
    };
  }, []);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate('/admin/login');
      } else if (requireAdmin && !isAdmin) {
        navigate('/admin');
      }
    }
  }, [user, isAdmin, loading, navigate, requireAdmin]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AdminSidebar />
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}
