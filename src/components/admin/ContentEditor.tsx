import { useState, useEffect, useRef, useCallback } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { 
  Bold, Italic, List, ListOrdered, Quote, Undo, Redo,
  Image as ImageIcon, Link as LinkIcon, Save, Loader2,
  WifiOff, Wifi, CloudOff, Cloud, Trash2
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Page {
  id: string;
  slug: string;
  title: string;
}

interface ContentBlock {
  id: string;
  page_id: string;
  block_type: string;
  content: {
    html?: string;
    url?: string;
    alt?: string;
    caption?: string;
  };
  display_order: number;
}

interface OfflineDraft {
  pageId: string;
  blocks: ContentBlock[];
  lastModified: number;
}

const OFFLINE_STORAGE_KEY = 'atroun-content-drafts';

export const ContentEditor = () => {
  const [pages, setPages] = useState<Page[]>([]);
  const [selectedPageId, setSelectedPageId] = useState<string>('');
  const [contentBlocks, setContentBlocks] = useState<ContentBlock[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [hasOfflineChanges, setHasOfflineChanges] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primary underline',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full rounded-lg',
        },
      }),
      Placeholder.configure({
        placeholder: 'Start writing your content here...',
      }),
    ],
    content: '',
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-xl focus:outline-none min-h-[300px] p-4',
      },
    },
    onUpdate: ({ editor }) => {
      saveToLocalDraft(editor.getHTML());
    },
  });

  // Online/offline detection
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      syncOfflineChanges();
    };
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Load pages
  useEffect(() => {
    fetchPages();
  }, []);

  // Load content when page changes
  useEffect(() => {
    if (selectedPageId) {
      loadPageContent();
    }
  }, [selectedPageId]);

  // Check for offline changes on load
  useEffect(() => {
    const drafts = getOfflineDrafts();
    setHasOfflineChanges(Object.keys(drafts).length > 0);
    
    if (isOnline && Object.keys(drafts).length > 0) {
      syncOfflineChanges();
    }
  }, [isOnline]);

  const fetchPages = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('pages')
      .select('id, slug, title')
      .order('display_order', { ascending: true });

    if (error) {
      toast.error('Failed to load pages');
    } else {
      setPages(data || []);
      if (data && data.length > 0) {
        setSelectedPageId(data[0].id);
      }
    }
    setLoading(false);
  };

  const loadPageContent = async () => {
    if (!selectedPageId) return;

    // First check for offline draft
    const drafts = getOfflineDrafts();
    const offlineDraft = drafts[selectedPageId];
    
    if (offlineDraft && !isOnline) {
      // Load from offline draft
      const block = offlineDraft.blocks.find(b => b.block_type === 'paragraph');
      if (block && editor) {
        editor.commands.setContent(block.content.html || '');
      }
      return;
    }

    // Load from database
    const { data, error } = await supabase
      .from('page_content')
      .select('*')
      .eq('page_id', selectedPageId)
      .order('display_order', { ascending: true });

    if (error) {
      toast.error('Failed to load content');
    } else {
      setContentBlocks((data as ContentBlock[]) || []);
      // Load first paragraph block into editor
      const paragraphBlock = data?.find(b => b.block_type === 'paragraph');
      if (paragraphBlock && editor) {
        const content = paragraphBlock.content as { html?: string };
        editor.commands.setContent(content?.html || '');
      } else if (editor) {
        editor.commands.setContent('');
      }
    }
  };

  const getOfflineDrafts = (): Record<string, OfflineDraft> => {
    try {
      const stored = localStorage.getItem(OFFLINE_STORAGE_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  };

  const saveToLocalDraft = useCallback((html: string) => {
    if (!selectedPageId) return;

    const drafts = getOfflineDrafts();
    drafts[selectedPageId] = {
      pageId: selectedPageId,
      blocks: [{
        id: 'draft',
        page_id: selectedPageId,
        block_type: 'paragraph',
        content: { html },
        display_order: 0,
      }],
      lastModified: Date.now(),
    };
    localStorage.setItem(OFFLINE_STORAGE_KEY, JSON.stringify(drafts));
    setHasOfflineChanges(true);
  }, [selectedPageId]);

  const syncOfflineChanges = async () => {
    if (!isOnline) return;

    const drafts = getOfflineDrafts();
    if (Object.keys(drafts).length === 0) return;

    setSyncing(true);
    let syncedCount = 0;

    for (const pageId of Object.keys(drafts)) {
      const draft = drafts[pageId];
      for (const block of draft.blocks) {
        const existingBlock = contentBlocks.find(b => 
          b.page_id === pageId && b.block_type === block.block_type
        );

        if (existingBlock) {
          await supabase
            .from('page_content')
            .update({ content: block.content })
            .eq('id', existingBlock.id);
        } else {
          await supabase
            .from('page_content')
            .insert({
              page_id: pageId,
              block_type: block.block_type,
              content: block.content,
              display_order: 0,
            });
        }
        syncedCount++;
      }
    }

    // Clear offline drafts
    localStorage.removeItem(OFFLINE_STORAGE_KEY);
    setHasOfflineChanges(false);
    setSyncing(false);

    if (syncedCount > 0) {
      toast.success(`${syncedCount} changes synced to cloud`);
      loadPageContent();
    }
  };

  const saveContent = async () => {
    if (!editor || !selectedPageId) return;

    const html = editor.getHTML();

    if (!isOnline) {
      saveToLocalDraft(html);
      toast.success('Saved offline - will sync when online');
      return;
    }

    setSaving(true);
    
    // Find existing paragraph block or create new one
    const existingBlock = contentBlocks.find(b => b.block_type === 'paragraph');
    
    if (existingBlock) {
      const { error } = await supabase
        .from('page_content')
        .update({ content: { html } })
        .eq('id', existingBlock.id);

      if (error) {
        toast.error('Failed to save');
      } else {
        toast.success('Content saved');
        // Clear offline draft for this page
        const drafts = getOfflineDrafts();
        delete drafts[selectedPageId];
        localStorage.setItem(OFFLINE_STORAGE_KEY, JSON.stringify(drafts));
      }
    } else {
      const { data, error } = await supabase
        .from('page_content')
        .insert({
          page_id: selectedPageId,
          block_type: 'paragraph',
          content: { html },
          display_order: 0,
        })
        .select()
        .single();

      if (error) {
        toast.error('Failed to save');
      } else {
        setContentBlocks(prev => [...prev, data as ContentBlock]);
        toast.success('Content saved');
      }
    }

    setSaving(false);
  };

  const handleImageUpload = async (file: File) => {
    if (!isOnline) {
      toast.error('Image upload requires internet connection');
      return;
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `images/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('content-media')
      .upload(filePath, file);

    if (uploadError) {
      toast.error('Failed to upload image');
      return;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('content-media')
      .getPublicUrl(filePath);

    editor?.chain().focus().setImage({ src: publicUrl }).run();
    toast.success('Image uploaded');
  };

  const addLink = () => {
    const url = prompt('Enter URL:');
    if (url) {
      editor?.chain().focus().setLink({ href: url }).run();
    }
  };

  const selectedPage = pages.find(p => p.id === selectedPageId);

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
          <h2 className="text-xl font-semibold">Content Editor</h2>
          <p className="text-sm text-muted-foreground">Edit page content with rich media support</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Connection Status */}
          <Badge variant={isOnline ? 'default' : 'secondary'} className="gap-1">
            {isOnline ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
            {isOnline ? 'Online' : 'Offline'}
          </Badge>

          {/* Sync Status */}
          {hasOfflineChanges && (
            <Badge variant="outline" className="gap-1">
              {syncing ? (
                <>
                  <Loader2 className="h-3 w-3 animate-spin" />
                  Syncing...
                </>
              ) : (
                <>
                  <CloudOff className="h-3 w-3" />
                  Pending sync
                </>
              )}
            </Badge>
          )}

          {isOnline && hasOfflineChanges && !syncing && (
            <Button variant="outline" size="sm" onClick={syncOfflineChanges}>
              <Cloud className="h-4 w-4 mr-2" />
              Sync Now
            </Button>
          )}
        </div>
      </div>

      {/* Page Selector */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Label htmlFor="page-select">Select Page</Label>
              <Select value={selectedPageId} onValueChange={setSelectedPageId}>
                <SelectTrigger id="page-select">
                  <SelectValue placeholder="Select a page" />
                </SelectTrigger>
                <SelectContent>
                  {pages.map(page => (
                    <SelectItem key={page.id} value={page.id}>
                      {page.title} (/{page.slug})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={saveContent} disabled={saving || !selectedPageId}>
              {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
              {isOnline ? 'Save' : 'Save Offline'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Editor */}
      {selectedPageId && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">
              Editing: {selectedPage?.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-1 p-2 border rounded-t-lg bg-muted/50 border-b-0">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => editor?.chain().focus().toggleBold().run()}
                className={editor?.isActive('bold') ? 'bg-muted' : ''}
              >
                <Bold className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => editor?.chain().focus().toggleItalic().run()}
                className={editor?.isActive('italic') ? 'bg-muted' : ''}
              >
                <Italic className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => editor?.chain().focus().toggleBulletList().run()}
                className={editor?.isActive('bulletList') ? 'bg-muted' : ''}
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => editor?.chain().focus().toggleOrderedList().run()}
                className={editor?.isActive('orderedList') ? 'bg-muted' : ''}
              >
                <ListOrdered className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => editor?.chain().focus().toggleBlockquote().run()}
                className={editor?.isActive('blockquote') ? 'bg-muted' : ''}
              >
                <Quote className="h-4 w-4" />
              </Button>
              <div className="w-px h-6 bg-border mx-1" />
              <Button variant="ghost" size="sm" onClick={addLink}>
                <LinkIcon className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => fileInputRef.current?.click()}
                disabled={!isOnline}
              >
                <ImageIcon className="h-4 w-4" />
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleImageUpload(file);
                  e.target.value = '';
                }}
              />
              <div className="w-px h-6 bg-border mx-1" />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => editor?.chain().focus().undo().run()}
                disabled={!editor?.can().undo()}
              >
                <Undo className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => editor?.chain().focus().redo().run()}
                disabled={!editor?.can().redo()}
              >
                <Redo className="h-4 w-4" />
              </Button>
            </div>

            {/* Editor Content */}
            <div className="border rounded-b-lg min-h-[400px]">
              <EditorContent editor={editor} />
            </div>

            {!isOnline && (
              <p className="text-sm text-muted-foreground mt-2 flex items-center gap-2">
                <WifiOff className="h-4 w-4" />
                You're offline. Changes will be saved locally and synced when you're back online.
              </p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
