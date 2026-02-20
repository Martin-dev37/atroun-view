import { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { UserPlus, Mail, Trash2, Loader2, Shield, Users, Eye } from 'lucide-react';

interface UserWithRole {
  user_id: string;
  email: string;
  display_name: string;
  roles: string[];
  portal_access: string[];
}

const PORTAL_SECTIONS = ['investor', 'financial_projections', 'impact_metrics', 'reports', 'data_room'];
const PORTAL_LABELS: Record<string, string> = {
  investor: 'Investor Portal',
  financial_projections: 'Financial Projections',
  impact_metrics: 'Impact Metrics',
  reports: 'Reports',
  data_room: 'Data Room',
};

export default function UsersPage() {
  const { isAdmin } = useAuth();
  const { toast } = useToast();
  const [users, setUsers] = useState<UserWithRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteLoading, setInviteLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserWithRole | null>(null);
  const [accessDialogOpen, setAccessDialogOpen] = useState(false);

  useEffect(() => {
    if (isAdmin) loadUsers();
  }, [isAdmin]);

  async function loadUsers() {
    const { data: profiles } = await supabase.from('profiles').select('*');
    if (!profiles) { setLoading(false); return; }

    const userIds = profiles.map(p => p.user_id);

    const [rolesRes, accessRes] = await Promise.all([
      supabase.from('user_roles').select('*').in('user_id', userIds),
      supabase.from('portal_access').select('*').in('user_id', userIds),
    ]);

    const rolesMap: Record<string, string[]> = {};
    const accessMap: Record<string, string[]> = {};
    rolesRes.data?.forEach(r => {
      if (!rolesMap[r.user_id]) rolesMap[r.user_id] = [];
      rolesMap[r.user_id].push(r.role);
    });
    accessRes.data?.forEach(a => {
      if (!accessMap[a.user_id]) accessMap[a.user_id] = [];
      accessMap[a.user_id].push(a.portal_section);
    });

    const combined: UserWithRole[] = profiles.map(p => ({
      user_id: p.user_id,
      email: p.email ?? '',
      display_name: p.display_name ?? '',
      roles: rolesMap[p.user_id] ?? [],
      portal_access: accessMap[p.user_id] ?? [],
    }));

    setUsers(combined);
    setLoading(false);
  }

  async function handleInvite() {
    if (!inviteEmail) return;
    setInviteLoading(true);
    const { error } = await supabase.auth.admin?.inviteUserByEmail?.(inviteEmail) ?? { error: { message: 'Not supported' } };
    // Since admin invites require service role, we'll create a placeholder notification
    toast({
      title: 'Invitation note',
      description: `User ${inviteEmail} can be added manually. Share the login link and have them sign up.`,
    });
    setInviteEmail('');
    setInviteLoading(false);
  }

  async function togglePortalAccess(userId: string, section: string, hasAccess: boolean) {
    if (hasAccess) {
      await supabase.from('portal_access').delete().eq('user_id', userId).eq('portal_section', section);
    } else {
      await supabase.from('portal_access').insert({ user_id: userId, portal_section: section });
    }
    loadUsers();
  }

  async function toggleAdminRole(userId: string, isCurrentlyAdmin: boolean) {
    if (isCurrentlyAdmin) {
      await supabase.from('user_roles').delete().eq('user_id', userId).eq('role', 'admin');
    } else {
      await supabase.from('user_roles').insert({ user_id: userId, role: 'admin' });
    }
    loadUsers();
  }

  if (!isAdmin) return <AdminLayout><div className="p-8 text-center text-muted-foreground">Access restricted to administrators.</div></AdminLayout>;

  return (
    <AdminLayout requireAdmin>
      <div className="p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-display font-semibold text-foreground">Users</h1>
            <p className="text-muted-foreground mt-1">Manage user access and permissions</p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button><UserPlus className="h-4 w-4 mr-2" />Invite User</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Invite New User</DialogTitle></DialogHeader>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Share the login page link with the user and have them sign up. Then manage their access below.
                </p>
                <div className="bg-muted rounded-lg p-3">
                  <p className="text-xs text-muted-foreground mb-1">Login URL</p>
                  <p className="text-sm font-mono break-all">{window.location.origin}/admin/login</p>
                </div>
                <div className="space-y-2">
                  <Label>User Email (for your reference)</Label>
                  <Input
                    type="email"
                    placeholder="user@example.com"
                    value={inviteEmail}
                    onChange={e => setInviteEmail(e.target.value)}
                  />
                </div>
                <Button className="w-full" onClick={handleInvite} disabled={inviteLoading}>
                  <Mail className="h-4 w-4 mr-2" />Send Invite Note
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card><CardContent className="pt-5"><p className="text-2xl font-display font-bold">{users.length}</p><p className="text-sm text-muted-foreground">Total Users</p></CardContent></Card>
          <Card><CardContent className="pt-5"><p className="text-2xl font-display font-bold">{users.filter(u => u.roles.includes('admin')).length}</p><p className="text-sm text-muted-foreground">Admins</p></CardContent></Card>
          <Card><CardContent className="pt-5"><p className="text-2xl font-display font-bold">{users.filter(u => u.portal_access.length > 0).length}</p><p className="text-sm text-muted-foreground">Portal Users</p></CardContent></Card>
          <Card><CardContent className="pt-5"><p className="text-2xl font-display font-bold">{users.filter(u => u.roles.length === 0 && u.portal_access.length === 0).length}</p><p className="text-sm text-muted-foreground">No Access</p></CardContent></Card>
        </div>

        {/* Users table */}
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Users className="h-5 w-5 text-primary" />All Users</CardTitle></CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-8"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Roles</TableHead>
                    <TableHead>Portal Access</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map(user => (
                    <TableRow key={user.user_id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-xs font-semibold text-primary">{user.display_name.charAt(0).toUpperCase()}</span>
                          </div>
                          <div>
                            <p className="font-medium text-sm">{user.display_name}</p>
                            <p className="text-xs text-muted-foreground">{user.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1 flex-wrap">
                          {user.roles.length === 0 ? (
                            <Badge variant="outline" className="text-xs">No role</Badge>
                          ) : user.roles.map(r => (
                            <Badge key={r} variant={r === 'admin' ? 'default' : 'secondary'} className="text-xs capitalize">{r}</Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1 flex-wrap">
                          {user.portal_access.length === 0 ? (
                            <span className="text-xs text-muted-foreground">None</span>
                          ) : user.portal_access.map(s => (
                            <Badge key={s} variant="outline" className="text-xs">{PORTAL_LABELS[s] ?? s}</Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => { setSelectedUser(user); setAccessDialogOpen(true); }}
                        >
                          <Eye className="h-3 w-3 mr-1" />Manage
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Access management dialog */}
      <Dialog open={accessDialogOpen} onOpenChange={setAccessDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Manage Access — {selectedUser?.display_name}</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-sm font-semibold flex items-center gap-2"><Shield className="h-4 w-4 text-primary" />Role</h3>
                <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                  <Checkbox
                    id="admin-role"
                    checked={selectedUser.roles.includes('admin')}
                    onCheckedChange={checked => {
                      toggleAdminRole(selectedUser.user_id, selectedUser.roles.includes('admin'));
                      setSelectedUser(prev => prev ? {
                        ...prev,
                        roles: checked
                          ? [...prev.roles, 'admin']
                          : prev.roles.filter(r => r !== 'admin')
                      } : null);
                    }}
                  />
                  <label htmlFor="admin-role" className="text-sm font-medium cursor-pointer">Administrator — Full access to all features</label>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-semibold">Portal Section Access</h3>
                <div className="space-y-2">
                  {PORTAL_SECTIONS.map(section => {
                    const hasAccess = selectedUser.portal_access.includes(section);
                    return (
                      <div key={section} className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                        <Checkbox
                          id={section}
                          checked={hasAccess}
                          onCheckedChange={() => {
                            togglePortalAccess(selectedUser.user_id, section, hasAccess);
                            setSelectedUser(prev => prev ? {
                              ...prev,
                              portal_access: hasAccess
                                ? prev.portal_access.filter(s => s !== section)
                                : [...prev.portal_access, section]
                            } : null);
                          }}
                        />
                        <label htmlFor={section} className="text-sm cursor-pointer">{PORTAL_LABELS[section]}</label>
                      </div>
                    );
                  })}
                </div>
              </div>

              <Button className="w-full" onClick={() => { setAccessDialogOpen(false); toast({ title: 'Access updated' }); }}>
                Done
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
