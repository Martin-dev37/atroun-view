import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import {
  Upload, Trash2, Copy, Check, Search, Image as ImageIcon, Loader2, X, FolderOpen,
} from 'lucide-react';

const BUCKET = 'media-assets';

interface MediaFile {
  name: string;
  url: string;
  size: number;
  created_at: string;
  metadata?: Record<string, unknown>;
}

interface MediaLibraryProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect?: (url: string) => void;
  mode?: 'browse' | 'select';
}

export function MediaLibrary({ open, onOpenChange, onSelect, mode = 'browse' }: MediaLibraryProps) {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState('');
  const [copied, setCopied] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const loadFiles = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.storage.from(BUCKET).list('', {
        limit: 200,
        offset: 0,
        sortBy: { column: 'created_at', order: 'desc' },
      });
      if (error) throw error;
      const mediaFiles: MediaFile[] = (data || [])
        .filter(f => f.name !== '.emptyFolderPlaceholder')
        .map(f => ({
          name: f.name,
          url: supabase.storage.from(BUCKET).getPublicUrl(f.name).data.publicUrl,
          size: f.metadata?.size as number || 0,
          created_at: f.created_at || '',
          metadata: f.metadata as Record<string, unknown>,
        }));
      setFiles(mediaFiles);
    } catch (e: any) {
      toast({ title: 'Failed to load media', description: e.message, variant: 'destructive' });
    }
    setLoading(false);
  }, [toast]);

  useEffect(() => {
    if (open) loadFiles();
  }, [open, loadFiles]);

  async function handleUpload(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return;
    setUploading(true);
    let successCount = 0;
    for (const file of Array.from(fileList)) {
      if (file.size > 10 * 1024 * 1024) {
        toast({ title: `${file.name} exceeds 10MB limit`, variant: 'destructive' });
        continue;
      }
      const ext = file.name.split('.').pop();
      const safeName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
      const { error } = await supabase.storage.from(BUCKET).upload(safeName, file, {
        cacheControl: '3600',
        upsert: false,
      });
      if (error) {
        toast({ title: `Failed to upload ${file.name}`, description: error.message, variant: 'destructive' });
      } else {
        successCount++;
      }
    }
    if (successCount > 0) {
      toast({ title: `${successCount} file${successCount > 1 ? 's' : ''} uploaded` });
      loadFiles();
    }
    setUploading(false);
  }

  async function handleDelete(fileName: string) {
    setDeleting(fileName);
    const { error } = await supabase.storage.from(BUCKET).remove([fileName]);
    if (error) {
      toast({ title: 'Delete failed', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'File deleted' });
      setFiles(prev => prev.filter(f => f.name !== fileName));
    }
    setDeleting(null);
  }

  function handleCopy(url: string) {
    navigator.clipboard.writeText(url);
    setCopied(url);
    setTimeout(() => setCopied(null), 2000);
  }

  function handleSelect(url: string) {
    if (mode === 'select' && onSelect) {
      onSelect(url);
      onOpenChange(false);
    } else {
      setSelected(prev => prev === url ? null : url);
    }
  }

  const filtered = files.filter(f =>
    f.name.toLowerCase().includes(search.toLowerCase())
  );

  function formatSize(bytes: number) {
    if (!bytes) return '—';
    if (bytes < 1024) return `${bytes}B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] flex flex-col p-0 gap-0">
        <DialogHeader className="px-6 py-4 border-b border-border flex-shrink-0">
          <DialogTitle className="flex items-center gap-2">
            <FolderOpen className="h-5 w-5 text-primary" />
            Media Library
            {mode === 'select' && (
              <span className="text-sm font-normal text-muted-foreground ml-2">— Click an image to select it</span>
            )}
          </DialogTitle>
        </DialogHeader>

        {/* Toolbar */}
        <div className="flex items-center gap-3 px-6 py-3 border-b border-border flex-shrink-0 bg-muted/30">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search files…"
              className="pl-8 h-8 text-sm"
            />
          </div>
          <Button
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="gap-2"
          >
            {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
            {uploading ? 'Uploading…' : 'Upload'}
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={e => handleUpload(e.target.files)}
          />
        </div>

        {/* Drop Zone + Grid */}
        <div
          className={`flex-1 overflow-y-auto p-6 transition-colors ${dragOver ? 'bg-primary/5 ring-2 ring-inset ring-primary/30' : ''}`}
          onDragOver={e => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={e => { e.preventDefault(); setDragOver(false); handleUpload(e.dataTransfer.files); }}
        >
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : files.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <ImageIcon className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground font-medium">No media files yet</p>
              <p className="text-sm text-muted-foreground mt-1">Upload images or drag & drop here</p>
              <Button className="mt-4 gap-2" onClick={() => fileInputRef.current?.click()}>
                <Upload className="h-4 w-4" />Upload First Image
              </Button>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <p className="text-muted-foreground">No files match "{search}"</p>
              <Button variant="ghost" size="sm" className="mt-2" onClick={() => setSearch('')}>
                <X className="h-3.5 w-3.5 mr-1" />Clear search
              </Button>
            </div>
          ) : (
            <>
              {dragOver && (
                <div className="mb-4 p-4 rounded-lg border-2 border-dashed border-primary text-center text-primary font-medium text-sm">
                  Drop images here to upload
                </div>
              )}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {filtered.map(file => {
                  const isSelected = selected === file.url;
                  return (
                    <div
                      key={file.name}
                      className={`group relative rounded-lg border overflow-hidden cursor-pointer transition-all ${
                        isSelected
                          ? 'border-primary ring-2 ring-primary shadow-md'
                          : 'border-border hover:border-primary/50 hover:shadow-sm'
                      }`}
                      onClick={() => handleSelect(file.url)}
                    >
                      {/* Image */}
                      <div className="aspect-square bg-muted relative">
                        <img
                          src={file.url}
                          alt={file.name}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                        {isSelected && (
                          <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                              <Check className="h-4 w-4 text-primary-foreground" />
                            </div>
                          </div>
                        )}
                        {/* Hover actions */}
                        <div className="absolute top-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            className="w-7 h-7 rounded-md bg-background/90 backdrop-blur-sm flex items-center justify-center hover:bg-background shadow-sm"
                            onClick={e => { e.stopPropagation(); handleCopy(file.url); }}
                            title="Copy URL"
                          >
                            {copied === file.url ? <Check className="h-3.5 w-3.5 text-primary" /> : <Copy className="h-3.5 w-3.5" />}
                          </button>
                          <button
                            className="w-7 h-7 rounded-md bg-background/90 backdrop-blur-sm flex items-center justify-center hover:bg-destructive/10 hover:text-destructive shadow-sm"
                            onClick={e => { e.stopPropagation(); handleDelete(file.name); }}
                            title="Delete"
                            disabled={deleting === file.name}
                          >
                            {deleting === file.name
                              ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                              : <Trash2 className="h-3.5 w-3.5" />}
                          </button>
                        </div>
                      </div>
                      {/* Filename + size */}
                      <div className="px-2 py-1.5 bg-background">
                        <p className="text-[11px] font-medium truncate text-foreground" title={file.name}>{file.name}</p>
                        <p className="text-[10px] text-muted-foreground">{formatSize(file.size)}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        {mode === 'select' && selected && (
          <div className="flex items-center justify-between px-6 py-3 border-t border-border bg-muted/30 flex-shrink-0">
            <div className="flex items-center gap-3 min-w-0">
              <img src={selected} alt="Selected" className="w-10 h-10 rounded object-cover border border-border flex-shrink-0" />
              <p className="text-sm truncate text-muted-foreground">{selected}</p>
            </div>
            <Button onClick={() => { onSelect?.(selected); onOpenChange(false); }} className="ml-4 flex-shrink-0">
              Use This Image
            </Button>
          </div>
        )}

        {mode === 'browse' && (
          <div className="flex items-center justify-between px-6 py-3 border-t border-border bg-muted/30 flex-shrink-0">
            <p className="text-xs text-muted-foreground">
              {filtered.length} file{filtered.length !== 1 ? 's' : ''} · Drag & drop anywhere to upload
            </p>
            {selected && (
              <Button variant="outline" size="sm" onClick={() => handleCopy(selected)} className="gap-2">
                {copied === selected ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                Copy URL
              </Button>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

// Small inline trigger button to open media library picker
interface ImagePickerProps {
  value: string;
  onChange: (url: string) => void;
  placeholder?: string;
}

export function ImagePickerInput({ value, onChange, placeholder = 'https://... or pick from library' }: ImagePickerProps) {
  const [libraryOpen, setLibraryOpen] = useState(false);

  return (
    <div className="flex gap-2">
      <Input
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="flex-1"
      />
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="flex-shrink-0 gap-1.5 px-3"
        onClick={() => setLibraryOpen(true)}
        title="Pick from media library"
      >
        <ImageIcon className="h-3.5 w-3.5" />
        Library
      </Button>
      <MediaLibrary
        open={libraryOpen}
        onOpenChange={setLibraryOpen}
        mode="select"
        onSelect={onChange}
      />
    </div>
  );
}
