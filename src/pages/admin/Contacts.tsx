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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { UserPlus, Search, Edit, Trash2, Loader2, Phone, Mail, Building, Tag } from 'lucide-react';
import { ContactImport } from '@/components/admin/ContactImport';

interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  role: string | null;
  source: string;
  status: string;
  notes: string | null;
  subscribed_to_emails: boolean;
  created_at: string;
  last_contacted_at: string | null;
}

export default function ContactsPage() {
  const { isAdmin } = useAuth();
  const { toast } = useToast();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editContact, setEditContact] = useState<Partial<Contact> | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadContacts();
    syncContactsFromForm();
  }, []);

  async function loadContacts() {
    const { data } = await supabase
      .from('crm_contacts')
      .select('*')
      .order('created_at', { ascending: false });
    setContacts((data as Contact[]) ?? []);
    setLoading(false);
  }

  async function syncContactsFromForm() {
    // Sync contact form submissions into CRM
    const { data: submissions } = await supabase
      .from('contact_submissions')
      .select('*')
      .order('created_at', { ascending: false });

    if (!submissions) return;

    for (const sub of submissions) {
      const { data: existing } = await supabase
        .from('crm_contacts')
        .select('id')
        .eq('email', sub.email)
        .single();

      if (!existing) {
        await supabase.from('crm_contacts').insert({
          name: sub.name,
          email: sub.email,
          source: 'contact_form',
          notes: sub.message,
        });
      }
    }
    loadContacts();
  }

  async function handleSave() {
    if (!editContact?.name || !editContact?.email) return;
    setSaving(true);
    if (editContact.id) {
      await supabase.from('crm_contacts').update({
        name: editContact.name,
        email: editContact.email,
        phone: editContact.phone,
        company: editContact.company,
        role: editContact.role,
        status: editContact.status,
        notes: editContact.notes,
        subscribed_to_emails: editContact.subscribed_to_emails,
      }).eq('id', editContact.id);
    } else {
      await supabase.from('crm_contacts').insert({
        name: editContact.name,
        email: editContact.email,
        phone: editContact.phone,
        company: editContact.company,
        role: editContact.role,
        status: editContact.status ?? 'active',
        notes: editContact.notes,
        source: 'manual',
        subscribed_to_emails: editContact.subscribed_to_emails ?? true,
      });
    }
    toast({ title: editContact.id ? 'Contact updated' : 'Contact added' });
    setDialogOpen(false);
    setEditContact(null);
    setSaving(false);
    loadContacts();
  }

  async function handleDelete(id: string) {
    await supabase.from('crm_contacts').delete().eq('id', id);
    setContacts(prev => prev.filter(c => c.id !== id));
    toast({ title: 'Contact deleted' });
  }

  const filtered = contacts.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase()) ||
    (c.company ?? '').toLowerCase().includes(search.toLowerCase())
  );

  const statusColor = (s: string) => ({
    active: 'default', inactive: 'secondary', unsubscribed: 'destructive'
  }[s] ?? 'outline') as 'default' | 'secondary' | 'destructive' | 'outline';

  const sourceLabel = (s: string) => ({ contact_form: 'Form', manual: 'Manual', import: 'Import' }[s] ?? s);

  if (!isAdmin) return <AdminLayout><div className="p-8 text-center text-muted-foreground">Access restricted to administrators.</div></AdminLayout>;

  return (
    <AdminLayout requireAdmin>
      <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-display font-semibold text-foreground">Contacts / CRM</h1>
            <p className="text-muted-foreground mt-1">Manage contacts and communication history</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setEditContact({ status: 'active', subscribed_to_emails: true })}>
                <UserPlus className="h-4 w-4 mr-2" />Add Contact
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>{editContact?.id ? 'Edit' : 'Add'} Contact</DialogTitle></DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2"><Label>Name *</Label><Input value={editContact?.name ?? ''} onChange={e => setEditContact(p => ({ ...p, name: e.target.value }))} /></div>
                  <div className="space-y-2"><Label>Email *</Label><Input type="email" value={editContact?.email ?? ''} onChange={e => setEditContact(p => ({ ...p, email: e.target.value }))} /></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2"><Label>Phone</Label><Input value={editContact?.phone ?? ''} onChange={e => setEditContact(p => ({ ...p, phone: e.target.value }))} /></div>
                  <div className="space-y-2"><Label>Company</Label><Input value={editContact?.company ?? ''} onChange={e => setEditContact(p => ({ ...p, company: e.target.value }))} /></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2"><Label>Role/Title</Label><Input value={editContact?.role ?? ''} onChange={e => setEditContact(p => ({ ...p, role: e.target.value }))} /></div>
                  <div className="space-y-2">
                    <Label>Status</Label>
                    <Select value={editContact?.status ?? 'active'} onValueChange={v => setEditContact(p => ({ ...p, status: v }))}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="unsubscribed">Unsubscribed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2"><Label>Notes</Label><Textarea rows={3} value={editContact?.notes ?? ''} onChange={e => setEditContact(p => ({ ...p, notes: e.target.value }))} /></div>
                <Button className="w-full" onClick={handleSave} disabled={saving}>
                  {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  {editContact?.id ? 'Update' : 'Add'} Contact
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card><CardContent className="pt-5"><p className="text-2xl font-display font-bold">{contacts.length}</p><p className="text-sm text-muted-foreground">Total Contacts</p></CardContent></Card>
          <Card><CardContent className="pt-5"><p className="text-2xl font-display font-bold">{contacts.filter(c => c.source === 'contact_form').length}</p><p className="text-sm text-muted-foreground">From Form</p></CardContent></Card>
          <Card><CardContent className="pt-5"><p className="text-2xl font-display font-bold">{contacts.filter(c => c.subscribed_to_emails).length}</p><p className="text-sm text-muted-foreground">Subscribed</p></CardContent></Card>
          <Card><CardContent className="pt-5"><p className="text-2xl font-display font-bold">{contacts.filter(c => c.status === 'active').length}</p><p className="text-sm text-muted-foreground">Active</p></CardContent></Card>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input className="pl-10" placeholder="Search contacts..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>

        {/* Table */}
        <Card>
          <CardContent className="p-0">
            {loading ? (
              <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Contact</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Added</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.length === 0 ? (
                    <TableRow><TableCell colSpan={6} className="text-center py-12 text-muted-foreground">No contacts found</TableCell></TableRow>
                  ) : (
                    filtered.map(contact => (
                      <TableRow key={contact.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium text-sm">{contact.name}</p>
                            <p className="text-xs text-muted-foreground flex items-center gap-1"><Mail className="h-3 w-3" />{contact.email}</p>
                            {contact.phone && <p className="text-xs text-muted-foreground flex items-center gap-1"><Phone className="h-3 w-3" />{contact.phone}</p>}
                          </div>
                        </TableCell>
                        <TableCell>
                          {contact.company && <div><p className="text-sm">{contact.company}</p>{contact.role && <p className="text-xs text-muted-foreground">{contact.role}</p>}</div>}
                        </TableCell>
                        <TableCell><Badge variant="outline" className="text-xs capitalize">{sourceLabel(contact.source)}</Badge></TableCell>
                        <TableCell><Badge variant={statusColor(contact.status)} className="text-xs capitalize">{contact.status}</Badge></TableCell>
                        <TableCell className="text-xs text-muted-foreground">{new Date(contact.created_at).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button size="sm" variant="ghost" onClick={() => { setEditContact(contact); setDialogOpen(true); }}><Edit className="h-3 w-3" /></Button>
                            <Button size="sm" variant="ghost" onClick={() => handleDelete(contact.id)}><Trash2 className="h-3 w-3 text-destructive" /></Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
