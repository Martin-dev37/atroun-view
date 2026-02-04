import { useState, useCallback, useRef } from 'react';

export type SupportedLanguage = 'en' | 'fr' | 'es' | 'de' | 'pt' | 'ru' | 'sw';

export const LANGUAGE_OPTIONS: { code: SupportedLanguage; label: string; voiceLang: string }[] = [
  { code: 'en', label: 'English', voiceLang: 'en-US' },
  { code: 'fr', label: 'Français', voiceLang: 'fr-FR' },
  { code: 'es', label: 'Español', voiceLang: 'es-ES' },
  { code: 'de', label: 'Deutsch', voiceLang: 'de-DE' },
  { code: 'pt', label: 'Português', voiceLang: 'pt-BR' },
  { code: 'ru', label: 'Русский', voiceLang: 'ru-RU' },
  { code: 'sw', label: 'Kiswahili', voiceLang: 'sw-KE' },
];

export function useTextToSpeech() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const speak = useCallback((text: string, langCode: SupportedLanguage = 'en') => {
    if (!('speechSynthesis' in window)) {
      console.warn('Speech synthesis not supported');
      return;
    }

    // Stop any current speech
    window.speechSynthesis.cancel();

    const langOption = LANGUAGE_OPTIONS.find(l => l.code === langCode);
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = langOption?.voiceLang || 'en-US';
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, []);

  const stop = useCallback(() => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }, []);

  return { speak, stop, isSpeaking };
}
