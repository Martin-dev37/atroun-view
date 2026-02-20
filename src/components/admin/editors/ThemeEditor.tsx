import { useEffect, useState } from 'react';
import { cmsClient } from '@/lib/cms-client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Palette, Type, Save, RotateCcw } from 'lucide-react';

interface ThemeSetting {
  id?: string;
  setting_key: string;
  setting_value: string;
  setting_type: string;
  description: string | null;
}

const DEFAULT_THEME: Record<string, { value: string; type: string; description: string }> = {
  'theme_primary_color': { value: '#2D5016', type: 'color', description: 'Primary brand color' },
  'theme_secondary_color': { value: '#8B9D77', type: 'color', description: 'Secondary/sage color' },
  'theme_accent_color': { value: '#C4A035', type: 'color', description: 'Accent/gold color' },
  'theme_background_color': { value: '#FAFAF5', type: 'color', description: 'Background color' },
  'theme_foreground_color': { value: '#1A2E0A', type: 'color', description: 'Main text color' },
  'theme_muted_color': { value: '#F0EDE5', type: 'color', description: 'Muted background color' },
  'theme_heading_font': { value: 'Cormorant Garamond', type: 'font', description: 'Display/heading font' },
  'theme_body_font': { value: 'Inter', type: 'font', description: 'Body text font' },
  'theme_border_radius': { value: '0.5rem', type: 'text', description: 'Default border radius' },
  'theme_section_spacing': { value: 'comfortable', type: 'select', description: 'Section vertical spacing' },
};

const FONT_OPTIONS = [
  'Cormorant Garamond', 'Playfair Display', 'Merriweather', 'Lora', 'Crimson Text',
  'Inter', 'DM Sans', 'Poppins', 'Nunito', 'Source Sans 3', 'Manrope', 'Plus Jakarta Sans',
  'Roboto Slab', 'Bitter', 'PT Serif',
];

const SPACING_OPTIONS = [
  { value: 'compact', label: 'Compact — tighter layout' },
  { value: 'comfortable', label: 'Comfortable — default' },
  { value: 'spacious', label: 'Spacious — generous whitespace' },
];

const RADIUS_OPTIONS = [
  { value: '0', label: 'None (square)' },
  { value: '0.25rem', label: 'Small' },
  { value: '0.5rem', label: 'Medium' },
  { value: '0.75rem', label: 'Large' },
  { value: '1rem', label: 'Extra Large' },
  { value: '9999px', label: 'Full (pill)' },
];

export function ThemeEditor() {
  const { toast } = useToast();
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => { loadSettings(); }, []);

  async function loadSettings() {
    const { data } = await (cmsClient as any).from('site_settings').select('*');
    const map: Record<string, string> = {};
    // Initialize with defaults
    Object.entries(DEFAULT_THEME).forEach(([key, def]) => { map[key] = def.value; });
    // Override with DB values
    (data || []).forEach((s: ThemeSetting) => {
      if (s.setting_key.startsWith('theme_')) map[s.setting_key] = s.setting_value;
    });
    setSettings(map);
    setLoading(false);
  }

  function updateSetting(key: string, value: string) {
    setSettings(prev => ({ ...prev, [key]: value }));
  }

  async function handleSave() {
    setSaving(true);
    try {
      for (const [key, value] of Object.entries(settings)) {
        if (!key.startsWith('theme_')) continue;
        const def = DEFAULT_THEME[key];
        await (cmsClient as any).from('site_settings').upsert({
          setting_key: key,
          setting_value: value,
          setting_type: def?.type || 'text',
          description: def?.description || null,
        }, { onConflict: 'setting_key' });
      }
      toast({ title: 'Theme saved successfully' });
    } catch (e: any) {
      toast({ title: 'Save failed', description: e.message, variant: 'destructive' });
    }
    setSaving(false);
  }

  function handleReset() {
    const reset: Record<string, string> = {};
    Object.entries(DEFAULT_THEME).forEach(([key, def]) => { reset[key] = def.value; });
    setSettings(reset);
    toast({ title: 'Theme reset to defaults (unsaved)' });
  }

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

  const colorKeys = Object.entries(DEFAULT_THEME).filter(([, v]) => v.type === 'color');

  return (
    <div className="space-y-6">
      {/* Color Palette */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Palette className="h-5 w-5 text-primary" />Color Palette
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {colorKeys.map(([key, def]) => (
              <div key={key} className="space-y-2">
                <Label className="text-xs">{def.description}</Label>
                <div className="flex items-center gap-2">
                  <div
                    className="w-10 h-10 rounded-lg border border-border shadow-sm cursor-pointer relative overflow-hidden"
                    style={{ backgroundColor: settings[key] }}
                  >
                    <input
                      type="color"
                      value={settings[key]}
                      onChange={e => updateSetting(key, e.target.value)}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    />
                  </div>
                  <Input
                    value={settings[key]}
                    onChange={e => updateSetting(key, e.target.value)}
                    className="h-9 font-mono text-xs flex-1"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Color Preview Strip */}
          <div className="mt-6 p-4 rounded-lg border border-border bg-background">
            <p className="text-xs text-muted-foreground mb-3">Preview</p>
            <div className="flex gap-2">
              {colorKeys.map(([key]) => (
                <div
                  key={key}
                  className="flex-1 h-12 rounded-md shadow-sm first:rounded-l-lg last:rounded-r-lg"
                  style={{ backgroundColor: settings[key] }}
                  title={DEFAULT_THEME[key].description}
                />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Typography */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Type className="h-5 w-5 text-primary" />Typography
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Heading Font</Label>
              <Select value={settings['theme_heading_font']} onValueChange={v => updateSetting('theme_heading_font', v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {FONT_OPTIONS.map(f => (
                    <SelectItem key={f} value={f}>
                      <span style={{ fontFamily: f }}>{f}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="mt-3 p-3 bg-muted rounded-lg">
                <p className="text-2xl" style={{ fontFamily: settings['theme_heading_font'] }}>
                  Heading Preview
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Body Font</Label>
              <Select value={settings['theme_body_font']} onValueChange={v => updateSetting('theme_body_font', v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {FONT_OPTIONS.map(f => (
                    <SelectItem key={f} value={f}>
                      <span style={{ fontFamily: f }}>{f}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="mt-3 p-3 bg-muted rounded-lg">
                <p className="text-sm" style={{ fontFamily: settings['theme_body_font'] }}>
                  Body text preview — The quick brown fox jumps over the lazy dog.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Layout */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">Layout & Spacing</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Border Radius</Label>
              <Select value={settings['theme_border_radius']} onValueChange={v => updateSetting('theme_border_radius', v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {RADIUS_OPTIONS.map(o => (
                    <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex gap-3 mt-3">
                {['sm', 'md', 'lg'].map(size => (
                  <div
                    key={size}
                    className="w-16 h-16 bg-primary/20 border-2 border-primary/40"
                    style={{ borderRadius: settings['theme_border_radius'] }}
                  />
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Section Spacing</Label>
              <Select value={settings['theme_section_spacing']} onValueChange={v => updateSetting('theme_section_spacing', v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {SPACING_OPTIONS.map(o => (
                    <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-between items-center pt-2">
        <Button variant="outline" onClick={handleReset} className="gap-2">
          <RotateCcw className="h-4 w-4" />Reset to Defaults
        </Button>
        <Button onClick={handleSave} disabled={saving} className="gap-2">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save Theme
        </Button>
      </div>
    </div>
  );
}
