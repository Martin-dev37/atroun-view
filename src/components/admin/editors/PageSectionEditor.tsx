import { useEffect, useState, useCallback } from 'react';
import { cmsClient } from '@/lib/cms-client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import {
  DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  Loader2, GripVertical, Edit, Eye, EyeOff, Image, FileText, Megaphone, Save,
  ChevronRight, ExternalLink, Plus, Trash2, LayoutTemplate,
} from 'lucide-react';

interface Page {
  id: string; slug: string; title: string; meta_description: string | null; is_published: boolean; updated_at: string;
}

interface HeroSection {
  id: string; page_slug: string; eyebrow: string | null; title: string; subtitle: string | null;
  background_image: string | null; background_video: string | null;
  cta_primary_text: string | null; cta_primary_link: string | null;
  cta_secondary_text: string | null; cta_secondary_link: string | null;
  display_order: number;
}

interface ContentSection {
  id: string; page_slug: string; section_key: string; title: string | null; subtitle: string | null;
  body_content: string | null; image: string | null; image_alt: string | null;
  variant: string; display_order: number; is_centered: boolean;
}

interface CTABlock {
  id: string; page_slug: string; title: string; subtitle: string | null;
  cta_primary_text: string | null; cta_primary_link: string | null;
  cta_secondary_text: string | null; cta_secondary_link: string | null;
  variant: string; display_order: number; is_active: boolean;
}

type SectionItem = 
  | { type: 'hero'; data: HeroSection }
  | { type: 'content'; data: ContentSection }
  | { type: 'cta'; data: CTABlock };

const WEBSITE_URL = 'https://atroun-demo.lovable.app';

// Sortable section card
function SortableSectionCard({ item, onEdit, index }: { item: SectionItem; onEdit: () => void; index: number }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: item.data.id });
  const style = { transform: CSS.Transform.toString(transform), transition };

  const label = item.type === 'hero' ? 'Hero Section' 
    : item.type === 'cta' ? 'Call to Action'
    : (item.data as ContentSection).section_key.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

  const icon = item.type === 'hero' ? <Image className="h-4 w-4" /> 
    : item.type === 'cta' ? <Megaphone className="h-4 w-4" />
    : <FileText className="h-4 w-4" />;

  const title = item.type === 'hero' ? (item.data as HeroSection).title
    : item.type === 'cta' ? (item.data as CTABlock).title
    : (item.data as ContentSection).title || 'Untitled Section';

  return (
    <div ref={setNodeRef} style={style} className="group">
      <div className="flex items-center gap-3 p-3 rounded-lg border border-border bg-background hover:bg-muted/50 transition-colors">
        <button className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground" {...attributes} {...listeners}>
          <GripVertical className="h-4 w-4" />
        </button>
        <div className="h-8 w-8 rounded bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-[10px] font-mono px-1.5 py-0">{label}</Badge>
          </div>
          <p className="text-sm font-medium truncate mt-0.5">{title}</p>
        </div>
        <Button size="sm" variant="ghost" onClick={onEdit} className="opacity-0 group-hover:opacity-100 transition-opacity">
          <Edit className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}

