import { useState, useEffect, useRef, useCallback } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bold, Italic, List, ListOrdered, Quote, Undo, Redo,
  Image as ImageIcon, Link as LinkIcon, Save, Loader2,
  WifiOff, Wifi, CloudOff, Cloud, Eye, EyeOff,
  Smartphone, Monitor, Tablet, Maximize2, Minimize2,
  Type, Heading1, Heading2
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

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

const OFFLINE_STORAGE_KEY = 'atroun-content-drafts';

type PreviewDevice = 'desktop' | 'tablet' | 'mobile';

export const ContentEditorWithPreview = () => {
  const [pages, setPages] = useState<Page[]>([]);
  const [selectedPageId, setSelectedPageId] = useState<string>('');
  const [contentBlocks, setContentBlocks] = useState<ContentBlock[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [hasOfflineChanges, setHasOfflineChanges] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
  const [previewDevice, setPreviewDevice] = useState<PreviewDevice>('desktop');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [liveContent, setLiveContent] = useState('');
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
        class: 'prose prose-sm sm:prose lg:prose-lg focus:outline-none min-h-[300px] p-4',
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      setLiveContent(html);
      saveToLocalDraft(html);
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

  useEffect(() => {
    fetchPages();
  }, []);

  useEffect(() => {
    if (selectedPageId) {
      loadPageContent();
    }
  }, [selectedPageId]);

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

    const drafts = getOfflineDrafts();
    const offlineDraft = drafts[selectedPageId];
    
    if (offlineDraft && !isOnline) {
      const block = offlineDraft.blocks.find((b: ContentBlock) => b.block_type === 'paragraph');
      if (block && editor) {
        editor.commands.setContent(block.content.html || '');
        setLiveContent(block.content.html || '');
      }
      return;
    }

    const { data, error } = await supabase
      .from('page_content')
      .select('*')
      .eq('page_id', selectedPageId)
      .order('display_order', { ascending: true });

    if (error) {
      toast.error('Failed to load content');
    } else {
      setContentBlocks((data as ContentBlock[]) || []);
      const paragraphBlock = data?.find(b => b.block_type === 'paragraph');
      if (paragraphBlock && editor) {
        const content = paragraphBlock.content as { html?: string };
        editor.commands.setContent(content?.html || '');
        setLiveContent(content?.html || '');
      } else if (editor) {
        editor.commands.setContent('');
        setLiveContent('');
      }
    }
  };

  const getOfflineDrafts = (): Record<string, { blocks: ContentBlock[] }> => {
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
      blocks: [{
        id: 'draft',
        page_id: selectedPageId,
        block_type: 'paragraph',
        content: { html },
        display_order: 0,
      }],
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

    localStorage.removeItem(OFFLINE_STORAGE_KEY);
    setHasOfflineChanges(false);
    setSyncing(false);

    if (syncedCount > 0) {
      toast.success(`${syncedCount} changes synced`);
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
      toast.error('Image upload requires internet');
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

  const getPreviewWidth = () => {
    switch (previewDevice) {
      case 'mobile': return 'max-w-[375px]';
      case 'tablet': return 'max-w-[768px]';
      default: return 'max-w-full';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${isFullscreen ? 'fixed inset-0 z-50 bg-background p-4' : ''}`}>
      {/* Header Controls */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <Select value={selectedPageId} onValueChange={setSelectedPageId}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select page" />
            </SelectTrigger>
            <SelectContent>
              {pages.map(page => (
                <SelectItem key={page.id} value={page.id}>
                  {page.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Badge variant={isOnline ? 'default' : 'secondary'} className="gap-1">
            {isOnline ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
            {isOnline ? 'Online' : 'Offline'}
          </Badge>

          {hasOfflineChanges && (
            <Badge variant="outline" className="gap-1">
              {syncing ? (
                <>
                  <Loader2 className="h-3 w-3 animate-spin" />
                  Syncing
                </>
              ) : (
                <>
                  <CloudOff className="h-3 w-3" />
                  Pending
                </>
              )}
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Preview Device Toggle */}
          <div className="flex items-center rounded-lg border bg-muted/50 p-1">
            <Button
              variant={previewDevice === 'desktop' ? 'secondary' : 'ghost'}
              size="icon"
              className="h-7 w-7"
              onClick={() => setPreviewDevice('desktop')}
            >
              <Monitor className="h-4 w-4" />
            </Button>
            <Button
              variant={previewDevice === 'tablet' ? 'secondary' : 'ghost'}
              size="icon"
              className="h-7 w-7"
              onClick={() => setPreviewDevice('tablet')}
            >
              <Tablet className="h-4 w-4" />
            </Button>
            <Button
              variant={previewDevice === 'mobile' ? 'secondary' : 'ghost'}
              size="icon"
              className="h-7 w-7"
              onClick={() => setPreviewDevice('mobile')}
            >
              <Smartphone className="h-4 w-4" />
            </Button>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowPreview(!showPreview)}
          >
            {showPreview ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsFullscreen(!isFullscreen)}
          >
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Button>

          {isOnline && hasOfflineChanges && !syncing && (
            <Button variant="outline" size="sm" onClick={syncOfflineChanges}>
              <Cloud className="h-4 w-4 mr-1" />
              Sync
            </Button>
          )}

          <Button onClick={saveContent} disabled={saving || !selectedPageId}>
            {saving ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <Save className="h-4 w-4 mr-1" />}
            Save
          </Button>
        </div>
      </div>

      {/* Main Editor Area */}
      <ResizablePanelGroup direction="horizontal" className="min-h-[600px] rounded-lg border">
        {/* Editor Panel */}
        <ResizablePanel defaultSize={showPreview ? 50 : 100} minSize={30}>
          <div className="h-full flex flex-col">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-1 p-2 border-b bg-muted/30">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => editor?.chain().focus().setParagraph().run()}
                className={editor?.isActive('paragraph') ? 'bg-muted' : ''}
              >
                <Type className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}
                className={editor?.isActive('heading', { level: 1 }) ? 'bg-muted' : ''}
              >
                <Heading1 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
                className={editor?.isActive('heading', { level: 2 }) ? 'bg-muted' : ''}
              >
                <Heading2 className="h-4 w-4" />
              </Button>
              <div className="w-px h-6 bg-border mx-1" />
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
              <div className="w-px h-6 bg-border mx-1" />
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
              <div className="flex-1" />
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
            <div className="flex-1 overflow-auto">
              <EditorContent editor={editor} className="h-full" />
            </div>
          </div>
        </ResizablePanel>

        {showPreview && (
          <>
            <ResizableHandle withHandle />
            
            {/* Preview Panel */}
            <ResizablePanel defaultSize={50} minSize={30}>
              <div className="h-full flex flex-col bg-gradient-to-br from-muted/20 to-muted/40">
                {/* Preview Header */}
                <div className="flex items-center justify-between p-3 border-b bg-background/80 backdrop-blur-sm">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-400" />
                      <div className="w-3 h-3 rounded-full bg-yellow-400" />
                      <div className="w-3 h-3 rounded-full bg-green-400" />
                    </div>
                    <span className="text-xs text-muted-foreground ml-2">
                      Live Preview - {selectedPage?.title}
                    </span>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {previewDevice === 'mobile' ? '375px' : previewDevice === 'tablet' ? '768px' : '100%'}
                  </Badge>
                </div>

                {/* Preview Content */}
                <div className="flex-1 overflow-auto p-4">
                  <motion.div 
                    key={previewDevice}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.2 }}
                    className={`mx-auto bg-background rounded-lg shadow-elevated border overflow-hidden ${getPreviewWidth()}`}
                    style={{ minHeight: '400px' }}
                  >
                    {/* Mock Browser Chrome */}
                    <div className="h-8 bg-muted/50 border-b flex items-center px-3 gap-2">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 rounded-full bg-border" />
                        <div className="w-2 h-2 rounded-full bg-border" />
                        <div className="w-2 h-2 rounded-full bg-border" />
                      </div>
                      <div className="flex-1 bg-background/50 rounded h-4 px-2 text-[10px] text-muted-foreground flex items-center">
                        atroun.com/{selectedPage?.slug || ''}
                      </div>
                    </div>

                    {/* Page Content Preview */}
                    <div className="p-6">
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={liveContent}
                          initial={{ opacity: 0.5 }}
                          animate={{ opacity: 1 }}
                          className="prose prose-sm max-w-none"
                          dangerouslySetInnerHTML={{ __html: liveContent || '<p class="text-muted-foreground">Start typing to see live preview...</p>' }}
                        />
                      </AnimatePresence>
                    </div>
                  </motion.div>
                </div>

                {/* Preview Footer */}
                <div className="p-2 border-t bg-background/60 backdrop-blur-sm">
                  <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                      Real-time sync
                    </span>
                  </div>
                </div>
              </div>
            </ResizablePanel>
          </>
        )}
      </ResizablePanelGroup>
    </div>
  );
};
