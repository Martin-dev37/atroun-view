import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { 
  Plus, Loader2, GripVertical, Trash2, Edit, 
  Eye, EyeOff, FileText, Globe, Save, X
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Page {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  is_enabled: boolean;
  is_custom: boolean;
  display_order: number;
}

export const PageManager = () => {
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editPage, setEditPage] = useState<Page | null>(null);
  const [deletePage, setDeletePage] = useState<Page | null>(null);
  const [saving, setSaving] = useState(false);
  
  // Form state
  const [formTitle, setFormTitle] = useState('');
  const [formSlug, setFormSlug] = useState('');
  const [formDescription, setFormDescription] = useState('');

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('pages')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) {
      toast.error('Failed to load pages');
    } else {
      setPages(data || []);
    }
    setLoading(false);
  };

  const togglePageEnabled = async (page: Page) => {
    const { error } = await supabase
      .from('pages')
      .update({ is_enabled: !page.is_enabled })
      .eq('id', page.id);

    if (error) {
      toast.error('Failed to update page');
    } else {
      setPages(prev => 
        prev.map(p => p.id === page.id ? { ...p, is_enabled: !p.is_enabled } : p)
      );
      toast.success(`${page.title} ${!page.is_enabled ? 'enabled' : 'disabled'}`);
    }
  };

  const handleCreatePage = async () => {
    if (!formTitle.trim() || !formSlug.trim()) {
      toast.error('Title and slug are required');
      return;
    }

    setSaving(true);
    const { data, error } = await supabase
      .from('pages')
      .insert({
        title: formTitle.trim(),
        slug: formSlug.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-'),
        description: formDescription.trim() || null,
        is_custom: true,
        display_order: pages.length,
      })
      .select()
      .single();

    if (error) {
      toast.error(error.message.includes('duplicate') ? 'Slug already exists' : 'Failed to create page');
    } else {
      setPages(prev => [...prev, data]);
      toast.success('Page created');
      resetForm();
      setShowCreateDialog(false);
    }
    setSaving(false);
  };

  const handleUpdatePage = async () => {
    if (!editPage || !formTitle.trim() || !formSlug.trim()) {
      toast.error('Title and slug are required');
      return;
    }

    setSaving(true);
    const { error } = await supabase
      .from('pages')
      .update({
        title: formTitle.trim(),
        slug: formSlug.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-'),
        description: formDescription.trim() || null,
      })
      .eq('id', editPage.id);

    if (error) {
      toast.error(error.message.includes('duplicate') ? 'Slug already exists' : 'Failed to update page');
    } else {
      setPages(prev => 
        prev.map(p => p.id === editPage.id ? { 
          ...p, 
          title: formTitle.trim(),
          slug: formSlug.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-'),
          description: formDescription.trim() || null,
        } : p)
      );
      toast.success('Page updated');
      setEditPage(null);
      resetForm();
    }
    setSaving(false);
  };

  const handleDeletePage = async () => {
    if (!deletePage) return;

    const { error } = await supabase
      .from('pages')
      .delete()
      .eq('id', deletePage.id);

    if (error) {
      toast.error('Failed to delete page');
    } else {
      setPages(prev => prev.filter(p => p.id !== deletePage.id));
      toast.success('Page deleted');
    }
    setDeletePage(null);
  };

  const resetForm = () => {
    setFormTitle('');
    setFormSlug('');
    setFormDescription('');
  };

  const openEditDialog = (page: Page) => {
    setFormTitle(page.title);
    setFormSlug(page.slug);
    setFormDescription(page.description || '');
    setEditPage(page);
  };

  const generateSlug = (title: string) => {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Page Management</h2>
          <p className="text-sm text-muted-foreground">Enable, disable, or create new pages</p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Page
        </Button>
      </div>

      <div className="grid gap-3">
        {pages.map((page) => (
          <Card key={page.id} className={!page.is_enabled ? 'opacity-60' : ''}>
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <GripVertical className="h-5 w-5 text-muted-foreground cursor-grab" />
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium truncate">{page.title}</h3>
                    {page.is_custom ? (
                      <Badge variant="secondary" className="text-xs">Custom</Badge>
                    ) : (
                      <Badge variant="outline" className="text-xs">System</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">/{page.slug}</p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    {page.is_enabled ? (
                      <Eye className="h-4 w-4 text-green-600" />
                    ) : (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    )}
                    <Switch
                      checked={page.is_enabled}
                      onCheckedChange={() => togglePageEnabled(page)}
                    />
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openEditDialog(page)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>

                  {page.is_custom && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setDeletePage(page)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Create Page Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Page</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Page Title</Label>
              <Input
                id="title"
                value={formTitle}
                onChange={(e) => {
                  setFormTitle(e.target.value);
                  if (!formSlug) setFormSlug(generateSlug(e.target.value));
                }}
                placeholder="e.g., Our Team"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">URL Slug</Label>
              <div className="flex items-center">
                <span className="text-sm text-muted-foreground mr-1">/</span>
                <Input
                  id="slug"
                  value={formSlug}
                  onChange={(e) => setFormSlug(e.target.value)}
                  placeholder="e.g., our-team"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description (optional)</Label>
              <Textarea
                id="description"
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                placeholder="Brief page description..."
                rows={2}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setShowCreateDialog(false); resetForm(); }}>
              Cancel
            </Button>
            <Button onClick={handleCreatePage} disabled={saving}>
              {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Create Page
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Page Dialog */}
      <Dialog open={!!editPage} onOpenChange={(open) => !open && setEditPage(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Page</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-title">Page Title</Label>
              <Input
                id="edit-title"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-slug">URL Slug</Label>
              <div className="flex items-center">
                <span className="text-sm text-muted-foreground mr-1">/</span>
                <Input
                  id="edit-slug"
                  value={formSlug}
                  onChange={(e) => setFormSlug(e.target.value)}
                  disabled={!editPage?.is_custom}
                />
              </div>
              {!editPage?.is_custom && (
                <p className="text-xs text-muted-foreground">System page slugs cannot be changed</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description (optional)</Label>
              <Textarea
                id="edit-description"
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                rows={2}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setEditPage(null); resetForm(); }}>
              Cancel
            </Button>
            <Button onClick={handleUpdatePage} disabled={saving}>
              {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deletePage} onOpenChange={(open) => !open && setDeletePage(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Page</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deletePage?.title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeletePage} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
