import { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Upload, FileSpreadsheet, Loader2, CheckCircle, AlertCircle, FileText } from 'lucide-react';
import * as XLSX from 'xlsx';

interface ParsedContact {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  role?: string;
  notes?: string;
}

// Parse VCF (vCard) file content
function parseVCF(text: string): ParsedContact[] {
  const contacts: ParsedContact[] = [];
  const cards = text.split('BEGIN:VCARD').filter(c => c.trim());

  for (const card of cards) {
    const lines = card.split(/\r?\n/);
    let name = '';
    let email = '';
    let phone = '';
    let company = '';
    let role = '';
    let notes = '';

    for (const line of lines) {
      const upperLine = line.toUpperCase();

      if (upperLine.startsWith('FN:') || upperLine.startsWith('FN;')) {
        name = line.substring(line.indexOf(':') + 1).trim();
      } else if (!name && (upperLine.startsWith('N:') || upperLine.startsWith('N;'))) {
        const parts = line.substring(line.indexOf(':') + 1).split(';');
        name = [parts[1], parts[0]].filter(Boolean).join(' ').trim();
      } else if (upperLine.startsWith('EMAIL') && !email) {
        email = line.substring(line.indexOf(':') + 1).trim();
      } else if (upperLine.startsWith('TEL') && !phone) {
        phone = line.substring(line.indexOf(':') + 1).trim();
      } else if (upperLine.startsWith('ORG') && !company) {
        company = line.substring(line.indexOf(':') + 1).split(';')[0].trim();
      } else if (upperLine.startsWith('TITLE') && !role) {
        role = line.substring(line.indexOf(':') + 1).trim();
      } else if (upperLine.startsWith('NOTE') && !notes) {
        notes = line.substring(line.indexOf(':') + 1).trim();
      }
    }

    if (name && email) {
      contacts.push({ name, email, phone: phone || undefined, company: company || undefined, role: role || undefined, notes: notes || undefined });
    }
  }

  return contacts;
}

// Parse Excel/CSV file
function parseExcel(data: ArrayBuffer): ParsedContact[] {
  const workbook = XLSX.read(data, { type: 'array' });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet);

  const findCol = (row: Record<string, unknown>, ...candidates: string[]): string => {
    for (const key of Object.keys(row)) {
      const lower = key.toLowerCase().replace(/[^a-z]/g, '');
      for (const c of candidates) {
        if (lower.includes(c)) return String(row[key] ?? '');
      }
    }
    return '';
  };

  return rows
    .map(row => ({
      name: findCol(row, 'name', 'fullname', 'contactname', 'firstname') || findCol(row, 'first') + ' ' + findCol(row, 'last'),
      email: findCol(row, 'email', 'emailaddress', 'mail'),
      phone: findCol(row, 'phone', 'tel', 'mobile', 'cell') || undefined,
      company: findCol(row, 'company', 'org', 'organization', 'organisation') || undefined,
      role: findCol(row, 'role', 'title', 'jobtitle', 'position') || undefined,
      notes: findCol(row, 'note', 'comment', 'description') || undefined,
    }))
    .filter(c => c.name.trim() && c.email.trim());
}

interface ContactImportProps {
  onImportComplete: () => void;
}

