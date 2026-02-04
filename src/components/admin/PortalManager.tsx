import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Loader2, Users, Building2, FolderLock, Link2, Copy,
  Trash2, Eye, EyeOff, Calendar, Clock, ExternalLink,
  Shield, FileText, Download, Upload, MoreHorizontal, Mail
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

interface PortalInvite {
  id: string;
  portal_type: 'investor' | 'partner' | 'data_room';
  invite_code: string;
  email: string;
  name: string | null;
  company: string | null;
  expires_at: string | null;
  accessed_at: string | null;
  access_count: number;
  is_active: boolean;
  created_at: string;
}

interface Document {
  id: string;
  title: string;
  description: string | null;
  file_path: string;
  file_type: string | null;
  file_size: number | null;
  category: string;
  access_level: 'investor' | 'partner' | 'all';
  download_count: number;
  created_at: string;
}

const PORTAL_CONFIG = {
  investor: { label: 'Investor Portal', icon: Building2, color: 'text-blue-500' },
  partner: { label: 'Partner Dashboard', icon: Users, color: 'text-green-500' },
  data_room: { label: 'Data Room', icon: FolderLock, color: 'text-purple-500' },
};

export const PortalManager = () => {
  const [invites, setInvites] = useState<PortalInvite[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [showDocDialog, setShowDocDialog] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('invites');

  // Form state for invites
  const [formEmail, setFormEmail] = useState('');
  const [formName, setFormName] = useState('');
  const [formCompany, setFormCompany] = useState('');
  const [formPortalType, setFormPortalType] = useState<'investor' | 'partner' | 'data_room'>('investor');
  const [formExpiresAt, setFormExpiresAt] = useState('');

  // Form state for documents
  const [docTitle, setDocTitle] = useState('');
  const [docDescription, setDocDescription] = useState('');
  const [docCategory, setDocCategory] = useState('general');
  const [docAccessLevel, setDocAccessLevel] = useState<'investor' | 'partner' | 'all'>('investor');
  const [docFile, setDocFile] = useState<File | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    
    const [invitesRes, docsRes] = await Promise.all([
      supabase.from('portal_invites').select('*').order('created_at', { ascending: false }),
      supabase.from('data_room_documents').select('*').order('created_at', { ascending: false }),
    ]);

    if (invitesRes.error) toast.error('Failed to load invites');
    else setInvites((invitesRes.data as PortalInvite[]) || []);

    if (docsRes.error) toast.error('Failed to load documents');
    else setDocuments((docsRes.data as Document[]) || []);

    setLoading(false);
  };

  const generateInviteCode = () => {
    return `inv_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 10)}`;
  };

  const createInvite = async () => {
    if (!formEmail.trim()) {
      toast.error('Email is required');
      return;
    }

    setSaving(true);
    const inviteCode = generateInviteCode();

    const { data, error } = await supabase
      .from('portal_invites')
      .insert({
        portal_type: formPortalType,
        invite_code: inviteCode,
        email: formEmail.trim(),
        name: formName.trim() || null,
        company: formCompany.trim() || null,
        expires_at: formExpiresAt || null,
      })
      .select()
      .single();

    if (error) {
      toast.error('Failed to create invite');
    } else {
      setInvites(prev => [data as PortalInvite, ...prev]);
      toast.success('Invite created');
      
      // Copy invite link
      const inviteUrl = `${window.location.origin}/portal/${formPortalType}?code=${inviteCode}`;
      await navigator.clipboard.writeText(inviteUrl);
      toast.success('Invite link copied to clipboard');
      
      resetInviteForm();
      setShowInviteDialog(false);
    }
    setSaving(false);
  };

  const copyInviteLink = async (invite: PortalInvite) => {
    const inviteUrl = `${window.location.origin}/portal/${invite.portal_type}?code=${invite.invite_code}`;
    await navigator.clipboard.writeText(inviteUrl);
    toast.success('Invite link copied');
  };

  const toggleInviteActive = async (invite: PortalInvite) => {
    const { error } = await supabase
      .from('portal_invites')
      .update({ is_active: !invite.is_active })
      .eq('id', invite.id);

    if (error) {
      toast.error('Failed to update invite');
    } else {
      setInvites(prev => prev.map(i => 
        i.id === invite.id ? { ...i, is_active: !i.is_active } : i
      ));
      toast.success(`Invite ${invite.is_active ? 'deactivated' : 'activated'}`);
    }
  };

  const deleteInvite = async (id: string) => {
    const { error } = await supabase.from('portal_invites').delete().eq('id', id);
    if (error) toast.error('Failed to delete invite');
    else {
      setInvites(prev => prev.filter(i => i.id !== id));
      toast.success('Invite deleted');
    }
  };

  const uploadDocument = async () => {
    if (!docTitle.trim() || !docFile) {
      toast.error('Title and file are required');
      return;
    }

    setSaving(true);

    const fileExt = docFile.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `data-room/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('content-media')
      .upload(filePath, docFile);

    if (uploadError) {
      toast.error('Failed to upload file');
      setSaving(false);
      return;
    }

    const { data, error } = await supabase
      .from('data_room_documents')
      .insert({
        title: docTitle.trim(),
        description: docDescription.trim() || null,
        file_path: filePath,
        file_type: docFile.type,
        file_size: docFile.size,
        category: docCategory,
        access_level: docAccessLevel,
      })
      .select()
      .single();

    if (error) {
      toast.error('Failed to save document');
    } else {
      setDocuments(prev => [data as Document, ...prev]);
      toast.success('Document uploaded');
      resetDocForm();
      setShowDocDialog(false);
    }
    setSaving(false);
  };

  const deleteDocument = async (doc: Document) => {
    await supabase.storage.from('content-media').remove([doc.file_path]);
    const { error } = await supabase.from('data_room_documents').delete().eq('id', doc.id);
    
    if (error) toast.error('Failed to delete document');
    else {
      setDocuments(prev => prev.filter(d => d.id !== doc.id));
      toast.success('Document deleted');
    }
  };

  const resetInviteForm = () => {
    setFormEmail('');
    setFormName('');
    setFormCompany('');
    setFormPortalType('investor');
    setFormExpiresAt('');
  };

  const resetDocForm = () => {
    setDocTitle('');
    setDocDescription('');
    setDocCategory('general');
    setDocAccessLevel('investor');
    setDocFile(null);
  };

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return '-';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

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
          <h2 className="text-xl font-semibold">Portal Management</h2>
          <p className="text-sm text-muted-foreground">Manage investor, partner access and data rooms</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Active Invites', value: invites.filter(i => i.is_active).length, icon: Link2 },
          { label: 'Investors', value: invites.filter(i => i.portal_type === 'investor').length, icon: Building2 },
          { label: 'Partners', value: invites.filter(i => i.portal_type === 'partner').length, icon: Users },
          { label: 'Documents', value: documents.length, icon: FileText },
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

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="invites" className="gap-2">
              <Link2 className="h-4 w-4" />
              Invites
            </TabsTrigger>
            <TabsTrigger value="documents" className="gap-2">
              <FileText className="h-4 w-4" />
              Documents
            </TabsTrigger>
          </TabsList>

          {activeTab === 'invites' ? (
            <Button onClick={() => setShowInviteDialog(true)} className="btn-industrial">
              <Plus className="h-4 w-4 mr-2" />
              New Invite
            </Button>
          ) : (
            <Button onClick={() => setShowDocDialog(true)} className="btn-industrial">
              <Upload className="h-4 w-4 mr-2" />
              Upload Document
            </Button>
          )}
        </div>

        {/* Invites Tab */}
        <TabsContent value="invites">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Recipient</TableHead>
                    <TableHead>Portal</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Access</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invites.map((invite) => {
                    const config = PORTAL_CONFIG[invite.portal_type];
                    return (
                      <TableRow key={invite.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{invite.name || invite.email}</p>
                            {invite.company && (
                              <p className="text-sm text-muted-foreground">{invite.company}</p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={`gap-1 ${config.color}`}>
                            <config.icon className="h-3 w-3" />
                            {config.label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={invite.is_active ? 'default' : 'secondary'}>
                            {invite.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-sm">
                            <Eye className="h-3 w-3" />
                            {invite.access_count} views
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {new Date(invite.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => copyInviteLink(invite)}>
                                <Copy className="h-4 w-4 mr-2" />
                                Copy Link
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => toggleInviteActive(invite)}>
                                {invite.is_active ? (
                                  <>
                                    <EyeOff className="h-4 w-4 mr-2" />
                                    Deactivate
                                  </>
                                ) : (
                                  <>
                                    <Eye className="h-4 w-4 mr-2" />
                                    Activate
                                  </>
                                )}
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => deleteInvite(invite.id)}
                                className="text-destructive"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {invites.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                        No invites yet. Create one to share portal access.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Documents Tab */}
        <TabsContent value="documents">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Document</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Access</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Downloads</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {documents.map((doc) => (
                    <TableRow key={doc.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="font-medium">{doc.title}</p>
                            {doc.description && (
                              <p className="text-sm text-muted-foreground truncate max-w-[200px]">
                                {doc.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{doc.category}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{doc.access_level}</Badge>
                      </TableCell>
                      <TableCell className="text-sm">
                        {formatFileSize(doc.file_size)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <Download className="h-3 w-3" />
                          {doc.download_count}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <a 
                                href={supabase.storage.from('content-media').getPublicUrl(doc.file_path).data.publicUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <ExternalLink className="h-4 w-4 mr-2" />
                                View
                              </a>
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => deleteDocument(doc)}
                              className="text-destructive"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                  {documents.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                        No documents uploaded yet.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Create Invite Dialog */}
      <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Portal Invite</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Portal Type</Label>
              <Select value={formPortalType} onValueChange={(v: 'investor' | 'partner' | 'data_room') => setFormPortalType(v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(PORTAL_CONFIG).map(([key, config]) => (
                    <SelectItem key={key} value={key}>
                      <div className="flex items-center gap-2">
                        <config.icon className={`h-4 w-4 ${config.color}`} />
                        {config.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formEmail}
                onChange={(e) => setFormEmail(e.target.value)}
                placeholder="investor@company.com"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="John Smith"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company">Company</Label>
                <Input
                  id="company"
                  value={formCompany}
                  onChange={(e) => setFormCompany(e.target.value)}
                  placeholder="Acme Capital"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="expires">Expires (Optional)</Label>
              <Input
                id="expires"
                type="datetime-local"
                value={formExpiresAt}
                onChange={(e) => setFormExpiresAt(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setShowInviteDialog(false); resetInviteForm(); }}>
              Cancel
            </Button>
            <Button onClick={createInvite} disabled={saving}>
              {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Create & Copy Link
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Upload Document Dialog */}
      <Dialog open={showDocDialog} onOpenChange={setShowDocDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Document</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="doc-title">Title *</Label>
              <Input
                id="doc-title"
                value={docTitle}
                onChange={(e) => setDocTitle(e.target.value)}
                placeholder="Q4 2025 Financial Report"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="doc-desc">Description</Label>
              <Input
                id="doc-desc"
                value={docDescription}
                onChange={(e) => setDocDescription(e.target.value)}
                placeholder="Brief description..."
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={docCategory} onValueChange={setDocCategory}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General</SelectItem>
                    <SelectItem value="financial">Financial</SelectItem>
                    <SelectItem value="legal">Legal</SelectItem>
                    <SelectItem value="technical">Technical</SelectItem>
                    <SelectItem value="pitch">Pitch Deck</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Access Level</Label>
                <Select value={docAccessLevel} onValueChange={(v: 'investor' | 'partner' | 'all') => setDocAccessLevel(v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="investor">Investors Only</SelectItem>
                    <SelectItem value="partner">Partners Only</SelectItem>
                    <SelectItem value="all">Everyone</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="doc-file">File *</Label>
              <Input
                id="doc-file"
                type="file"
                onChange={(e) => setDocFile(e.target.files?.[0] || null)}
              />
              {docFile && (
                <p className="text-xs text-muted-foreground">
                  {docFile.name} ({formatFileSize(docFile.size)})
                </p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setShowDocDialog(false); resetDocForm(); }}>
              Cancel
            </Button>
            <Button onClick={uploadDocument} disabled={saving}>
              {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Upload
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
