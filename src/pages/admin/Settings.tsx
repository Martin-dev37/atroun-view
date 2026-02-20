import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, EyeOff, Lock, Shield, CheckCircle2, XCircle } from 'lucide-react';
import { z } from 'zod';

const passwordSchema = z.object({
  current: z.string().min(1, 'Current password is required'),
  next: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(72, 'Password must be under 72 characters'),
  confirm: z.string().min(1, 'Please confirm your new password'),
}).refine(data => data.next === data.confirm, {
  message: "Passwords don't match",
  path: ['confirm'],
});

type FieldErrors = Partial<Record<'current' | 'next' | 'confirm', string>>;

function PasswordStrength({ password }: { password: string }) {
  const checks = [
    { label: 'At least 8 characters', pass: password.length >= 8 },
    { label: 'Contains a number', pass: /\d/.test(password) },
    { label: 'Contains uppercase', pass: /[A-Z]/.test(password) },
    { label: 'Contains special character', pass: /[^A-Za-z0-9]/.test(password) },
  ];

  const score = checks.filter(c => c.pass).length;
  const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong'][score];
  const strengthColor = ['', 'bg-destructive', 'bg-amber-500', 'bg-yellow-400', 'bg-green-500'][score];

  if (!password) return null;

  return (
    <div className="mt-2 space-y-2">
      <div className="flex gap-1">
        {[1, 2, 3, 4].map(i => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-colors duration-300 ${i <= score ? strengthColor : 'bg-border'}`}
          />
        ))}
      </div>
      <p className="text-xs text-muted-foreground">
        Strength: <span className="font-medium text-foreground">{strengthLabel}</span>
      </p>
      <ul className="space-y-1">
        {checks.map(check => (
          <li key={check.label} className="flex items-center gap-1.5 text-xs">
            {check.pass
              ? <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
              : <XCircle className="h-3.5 w-3.5 text-muted-foreground" />}
            <span className={check.pass ? 'text-foreground' : 'text-muted-foreground'}>{check.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function SettingsPage() {
  const { profile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [form, setForm] = useState({ current: '', next: '', confirm: '' });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [show, setShow] = useState({ current: false, next: false, confirm: false });
  const [loading, setLoading] = useState(false);

  const toggleShow = (field: keyof typeof show) =>
    setShow(s => ({ ...s, [field]: !s[field] }));

  const handleChange = (field: keyof typeof form, value: string) => {
    setForm(f => ({ ...f, [field]: value }));
    if (errors[field]) setErrors(e => ({ ...e, [field]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const parsed = passwordSchema.safeParse(form);
    if (!parsed.success) {
      const fieldErrors: FieldErrors = {};
      parsed.error.errors.forEach(err => {
        const key = err.path[0] as keyof FieldErrors;
        if (!fieldErrors[key]) fieldErrors[key] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);
    try {
      // Re-authenticate with current password to verify it's correct
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user?.email) throw new Error('No authenticated user');

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: userData.user.email,
        password: form.current,
      });

      if (signInError) {
        setErrors({ current: 'Current password is incorrect' });
        setLoading(false);
        return;
      }

      // Update to the new password
      const { error: updateError } = await supabase.auth.updateUser({
        password: form.next,
      });

      if (updateError) throw updateError;

      toast({
        title: 'Password updated',
        description: 'Your password has been changed successfully.',
      });
      setForm({ current: '', next: '', confirm: '' });
      navigate('/admin');
    } catch (err: unknown) {
      toast({
        title: 'Update failed',
        description: err instanceof Error ? err.message : 'Something went wrong.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="p-6 max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-display font-semibold text-foreground">Settings</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your account and security preferences</p>
        </div>

        {/* Profile Info Card */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" />
              Account Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <span className="text-lg font-semibold text-primary">
                  {profile?.display_name?.charAt(0).toUpperCase() ?? '?'}
                </span>
              </div>
              <div>
                <p className="font-medium text-foreground">{profile?.display_name ?? '—'}</p>
                <p className="text-sm text-muted-foreground">{profile?.email ?? '—'}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Change Password Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Lock className="h-4 w-4 text-primary" />
              Change Password
            </CardTitle>
            <CardDescription>
              Choose a strong, unique password. Minimum 8 characters recommended.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Current Password */}
              <div className="space-y-1.5">
                <Label htmlFor="current">Current Password</Label>
                <div className="relative">
                  <Input
                    id="current"
                    type={show.current ? 'text' : 'password'}
                    placeholder="Enter current password"
                    value={form.current}
                    onChange={e => handleChange('current', e.target.value)}
                    className={errors.current ? 'border-destructive focus-visible:ring-destructive' : ''}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => toggleShow('current')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    tabIndex={-1}
                  >
                    {show.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.current && (
                  <p className="text-xs text-destructive">{errors.current}</p>
                )}
              </div>

              {/* New Password */}
              <div className="space-y-1.5">
                <Label htmlFor="next">New Password</Label>
                <div className="relative">
                  <Input
                    id="next"
                    type={show.next ? 'text' : 'password'}
                    placeholder="Enter new password"
                    value={form.next}
                    onChange={e => handleChange('next', e.target.value)}
                    className={errors.next ? 'border-destructive focus-visible:ring-destructive' : ''}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => toggleShow('next')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    tabIndex={-1}
                  >
                    {show.next ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.next && (
                  <p className="text-xs text-destructive">{errors.next}</p>
                )}
                <PasswordStrength password={form.next} />
              </div>

              {/* Confirm Password */}
              <div className="space-y-1.5">
                <Label htmlFor="confirm">Confirm New Password</Label>
                <div className="relative">
                  <Input
                    id="confirm"
                    type={show.confirm ? 'text' : 'password'}
                    placeholder="Re-enter new password"
                    value={form.confirm}
                    onChange={e => handleChange('confirm', e.target.value)}
                    className={errors.confirm ? 'border-destructive focus-visible:ring-destructive' : ''}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => toggleShow('confirm')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    tabIndex={-1}
                  >
                    {show.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.confirm && (
                  <p className="text-xs text-destructive">{errors.confirm}</p>
                )}
              </div>

              <div className="flex gap-3 pt-2">
                <Button type="submit" disabled={loading}>
                  {loading ? 'Updating…' : 'Update Password'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => { setForm({ current: '', next: '', confirm: '' }); setErrors({}); }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
