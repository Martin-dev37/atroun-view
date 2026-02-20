import { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { useAuth } from '@/hooks/useAuth';
import { usePortalAccess } from '@/hooks/usePortalAccess';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { TrendingUp, TrendingDown, Minus, Plus, Edit, Trash2, Loader2, Lock } from 'lucide-react';

interface FinancialProjection {
  id: string;
  year: number;
  quarter: string | null;
  metric_name: string;
  metric_value: number | null;
  metric_unit: string | null;
  description: string | null;
  is_published: boolean;
  created_at: string;
}

export default function FinancialProjections() {
  const { user, isAdmin } = useAuth();
  const { hasAccess, loading: accessLoading } = usePortalAccess(user?.id);
  const { toast } = useToast();
  const [projections, setProjections] = useState<FinancialProjection[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editItem, setEditItem] = useState<Partial<FinancialProjection> | null>(null);
  const [saving, setSaving] = useState(false);

  const canAccess = isAdmin || hasAccess('financial_projections');

  useEffect(() => {
    if (canAccess && !accessLoading) loadProjections();
  }, [canAccess, accessLoading]);

  async function loadProjections() {
    const { data } = await supabase
      .from('financial_projections')
      .select('*')
      .order('year', { ascending: false })
      .order('display_order');
    setProjections((data as FinancialProjection[]) ?? []);
    setLoading(false);
  }

  async function handleSave() {
    if (!editItem?.metric_name || !editItem?.year) return;
    setSaving(true);
    if (editItem.id) {
      await supabase.from('financial_projections').update({
        year: editItem.year,
        quarter: editItem.quarter,
        metric_name: editItem.metric_name,
        metric_value: editItem.metric_value,
        metric_unit: editItem.metric_unit,
        description: editItem.description,
        is_published: editItem.is_published,
      }).eq('id', editItem.id);
    } else {
      await supabase.from('financial_projections').insert({
        year: editItem.year,
        quarter: editItem.quarter,
        metric_name: editItem.metric_name,
        metric_value: editItem.metric_value,
        metric_unit: editItem.metric_unit,
        description: editItem.description,
        is_published: editItem.is_published ?? true,
      });
    }
    toast({ title: editItem.id ? 'Updated successfully' : 'Added successfully' });
    setDialogOpen(false);
    setEditItem(null);
    setSaving(false);
    loadProjections();
  }

  async function handleDelete(id: string) {
    await supabase.from('financial_projections').delete().eq('id', id);
    setProjections(prev => prev.filter(p => p.id !== id));
    toast({ title: 'Deleted' });
  }

  const groupedByYear = projections.reduce((acc, p) => {
    const year = p.year.toString();
    if (!acc[year]) acc[year] = [];
    acc[year].push(p);
    return acc;
  }, {} as Record<string, FinancialProjection[]>);

  if (accessLoading || loading) {
    return <AdminLayout><div className="flex items-center justify-center h-64"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div></AdminLayout>;
  }

  if (!canAccess) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center h-64 gap-4">
          <Lock className="h-12 w-12 text-muted-foreground" />
          <h2 className="text-xl font-display font-semibold">Access Restricted</h2>
          <p className="text-muted-foreground">You don't have access to Financial Projections.</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-display font-semibold text-foreground">Financial Projections</h1>
            <p className="text-muted-foreground mt-1">Revenue forecasts and financial models</p>
          </div>
          {isAdmin && (
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => setEditItem({ year: new Date().getFullYear(), is_published: true })}>
                  <Plus className="h-4 w-4 mr-2" />Add Metric
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>{editItem?.id ? 'Edit' : 'Add'} Financial Metric</DialogTitle></DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Year *</Label>
                      <Input type="number" value={editItem?.year ?? ''} onChange={e => setEditItem(prev => ({ ...prev, year: parseInt(e.target.value) }))} />
                    </div>
                    <div className="space-y-2">
                      <Label>Quarter</Label>
                      <Input placeholder="Q1, Q2, Q3, Q4" value={editItem?.quarter ?? ''} onChange={e => setEditItem(prev => ({ ...prev, quarter: e.target.value }))} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Metric Name *</Label>
                    <Input value={editItem?.metric_name ?? ''} onChange={e => setEditItem(prev => ({ ...prev, metric_name: e.target.value }))} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Value</Label>
                      <Input type="number" value={editItem?.metric_value ?? ''} onChange={e => setEditItem(prev => ({ ...prev, metric_value: parseFloat(e.target.value) }))} />
                    </div>
                    <div className="space-y-2">
                      <Label>Unit (e.g. USD, %)</Label>
                      <Input value={editItem?.metric_unit ?? ''} onChange={e => setEditItem(prev => ({ ...prev, metric_unit: e.target.value }))} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Input value={editItem?.description ?? ''} onChange={e => setEditItem(prev => ({ ...prev, description: e.target.value }))} />
                  </div>
                  <Button className="w-full" onClick={handleSave} disabled={saving}>
                    {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                    {editItem?.id ? 'Update' : 'Add'} Metric
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {Object.keys(groupedByYear).length === 0 ? (
          <Card className="p-12 text-center">
            <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No financial projections added yet.</p>
            {isAdmin && <p className="text-sm text-muted-foreground mt-2">Click "Add Metric" to get started.</p>}
          </Card>
        ) : (
          Object.entries(groupedByYear).map(([year, metrics]) => (
            <div key={year} className="space-y-3">
              <h2 className="text-lg font-display font-semibold text-foreground">{year}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {metrics.map(metric => (
                  <Card key={metric.id} className="hover:shadow-soft transition-shadow">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm font-medium text-muted-foreground">{metric.metric_name}</CardTitle>
                        {!metric.is_published && <Badge variant="secondary">Draft</Badge>}
                      </div>
                      {metric.quarter && <p className="text-xs text-muted-foreground">{metric.quarter}</p>}
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-end justify-between">
                        <div>
                          <p className="text-3xl font-display font-bold text-foreground">
                            {metric.metric_value?.toLocaleString() ?? '—'}
                          </p>
                          {metric.metric_unit && <p className="text-sm text-muted-foreground">{metric.metric_unit}</p>}
                        </div>
                        {isAdmin && (
                          <div className="flex gap-2">
                            <Button size="sm" variant="ghost" onClick={() => { setEditItem(metric); setDialogOpen(true); }}>
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => handleDelete(metric.id)}>
                              <Trash2 className="h-3 w-3 text-destructive" />
                            </Button>
                          </div>
                        )}
                      </div>
                      {metric.description && <p className="text-xs text-muted-foreground mt-2">{metric.description}</p>}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </AdminLayout>
  );
}
