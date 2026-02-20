import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Edit, Loader2, Plus, Trash2, TrendingUp, BarChart3, FileText, FolderLock, Briefcase } from 'lucide-react';

const SECTIONS = [
  { key: 'investor', label: 'Investor Portal', icon: Briefcase },
  { key: 'financial_projections', label: 'Financial Projections', icon: TrendingUp },
  { key: 'impact_metrics', label: 'Impact Metrics', icon: BarChart3 },
  { key: 'reports', label: 'Reports', icon: FileText },
  { key: 'data_room', label: 'Data Room', icon: FolderLock },
];

interface PortalDocument {
  id: string;
  section: string;
  title: string;
  description: string | null;
  file_url: string | null;
  file_name: string | null;
  is_published: boolean;
  created_at: string;
}

export function PortalEditor() {
  const { toast } = useToast();
  const [selectedSection, setSelectedSection] = useState('investor');
  const [documents, setDocuments] = useState<PortalDocument[]>([]);
  const [loading, setLoading] = useState(false);
  const [editDoc, setEditDoc] = useState<Partial<PortalDocument> | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadDocuments();
  }, [selectedSection]);

  async function loadDocuments() {
    setLoading(true);
    const { data } = await supabase
      .from('portal_documents')
      .select('*')
      .eq('section', selectedSection)
      .order('created_at', { ascending: false });
    setDocuments((data as PortalDocument[]) ?? []);
    setLoading(false);
  }

  async function handleSave() {
    if (!editDoc?.title) return;
    setSaving(true);
    if (editDoc.id) {
      await supabase.from('portal_documents').update({
        title: editDoc.title,
        description: editDoc.description,
        is_published: editDoc.is_published,
      }).eq('id', editDoc.id);
    } else {
      await supabase.from('portal_documents').insert({
        section: selectedSection,
        title: editDoc.title,
        description: editDoc.description,
        is_published: editDoc.is_published ?? true,
      });
    }
    toast({ title: 'Saved' });
    setDialogOpen(false);
    setEditDoc(null);
    setSaving(false);
    loadDocuments();
  }

  async function togglePublished(doc: PortalDocument) {
    await supabase.from('portal_documents').update({ is_published: !doc.is_published }).eq('id', doc.id);
    setDocuments(prev => prev.map(d => d.id === doc.id ? { ...d, is_published: !d.is_published } : d));
  }

  async function handleDelete(id: string) {
    await supabase.from('portal_documents').delete().eq('id', id);
    setDocuments(prev => prev.filter(d => d.id !== id));
    toast({ title: 'Deleted' });
  }

  return (
    <div className="space-y-6">
      {/* Section Tabs */}
      <div className="flex flex-wrap gap-2">
        {SECTIONS.map(section => (
          <button
            key={section.key}
            onClick={() => setSelectedSection(section.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedSection === section.key
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            <section.icon className="h-4 w-4" />
            {section.label}
          </button>
        ))}
      </div>

      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">
          {documents.length} document(s) in {SECTIONS.find(s => s.key === selectedSection)?.label}
        </p>
        <Button size="sm" onClick={() => { setEditDoc({ is_published: true }); setDialogOpen(true); }}>
          <Plus className="h-4 w-4 mr-2" />Add Entry
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-8"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
      ) : documents.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground">No content in this section yet.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {documents.map(doc => (
            <Card key={doc.id}>
              <CardContent className="pt-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-medium text-sm">{doc.title}</p>
                      <Badge variant={doc.is_published ? 'default' : 'secondary'} className="text-xs">
                        {doc.is_published ? 'Published' : 'Draft'}
                      </Badge>
                    </div>
                    {doc.description && <p className="text-xs text-muted-foreground mt-1">{doc.description}</p>}
                    {doc.file_name && <p className="text-xs text-muted-foreground mt-1 font-mono">{doc.file_name}</p>}
                  </div>
                  <Switch checked={doc.is_published} onCheckedChange={() => togglePublished(doc)} />
                </div>
                <div className="flex gap-2 mt-4">
                  <Button size="sm" variant="outline" className="flex-1" onClick={() => { setEditDoc(doc); setDialogOpen(true); }}>
                    <Edit className="h-3 w-3 mr-1" />Edit
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleDelete(doc.id)}>
                    <Trash2 className="h-3 w-3 text-destructive" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editDoc?.id ? 'Edit' : 'Add'} Content Entry</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2"><Label>Title *</Label><Input value={editDoc?.title ?? ''} onChange={e => setEditDoc(p => ({ ...p, title: e.target.value }))} /></div>
            <div className="space-y-2"><Label>Description</Label><Textarea rows={3} value={editDoc?.description ?? ''} onChange={e => setEditDoc(p => ({ ...p, description: e.target.value }))} /></div>
            <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
              <Switch checked={editDoc?.is_published ?? true} onCheckedChange={v => setEditDoc(p => ({ ...p, is_published: v }))} />
              <Label>Published</Label>
            </div>
            <Button className="w-full" onClick={handleSave} disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Save
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
