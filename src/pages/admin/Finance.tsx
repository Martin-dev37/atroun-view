import { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
  DollarSign, TrendingUp, TrendingDown, ArrowUpDown, Search,
  Plus, Loader2, CreditCard, Send, Filter, Calendar,
  ArrowUpRight, ArrowDownRight, Wallet, Building2
} from 'lucide-react';

interface Transaction {
  id: string;
  type: string;
  category: string;
  description: string;
  amount: number;
  currency: string;
  status: string;
  reference: string | null;
  counterparty: string | null;
  notes: string | null;
  transaction_date: string;
  created_at: string;
}

interface PaymentRecord {
  id: string;
  recipient_name: string;
  recipient_email: string | null;
  recipient_phone: string | null;
  amount: number;
  currency: string;
  method: string;
  status: string;
  reference: string | null;
  notes: string | null;
  created_at: string;
}

const categories = ['general', 'operations', 'salaries', 'marketing', 'equipment', 'logistics', 'investment', 'sales', 'consulting', 'other'];

export default function FinancePage() {
  const { isAdmin } = useAuth();
  const { toast } = useToast();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Transaction dialog
  const [txDialogOpen, setTxDialogOpen] = useState(false);
  const [editTx, setEditTx] = useState<Partial<Transaction> | null>(null);
  const [saving, setSaving] = useState(false);

  // Payment dialog
  const [payDialogOpen, setPayDialogOpen] = useState(false);
  const [editPay, setEditPay] = useState<Partial<PaymentRecord> | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const [txRes, payRes] = await Promise.all([
      supabase.from('transactions').select('*').order('transaction_date', { ascending: false }),
      supabase.from('payment_records').select('*').order('created_at', { ascending: false }),
    ]);
    setTransactions((txRes.data as Transaction[]) ?? []);
    setPayments((payRes.data as PaymentRecord[]) ?? []);
    setLoading(false);
  }

  // Stats
  const totalIncome = transactions.filter(t => t.type === 'income' && t.status === 'completed').reduce((s, t) => s + Number(t.amount), 0);
  const totalExpenses = transactions.filter(t => t.type === 'expense' && t.status === 'completed').reduce((s, t) => s + Number(t.amount), 0);
  const pendingPayments = payments.filter(p => ['pending', 'approved', 'processing'].includes(p.status)).reduce((s, p) => s + Number(p.amount), 0);
  const netBalance = totalIncome - totalExpenses;

  // Save transaction
  async function handleSaveTx() {
    if (!editTx?.description || !editTx?.amount) return;
    setSaving(true);
    const payload = {
      type: editTx.type ?? 'income',
      category: editTx.category ?? 'general',
      description: editTx.description,
      amount: Number(editTx.amount),
      currency: editTx.currency ?? 'USD',
      status: editTx.status ?? 'completed',
      reference: editTx.reference ?? null,
      counterparty: editTx.counterparty ?? null,
      notes: editTx.notes ?? null,
      transaction_date: editTx.transaction_date ?? new Date().toISOString(),
    };

    if (editTx.id) {
      await supabase.from('transactions').update(payload).eq('id', editTx.id);
    } else {
      await supabase.from('transactions').insert(payload);
    }
    toast({ title: editTx.id ? 'Transaction updated' : 'Transaction recorded' });
    setTxDialogOpen(false);
    setEditTx(null);
    setSaving(false);
    loadData();
  }

  // Save payment
  async function handleSavePay() {
    if (!editPay?.recipient_name || !editPay?.amount) return;
    setSaving(true);
    const payload = {
      recipient_name: editPay.recipient_name,
      recipient_email: editPay.recipient_email ?? null,
      recipient_phone: editPay.recipient_phone ?? null,
      amount: Number(editPay.amount),
      currency: editPay.currency ?? 'USD',
      method: editPay.method ?? 'bank_transfer',
      status: editPay.status ?? 'pending',
      reference: editPay.reference ?? null,
      notes: editPay.notes ?? null,
    };

    if (editPay.id) {
      await supabase.from('payment_records').update(payload).eq('id', editPay.id);
    } else {
      await supabase.from('payment_records').insert(payload);
    }
    toast({ title: editPay.id ? 'Payment updated' : 'Payment created' });
    setPayDialogOpen(false);
    setEditPay(null);
    setSaving(false);
    loadData();
  }

  // Filtered transactions
  const filteredTx = transactions.filter(t => {
    const matchSearch = t.description.toLowerCase().includes(search.toLowerCase()) ||
      (t.counterparty ?? '').toLowerCase().includes(search.toLowerCase()) ||
      (t.reference ?? '').toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === 'all' || t.type === typeFilter;
    const matchStatus = statusFilter === 'all' || t.status === statusFilter;
    return matchSearch && matchType && matchStatus;
  });

  const statusVariant = (s: string) => ({
    completed: 'default', pending: 'secondary', failed: 'destructive', cancelled: 'outline',
    approved: 'default', processing: 'secondary',
  }[s] ?? 'outline') as 'default' | 'secondary' | 'destructive' | 'outline';

  const typeIcon = (type: string) => {
    switch (type) {
      case 'income': return <ArrowDownRight className="h-4 w-4 text-primary" />;
      case 'expense': return <ArrowUpRight className="h-4 w-4 text-destructive" />;
      case 'payment': return <Send className="h-4 w-4 text-accent" />;
      case 'refund': return <ArrowDownRight className="h-4 w-4 text-muted-foreground" />;
      default: return <ArrowUpDown className="h-4 w-4" />;
    }
  };

  const formatCurrency = (amount: number, currency = 'USD') =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);

  const methodLabel = (m: string) => ({
    bank_transfer: 'Bank Transfer', mobile_money: 'Mobile Money', cash: 'Cash',
    check: 'Check', crypto: 'Crypto', other: 'Other'
  }[m] ?? m);

  if (!isAdmin) return <AdminLayout><div className="p-8 text-center text-muted-foreground">Access restricted to administrators.</div></AdminLayout>;

  return (
    <AdminLayout requireAdmin>
      <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-display font-semibold text-foreground">Finance</h1>
            <p className="text-muted-foreground mt-1">Monitor transactions & manage payments</p>
          </div>
          <div className="flex items-center gap-2">
            <Dialog open={txDialogOpen} onOpenChange={setTxDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" onClick={() => setEditTx({ type: 'income', category: 'general', status: 'completed', currency: 'USD' })}>
                  <Plus className="h-4 w-4 mr-2" />Record Transaction
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>{editTx?.id ? 'Edit' : 'Record'} Transaction</DialogTitle></DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Type</Label>
                      <Select value={editTx?.type ?? 'income'} onValueChange={v => setEditTx(p => ({ ...p, type: v }))}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="income">Income</SelectItem>
                          <SelectItem value="expense">Expense</SelectItem>
                          <SelectItem value="payment">Payment</SelectItem>
                          <SelectItem value="refund">Refund</SelectItem>
                          <SelectItem value="transfer">Transfer</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Category</Label>
                      <Select value={editTx?.category ?? 'general'} onValueChange={v => setEditTx(p => ({ ...p, category: v }))}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {categories.map(c => <SelectItem key={c} value={c} className="capitalize">{c}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Description *</Label>
                    <Input value={editTx?.description ?? ''} onChange={e => setEditTx(p => ({ ...p, description: e.target.value }))} placeholder="e.g. Avocado oil sales - March batch" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Amount *</Label>
                      <Input type="number" step="0.01" value={editTx?.amount ?? ''} onChange={e => setEditTx(p => ({ ...p, amount: parseFloat(e.target.value) as any }))} />
                    </div>
                    <div className="space-y-2">
                      <Label>Currency</Label>
                      <Select value={editTx?.currency ?? 'USD'} onValueChange={v => setEditTx(p => ({ ...p, currency: v }))}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="USD">USD</SelectItem>
                          <SelectItem value="KES">KES</SelectItem>
                          <SelectItem value="EUR">EUR</SelectItem>
                          <SelectItem value="GBP">GBP</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Counterparty</Label>
                      <Input value={editTx?.counterparty ?? ''} onChange={e => setEditTx(p => ({ ...p, counterparty: e.target.value }))} placeholder="Company or person" />
                    </div>
                    <div className="space-y-2">
                      <Label>Reference</Label>
                      <Input value={editTx?.reference ?? ''} onChange={e => setEditTx(p => ({ ...p, reference: e.target.value }))} placeholder="Invoice/receipt #" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Status</Label>
                      <Select value={editTx?.status ?? 'completed'} onValueChange={v => setEditTx(p => ({ ...p, status: v }))}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="failed">Failed</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Date</Label>
                      <Input type="date" value={editTx?.transaction_date?.split('T')[0] ?? new Date().toISOString().split('T')[0]} onChange={e => setEditTx(p => ({ ...p, transaction_date: new Date(e.target.value).toISOString() }))} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Notes</Label>
                    <Textarea rows={2} value={editTx?.notes ?? ''} onChange={e => setEditTx(p => ({ ...p, notes: e.target.value }))} />
                  </div>
                  <Button className="w-full" onClick={handleSaveTx} disabled={saving}>
                    {saving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                    {editTx?.id ? 'Update' : 'Record'} Transaction
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog open={payDialogOpen} onOpenChange={setPayDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => setEditPay({ method: 'bank_transfer', status: 'pending', currency: 'USD' })}>
                  <Send className="h-4 w-4 mr-2" />New Payment
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>{editPay?.id ? 'Edit' : 'Create'} Payment</DialogTitle></DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Recipient Name *</Label>
                    <Input value={editPay?.recipient_name ?? ''} onChange={e => setEditPay(p => ({ ...p, recipient_name: e.target.value }))} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Email</Label>
                      <Input type="email" value={editPay?.recipient_email ?? ''} onChange={e => setEditPay(p => ({ ...p, recipient_email: e.target.value }))} />
                    </div>
                    <div className="space-y-2">
                      <Label>Phone</Label>
                      <Input value={editPay?.recipient_phone ?? ''} onChange={e => setEditPay(p => ({ ...p, recipient_phone: e.target.value }))} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Amount *</Label>
                      <Input type="number" step="0.01" value={editPay?.amount ?? ''} onChange={e => setEditPay(p => ({ ...p, amount: parseFloat(e.target.value) as any }))} />
                    </div>
                    <div className="space-y-2">
                      <Label>Currency</Label>
                      <Select value={editPay?.currency ?? 'USD'} onValueChange={v => setEditPay(p => ({ ...p, currency: v }))}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="USD">USD</SelectItem>
                          <SelectItem value="KES">KES</SelectItem>
                          <SelectItem value="EUR">EUR</SelectItem>
                          <SelectItem value="GBP">GBP</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Method</Label>
                      <Select value={editPay?.method ?? 'bank_transfer'} onValueChange={v => setEditPay(p => ({ ...p, method: v }))}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                          <SelectItem value="mobile_money">Mobile Money</SelectItem>
                          <SelectItem value="cash">Cash</SelectItem>
                          <SelectItem value="check">Check</SelectItem>
                          <SelectItem value="crypto">Crypto</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Status</Label>
                      <Select value={editPay?.status ?? 'pending'} onValueChange={v => setEditPay(p => ({ ...p, status: v }))}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="approved">Approved</SelectItem>
                          <SelectItem value="processing">Processing</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="failed">Failed</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Reference</Label>
                    <Input value={editPay?.reference ?? ''} onChange={e => setEditPay(p => ({ ...p, reference: e.target.value }))} placeholder="Invoice or PO number" />
                  </div>
                  <div className="space-y-2">
                    <Label>Notes</Label>
                    <Textarea rows={2} value={editPay?.notes ?? ''} onChange={e => setEditPay(p => ({ ...p, notes: e.target.value }))} />
                  </div>
                  <Button className="w-full" onClick={handleSavePay} disabled={saving}>
                    {saving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                    {editPay?.id ? 'Update' : 'Create'} Payment
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Income</p>
                  <p className="text-2xl font-display font-bold text-primary">{formatCurrency(totalIncome)}</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Expenses</p>
                  <p className="text-2xl font-display font-bold text-destructive">{formatCurrency(totalExpenses)}</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-destructive/10 flex items-center justify-center">
                  <TrendingDown className="h-5 w-5 text-destructive" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Net Balance</p>
                  <p className={`text-2xl font-display font-bold ${netBalance >= 0 ? 'text-primary' : 'text-destructive'}`}>{formatCurrency(netBalance)}</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center">
                  <Wallet className="h-5 w-5 text-accent" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pending Payments</p>
                  <p className="text-2xl font-display font-bold text-muted-foreground">{formatCurrency(pendingPayments)}</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                  <CreditCard className="h-5 w-5 text-muted-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="transactions">
          <TabsList>
            <TabsTrigger value="transactions">Transactions ({transactions.length})</TabsTrigger>
            <TabsTrigger value="payments">Payments ({payments.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="transactions" className="space-y-4 mt-4">
            {/* Filters */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input className="pl-10" placeholder="Search transactions..." value={search} onChange={e => setSearch(e.target.value)} />
              </div>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[140px]"><Filter className="h-4 w-4 mr-2" /><SelectValue placeholder="Type" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="income">Income</SelectItem>
                  <SelectItem value="expense">Expense</SelectItem>
                  <SelectItem value="payment">Payment</SelectItem>
                  <SelectItem value="refund">Refund</SelectItem>
                  <SelectItem value="transfer">Transfer</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px]"><SelectValue placeholder="Status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Card>
              <CardContent className="p-0">
                {loading ? (
                  <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Type</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Counterparty</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredTx.length === 0 ? (
                        <TableRow><TableCell colSpan={7} className="text-center py-12 text-muted-foreground">No transactions found</TableCell></TableRow>
                      ) : (
                        filteredTx.map(tx => (
                          <TableRow key={tx.id} className="cursor-pointer hover:bg-muted/50" onClick={() => { setEditTx(tx); setTxDialogOpen(true); }}>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                {typeIcon(tx.type)}
                                <span className="text-xs capitalize">{tx.type}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <p className="text-sm font-medium">{tx.description}</p>
                              {tx.reference && <p className="text-xs text-muted-foreground">Ref: {tx.reference}</p>}
                            </TableCell>
                            <TableCell className="text-sm">{tx.counterparty ?? '—'}</TableCell>
                            <TableCell><Badge variant="outline" className="text-xs capitalize">{tx.category}</Badge></TableCell>
                            <TableCell className={`text-right font-medium text-sm ${tx.type === 'income' || tx.type === 'refund' ? 'text-primary' : 'text-destructive'}`}>
                              {tx.type === 'income' || tx.type === 'refund' ? '+' : '-'}{formatCurrency(Number(tx.amount), tx.currency)}
                            </TableCell>
                            <TableCell><Badge variant={statusVariant(tx.status)} className="text-xs capitalize">{tx.status}</Badge></TableCell>
                            <TableCell className="text-xs text-muted-foreground">{new Date(tx.transaction_date).toLocaleDateString()}</TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payments" className="space-y-4 mt-4">
            <Card>
              <CardContent className="p-0">
                {loading ? (
                  <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Recipient</TableHead>
                        <TableHead>Method</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Reference</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {payments.length === 0 ? (
                        <TableRow><TableCell colSpan={6} className="text-center py-12 text-muted-foreground">No payments found</TableCell></TableRow>
                      ) : (
                        payments.map(pay => (
                          <TableRow key={pay.id} className="cursor-pointer hover:bg-muted/50" onClick={() => { setEditPay(pay); setPayDialogOpen(true); }}>
                            <TableCell>
                              <div>
                                <p className="text-sm font-medium">{pay.recipient_name}</p>
                                {pay.recipient_email && <p className="text-xs text-muted-foreground">{pay.recipient_email}</p>}
                              </div>
                            </TableCell>
                            <TableCell className="text-sm">{methodLabel(pay.method)}</TableCell>
                            <TableCell className="text-right font-medium text-sm">{formatCurrency(Number(pay.amount), pay.currency)}</TableCell>
                            <TableCell><Badge variant={statusVariant(pay.status)} className="text-xs capitalize">{pay.status}</Badge></TableCell>
                            <TableCell className="text-xs text-muted-foreground">{pay.reference ?? '—'}</TableCell>
                            <TableCell className="text-xs text-muted-foreground">{new Date(pay.created_at).toLocaleDateString()}</TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
