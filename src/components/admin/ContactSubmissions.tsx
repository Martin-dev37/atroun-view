import { useState, useMemo, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { 
  Loader2, Mail, Trash2, Check, RefreshCw, 
  MessageSquare, User, Building, Calendar, Search,
  Download, CheckCheck, Filter, X
} from 'lucide-react';
import { format } from 'date-fns';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  company: string | null;
  subject: string;
  message: string;
  read: boolean;
  created_at: string;
}

type FilterStatus = 'all' | 'unread' | 'read';
type SortOption = 'newest' | 'oldest' | 'name';

export const ContactSubmissions = () => {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState<ContactSubmission | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [sortOption, setSortOption] = useState<SortOption>('newest');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [showBulkDelete, setShowBulkDelete] = useState(false);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    setLoadingData(true);
    const { data, error } = await supabase
      .from('contact_submissions')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast.error('Failed to load submissions');
    } else {
      setSubmissions(data || []);
    }
    setLoadingData(false);
  };

  const filteredSubmissions = useMemo(() => {
    let result = [...submissions];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(s => 
        s.name.toLowerCase().includes(query) ||
        s.email.toLowerCase().includes(query) ||
        s.subject.toLowerCase().includes(query) ||
        (s.company && s.company.toLowerCase().includes(query))
      );
    }

    if (filterStatus === 'unread') {
      result = result.filter(s => !s.read);
    } else if (filterStatus === 'read') {
      result = result.filter(s => s.read);
    }

    if (sortOption === 'oldest') {
      result.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
    } else if (sortOption === 'name') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }

    return result;
  }, [submissions, searchQuery, filterStatus, sortOption]);

  const markAsRead = async (id: string) => {
    const { error } = await supabase
      .from('contact_submissions')
      .update({ read: true })
      .eq('id', id);

    if (error) {
      toast.error('Failed to update');
    } else {
      setSubmissions(prev => 
        prev.map(s => s.id === id ? { ...s, read: true } : s)
      );
      if (selectedSubmission?.id === id) {
        setSelectedSubmission(prev => prev ? { ...prev, read: true } : null);
      }
    }
  };

  const markAllAsRead = async () => {
    const unreadIds = submissions.filter(s => !s.read).map(s => s.id);
    if (unreadIds.length === 0) return;

    const { error } = await supabase
      .from('contact_submissions')
      .update({ read: true })
      .in('id', unreadIds);

    if (error) {
      toast.error('Failed to mark all as read');
    } else {
      setSubmissions(prev => prev.map(s => ({ ...s, read: true })));
      toast.success('All marked as read');
    }
  };

  const deleteSubmission = async (id: string) => {
    const { error } = await supabase
      .from('contact_submissions')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error('Failed to delete');
    } else {
      setSubmissions(prev => prev.filter(s => s.id !== id));
      if (selectedSubmission?.id === id) {
        setSelectedSubmission(null);
      }
      toast.success('Submission deleted');
    }
    setDeleteId(null);
  };

  const deleteSelected = async () => {
    if (selectedIds.size === 0) return;

    const { error } = await supabase
      .from('contact_submissions')
      .delete()
      .in('id', Array.from(selectedIds));

    if (error) {
      toast.error('Failed to delete selected');
    } else {
      setSubmissions(prev => prev.filter(s => !selectedIds.has(s.id)));
      if (selectedSubmission && selectedIds.has(selectedSubmission.id)) {
        setSelectedSubmission(null);
      }
      toast.success(`${selectedIds.size} submissions deleted`);
      setSelectedIds(new Set());
    }
    setShowBulkDelete(false);
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredSubmissions.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredSubmissions.map(s => s.id)));
    }
  };

  const toggleSelect = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const exportToCsv = () => {
    const headers = ['Name', 'Email', 'Company', 'Subject', 'Message', 'Status', 'Date'];
    const rows = filteredSubmissions.map(s => [
      s.name,
      s.email,
      s.company || '',
      s.subject,
      s.message.replace(/"/g, '""'),
      s.read ? 'Read' : 'Unread',
      format(new Date(s.created_at), 'yyyy-MM-dd HH:mm')
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `contact-submissions-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    link.click();
    toast.success('Exported to CSV');
  };

  const clearFilters = () => {
    setSearchQuery('');
    setFilterStatus('all');
    setSortOption('newest');
  };

  const hasActiveFilters = searchQuery || filterStatus !== 'all' || sortOption !== 'newest';
  const unreadCount = submissions.filter(s => !s.read).length;

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <MessageSquare className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{submissions.length}</p>
                <p className="text-sm text-muted-foreground">Total Submissions</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-accent/10">
                <Mail className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold">{unreadCount}</p>
                <p className="text-sm text-muted-foreground">Unread</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-500/10">
                <Check className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{submissions.length - unreadCount}</p>
                <p className="text-sm text-muted-foreground">Read</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search & Filter Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, subject, or company..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex gap-2 flex-wrap">
              <Select value={filterStatus} onValueChange={(v) => setFilterStatus(v as FilterStatus)}>
                <SelectTrigger className="w-[130px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="unread">Unread</SelectItem>
                  <SelectItem value="read">Read</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortOption} onValueChange={(v) => setSortOption(v as SortOption)}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="name">By Name</SelectItem>
                </SelectContent>
              </Select>

              {hasActiveFilters && (
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  <X className="h-4 w-4 mr-1" />
                  Clear
                </Button>
              )}

              <Button variant="outline" size="sm" onClick={fetchSubmissions}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>

          {/* Bulk Actions */}
          <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t">
            <Button variant="outline" size="sm" onClick={toggleSelectAll}>
              {selectedIds.size === filteredSubmissions.length && filteredSubmissions.length > 0
                ? 'Deselect All'
                : `Select All (${filteredSubmissions.length})`}
            </Button>
            
            {selectedIds.size > 0 && (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setShowBulkDelete(true)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Selected ({selectedIds.size})
              </Button>
            )}
            
            {unreadCount > 0 && (
              <Button variant="outline" size="sm" onClick={markAllAsRead}>
                <CheckCheck className="h-4 w-4 mr-2" />
                Mark All Read
              </Button>
            )}
            
            <Button variant="outline" size="sm" onClick={exportToCsv}>
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>

            {filteredSubmissions.length !== submissions.length && (
              <Badge variant="secondary" className="ml-auto">
                Showing {filteredSubmissions.length} of {submissions.length}
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Submissions List */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Submissions</CardTitle>
          </CardHeader>
          <CardContent>
            {loadingData ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : filteredSubmissions.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                {submissions.length === 0 ? 'No submissions yet' : 'No submissions match your filters'}
              </p>
            ) : (
              <div className="space-y-2 max-h-[500px] overflow-y-auto">
                {filteredSubmissions.map((submission) => (
                  <div
                    key={submission.id}
                    onClick={() => {
                      setSelectedSubmission(submission);
                      if (!submission.read) markAsRead(submission.id);
                    }}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedSubmission?.id === submission.id
                        ? 'border-primary bg-primary/5'
                        : 'hover:bg-muted/50'
                    } ${!submission.read ? 'border-l-4 border-l-accent' : ''}`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div
                        className={`w-5 h-5 rounded border flex-shrink-0 flex items-center justify-center cursor-pointer ${
                          selectedIds.has(submission.id)
                            ? 'bg-primary border-primary'
                            : 'border-muted-foreground/30 hover:border-primary'
                        }`}
                        onClick={(e) => toggleSelect(submission.id, e)}
                      >
                        {selectedIds.has(submission.id) && (
                          <Check className="h-3 w-3 text-primary-foreground" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium truncate">{submission.name}</p>
                          {!submission.read && (
                            <Badge variant="secondary" className="text-xs">New</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground truncate">
                          {submission.subject}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {format(new Date(submission.created_at), 'MMM d, yyyy')}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Submission Detail */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Details</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedSubmission ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{selectedSubmission.name}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <a 
                    href={`mailto:${selectedSubmission.email}`}
                    className="text-primary hover:underline"
                  >
                    {selectedSubmission.email}
                  </a>
                </div>
                {selectedSubmission.company && (
                  <div className="flex items-center gap-2 text-sm">
                    <Building className="h-4 w-4 text-muted-foreground" />
                    <span>{selectedSubmission.company}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {format(new Date(selectedSubmission.created_at), 'MMMM d, yyyy \'at\' h:mm a')}
                  </span>
                </div>
                
                <div className="pt-4 border-t">
                  <p className="text-sm font-medium mb-1">Subject</p>
                  <p className="text-foreground">{selectedSubmission.subject}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium mb-1">Message</p>
                  <p className="text-foreground whitespace-pre-wrap">
                    {selectedSubmission.message}
                  </p>
                </div>

                <div className="pt-4 flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => window.location.href = `mailto:${selectedSubmission.email}?subject=Re: ${selectedSubmission.subject}`}
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Reply
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => setDeleteId(selectedSubmission.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">
                Select a submission to view details
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Submission?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the submission.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => deleteId && deleteSubmission(deleteId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Bulk Delete Confirmation Dialog */}
      <AlertDialog open={showBulkDelete} onOpenChange={setShowBulkDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {selectedIds.size} Submissions?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete all selected submissions.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={deleteSelected}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete All
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
