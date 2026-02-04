import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Users } from 'lucide-react';

const PartnerPortal = () => {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [valid, setValid] = useState(false);
  const code = searchParams.get('code');

  useEffect(() => {
    if (code) validateAccess();
  }, [code]);

  const validateAccess = async () => {
    const { data } = await supabase.from('portal_invites').select('*').eq('invite_code', code).eq('portal_type', 'partner').eq('is_active', true).maybeSingle();
    if (data) {
      setValid(true);
      await supabase.from('portal_invites').update({ access_count: data.access_count + 1, accessed_at: new Date().toISOString() }).eq('id', data.id);
    }
    setLoading(false);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  if (!valid) return <div className="min-h-screen flex items-center justify-center"><Card><CardContent className="p-8 text-center"><p>Invalid or expired invite link.</p></CardContent></Card></div>;

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <Users className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-display font-bold">Partner Dashboard</h1>
        </div>
        <Card className="card-3d"><CardContent className="p-8 text-center text-muted-foreground">Partner dashboard content coming soon.</CardContent></Card>
      </div>
    </div>
  );
};

export default PartnerPortal;
