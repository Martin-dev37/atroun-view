import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

// Converts a hex color like #2D5016 to HSL values "93 72% 24%"
function hexToHsl(hex: string): string | null {
  const clean = hex.replace('#', '');
  if (clean.length !== 6) return null;
  const r = parseInt(clean.slice(0, 2), 16) / 255;
  const g = parseInt(clean.slice(2, 4), 16) / 255;
  const b = parseInt(clean.slice(4, 6), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
}

// Map of setting_key → CSS variable name(s) to set
const COLOR_MAP: Record<string, string[]> = {
  theme_primary_color:    ['--primary', '--sidebar-primary', '--chart-1'],
  theme_secondary_color:  ['--secondary'],
  theme_accent_color:     ['--accent'],
  theme_background_color: ['--background'],
  theme_foreground_color: ['--foreground'],
  theme_muted_color:      ['--muted'],
};

const SPACING_MAP: Record<string, string> = {
  compact:     '4rem',
  comfortable: '6rem',
  spacious:    '9rem',
};

export function useTheme() {
  useEffect(() => {
    loadAndApplyTheme();
  }, []);
}

// Exported so ThemeEditor can re-apply after saving
export { loadAndApplyTheme as applyThemeFromDB };

async function loadAndApplyTheme() {
  try {
    const { data, error } = await (supabase as any)
      .from('site_settings')
      .select('setting_key, setting_value')
      .like('setting_key', 'theme_%');

    if (error || !data || data.length === 0) return;

    const settings: Record<string, string> = {};
    data.forEach((row: { setting_key: string; setting_value: string }) => {
      settings[row.setting_key] = row.setting_value;
    });

    const root = document.documentElement;

    // Apply color variables
    Object.entries(COLOR_MAP).forEach(([key, cssVars]) => {
      if (!settings[key]) return;
      const hsl = hexToHsl(settings[key]);
      if (!hsl) return;
      cssVars.forEach(cssVar => root.style.setProperty(cssVar, hsl));
    });

    // Apply border radius
    if (settings.theme_border_radius) {
      root.style.setProperty('--radius', settings.theme_border_radius);
    }

    // Apply section spacing as a custom property
    if (settings.theme_section_spacing) {
      const spacing = SPACING_MAP[settings.theme_section_spacing] || '6rem';
      root.style.setProperty('--section-spacing', spacing);
    }

    // Load and apply Google Fonts for heading & body
    const fontsToLoad: string[] = [];
    if (settings.theme_heading_font) fontsToLoad.push(settings.theme_heading_font);
    if (settings.theme_body_font && settings.theme_body_font !== settings.theme_heading_font) {
      fontsToLoad.push(settings.theme_body_font);
    }

    if (fontsToLoad.length > 0) {
      const existing = document.getElementById('dynamic-theme-fonts');
      if (existing) existing.remove();
      const link = document.createElement('link');
      link.id = 'dynamic-theme-fonts';
      link.rel = 'stylesheet';
      const families = fontsToLoad.map(f => `family=${f.replace(/ /g, '+')}:wght@300;400;500;600;700`).join('&');
      link.href = `https://fonts.googleapis.com/css2?${families}&display=swap`;
      document.head.appendChild(link);
    }

    // Apply font families via CSS variables
    if (settings.theme_heading_font) {
      root.style.setProperty('--font-display', `"${settings.theme_heading_font}", serif`);
    }
    if (settings.theme_body_font) {
      root.style.setProperty('--font-body', `"${settings.theme_body_font}", sans-serif`);
    }

  } catch (e) {
    // Silently fail — theme is cosmetic only
    console.warn('Theme load failed:', e);
  }
}
