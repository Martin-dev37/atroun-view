import { Link, useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { usePortalAccess } from '@/hooks/usePortalAccess';
import { useToast } from '@/hooks/use-toast';
import {
  Sidebar, SidebarContent, SidebarHeader, SidebarFooter,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarGroup,
  SidebarGroupLabel, SidebarGroupContent, SidebarSeparator
} from '@/components/ui/sidebar';
import {
  LayoutDashboard, Users, Mail, PhoneCall, Globe, Settings,
  TrendingUp, BarChart3, FileText, FolderLock, Briefcase,
  LogOut, ChevronRight, Shield
} from 'lucide-react';
import atrounLogo from '@/assets/atroun-logo.png';
import { cn } from '@/lib/utils';

const portalItems = [
  { label: 'Investor Portal', path: '/admin/portal/investor', icon: Briefcase, section: 'investor' },
  { label: 'Financial Projections', path: '/admin/portal/financial-projections', icon: TrendingUp, section: 'financial_projections' },
  { label: 'Impact Metrics', path: '/admin/portal/impact-metrics', icon: BarChart3, section: 'impact_metrics' },
  { label: 'Reports', path: '/admin/portal/reports', icon: FileText, section: 'reports' },
  { label: 'Data Room', path: '/admin/portal/data-room', icon: FolderLock, section: 'data_room' },
];

const adminItems = [
  { label: 'Users', path: '/admin/users', icon: Users },
  { label: 'Contacts / CRM', path: '/admin/contacts', icon: PhoneCall },
  { label: 'Email Campaigns', path: '/admin/emails', icon: Mail },
  { label: 'Content Editor', path: '/admin/content', icon: Globe },
];

const accountItems = [
  { label: 'Settings', path: '/admin/settings', icon: Settings },
];

export function AdminSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isAdmin, profile, roles } = useAuth();
  const { hasAccess } = usePortalAccess(user?.id);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({ title: 'Signed out successfully' });
    navigate('/admin/login');
  };

  const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(path + '/');

  const visiblePortalItems = portalItems.filter(item =>
    isAdmin || hasAccess(item.section)
  );

  return (
    <Sidebar className="border-r border-border">
      <SidebarHeader className="p-4 border-b border-border">
        <Link to="/admin" className="flex items-center gap-3">
          <img src={atrounLogo} alt="ATROUN" className="h-8" />
          <div>
            <p className="text-xs font-semibold text-foreground">ATROUN</p>
            <p className="text-[10px] text-muted-foreground">Admin Portal</p>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-2 py-4">
        {/* Overview */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={location.pathname === '/admin'}>
                  <Link to="/admin" className="flex items-center gap-3">
                    <LayoutDashboard className="h-4 w-4" />
                    <span>Overview</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        {/* Portal Sections */}
        {visiblePortalItems.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 py-2">
              Portals
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {visiblePortalItems.map(item => (
                  <SidebarMenuItem key={item.path}>
                    <SidebarMenuButton asChild isActive={isActive(item.path)}>
                      <Link to={item.path} className="flex items-center gap-3">
                        <item.icon className="h-4 w-4" />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* Admin Management */}
        {isAdmin && (
          <>
            <SidebarSeparator />
            <SidebarGroup>
              <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 py-2 flex items-center gap-2">
                <Shield className="h-3 w-3" />
                Management
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {adminItems.map(item => (
                    <SidebarMenuItem key={item.path}>
                      <SidebarMenuButton asChild isActive={isActive(item.path)}>
                        <Link to={item.path} className="flex items-center gap-3">
                          <item.icon className="h-4 w-4" />
                          <span>{item.label}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </>
        )}
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-border space-y-1">
        <div className="flex items-center gap-3 mb-2 px-2">
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-xs font-semibold text-primary">
              {profile?.display_name?.charAt(0).toUpperCase() ?? '?'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{profile?.display_name ?? 'User'}</p>
            <p className="text-xs text-muted-foreground truncate">{profile?.email}</p>
          </div>
        </div>
        {accountItems.map(item => (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              'w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors',
              isActive(item.path)
                ? 'bg-sidebar-accent text-foreground'
                : 'text-muted-foreground hover:text-foreground hover:bg-sidebar-accent'
            )}
          >
            <item.icon className="h-4 w-4" />
            <span>{item.label}</span>
          </Link>
        ))}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-sidebar-accent rounded-lg transition-colors"
        >
          <LogOut className="h-4 w-4" />
          <span>Sign Out</span>
        </button>
      </SidebarFooter>
    </Sidebar>
  );
}
