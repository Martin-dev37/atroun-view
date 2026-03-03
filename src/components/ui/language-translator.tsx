import { useEffect, useState, useCallback, useRef } from 'react';
import { Globe } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

declare global {
  interface Window {
    google: any;
    googleTranslateElementInit: () => void;
  }
}

const LANGUAGES = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { code: 'pt', label: 'Português', flag: '🇧🇷' },
  { code: 'ru', label: 'Русский', flag: '🇷🇺' },
];

function getGoogleTranslateCookie(): string {
  const match = document.cookie.match(/googtrans=\/[a-z]{2}\/([a-z]{2})/);
  return match ? match[1] : 'en';
}

function setGoogleTranslateCookie(lang: string) {
  const domain = window.location.hostname;
  document.cookie = `googtrans=/en/${lang}; path=/; domain=${domain}`;
  document.cookie = `googtrans=/en/${lang}; path=/`;
}

function getTranslateSelect(): HTMLSelectElement | null {
  return document.querySelector('.goog-te-combo') as HTMLSelectElement | null;
}

export function LanguageTranslator() {
  const [currentLang, setCurrentLang] = useState(() => getGoogleTranslateCookie());
  const observerRef = useRef<MutationObserver | null>(null);

  // Ensure hidden container exists for the widget
  useEffect(() => {
    let container = document.getElementById('google_translate_element');
    if (!container) {
      container = document.createElement('div');
      container.id = 'google_translate_element';
      container.style.display = 'none';
      document.body.appendChild(container);
    }
    return () => {
      observerRef.current?.disconnect();
    };
  }, []);

  const triggerTranslate = useCallback((langCode: string) => {
    const select = getTranslateSelect();
    if (select) {
      select.value = langCode;
      select.dispatchEvent(new Event('change'));
      return true;
    }
    return false;
  }, []);

  const waitForSelectAndTranslate = useCallback((langCode: string) => {
    // Try immediately first
    if (triggerTranslate(langCode)) return;

    // Use MutationObserver to detect when the select appears
    observerRef.current?.disconnect();
    const observer = new MutationObserver(() => {
      if (triggerTranslate(langCode)) {
        observer.disconnect();
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
    observerRef.current = observer;

    // Safety timeout to clean up observer
    setTimeout(() => observer.disconnect(), 5000);
  }, [triggerTranslate]);

  const changeLanguage = useCallback((langCode: string) => {
    setCurrentLang(langCode);

    if (langCode === 'en') {
      // Clear cookies and restore original
      document.cookie = 'googtrans=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC';
      document.cookie = `googtrans=; path=/; domain=${window.location.hostname}; expires=Thu, 01 Jan 1970 00:00:00 UTC`;

      // Try using the widget's built-in restore
      const banner = document.querySelector('.goog-te-banner-frame') as HTMLIFrameElement;
      if (banner?.contentDocument) {
        const restoreBtn = banner.contentDocument.querySelector('.goog-te-banner-frame-content button');
        if (restoreBtn) {
          (restoreBtn as HTMLElement).click();
          return;
        }
      }
      // Fallback: trigger select to 'en' or reload
      if (!triggerTranslate('en')) {
        window.location.reload();
      }
      return;
    }

    setGoogleTranslateCookie(langCode);
    waitForSelectAndTranslate(langCode);
  }, [triggerTranslate, waitForSelectAndTranslate]);

  const currentLanguage = LANGUAGES.find(l => l.code === currentLang) || LANGUAGES[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-1.5 px-2 notranslate"
          aria-label="Select language"
        >
          <Globe className="h-4 w-4" />
          <span className="text-sm hidden sm:inline">{currentLanguage.flag}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[140px] notranslate">
        {LANGUAGES.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => changeLanguage(lang.code)}
            className={`flex items-center gap-2 cursor-pointer ${
              currentLang === lang.code ? 'bg-primary/10' : ''
            }`}
          >
            <span>{lang.flag}</span>
            <span>{lang.label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