// Hero editor fields
function HeroEditorFields({ hero, onChange }: { hero: HeroSection; onChange: (h: HeroSection) => void }) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Eyebrow Text</Label>
        <Input value={hero.eyebrow || ''} onChange={e => onChange({ ...hero, eyebrow: e.target.value })} placeholder="e.g. Agri-Biotech · Uganda" />
      </div>
      <div className="space-y-2">
        <Label>Title *</Label>
        <Textarea rows={2} value={hero.title} onChange={e => onChange({ ...hero, title: e.target.value })} />
      </div>
      <div className="space-y-2">
        <Label>Subtitle</Label>
        <Textarea rows={3} value={hero.subtitle || ''} onChange={e => onChange({ ...hero, subtitle: e.target.value })} />
      </div>
      <div className="space-y-2">
        <Label>Background Image URL</Label>
        <Input value={hero.background_image || ''} onChange={e => onChange({ ...hero, background_image: e.target.value })} placeholder="https://..." />
      </div>
      <div className="space-y-2">
        <Label>Background Video URL</Label>
        <Input value={hero.background_video || ''} onChange={e => onChange({ ...hero, background_video: e.target.value })} placeholder="https://..." />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Primary CTA Text</Label>
          <Input value={hero.cta_primary_text || ''} onChange={e => onChange({ ...hero, cta_primary_text: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label>Primary CTA Link</Label>
          <Input value={hero.cta_primary_link || ''} onChange={e => onChange({ ...hero, cta_primary_link: e.target.value })} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Secondary CTA Text</Label>
          <Input value={hero.cta_secondary_text || ''} onChange={e => onChange({ ...hero, cta_secondary_text: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label>Secondary CTA Link</Label>
          <Input value={hero.cta_secondary_link || ''} onChange={e => onChange({ ...hero, cta_secondary_link: e.target.value })} />
        </div>
      </div>
    </div>
  );
}

// Content section editor fields
function ContentEditorFields({ section, onChange }: { section: ContentSection; onChange: (s: ContentSection) => void }) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Section Key</Label>
        <Input value={section.section_key} disabled className="bg-muted font-mono text-xs" />
      </div>
      <div className="space-y-2">
        <Label>Title</Label>
        <Input value={section.title || ''} onChange={e => onChange({ ...section, title: e.target.value })} />
      </div>
      <div className="space-y-2">
        <Label>Subtitle</Label>
        <Textarea rows={2} value={section.subtitle || ''} onChange={e => onChange({ ...section, subtitle: e.target.value })} />
      </div>
      <div className="space-y-2">
        <Label>Body Content</Label>
        <Textarea rows={5} value={section.body_content || ''} onChange={e => onChange({ ...section, body_content: e.target.value })} />
        <p className="text-xs text-muted-foreground">Use newlines to separate list items</p>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Image URL</Label>
          <Input value={section.image || ''} onChange={e => onChange({ ...section, image: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label>Image Alt Text</Label>
          <Input value={section.image_alt || ''} onChange={e => onChange({ ...section, image_alt: e.target.value })} />
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Switch checked={section.is_centered} onCheckedChange={v => onChange({ ...section, is_centered: v })} />
        <Label>Center content</Label>
      </div>
    </div>
  );
}

// CTA editor fields
function CTAEditorFields({ cta, onChange }: { cta: CTABlock; onChange: (c: CTABlock) => void }) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Title *</Label>
        <Textarea rows={2} value={cta.title} onChange={e => onChange({ ...cta, title: e.target.value })} />
      </div>
      <div className="space-y-2">
        <Label>Subtitle</Label>
        <Textarea rows={3} value={cta.subtitle || ''} onChange={e => onChange({ ...cta, subtitle: e.target.value })} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Primary Button Text</Label>
          <Input value={cta.cta_primary_text || ''} onChange={e => onChange({ ...cta, cta_primary_text: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label>Primary Button Link</Label>
          <Input value={cta.cta_primary_link || ''} onChange={e => onChange({ ...cta, cta_primary_link: e.target.value })} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Secondary Button Text</Label>
          <Input value={cta.cta_secondary_text || ''} onChange={e => onChange({ ...cta, cta_secondary_text: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label>Secondary Button Link</Label>
          <Input value={cta.cta_secondary_link || ''} onChange={e => onChange({ ...cta, cta_secondary_link: e.target.value })} />
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Switch checked={cta.is_active} onCheckedChange={v => onChange({ ...cta, is_active: v })} />
        <Label>Active</Label>
      </div>
    </div>
  );
}

export function PageSectionEditor() {
  const { toast } = useToast();
  const [pages, setPages] = useState<Page[]>([]);
  const [selectedPage, setSelectedPage] = useState<string | null>(null);
  const [sections, setSections] = useState<SectionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [sectionsLoading, setSectionsLoading] = useState(false);
  const [editItem, setEditItem] = useState<SectionItem | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [pageEditOpen, setPageEditOpen] = useState(false);
  const [editPageData, setEditPageData] = useState<Page | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  useEffect(() => { loadPages(); }, []);

  async function loadPages() {
    const { data } = await (cmsClient as any).from('pages').select('*').order('slug');
    const pageList = (data || []) as Page[];
    setPages(pageList);
    if (pageList.length > 0 && !selectedPage) setSelectedPage(pageList[0].slug);
    setLoading(false);
  }

  useEffect(() => {
    if (selectedPage) loadSections(selectedPage);
  }, [selectedPage]);

  async function loadSections(slug: string) {
    setSectionsLoading(true);
    const [heroRes, contentRes, ctaRes] = await Promise.all([
      (cmsClient as any).from('hero_sections').select('*').eq('page_slug', slug).order('display_order'),
      (cmsClient as any).from('content_sections').select('*').eq('page_slug', slug).order('display_order'),
      (cmsClient as any).from('cta_blocks').select('*').eq('page_slug', slug).order('display_order'),
    ]);

    const items: SectionItem[] = [
      ...(heroRes.data || []).map((d: HeroSection) => ({ type: 'hero' as const, data: d })),
      ...(contentRes.data || []).map((d: ContentSection) => ({ type: 'content' as const, data: d })),
      ...(ctaRes.data || []).map((d: CTABlock) => ({ type: 'cta' as const, data: d })),
    ];
    items.sort((a, b) => a.data.display_order - b.data.display_order);
    setSections(items);
    setSectionsLoading(false);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    setSections(prev => {
      const oldIdx = prev.findIndex(s => s.data.id === active.id);
      const newIdx = prev.findIndex(s => s.data.id === over.id);
      const reordered = arrayMove(prev, oldIdx, newIdx);
      // Persist order
      reordered.forEach((item, idx) => {
        const table = item.type === 'hero' ? 'hero_sections' : item.type === 'cta' ? 'cta_blocks' : 'content_sections';
        (cmsClient as any).from(table).update({ display_order: idx }).eq('id', item.data.id);
      });
      toast({ title: 'Section order updated' });
      return reordered;
    });
  }

  async function handleSaveSection() {
    if (!editItem) return;
    setSaving(true);
    const table = editItem.type === 'hero' ? 'hero_sections' : editItem.type === 'cta' ? 'cta_blocks' : 'content_sections';
    const { id, ...rest } = editItem.data as any;
    delete rest.created_at;
    delete rest.updated_at;
    const { error } = await (cmsClient as any).from(table).update(rest).eq('id', id);
    if (error) {
      toast({ title: 'Save failed', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Section updated' });
      setEditDialogOpen(false);
      if (selectedPage) loadSections(selectedPage);
    }
    setSaving(false);
  }

  async function handleSavePage() {
    if (!editPageData) return;
    setSaving(true);
    const { error } = await (cmsClient as any).from('pages').update({
      title: editPageData.title,
      meta_description: editPageData.meta_description,
      is_published: editPageData.is_published,
    }).eq('id', editPageData.id);
    if (error) {
      toast({ title: 'Save failed', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Page settings updated' });
      setPageEditOpen(false);
      loadPages();
    }
    setSaving(false);
  }

  async function togglePublished(page: Page) {
    await (cmsClient as any).from('pages').update({ is_published: !page.is_published }).eq('id', page.id);
    setPages(prev => prev.map(p => p.id === page.id ? { ...p, is_published: !p.is_published } : p));
    toast({ title: `Page ${page.is_published ? 'unpublished' : 'published'}` });
  }

  const pageSlugToPath = (slug: string) => slug === 'home' ? '/' : `/${slug}`;
  const currentPage = pages.find(p => p.slug === selectedPage);

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-4">
      {/* Page Selector */}
      <div className="flex items-center gap-3 flex-wrap">
        {pages.map(page => (
          <Button
            key={page.slug}
            variant={selectedPage === page.slug ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedPage(page.slug)}
            className="gap-2"
          >
            {page.is_published ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
            {page.title}
          </Button>
        ))}
      </div>

      {currentPage && (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Left: Section List */}
          <div className="lg:col-span-2 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold flex items-center gap-2">
                <LayoutTemplate className="h-4 w-4" />Sections
              </h3>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => { setEditPageData(currentPage); setPageEditOpen(true); }}>
                  <Edit className="h-3 w-3 mr-1" />Page Settings
                </Button>
              </div>
            </div>

            {sectionsLoading ? (
              <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
            ) : sections.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground text-sm">
                No sections found for this page.
              </div>
            ) : (
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={sections.map(s => s.data.id)} strategy={verticalListSortingStrategy}>
                  <div className="space-y-2">
                    {sections.map((item, idx) => (
                      <SortableSectionCard
                        key={item.data.id}
                        item={item}
                        index={idx}
                        onEdit={() => { setEditItem(JSON.parse(JSON.stringify(item))); setEditDialogOpen(true); }}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            )}
          </div>

          {/* Right: Live Preview */}
          <div className="lg:col-span-3 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold">Live Preview</h3>
              <a href={`${WEBSITE_URL}${pageSlugToPath(currentPage.slug)}`} target="_blank" rel="noreferrer">
                <Button size="sm" variant="outline" className="gap-1">
                  <ExternalLink className="h-3 w-3" />Open in New Tab
                </Button>
              </a>
            </div>
            <div className="rounded-lg border border-border overflow-hidden bg-background shadow-sm">
              <div className="h-8 bg-muted flex items-center px-3 gap-1.5 border-b border-border">
                <div className="w-2.5 h-2.5 rounded-full bg-destructive/50" />
                <div className="w-2.5 h-2.5 rounded-full bg-accent/50" />
                <div className="w-2.5 h-2.5 rounded-full bg-primary/50" />
                <span className="text-[10px] text-muted-foreground font-mono ml-3 truncate">
                  {WEBSITE_URL}{pageSlugToPath(currentPage.slug)}
                </span>
              </div>
              <iframe
                src={`${WEBSITE_URL}${pageSlugToPath(currentPage.slug)}`}
                className="w-full h-[500px]"
                title="Page preview"
              />
            </div>
          </div>
        </div>
      )}

      {/* Section Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Edit {editItem?.type === 'hero' ? 'Hero Section' : editItem?.type === 'cta' ? 'Call to Action' : 'Content Section'}
            </DialogTitle>
          </DialogHeader>
          {editItem?.type === 'hero' && (
            <HeroEditorFields
              hero={editItem.data as HeroSection}
              onChange={h => setEditItem({ type: 'hero', data: h })}
            />
          )}
          {editItem?.type === 'content' && (
            <ContentEditorFields
              section={editItem.data as ContentSection}
              onChange={s => setEditItem({ type: 'content', data: s })}
            />
          )}
          {editItem?.type === 'cta' && (
            <CTAEditorFields
              cta={editItem.data as CTABlock}
              onChange={c => setEditItem({ type: 'cta', data: c })}
            />
          )}
          <Button className="w-full mt-4 gap-2" onClick={handleSaveSection} disabled={saving}>
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Save Changes
          </Button>
        </DialogContent>
      </Dialog>

      {/* Page Settings Dialog */}
      <Dialog open={pageEditOpen} onOpenChange={setPageEditOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Page Settings — {editPageData?.title}</DialogTitle></DialogHeader>
          {editPageData && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Page Title</Label>
                <Input value={editPageData.title} onChange={e => setEditPageData(p => p ? { ...p, title: e.target.value } : null)} />
              </div>
              <div className="space-y-2">
                <Label>Meta Description</Label>
                <Textarea
                  rows={3}
                  value={editPageData.meta_description ?? ''}
                  onChange={e => setEditPageData(p => p ? { ...p, meta_description: e.target.value } : null)}
                />
                <p className="text-xs text-muted-foreground">{editPageData.meta_description?.length ?? 0}/160 characters</p>
              </div>
              <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                <Switch
                  checked={editPageData.is_published}
                  onCheckedChange={v => setEditPageData(p => p ? { ...p, is_published: v } : null)}
                />
                <div>
                  <Label>Published</Label>
                  <p className="text-xs text-muted-foreground">
                    Page is {editPageData.is_published ? 'visible to the public' : 'hidden'}
                  </p>
                </div>
              </div>
              <Button className="w-full gap-2" onClick={handleSavePage} disabled={saving}>
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Save Page Settings
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
