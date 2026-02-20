import { useEffect, useState, useRef } from 'react';
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
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import {
  UserPlus, Trash2, Loader2, Shield, Users, Eye, Search,
  ChevronLeft, ChevronRight, Upload, Download, AlertCircle, CheckCircle2,
} from 'lucide-react';

interface UserWithRole {
  user_id: string;
  email: string;
  display_name: string;
  created_at: string;
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

const PAGE_SIZE = 50;

// Call our manage-users edge function
async function callManageUsers(action: string, payload: Record<string, any> = {}) {
  const { data: { session } } = await supabase.auth.getSession();
  const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/manage-users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session?.access_token}`,
      'apikey': import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
    },
    body: JSON.stringify({ action, ...payload }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

export default function UsersPage() {
  const { isAdmin } = useAuth();
  const { toast } = useToast();

  // List state
  const [users, setUsers] = useState<UserWithRole[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, admins: 0, portalUsers: 0 });

  // Invite state
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteDisplayName, setInviteDisplayName] = useState('');
  const [inviteRole, setInviteRole] = useState('investor');
  const [invitePortal, setInvitePortal] = useState<string[]>(['investor']);
  const [inviteLoading, setInviteLoading] = useState(false);

  // Bulk import state
  const [bulkOpen, setBulkOpen] = useState(false);
  const [csvText, setCsvText] = useState('');
  const [bulkRole, setBulkRole] = useState('investor');
  const [bulkPortal, setBulkPortal] = useState<string[]>(['investor']);
  const [bulkLoading, setBulkLoading] = useState(false);
  const [bulkResult, setBulkResult] = useState<{ created: number; updated: number; errors: string[] } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Access dialog
  const [selectedUser, setSelectedUser] = useState<UserWithRole | null>(null);
  const [accessDialogOpen, setAccessDialogOpen] = useState(false);
  const [accessSaving, setAccessSaving] = useState(false);

  // Delete confirm
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (isAdmin) {
      loadStats();
      loadUsers();
    }
  }, [isAdmin, page, search]);

  async function loadStats() {
    try {
      const data = await callManageUsers('stats');
      setStats(data);
    } catch { /* silent */ }
  }

  async function loadUsers() {
    setLoading(true);
    try {
      const data = await callManageUsers('list', { page, pageSize: PAGE_SIZE, search });
      setUsers(data.users || []);
      setTotal(data.total || 0);
    } catch (e: any) {
      toast({ title: 'Failed to load users', description: e.message, variant: 'destructive' });
    }
    setLoading(false);
  }

  function handleSearch() {
    setSearch(searchInput);
    setPage(1);
  }

  async function handleInvite() {
    if (!inviteEmail) return;
    setInviteLoading(true);
    try {
      const result = await callManageUsers('create', {
        email: inviteEmail,
        displayName: inviteDisplayName,
        role: inviteRole,
        portalSections: invitePortal,
      });
      toast({ title: result.isNew ? `User created & invited: ${inviteEmail}` : `Access updated for ${inviteEmail}` });
      setInviteOpen(false);
      setInviteEmail(''); setInviteDisplayName(''); setInviteRole('investor'); setInvitePortal(['investor']);
      loadUsers(); loadStats();
    } catch (e: any) {
      toast({ title: 'Failed to create user', description: e.message, variant: 'destructive' });
    }
    setInviteLoading(false);
  }

  function handleCSVFile(file: File) {
    const reader = new FileReader();
    reader.onload = e => setCsvText(e.target?.result as string || '');
    reader.readAsText(file);
  }

  async function handleBulkImport() {
    const lines = csvText.trim().split('\n').filter(l => l.trim());
    if (lines.length === 0) return;
    setBulkLoading(true);
    setBulkResult(null);

    // Parse CSV: first line may be header (email, name, role, portal_sections)
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    const hasHeader = headers.includes('email');
    const dataLines = hasHeader ? lines.slice(1) : lines;

    const userList = dataLines.map(line => {
      const values = line.split(',').map(v => v.trim().replace(/^["']|["']$/g, ''));
      if (hasHeader) {
        const obj: Record<string, string> = {};
        headers.forEach((h, i) => { obj[h] = values[i] || ''; });
        return obj;
      }
      // No header — assume: email, name, role, portal_sections
      return { email: values[0], name: values[1] || '', role: values[2] || '', portal_sections: values[3] || '' };
    }).filter(u => u.email);

    try {
      const result = await callManageUsers('bulk_create', {
        users: userList,
        defaultRole: bulkRole,
        defaultPortalSections: bulkPortal,
      });
      setBulkResult({ created: result.created, updated: result.updated, errors: result.errors || [] });
      loadUsers(); loadStats();
    } catch (e: any) {
      toast({ title: 'Bulk import failed', description: e.message, variant: 'destructive' });
    }
    setBulkLoading(false);
  }

  async function togglePortalAccess(userId: string, section: string, hasAccess: boolean) {
    if (hasAccess) {
      await supabase.from('portal_access').delete().eq('user_id', userId).eq('portal_section', section);
    } else {
      await supabase.from('portal_access').insert({ user_id: userId, portal_section: section, granted_by: userId });
    }
    setSelectedUser(prev => prev ? {
      ...prev,
      portal_access: hasAccess ? prev.portal_access.filter(s => s !== section) : [...prev.portal_access, section],
    } : null);
    loadUsers();
  }

  async function toggleAdminRole(userId: string, isCurrentlyAdmin: boolean) {
    if (isCurrentlyAdmin) {
      await supabase.from('user_roles').delete().eq('user_id', userId).eq('role', 'admin');
    } else {
      await supabase.from('user_roles').insert({ user_id: userId, role: 'admin' });
    }
    setSelectedUser(prev => prev ? {
      ...prev,
      roles: isCurrentlyAdmin ? prev.roles.filter(r => r !== 'admin') : [...prev.roles, 'admin'],
    } : null);
    loadUsers();
  }

  async function handleDeleteUser() {
    if (!deleteUserId) return;
    setDeleting(true);
    try {
      await callManageUsers('delete', { userId: deleteUserId });
      toast({ title: 'User deleted' });
      setDeleteUserId(null);
      loadUsers(); loadStats();
    } catch (e: any) {
      toast({ title: 'Delete failed', description: e.message, variant: 'destructive' });
    }
    setDeleting(false);
  }

  function downloadCSVTemplate() {
    const csv = 'email,name,role,portal_sections\nuser@example.com,John Doe,investor,"investor,reports"\nuser2@example.com,Jane Smith,viewer,investor';
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'users-template.csv'; a.click();
  }

  const totalPages = Math.ceil(total / PAGE_SIZE);

  if (!isAdmin) return <AdminLayout><div className="p-8 text-center text-muted-foreground">Access restricted to administrators.</div></AdminLayout>;

  return (
    <AdminLayout requireAdmin>
      <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-display font-semibold text-foreground">Users</h1>
            <p className="text-muted-foreground mt-1">Manage user access and permissions — supports 10,000+ users</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setBulkOpen(true)} className="gap-2">
              <Upload className="h-4 w-4" />Bulk Import
            </Button>
            <Button onClick={() => setInviteOpen(true)} className="gap-2">
              <UserPlus className="h-4 w-4" />Add User
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card><CardContent className="pt-5">
            <p className="text-2xl font-display font-bold">{stats.total.toLocaleString()}</p>
            <p className="text-sm text-muted-foreground">Total Users</p>
          </CardContent></Card>
          <Card><CardContent className="pt-5">
            <p className="text-2xl font-display font-bold">{stats.admins}</p>
            <p className="text-sm text-muted-foreground">Admins</p>
          </CardContent></Card>
          <Card><CardContent className="pt-5">
            <p className="text-2xl font-display font-bold">{stats.portalUsers.toLocaleString()}</p>
            <p className="text-sm text-muted-foreground">Portal Users</p>
          </CardContent></Card>
          <Card><CardContent className="pt-5">
            <p className="text-2xl font-display font-bold">10,000+</p>
            <p className="text-sm text-muted-foreground">Max Capacity</p>
          </CardContent></Card>
        </div>

        {/* Search + Users Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                All Users
                <Badge variant="outline" className="font-normal text-xs">{total.toLocaleString()} total</Badge>
              </CardTitle>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                  <Input
                    placeholder="Search by email or name…"
                    value={searchInput}
                    onChange={e => setSearchInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSearch()}
                    className="pl-8 w-64 h-9"
                  />
                </div>
                <Button size="sm" onClick={handleSearch} variant="outline">Search</Button>
                {search && <Button size="sm" variant="ghost" onClick={() => { setSearch(''); setSearchInput(''); setPage(1); }}>Clear</Button>}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
            ) : users.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                {search ? `No users matching "${search}"` : 'No users yet. Add users with the button above.'}
              </div>
            ) : (
              <>
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
                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                              <span className="text-xs font-semibold text-primary">
                                {(user.display_name || user.email).charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div className="min-w-0">
                              <p className="font-medium text-sm truncate">{user.display_name}</p>
                              <p className="text-xs text-muted-foreground truncate">{user.email}</p>
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
                            ) : user.portal_access.length > 2 ? (
                              <Badge variant="outline" className="text-xs">{user.portal_access.length} sections</Badge>
                            ) : user.portal_access.map(s => (
                              <Badge key={s} variant="outline" className="text-xs">{PORTAL_LABELS[s] ?? s}</Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button size="sm" variant="outline" onClick={() => { setSelectedUser(user); setAccessDialogOpen(true); }}>
                              <Eye className="h-3 w-3 mr-1" />Manage
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-destructive hover:text-destructive hover:bg-destructive/10"
                              onClick={() => setDeleteUserId(user.user_id)}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                    <p className="text-sm text-muted-foreground">
                      Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, total)} of {total.toLocaleString()} users
                    </p>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <span className="text-sm font-medium px-2">Page {page} of {totalPages}</span>
                      <Button size="sm" variant="outline" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Add Single User Dialog */}
      <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle className="flex items-center gap-2"><UserPlus className="h-5 w-5" />Add User</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Email *</Label>
              <Input type="email" placeholder="user@example.com" value={inviteEmail} onChange={e => setInviteEmail(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Display Name</Label>
              <Input placeholder="Full name" value={inviteDisplayName} onChange={e => setInviteDisplayName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Role</Label>
              <Select value={inviteRole} onValueChange={setInviteRole}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="investor">Investor</SelectItem>
                  <SelectItem value="viewer">Viewer</SelectItem>
                  <SelectItem value="portal_editor">Portal Editor</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Portal Access</Label>
              <div className="space-y-2">
                {PORTAL_SECTIONS.map(section => (
                  <div key={section} className="flex items-center gap-2">
                    <Checkbox
                      id={`invite-${section}`}
                      checked={invitePortal.includes(section)}
                      onCheckedChange={checked => setInvitePortal(prev =>
                        checked ? [...prev, section] : prev.filter(s => s !== section)
                      )}
                    />
                    <label htmlFor={`invite-${section}`} className="text-sm cursor-pointer">{PORTAL_LABELS[section]}</label>
                  </div>
                ))}
              </div>
            </div>
            <p className="text-xs text-muted-foreground bg-muted p-3 rounded-lg">
              A secure auto-generated password will be set. The user can reset their password via the login page.
            </p>
            <Button className="w-full gap-2" onClick={handleInvite} disabled={inviteLoading || !inviteEmail}>
              {inviteLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4" />}
              Create User
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Bulk Import Dialog */}
      <Dialog open={bulkOpen} onOpenChange={(o) => { setBulkOpen(o); if (!o) { setBulkResult(null); setCsvText(''); } }}>
        <DialogContent className="max-w-xl">
          <DialogHeader><DialogTitle className="flex items-center gap-2"><Upload className="h-5 w-5" />Bulk Import Users</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Upload a CSV file or paste CSV data. Max 500 users per batch.</p>
              <Button size="sm" variant="outline" onClick={downloadCSVTemplate} className="gap-1.5">
                <Download className="h-3.5 w-3.5" />Template
              </Button>
            </div>

            <div
              className="border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-primary/50 transition-colors"
              onClick={() => fileInputRef.current?.click()}
              onDragOver={e => e.preventDefault()}
              onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleCSVFile(f); }}
            >
              <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">Drop CSV file here or click to browse</p>
              <input ref={fileInputRef} type="file" accept=".csv,text/csv" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) handleCSVFile(f); }} />
            </div>

            <div className="space-y-2">
              <Label>Or paste CSV data</Label>
              <Textarea
                value={csvText}
                onChange={e => setCsvText(e.target.value)}
                rows={6}
                placeholder={'email,name,role,portal_sections\nuser@example.com,John Doe,investor,"investor,reports"'}
                className="font-mono text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Default Role (if not in CSV)</Label>
                <Select value={bulkRole} onValueChange={setBulkRole}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="investor">Investor</SelectItem>
                    <SelectItem value="viewer">Viewer</SelectItem>
                    <SelectItem value="portal_editor">Portal Editor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Default Portal Access</Label>
                <div className="space-y-1.5 max-h-28 overflow-y-auto">
                  {PORTAL_SECTIONS.map(section => (
                    <div key={section} className="flex items-center gap-2">
                      <Checkbox
                        id={`bulk-${section}`}
                        checked={bulkPortal.includes(section)}
                        onCheckedChange={checked => setBulkPortal(prev =>
                          checked ? [...prev, section] : prev.filter(s => s !== section)
                        )}
                      />
                      <label htmlFor={`bulk-${section}`} className="text-xs cursor-pointer">{PORTAL_LABELS[section]}</label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {bulkResult && (
              <div className="p-3 bg-muted rounded-lg space-y-1">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  {bulkResult.created} created, {bulkResult.updated} updated
                </div>
                {bulkResult.errors.length > 0 && (
                  <div className="text-xs text-destructive mt-1">
                    <p className="font-medium flex items-center gap-1"><AlertCircle className="h-3 w-3" />{bulkResult.errors.length} errors:</p>
                    <ul className="list-disc list-inside mt-1 space-y-0.5 max-h-24 overflow-y-auto">
                      {bulkResult.errors.map((e, i) => <li key={i}>{e}</li>)}
                    </ul>
                  </div>
                )}
              </div>
            )}

            <Button className="w-full gap-2" onClick={handleBulkImport} disabled={bulkLoading || !csvText.trim()}>
              {bulkLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
              {bulkLoading ? 'Importing…' : 'Import Users'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Access Management Dialog */}
      <Dialog open={accessDialogOpen} onOpenChange={setAccessDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Manage Access — {selectedUser?.display_name || selectedUser?.email}</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-sm font-semibold flex items-center gap-2"><Shield className="h-4 w-4 text-primary" />Role</h3>
                <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                  <Checkbox
                    id="admin-role"
                    checked={selectedUser.roles.includes('admin')}
                    onCheckedChange={() => toggleAdminRole(selectedUser.user_id, selectedUser.roles.includes('admin'))}
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
                          onCheckedChange={() => togglePortalAccess(selectedUser.user_id, section, hasAccess)}
                        />
                        <label htmlFor={section} className="text-sm cursor-pointer">{PORTAL_LABELS[section]}</label>
                      </div>
                    );
                  })}
                </div>
              </div>
              <Button className="w-full" onClick={() => { setAccessDialogOpen(false); toast({ title: 'Access updated' }); }}>Done</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirm Dialog */}
      <Dialog open={!!deleteUserId} onOpenChange={o => !o && setDeleteUserId(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Delete User?</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">This will permanently remove the user and revoke all their access. This cannot be undone.</p>
          <div className="flex gap-3 mt-2">
            <Button variant="outline" className="flex-1" onClick={() => setDeleteUserId(null)}>Cancel</Button>
            <Button variant="destructive" className="flex-1 gap-2" onClick={handleDeleteUser} disabled={deleting}>
              {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
