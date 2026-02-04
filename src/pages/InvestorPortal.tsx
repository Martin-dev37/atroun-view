import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Building2, FileText, Download } from 'lucide-react';

const InvestorPortal = () => {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [valid, setValid] = useState(false);
  const [documents, setDocuments] = useState<any[]>([]);
  const code = searchParams.get('code');

  useEffect(() => {
    if (code) validateAccess();
  }, [code]);

  const validateAccess = async () => {
    const { data } = await supabase
      .from('portal_invites')
      .select('*')
      .eq('invite_code', code)
      .eq('portal_type', 'investor')
      .eq('is_active', true)
      .maybeSingle();

    if (data) {
      setValid(true);
      await supabase.from('portal_invites').update({ access_count: data.access_count + 1, accessed_at: new Date().toISOString() }).eq('id', data.id);
      const { data: docs } = await supabase.from('data_room_documents').select('*').in('access_level', ['investor', 'all']);
      setDocuments(docs || []);
    }
    setLoading(false);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  if (!valid) return <div className="min-h-screen flex items-center justify-center"><Card><CardContent className="p-8 text-center"><p>Invalid or expired invite link.</p></CardContent></Card></div>;

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <Building2 className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-display font-bold">Investor Portal</h1>
        </div>
        <div className="grid gap-4">
          {documents.map(doc => (
            <Card key={doc.id} className="card-3d">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5" />
                  <div>
                    <p className="font-medium">{doc.title}</p>
                    <p className="text-sm text-muted-foreground">{doc.category}</p>
                  </div>
                </div>
                <a href={supabase.storage.from('content-media').getPublicUrl(doc.file_path).data.publicUrl} target="_blank" className="btn-industrial p-2 rounded"><Download className="h-4 w-4" /></a>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InvestorPortal;
