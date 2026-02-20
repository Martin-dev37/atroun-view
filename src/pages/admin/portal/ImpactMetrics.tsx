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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TrendingUp, TrendingDown, Minus, Plus, Edit, Trash2, Loader2, Lock, BarChart3 } from 'lucide-react';

interface ImpactMetric {
  id: string;
  category: string;
  metric_name: string;
  metric_value: string | null;
  unit: string | null;
  period: string | null;
  description: string | null;
  icon: string | null;
  trend: string | null;
  change_percentage: number | null;
  display_order: number;
  is_published: boolean;
  created_at: string;
}

const CATEGORIES = ['Environmental', 'Social', 'Economic', 'Agricultural', 'Community'];

export default function ImpactMetricsPage() {
  const { user, isAdmin } = useAuth();
  const { hasAccess, loading: accessLoading } = usePortalAccess(user?.id);
  const { toast } = useToast();
  const [metrics, setMetrics] = useState<ImpactMetric[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editItem, setEditItem] = useState<Partial<ImpactMetric> | null>(null);
  const [saving, setSaving] = useState(false);

  const canAccess = isAdmin || hasAccess('impact_metrics');

  useEffect(() => {
    if (canAccess && !accessLoading) loadMetrics();
  }, [canAccess, accessLoading]);

  async function loadMetrics() {
    const { data } = await supabase
      .from('impact_metrics')
      .select('*')
      .order('category')
      .order('display_order');
    setMetrics((data as ImpactMetric[]) ?? []);
    setLoading(false);
  }

  async function handleSave() {
    if (!editItem?.metric_name || !editItem?.category) return;
    setSaving(true);
    if (editItem.id) {
      await supabase.from('impact_metrics').update({
        category: editItem.category,
        metric_name: editItem.metric_name,
        metric_value: editItem.metric_value,
        unit: editItem.unit,
        period: editItem.period,
        description: editItem.description,
        trend: editItem.trend,
        change_percentage: editItem.change_percentage,
        is_published: editItem.is_published,
      }).eq('id', editItem.id);
    } else {
      await supabase.from('impact_metrics').insert({
        category: editItem.category,
        metric_name: editItem.metric_name,
        metric_value: editItem.metric_value,
        unit: editItem.unit,
        period: editItem.period,
        description: editItem.description,
        trend: editItem.trend ?? 'stable',
        change_percentage: editItem.change_percentage,
        is_published: editItem.is_published ?? true,
      });
    }
    toast({ title: editItem.id ? 'Updated' : 'Added' });
    setDialogOpen(false);
    setEditItem(null);
    setSaving(false);
    loadMetrics();
  }

  async function handleDelete(id: string) {
    await supabase.from('impact_metrics').delete().eq('id', id);
    setMetrics(prev => prev.filter(m => m.id !== id));
    toast({ title: 'Deleted' });
  }

  const trendIcon = (trend: string | null) => {
    if (trend === 'up') return <TrendingUp className="h-4 w-4 text-primary" />;
    if (trend === 'down') return <TrendingDown className="h-4 w-4 text-destructive" />;
    return <Minus className="h-4 w-4 text-muted-foreground" />;
  };

  const grouped = metrics.reduce((acc, m) => {
    if (!acc[m.category]) acc[m.category] = [];
    acc[m.category].push(m);
    return acc;
  }, {} as Record<string, ImpactMetric[]>);

  if (accessLoading || loading) return <AdminLayout><div className="flex items-center justify-center h-64"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div></AdminLayout>;

  if (!canAccess) return (
    <AdminLayout>
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <Lock className="h-12 w-12 text-muted-foreground" />
        <h2 className="text-xl font-display font-semibold">Access Restricted</h2>
        <p className="text-muted-foreground">You don't have access to Impact Metrics.</p>
      </div>
    </AdminLayout>
  );

  return (
    <AdminLayout>
      <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-display font-semibold text-foreground">Impact Metrics</h1>
            <p className="text-muted-foreground mt-1">ESG data and sustainability impact tracking</p>
          </div>
          {isAdmin && (
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => setEditItem({ is_published: true, trend: 'stable' })}>
                  <Plus className="h-4 w-4 mr-2" />Add Metric
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>{editItem?.id ? 'Edit' : 'Add'} Impact Metric</DialogTitle></DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Category *</Label>
                    <Select value={editItem?.category ?? ''} onValueChange={v => setEditItem(prev => ({ ...prev, category: v }))}>
                      <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                      <SelectContent>{CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Metric Name *</Label>
                    <Input value={editItem?.metric_name ?? ''} onChange={e => setEditItem(prev => ({ ...prev, metric_name: e.target.value }))} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Value</Label>
                      <Input value={editItem?.metric_value ?? ''} onChange={e => setEditItem(prev => ({ ...prev, metric_value: e.target.value }))} />
                    </div>
                    <div className="space-y-2">
                      <Label>Unit</Label>
                      <Input placeholder="tonnes, %, ha..." value={editItem?.unit ?? ''} onChange={e => setEditItem(prev => ({ ...prev, unit: e.target.value }))} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Period</Label>
                      <Input placeholder="2024, Q1 2024..." value={editItem?.period ?? ''} onChange={e => setEditItem(prev => ({ ...prev, period: e.target.value }))} />
                    </div>
                    <div className="space-y-2">
                      <Label>Trend</Label>
                      <Select value={editItem?.trend ?? 'stable'} onValueChange={v => setEditItem(prev => ({ ...prev, trend: v }))}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="up">↑ Up</SelectItem>
                          <SelectItem value="down">↓ Down</SelectItem>
                          <SelectItem value="stable">— Stable</SelectItem>
                        </SelectContent>
                      </Select>
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

        {Object.keys(grouped).length === 0 ? (
          <Card className="p-12 text-center">
            <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No impact metrics added yet.</p>
          </Card>
        ) : (
          Object.entries(grouped).map(([category, items]) => (
            <div key={category} className="space-y-3">
              <h2 className="text-lg font-display font-semibold text-foreground">{category}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {items.map(metric => (
                  <Card key={metric.id} className="hover:shadow-soft transition-shadow">
                    <CardContent className="pt-5">
                      <div className="flex items-start justify-between mb-2">
                        <p className="text-sm font-medium text-muted-foreground">{metric.metric_name}</p>
                        <div className="flex items-center gap-2">
                          {trendIcon(metric.trend)}
                          {isAdmin && (
                            <>
                              <button onClick={() => { setEditItem(metric); setDialogOpen(true); }}><Edit className="h-3 w-3 text-muted-foreground hover:text-foreground" /></button>
                              <button onClick={() => handleDelete(metric.id)}><Trash2 className="h-3 w-3 text-muted-foreground hover:text-destructive" /></button>
                            </>
                          )}
                        </div>
                      </div>
                      <p className="text-3xl font-display font-bold text-foreground">
                        {metric.metric_value ?? '—'}
                        {metric.unit && <span className="text-base font-normal text-muted-foreground ml-1">{metric.unit}</span>}
                      </p>
                      {metric.period && <p className="text-xs text-muted-foreground mt-1">{metric.period}</p>}
                      {metric.description && <p className="text-xs text-muted-foreground mt-2">{metric.description}</p>}
                      {metric.change_percentage !== null && (
                        <Badge variant="secondary" className="mt-2">
                          {metric.change_percentage > 0 ? '+' : ''}{metric.change_percentage}%
                        </Badge>
                      )}
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
