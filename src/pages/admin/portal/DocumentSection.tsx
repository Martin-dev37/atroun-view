import { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { useAuth } from '@/hooks/useAuth';
import { usePortalAccess } from '@/hooks/usePortalAccess';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Upload, FileText, Download, Trash2, Loader2, Lock, FolderLock } from 'lucide-react';

interface Document {
  id: string;
  title: string;
  description: string | null;
  file_url: string | null;
  file_name: string | null;
  file_size: number | null;
  file_type: string | null;
  tags: string[] | null;
  created_at: string;
  is_published: boolean;
}

interface DocumentSectionPageProps {
  section: 'reports' | 'data_room';
  title: string;
  description: string;
  portalKey: string;
  icon: React.ComponentType<{ className?: string }>;
}

export function DocumentSectionPage({ section, title, description, portalKey, icon: Icon }: DocumentSectionPageProps) {
  const { user, isAdmin, isPortalEditor } = useAuth();
  const { hasAccess, loading: accessLoading } = usePortalAccess(user?.id);
  const { toast } = useToast();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadLoading, setUploadLoading] = useState(false);

  const canAccess = isAdmin || hasAccess(portalKey);

  useEffect(() => {
    if (canAccess && !accessLoading) loadDocuments();
  }, [canAccess, accessLoading]);

  async function loadDocuments() {
    const { data } = await supabase
      .from('portal_documents')
      .select('*')
      .eq('section', section)
      .order('created_at', { ascending: false });
    setDocuments((data as Document[]) ?? []);
    setLoading(false);
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files?.[0] || !isAdmin) return;
    const file = e.target.files[0];
    setUploadLoading(true);

    const fileName = `${section}/${Date.now()}-${file.name}`;
    const { error: uploadError } = await supabase.storage
      .from('portal-documents')
      .upload(fileName, file);

    if (uploadError) {
      toast({ title: 'Upload failed', description: uploadError.message, variant: 'destructive' });
      setUploadLoading(false);
      return;
    }

    const { data: urlData } = supabase.storage.from('portal-documents').getPublicUrl(fileName);

    await supabase.from('portal_documents').insert({
      section,
      title: file.name,
      file_url: urlData.publicUrl,
      file_name: file.name,
      file_size: file.size,
      file_type: file.type,
      uploaded_by: user?.id,
    });

    toast({ title: 'Document uploaded successfully' });
    loadDocuments();
    setUploadLoading(false);
  }

  async function handleDownload(doc: Document) {
    if (!doc.file_url) return;
    const a = document.createElement('a');
    a.href = doc.file_url;
    a.download = doc.file_name ?? 'document';
    a.click();
  }

  async function handleDelete(docId: string) {
    await supabase.from('portal_documents').delete().eq('id', docId);
    setDocuments(prev => prev.filter(d => d.id !== docId));
    toast({ title: 'Document deleted' });
  }

  const formatSize = (bytes: number | null) => {
    if (!bytes) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
  };

  if (accessLoading || loading) return <AdminLayout><div className="flex items-center justify-center h-64"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div></AdminLayout>;

  if (!canAccess) return (
    <AdminLayout>
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <Lock className="h-12 w-12 text-muted-foreground" />
        <h2 className="text-xl font-display font-semibold">Access Restricted</h2>
        <p className="text-muted-foreground">You don't have access to this section. Contact your administrator.</p>
      </div>
    </AdminLayout>
  );

  return (
    <AdminLayout>
      <div className="p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Icon className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-display font-semibold text-foreground">{title}</h1>
              <p className="text-muted-foreground mt-0.5">{description}</p>
            </div>
          </div>
          {isAdmin && (
            <label>
              <input type="file" className="hidden" onChange={handleUpload} />
              <Button asChild disabled={uploadLoading}>
                <span className="cursor-pointer">
                  {uploadLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Upload className="h-4 w-4 mr-2" />}
                  Upload
                </span>
              </Button>
            </label>
          )}
        </div>

        {/* Documents grid */}
        {documents.length === 0 ? (
          <Card className="p-16 text-center">
            <Icon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg text-muted-foreground">No documents available yet.</p>
            {isAdmin && <p className="text-sm text-muted-foreground mt-2">Upload documents to make them available here.</p>}
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {documents.map(doc => (
              <Card key={doc.id} className="hover:shadow-soft transition-shadow">
                <CardContent className="pt-5">
                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-foreground truncate">{doc.title}</p>
                      {doc.description && <p className="text-xs text-muted-foreground mt-0.5">{doc.description}</p>}
                      <div className="flex items-center gap-3 mt-2">
                        {doc.file_type && <Badge variant="secondary" className="text-xs">{doc.file_type.split('/')[1]?.toUpperCase()}</Badge>}
                        {doc.file_size && <span className="text-xs text-muted-foreground">{formatSize(doc.file_size)}</span>}
                        <span className="text-xs text-muted-foreground">{new Date(doc.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Button size="sm" variant="outline" onClick={() => handleDownload(doc)}>
                        <Download className="h-3 w-3 mr-1" />Download
                      </Button>
                      {isAdmin && (
                        <Button size="sm" variant="outline" onClick={() => handleDelete(doc.id)}>
                          <Trash2 className="h-3 w-3 text-destructive" />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
