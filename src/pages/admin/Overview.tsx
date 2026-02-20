import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { useAuth } from '@/hooks/useAuth';
import { usePortalAccess } from '@/hooks/usePortalAccess';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Briefcase, TrendingUp, BarChart3, FileText, FolderLock,
  Users, PhoneCall, Mail, Globe, ArrowRight, Activity
} from 'lucide-react';

export default function AdminOverview() {
  const { user, isAdmin, profile, roles } = useAuth();
  const { accessibleSections } = usePortalAccess(user?.id);
  const [stats, setStats] = useState({ contacts: 0, campaigns: 0, documents: 0, users: 0 });

  useEffect(() => {
    if (isAdmin) {
      Promise.all([
        supabase.from('crm_contacts').select('id', { count: 'exact', head: true }),
        supabase.from('email_campaigns').select('id', { count: 'exact', head: true }),
        supabase.from('portal_documents').select('id', { count: 'exact', head: true }),
        supabase.from('profiles').select('id', { count: 'exact', head: true }),
      ]).then(([contacts, campaigns, docs, users]) => {
        setStats({
          contacts: contacts.count ?? 0,
          campaigns: campaigns.count ?? 0,
          documents: docs.count ?? 0,
          users: users.count ?? 0,
        });
      });
    }
  }, [isAdmin]);

  const portalCards = [
    { label: 'Investor Portal', path: '/admin/portal/investor', icon: Briefcase, section: 'investor', desc: 'Access financial documents & AI assistant' },
    { label: 'Financial Projections', path: '/admin/portal/financial-projections', icon: TrendingUp, section: 'financial_projections', desc: 'Revenue forecasts & financial models' },
    { label: 'Impact Metrics', path: '/admin/portal/impact-metrics', icon: BarChart3, section: 'impact_metrics', desc: 'ESG data & sustainability impact' },
    { label: 'Reports', path: '/admin/portal/reports', icon: FileText, section: 'reports', desc: 'Download company reports' },
    { label: 'Data Room', path: '/admin/portal/data-room', icon: FolderLock, section: 'data_room', desc: 'Confidential due diligence files' },
  ];

  const adminCards = [
    { label: 'Users', path: '/admin/users', icon: Users, desc: `${stats.users} registered users`, value: stats.users },
    { label: 'Contacts / CRM', path: '/admin/contacts', icon: PhoneCall, desc: `${stats.contacts} contacts`, value: stats.contacts },
    { label: 'Email Campaigns', path: '/admin/emails', icon: Mail, desc: `${stats.campaigns} campaigns`, value: stats.campaigns },
    { label: 'Content Editor', path: '/admin/content', icon: Globe, desc: 'Edit website & portal content', value: null },
  ];

  const visiblePortalCards = portalCards.filter(c => isAdmin || accessibleSections.includes(c.section));

  return (
    <AdminLayout>
      <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-1">
          <h1 className="text-3xl font-display font-semibold text-foreground">
            Welcome back, {profile?.display_name ?? 'User'} 👋
          </h1>
          <p className="text-muted-foreground">
            {isAdmin ? 'You have full admin access.' : `You have access to ${accessibleSections.length} portal section(s).`}
          </p>
        </div>

        {/* Portal Sections */}
        {visiblePortalCards.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-lg font-display font-semibold text-foreground flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Portal Sections
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {visiblePortalCards.map(card => (
                <Link key={card.path} to={card.path}>
                  <Card className="h-full hover:shadow-elevated transition-all duration-300 hover:-translate-y-0.5 group cursor-pointer border-border">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                          <card.icon className="h-5 w-5 text-primary" />
                        </div>
                        <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <h3 className="font-semibold text-foreground">{card.label}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{card.desc}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Admin Stats */}
        {isAdmin && (
          <div className="space-y-4">
            <h2 className="text-lg font-display font-semibold text-foreground flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Management
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {adminCards.map(card => (
                <Link key={card.path} to={card.path}>
                  <Card className="h-full hover:shadow-elevated transition-all duration-300 hover:-translate-y-0.5 group cursor-pointer border-border">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <div className="h-10 w-10 rounded-xl bg-accent/10 flex items-center justify-center">
                          <card.icon className="h-5 w-5 text-accent" />
                        </div>
                        {card.value !== null && (
                          <span className="text-2xl font-display font-bold text-foreground">{card.value}</span>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <h3 className="font-semibold text-foreground">{card.label}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{card.desc}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
