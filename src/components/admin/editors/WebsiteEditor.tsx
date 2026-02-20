import { useEffect, useState } from 'react';
import { cmsClient } from '@/lib/cms-client';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Eye, EyeOff, Edit, Globe, ExternalLink, Loader2 } from 'lucide-react';

interface Page {
  id: string;
  slug: string;
  title: string;
  meta_description: string | null;
  is_published: boolean;
  updated_at: string;
}

export function WebsiteEditor() {
  const { toast } = useToast();
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  const [editPage, setEditPage] = useState<Page | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const WEBSITE_URL = 'https://atroun-demo.lovable.app';

  useEffect(() => {
    loadPages();
  }, []);

  async function loadPages() {
    const { data } = await cmsClient.from('pages').select('*').order('slug');
    setPages((data as Page[]) ?? []);
    setLoading(false);
  }

  async function togglePublished(page: Page) {
    const { error } = await cmsClient
      .from('pages')
      .update({ is_published: !page.is_published })
      .eq('id', page.id);

    if (error) {
      toast({ title: 'Failed to update', description: error.message, variant: 'destructive' });
      return;
    }
    setPages(prev => prev.map(p => p.id === page.id ? { ...p, is_published: !p.is_published } : p));
    toast({ title: `Page ${page.is_published ? 'unpublished' : 'published'}` });
  }

  async function handleSave() {
    if (!editPage) return;
    setSaving(true);
    const { error } = await cmsClient
      .from('pages')
      .update({
        title: editPage.title,
        meta_description: editPage.meta_description,
        is_published: editPage.is_published,
      })
      .eq('id', editPage.id);

    if (error) {
      toast({ title: 'Save failed', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Page updated' });
      setEditDialogOpen(false);
      loadPages();
    }
    setSaving(false);
  }

  const pageSlugToPath = (slug: string) => slug === 'home' ? '/' : `/${slug}`;

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">Manage pages on the public website. Toggle publish status or edit page metadata.</p>
        <a href={WEBSITE_URL} target="_blank" rel="noreferrer">
          <Button variant="outline" size="sm">
            <ExternalLink className="h-4 w-4 mr-2" />View Website
          </Button>
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {pages.map(page => (
          <Card key={page.id} className="hover:shadow-soft transition-shadow">
            <CardContent className="pt-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Globe className="h-5 w-5 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-sm">{page.title}</p>
                      <Badge variant={page.is_published ? 'default' : 'secondary'} className="text-xs">
                        {page.is_published ? 'Published' : 'Draft'}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground font-mono mt-0.5">/{page.slug}</p>
                    {page.meta_description && (
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{page.meta_description}</p>
                    )}
                  </div>
                </div>
                <div className="flex flex-col gap-2 flex-shrink-0">
                  <Switch
                    checked={page.is_published}
                    onCheckedChange={() => togglePublished(page)}
                    aria-label="Toggle published"
                  />
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1"
                  onClick={() => { setEditPage(page); setEditDialogOpen(true); }}
                >
                  <Edit className="h-3 w-3 mr-1" />Edit
                </Button>
                <a href={`${WEBSITE_URL}${pageSlugToPath(page.slug)}`} target="_blank" rel="noreferrer" className="flex-1">
                  <Button size="sm" variant="outline" className="w-full">
                    <Eye className="h-3 w-3 mr-1" />Preview
                  </Button>
                </a>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle>Edit Page — {editPage?.title}</DialogTitle></DialogHeader>
          {editPage && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Page Title</Label>
                <Input value={editPage.title} onChange={e => setEditPage(p => p ? ({ ...p, title: e.target.value }) : null)} />
              </div>
              <div className="space-y-2">
                <Label>Meta Description</Label>
                <Textarea
                  rows={3}
                  value={editPage.meta_description ?? ''}
                  onChange={e => setEditPage(p => p ? ({ ...p, meta_description: e.target.value }) : null)}
                />
                <p className="text-xs text-muted-foreground">{editPage.meta_description?.length ?? 0}/160 characters</p>
              </div>
              <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                <Switch
                  checked={editPage.is_published}
                  onCheckedChange={v => setEditPage(p => p ? ({ ...p, is_published: v }) : null)}
                />
                <div>
                  <Label>Published</Label>
                  <p className="text-xs text-muted-foreground">Page is {editPage.is_published ? 'visible to the public' : 'hidden from the public'}</p>
                </div>
              </div>
              <div className="bg-muted rounded-lg p-3">
                <p className="text-xs text-muted-foreground mb-2">Live preview</p>
                <iframe
                  src={`${WEBSITE_URL}${pageSlugToPath(editPage.slug)}`}
                  className="w-full h-48 rounded border border-border"
                  title="Page preview"
                />
              </div>
              <Button className="w-full" onClick={handleSave} disabled={saving}>
                {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Save Changes
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
