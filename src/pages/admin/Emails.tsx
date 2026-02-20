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
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Mail, Send, Edit, Trash2, Loader2, Users, Eye, FileText } from 'lucide-react';

interface Campaign {
  id: string;
  name: string;
  subject: string;
  body_html: string | null;
  body_text: string | null;
  status: string;
  scheduled_at: string | null;
  sent_at: string | null;
  recipient_count: number;
  created_at: string;
}

const statusColor = (s: string) => ({
  draft: 'secondary', scheduled: 'default', sent: 'outline', cancelled: 'destructive'
}[s] ?? 'outline') as 'default' | 'secondary' | 'destructive' | 'outline';

export default function EmailsPage() {
  const { isAdmin } = useAuth();
  const { toast } = useToast();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editCampaign, setEditCampaign] = useState<Partial<Campaign> | null>(null);
  const [saving, setSaving] = useState(false);
  const [sending, setSending] = useState<string | null>(null);
  const [contactCount, setContactCount] = useState(0);

  useEffect(() => {
    loadCampaigns();
    supabase.from('crm_contacts').select('id', { count: 'exact', head: true })
      .eq('subscribed_to_emails', true).then(({ count }) => setContactCount(count ?? 0));
  }, []);

  async function loadCampaigns() {
    const { data } = await supabase.from('email_campaigns').select('*').order('created_at', { ascending: false });
    setCampaigns((data as Campaign[]) ?? []);
    setLoading(false);
  }

  async function handleSave() {
    if (!editCampaign?.name || !editCampaign?.subject) return;
    setSaving(true);
    if (editCampaign.id) {
      await supabase.from('email_campaigns').update({
        name: editCampaign.name,
        subject: editCampaign.subject,
        body_text: editCampaign.body_text,
        status: editCampaign.status,
      }).eq('id', editCampaign.id);
    } else {
      await supabase.from('email_campaigns').insert({
        name: editCampaign.name,
        subject: editCampaign.subject,
        body_text: editCampaign.body_text,
        status: 'draft',
        recipient_count: contactCount,
      });
    }
    toast({ title: editCampaign.id ? 'Campaign updated' : 'Campaign saved as draft' });
    setDialogOpen(false);
    setEditCampaign(null);
    setSaving(false);
    loadCampaigns();
  }

  async function handleSend(campaign: Campaign) {
    setSending(campaign.id);
    // Call edge function to send emails
    try {
      const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
      const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
      const res = await fetch(`${SUPABASE_URL}/functions/v1/send-campaign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${SUPABASE_KEY}` },
        body: JSON.stringify({ campaignId: campaign.id }),
      });
      if (res.ok) {
        await supabase.from('email_campaigns').update({ status: 'sent', sent_at: new Date().toISOString() }).eq('id', campaign.id);
        toast({ title: 'Campaign sent successfully!' });
        loadCampaigns();
      } else {
        toast({ title: 'Send failed', description: 'Check your email configuration.', variant: 'destructive' });
      }
    } catch {
      toast({ title: 'Error', description: 'Failed to send campaign.', variant: 'destructive' });
    }
    setSending(null);
  }

  async function handleDelete(id: string) {
    await supabase.from('email_campaigns').delete().eq('id', id);
    setCampaigns(prev => prev.filter(c => c.id !== id));
    toast({ title: 'Campaign deleted' });
  }

  if (!isAdmin) return <AdminLayout><div className="p-8 text-center text-muted-foreground">Access restricted to administrators.</div></AdminLayout>;

  return (
    <AdminLayout requireAdmin>
      <div className="p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-display font-semibold text-foreground">Email Campaigns</h1>
            <p className="text-muted-foreground mt-1">Create and send bulk email campaigns</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setEditCampaign({})}>
                <Plus className="h-4 w-4 mr-2" />New Campaign
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader><DialogTitle>{editCampaign?.id ? 'Edit' : 'New'} Campaign</DialogTitle></DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2"><Label>Campaign Name *</Label><Input value={editCampaign?.name ?? ''} onChange={e => setEditCampaign(p => ({ ...p, name: e.target.value }))} /></div>
                <div className="space-y-2"><Label>Email Subject *</Label><Input value={editCampaign?.subject ?? ''} onChange={e => setEditCampaign(p => ({ ...p, subject: e.target.value }))} /></div>
                <div className="space-y-2">
                  <Label>Email Body</Label>
                  <Textarea
                    rows={10}
                    placeholder="Write your email content here..."
                    value={editCampaign?.body_text ?? ''}
                    onChange={e => setEditCampaign(p => ({ ...p, body_text: e.target.value }))}
                  />
                </div>
                <div className="bg-muted rounded-lg p-3 flex items-center gap-3">
                  <Users className="h-5 w-5 text-primary" />
                  <p className="text-sm">This campaign will be sent to <strong>{contactCount}</strong> subscribed contacts.</p>
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1" onClick={handleSave} disabled={saving}>
                    <FileText className="h-4 w-4 mr-2" />Save as Draft
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card><CardContent className="pt-5"><p className="text-2xl font-display font-bold">{campaigns.length}</p><p className="text-sm text-muted-foreground">Total Campaigns</p></CardContent></Card>
          <Card><CardContent className="pt-5"><p className="text-2xl font-display font-bold">{campaigns.filter(c => c.status === 'sent').length}</p><p className="text-sm text-muted-foreground">Sent</p></CardContent></Card>
          <Card><CardContent className="pt-5"><p className="text-2xl font-display font-bold">{campaigns.filter(c => c.status === 'draft').length}</p><p className="text-sm text-muted-foreground">Drafts</p></CardContent></Card>
          <Card><CardContent className="pt-5"><p className="text-2xl font-display font-bold">{contactCount}</p><p className="text-sm text-muted-foreground">Subscribers</p></CardContent></Card>
        </div>

        {/* Table */}
        <Card>
          <CardContent className="p-0">
            {loading ? (
              <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
            ) : campaigns.length === 0 ? (
              <div className="py-16 text-center">
                <Mail className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No campaigns yet. Create your first campaign.</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Campaign</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Recipients</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {campaigns.map(campaign => (
                    <TableRow key={campaign.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium text-sm">{campaign.name}</p>
                          <p className="text-xs text-muted-foreground">{campaign.subject}</p>
                        </div>
                      </TableCell>
                      <TableCell><Badge variant={statusColor(campaign.status)} className="text-xs capitalize">{campaign.status}</Badge></TableCell>
                      <TableCell className="text-sm">{campaign.recipient_count}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {campaign.sent_at ? `Sent ${new Date(campaign.sent_at).toLocaleDateString()}` : `Created ${new Date(campaign.created_at).toLocaleDateString()}`}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {campaign.status === 'draft' && (
                            <>
                              <Button size="sm" variant="ghost" onClick={() => { setEditCampaign(campaign); setDialogOpen(true); }}><Edit className="h-3 w-3" /></Button>
                              <Button size="sm" onClick={() => handleSend(campaign)} disabled={sending === campaign.id}>
                                {sending === campaign.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <Send className="h-3 w-3 mr-1" />}
                                Send
                              </Button>
                            </>
                          )}
                          <Button size="sm" variant="ghost" onClick={() => handleDelete(campaign.id)}><Trash2 className="h-3 w-3 text-destructive" /></Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
