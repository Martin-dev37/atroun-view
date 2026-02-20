import { useEffect, useState, useRef } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { useAuth } from '@/hooks/useAuth';
import { usePortalAccess } from '@/hooks/usePortalAccess';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import {
  Upload, FileText, Download, Send, Bot, User as UserIcon,
  Trash2, Loader2, MessageSquare, Lock
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface Document {
  id: string;
  title: string;
  description: string | null;
  file_url: string | null;
  file_name: string | null;
  file_size: number | null;
  file_type: string | null;
  created_at: string;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}

export default function InvestorPortal() {
  const { user, isAdmin, isPortalEditor } = useAuth();
  const { hasAccess, loading: accessLoading } = usePortalAccess(user?.id);
  const { toast } = useToast();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const canAccess = isAdmin || isPortalEditor || hasAccess('investor');

  useEffect(() => {
    if (canAccess && !accessLoading) {
      loadDocuments();
      initChatSession();
    }
  }, [canAccess, accessLoading]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  async function loadDocuments() {
    const { data } = await supabase
      .from('portal_documents')
      .select('*')
      .eq('section', 'investor')
      .order('created_at', { ascending: false });
    setDocuments((data as Document[]) ?? []);
  }

  async function initChatSession() {
    if (!user) return;
    // Find or create a session for this user (within 3 years)
    const threeYearsAgo = new Date();
    threeYearsAgo.setFullYear(threeYearsAgo.getFullYear() - 3);

    const { data: sessions } = await supabase
      .from('investor_chat_sessions')
      .select('id')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1);

    let currentSessionId: string;
    if (sessions && sessions.length > 0) {
      currentSessionId = sessions[0].id;
    } else {
      const { data: newSession } = await supabase
        .from('investor_chat_sessions')
        .insert({ user_id: user.id })
        .select('id')
        .single();
      currentSessionId = newSession?.id;
    }

    setSessionId(currentSessionId);

    // Load chat history
    const { data: messages } = await supabase
      .from('investor_chat_messages')
      .select('*')
      .eq('session_id', currentSessionId)
      .gte('created_at', threeYearsAgo.toISOString())
      .order('created_at', { ascending: true });

    setChatMessages((messages as ChatMessage[]) ?? []);
  }

  async function handleSendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!chatInput.trim() || !sessionId) return;

    const userMsg = chatInput.trim();
    setChatInput('');
    setChatLoading(true);

    // Optimistically add user message
    const tempUserMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: userMsg,
      created_at: new Date().toISOString(),
    };
    setChatMessages(prev => [...prev, tempUserMsg]);

    // Save user message
    await supabase.from('investor_chat_messages').insert({
      session_id: sessionId,
      role: 'user',
      content: userMsg,
    });

    try {
      const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
      const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

      // Build context from documents
      const docContext = documents.map(d =>
        `Document: ${d.title}${d.description ? ` - ${d.description}` : ''}`
      ).join('\n');

      // Build chat history for context
      const recentMessages = chatMessages.slice(-10).map(m => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      }));

      const response = await fetch(`${SUPABASE_URL}/functions/v1/investor-chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${SUPABASE_KEY}`,
        },
        body: JSON.stringify({
          message: userMsg,
          history: recentMessages,
          documentContext: docContext,
        }),
      });

      let assistantContent = '';
      if (response.ok) {
        const data = await response.json();
        assistantContent = data.message || 'I apologize, I could not generate a response.';
      } else {
        assistantContent = 'I apologize, there was an error processing your request. Please try again.';
      }

      const assistantMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: assistantContent,
        created_at: new Date().toISOString(),
      };
      setChatMessages(prev => [...prev, assistantMsg]);

      await supabase.from('investor_chat_messages').insert({
        session_id: sessionId,
        role: 'assistant',
        content: assistantContent,
      });
    } catch (err) {
      toast({ title: 'Chat error', description: 'Failed to get response', variant: 'destructive' });
    }
    setChatLoading(false);
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files?.[0] || !isPortalEditor) return;
    const file = e.target.files[0];
    setUploadLoading(true);

    const fileName = `investor/${Date.now()}-${file.name}`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('portal-documents')
      .upload(fileName, file);

    if (uploadError) {
      toast({ title: 'Upload failed', description: uploadError.message, variant: 'destructive' });
      setUploadLoading(false);
      return;
    }

    const { data: urlData } = supabase.storage.from('portal-documents').getPublicUrl(fileName);

    await supabase.from('portal_documents').insert({
      section: 'investor',
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

  if (accessLoading) {
    return <AdminLayout><div className="flex items-center justify-center h-64"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div></AdminLayout>;
  }

  if (!canAccess) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center h-64 gap-4">
          <Lock className="h-12 w-12 text-muted-foreground" />
          <h2 className="text-xl font-display font-semibold">Access Restricted</h2>
          <p className="text-muted-foreground">You don't have access to the Investor Portal. Contact your administrator.</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-display font-semibold text-foreground">Investor Portal</h1>
            <p className="text-muted-foreground mt-1">Access financial documents and get AI-powered insights</p>
          </div>
          {isPortalEditor && (
            <label>
              <input type="file" className="hidden" onChange={handleUpload} accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx" />
              <Button asChild disabled={uploadLoading}>
                <span className="cursor-pointer">
                  {uploadLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Upload className="h-4 w-4 mr-2" />}
                  Upload Document
                </span>
              </Button>
            </label>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Documents */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Documents ({documents.length})
            </h2>
            <div className="space-y-3 max-h-[600px] overflow-y-auto">
              {documents.length === 0 ? (
                <Card className="p-8 text-center">
                  <FileText className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">No documents uploaded yet.</p>
                </Card>
              ) : (
                documents.map(doc => (
                  <Card key={doc.id} className="p-4 hover:shadow-soft transition-shadow">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <FileText className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="font-medium text-sm truncate">{doc.title}</p>
                          {doc.description && <p className="text-xs text-muted-foreground mt-0.5">{doc.description}</p>}
                          {doc.file_size && (
                            <p className="text-xs text-muted-foreground mt-1">
                              {(doc.file_size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Button size="sm" variant="outline" onClick={() => handleDownload(doc)}>
                          <Download className="h-3 w-3" />
                        </Button>
                        {isAdmin && (
                          <Button size="sm" variant="outline" onClick={() => handleDelete(doc.id)}>
                            <Trash2 className="h-3 w-3 text-destructive" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </div>

          {/* AI Chat */}
          <Card className="flex flex-col h-[650px]">
            <CardHeader className="border-b border-border pb-4">
              <CardTitle className="flex items-center gap-2 text-base">
                <Bot className="h-5 w-5 text-primary" />
                Financial AI Assistant
                <Badge variant="secondary" className="text-xs ml-auto">3-Year History</Badge>
              </CardTitle>
              <p className="text-xs text-muted-foreground">Ask about company financials, documents, and investment insights</p>
            </CardHeader>
            <CardContent className="flex flex-col flex-1 p-0 overflow-hidden">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {chatMessages.length === 0 && (
                  <div className="text-center py-8 space-y-3">
                    <MessageSquare className="h-10 w-10 text-muted-foreground mx-auto" />
                    <p className="text-sm text-muted-foreground">
                      Ask me anything about ATROUN's financials, projections, or uploaded documents.
                    </p>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {['What are the revenue projections?', 'Summarize the latest report', 'What is the funding status?'].map(q => (
                        <button
                          key={q}
                          onClick={() => setChatInput(q)}
                          className="text-xs bg-muted hover:bg-muted/80 text-muted-foreground px-3 py-1.5 rounded-full transition-colors"
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                {chatMessages.map(msg => (
                  <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {msg.role === 'assistant' && (
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Bot className="h-4 w-4 text-primary" />
                      </div>
                    )}
                    <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${
                      msg.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-foreground'
                    }`}>
                      {msg.role === 'assistant' ? (
                        <div className="prose prose-sm max-w-none">
                          <ReactMarkdown>{msg.content}</ReactMarkdown>
                        </div>
                      ) : msg.content}
                    </div>
                    {msg.role === 'user' && (
                      <div className="h-8 w-8 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                        <UserIcon className="h-4 w-4 text-accent" />
                      </div>
                    )}
                  </div>
                ))}
                {chatLoading && (
                  <div className="flex gap-3">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <Bot className="h-4 w-4 text-primary" />
                    </div>
                    <div className="bg-muted rounded-2xl px-4 py-3">
                      <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Input */}
              <form onSubmit={handleSendMessage} className="p-4 border-t border-border flex gap-2">
                <Input
                  value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                  placeholder="Ask about financials, documents..."
                  disabled={chatLoading}
                  className="flex-1"
                />
                <Button type="submit" disabled={chatLoading || !chatInput.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
