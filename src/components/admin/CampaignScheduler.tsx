import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Loader2, Mail, Send, Clock, Users, Calendar,
  Trash2, Edit, Play, Pause, CheckCircle, XCircle,
  Upload, FileText, Search, Filter, MoreHorizontal
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Campaign {
  id: string;
  name: string;
  subject: string | null;
  content: string;
  channel: 'email' | 'whatsapp';
  status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'failed';
  scheduled_at: string | null;
  sent_at: string | null;
  recipient_count: number;
  created_at: string;
}

interface Recipient {
  id: string;
  campaign_id: string;
  email: string | null;
  phone: string | null;
  name: string | null;
  status: 'pending' | 'sent' | 'failed' | 'bounced';
  sent_at: string | null;
  error_message: string | null;
}

export const CampaignScheduler = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [saving, setSaving] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Form state
  const [formName, setFormName] = useState('');
  const [formSubject, setFormSubject] = useState('');
  const [formContent, setFormContent] = useState('');
  const [formChannel, setFormChannel] = useState<'email' | 'whatsapp'>('email');
  const [formScheduledAt, setFormScheduledAt] = useState('');
  const [bulkEmails, setBulkEmails] = useState('');

  useEffect(() => {
    fetchCampaigns();
  }, []);

  useEffect(() => {
    if (selectedCampaign) {
      fetchRecipients(selectedCampaign.id);
    }
  }, [selectedCampaign]);

  const fetchCampaigns = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('messaging_campaigns')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast.error('Failed to load campaigns');
    } else {
      setCampaigns((data as Campaign[]) || []);
    }
    setLoading(false);
  };

  const fetchRecipients = async (campaignId: string) => {
    const { data, error } = await supabase
      .from('campaign_recipients')
      .select('*')
      .eq('campaign_id', campaignId)
      .order('created_at', { ascending: false });

    if (error) {
      toast.error('Failed to load recipients');
    } else {
      setRecipients((data as Recipient[]) || []);
    }
  };

  const createCampaign = async () => {
    if (!formName.trim() || !formContent.trim()) {
      toast.error('Name and content are required');
      return;
    }

    setSaving(true);

    const { data, error } = await supabase
      .from('messaging_campaigns')
      .insert({
        name: formName.trim(),
        subject: formSubject.trim() || null,
        content: formContent.trim(),
        channel: formChannel,
        scheduled_at: formScheduledAt || null,
        status: formScheduledAt ? 'scheduled' : 'draft',
      })
      .select()
      .single();

    if (error) {
      toast.error('Failed to create campaign');
    } else {
      // Parse and add recipients
      if (bulkEmails.trim()) {
        const emails = bulkEmails.split(/[\n,;]/).map(e => e.trim()).filter(e => e && e.includes('@'));
        
        if (emails.length > 0) {
          const recipientData = emails.map(email => ({
            campaign_id: data.id,
            email,
            status: 'pending' as const,
          }));

          await supabase.from('campaign_recipients').insert(recipientData);
          
          await supabase
            .from('messaging_campaigns')
            .update({ recipient_count: emails.length })
            .eq('id', data.id);
        }
      }

      setCampaigns(prev => [data as Campaign, ...prev]);
      toast.success('Campaign created');
      resetForm();
      setShowCreateDialog(false);
    }

    setSaving(false);
  };

  const sendCampaign = async (campaign: Campaign) => {
    if (campaign.recipient_count === 0) {
      toast.error('No recipients added');
      return;
    }

    toast.info('Sending campaign...');
    
    // Update status to sending
    await supabase
      .from('messaging_campaigns')
      .update({ status: 'sending' })
      .eq('id', campaign.id);

    // Call edge function to send emails
    const { error } = await supabase.functions.invoke('send-campaign', {
      body: { campaignId: campaign.id }
    });

    if (error) {
      toast.error('Failed to send campaign');
      await supabase
        .from('messaging_campaigns')
        .update({ status: 'failed' })
        .eq('id', campaign.id);
    } else {
      toast.success('Campaign sent successfully');
    }

    fetchCampaigns();
  };

  const deleteCampaign = async (id: string) => {
    const { error } = await supabase
      .from('messaging_campaigns')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error('Failed to delete campaign');
    } else {
      setCampaigns(prev => prev.filter(c => c.id !== id));
      if (selectedCampaign?.id === id) {
        setSelectedCampaign(null);
      }
      toast.success('Campaign deleted');
    }
  };

  const resetForm = () => {
    setFormName('');
    setFormSubject('');
    setFormContent('');
    setFormChannel('email');
    setFormScheduledAt('');
    setBulkEmails('');
  };

  const getStatusBadge = (status: Campaign['status']) => {
    const config = {
      draft: { color: 'secondary', icon: Edit },
      scheduled: { color: 'outline', icon: Clock },
      sending: { color: 'default', icon: Loader2 },
      sent: { color: 'default', icon: CheckCircle },
      failed: { color: 'destructive', icon: XCircle },
    };
    const { color, icon: Icon } = config[status];
    return (
      <Badge variant={color as 'default' | 'secondary' | 'outline' | 'destructive'} className="gap-1">
        <Icon className={`h-3 w-3 ${status === 'sending' ? 'animate-spin' : ''}`} />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const filteredCampaigns = campaigns.filter(c => {
    const matchesStatus = filterStatus === 'all' || c.status === filterStatus;
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.subject?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Campaign Scheduler</h2>
          <p className="text-sm text-muted-foreground">Send bulk emails to your audience</p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)} className="btn-industrial">
          <Plus className="h-4 w-4 mr-2" />
          New Campaign
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Campaigns', value: campaigns.length, icon: Mail },
          { label: 'Scheduled', value: campaigns.filter(c => c.status === 'scheduled').length, icon: Clock },
          { label: 'Sent', value: campaigns.filter(c => c.status === 'sent').length, icon: Send },
          { label: 'Total Recipients', value: campaigns.reduce((a, c) => a + c.recipient_count, 0), icon: Users },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="card-3d">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                  <stat.icon className="h-8 w-8 text-primary/30" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search campaigns..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-[150px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="scheduled">Scheduled</SelectItem>
            <SelectItem value="sending">Sending</SelectItem>
            <SelectItem value="sent">Sent</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Campaigns Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Campaign</TableHead>
                <TableHead>Channel</TableHead>
                <TableHead>Recipients</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Scheduled</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <AnimatePresence>
                {filteredCampaigns.map((campaign, index) => (
                  <motion.tr
                    key={campaign.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.05 }}
                    className="group hover:bg-muted/50"
                  >
                    <TableCell>
                      <div>
                        <p className="font-medium">{campaign.name}</p>
                        {campaign.subject && (
                          <p className="text-sm text-muted-foreground truncate max-w-[200px]">
                            {campaign.subject}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="gap-1">
                        <Mail className="h-3 w-3" />
                        {campaign.channel}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">{campaign.recipient_count}</span>
                    </TableCell>
                    <TableCell>{getStatusBadge(campaign.status)}</TableCell>
                    <TableCell>
                      {campaign.scheduled_at ? (
                        <span className="text-sm">
                          {new Date(campaign.scheduled_at).toLocaleDateString()}
                        </span>
                      ) : (
                        <span className="text-sm text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setSelectedCampaign(campaign)}>
                            <Users className="h-4 w-4 mr-2" />
                            View Recipients
                          </DropdownMenuItem>
                          {campaign.status === 'draft' && (
                            <DropdownMenuItem onClick={() => sendCampaign(campaign)}>
                              <Send className="h-4 w-4 mr-2" />
                              Send Now
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem 
                            onClick={() => deleteCampaign(campaign.id)}
                            className="text-destructive"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </motion.tr>
                ))}
              </AnimatePresence>
              {filteredCampaigns.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                    No campaigns found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Create Campaign Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Campaign</DialogTitle>
          </DialogHeader>
          
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="details">Campaign Details</TabsTrigger>
              <TabsTrigger value="recipients">Recipients</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Campaign Name</Label>
                  <Input
                    id="name"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g., January Newsletter"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="channel">Channel</Label>
                  <Select value={formChannel} onValueChange={(v: 'email' | 'whatsapp') => setFormChannel(v)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="whatsapp" disabled>WhatsApp (Coming Soon)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">Subject Line</Label>
                <Input
                  id="subject"
                  value={formSubject}
                  onChange={(e) => setFormSubject(e.target.value)}
                  placeholder="e.g., Updates from ATROUN"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Email Content</Label>
                <Textarea
                  id="content"
                  value={formContent}
                  onChange={(e) => setFormContent(e.target.value)}
                  placeholder="Write your email content here..."
                  rows={6}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="schedule">Schedule (Optional)</Label>
                <Input
                  id="schedule"
                  type="datetime-local"
                  value={formScheduledAt}
                  onChange={(e) => setFormScheduledAt(e.target.value)}
                />
              </div>
            </TabsContent>

            <TabsContent value="recipients" className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="bulk-emails">Add Recipients</Label>
                <p className="text-xs text-muted-foreground">
                  Enter email addresses separated by commas, semicolons, or new lines
                </p>
                <Textarea
                  id="bulk-emails"
                  value={bulkEmails}
                  onChange={(e) => setBulkEmails(e.target.value)}
                  placeholder="email1@example.com&#10;email2@example.com&#10;email3@example.com"
                  rows={8}
                  className="font-mono text-sm"
                />
              </div>
              
              {bulkEmails && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>
                    {bulkEmails.split(/[\n,;]/).filter(e => e.trim() && e.includes('@')).length} valid emails detected
                  </span>
                </div>
              )}
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button variant="outline" onClick={() => { setShowCreateDialog(false); resetForm(); }}>
              Cancel
            </Button>
            <Button onClick={createCampaign} disabled={saving}>
              {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Create Campaign
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Recipients Dialog */}
      <Dialog open={!!selectedCampaign} onOpenChange={(open) => !open && setSelectedCampaign(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              Recipients - {selectedCampaign?.name}
            </DialogTitle>
          </DialogHeader>
          
          <div className="max-h-[400px] overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Sent At</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recipients.map((recipient) => (
                  <TableRow key={recipient.id}>
                    <TableCell className="font-mono text-sm">{recipient.email}</TableCell>
                    <TableCell>{recipient.name || '-'}</TableCell>
                    <TableCell>
                      <Badge variant={
                        recipient.status === 'sent' ? 'default' :
                        recipient.status === 'failed' ? 'destructive' : 'secondary'
                      }>
                        {recipient.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {recipient.sent_at ? new Date(recipient.sent_at).toLocaleString() : '-'}
                    </TableCell>
                  </TableRow>
                ))}
                {recipients.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                      No recipients found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