export function ContactImport({ onImportComplete }: ContactImportProps) {
  const { toast } = useToast();
  const fileRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [parsed, setParsed] = useState<ParsedContact[]>([]);
  const [fileName, setFileName] = useState('');
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<{ added: number; skipped: number } | null>(null);

  function reset() {
    setParsed([]);
    setFileName('');
    setImportResult(null);
    if (fileRef.current) fileRef.current.value = '';
  }

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setImportResult(null);

    try {
      const ext = file.name.split('.').pop()?.toLowerCase();

      if (ext === 'vcf') {
        const text = await file.text();
        const contacts = parseVCF(text);
        setParsed(contacts);
      } else if (['xlsx', 'xls', 'csv'].includes(ext ?? '')) {
        const buffer = await file.arrayBuffer();
        const contacts = parseExcel(buffer);
        setParsed(contacts);
      } else {
        toast({ title: 'Unsupported file', description: 'Please upload a .vcf, .xlsx, .xls, or .csv file', variant: 'destructive' });
        return;
      }

      if (parsed.length === 0 && ext === 'vcf') {
        // Re-check after parse
      }
    } catch (err) {
      toast({ title: 'Parse error', description: 'Could not parse the file. Check the format.', variant: 'destructive' });
    }
  }

  async function handleImport() {
    if (parsed.length === 0) return;
    setImporting(true);
    let added = 0;
    let skipped = 0;

    for (const contact of parsed) {
      const { data: existing } = await supabase
        .from('crm_contacts')
        .select('id')
        .eq('email', contact.email)
        .maybeSingle();

      if (existing) {
        skipped++;
        continue;
      }

      const { error } = await supabase.from('crm_contacts').insert({
        name: contact.name,
        email: contact.email,
        phone: contact.phone ?? null,
        company: contact.company ?? null,
        role: contact.role ?? null,
        notes: contact.notes ?? null,
        source: 'import',
        status: 'active',
        subscribed_to_emails: true,
      });

      if (!error) added++;
      else skipped++;
    }

    setImporting(false);
    setImportResult({ added, skipped });
    toast({ title: 'Import complete', description: `${added} added, ${skipped} skipped (duplicates)` });
    onImportComplete();
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) reset(); }}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Upload className="h-4 w-4 mr-2" />Import Contacts
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Import Contacts</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 flex-1 overflow-hidden flex flex-col">
          {/* File picker */}
          <div className="border-2 border-dashed border-border rounded-lg p-6 text-center space-y-3">
            <div className="flex justify-center gap-3 text-muted-foreground">
              <FileText className="h-8 w-8" />
              <FileSpreadsheet className="h-8 w-8" />
            </div>
            <p className="text-sm text-muted-foreground">Upload a <strong>.vcf</strong>, <strong>.xlsx</strong>, <strong>.xls</strong>, or <strong>.csv</strong> file</p>
            <p className="text-xs text-muted-foreground">Excel/CSV files should have columns like: Name, Email, Phone, Company, Role</p>
            <input
              ref={fileRef}
              type="file"
              accept=".vcf,.xlsx,.xls,.csv"
              className="hidden"
              onChange={handleFile}
            />
            <Button variant="secondary" size="sm" onClick={() => fileRef.current?.click()}>
              Choose File
            </Button>
            {fileName && <p className="text-sm font-medium text-foreground">{fileName}</p>}
          </div>

          {/* Import result */}
          {importResult && (
            <div className="flex items-center gap-3 p-3 rounded-md bg-secondary">
              <CheckCircle className="h-5 w-5 text-primary" />
              <span className="text-sm">
                <strong>{importResult.added}</strong> contacts added, <strong>{importResult.skipped}</strong> skipped (duplicates)
              </span>
            </div>
          )}

          {/* Preview table */}
          {parsed.length > 0 && !importResult && (
            <>
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  <strong>{parsed.length}</strong> contacts found
                </p>
                <Button onClick={handleImport} disabled={importing}>
                  {importing ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Upload className="h-4 w-4 mr-2" />}
                  Import {parsed.length} Contacts
                </Button>
              </div>
              <div className="overflow-auto flex-1 border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Company</TableHead>
                      <TableHead>Role</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {parsed.slice(0, 50).map((c, i) => (
                      <TableRow key={i}>
                        <TableCell className="text-sm">{c.name}</TableCell>
                        <TableCell className="text-sm">{c.email}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{c.phone ?? '—'}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{c.company ?? '—'}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{c.role ?? '—'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {parsed.length > 50 && (
                  <p className="text-xs text-muted-foreground text-center py-2">Showing first 50 of {parsed.length} contacts</p>
                )}
              </div>
            </>
          )}

          {parsed.length === 0 && fileName && !importResult && (
            <div className="flex items-center gap-3 p-3 rounded-md bg-destructive/10 text-destructive">
              <AlertCircle className="h-5 w-5" />
              <span className="text-sm">No valid contacts found. Ensure the file has Name and Email fields.</span>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
