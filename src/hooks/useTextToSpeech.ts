import { useState, useCallback, useRef, useEffect } from 'react';

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

// Keywords that indicate high-quality voices (prioritized in order)
const PREMIUM_VOICE_KEYWORDS = [
  'natural',
  'neural',
  'enhanced',
  'premium',
  'wavenet',
  'samantha',
  'karen',
  'daniel',
  'moira',
  'tessa',
  'fiona',
  'alex',
];

function getBestVoice(voices: SpeechSynthesisVoice[], langCode: string): SpeechSynthesisVoice | null {
  // Filter voices by language
  const langVoices = voices.filter(v => 
    v.lang.toLowerCase().startsWith(langCode.toLowerCase().split('-')[0])
  );
  
  if (langVoices.length === 0) return null;

  // Prioritize premium/natural sounding voices
  for (const keyword of PREMIUM_VOICE_KEYWORDS) {
    const premiumVoice = langVoices.find(v => 
      v.name.toLowerCase().includes(keyword)
    );
    if (premiumVoice) return premiumVoice;
  }

  // Prefer local voices over remote (usually higher quality)
  const localVoice = langVoices.find(v => v.localService);
  if (localVoice) return localVoice;

  // Default to first available voice for the language
  return langVoices[0];
}

export function useTextToSpeech() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Load available voices
  useEffect(() => {
    if (!('speechSynthesis' in window)) return;

    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      if (availableVoices.length > 0) {
        setVoices(availableVoices);
      }
    };

    loadVoices();
    
    // Voices may load asynchronously
    window.speechSynthesis.addEventListener('voiceschanged', loadVoices);
    
    return () => {
      window.speechSynthesis.removeEventListener('voiceschanged', loadVoices);
    };
  }, []);

  const speak = useCallback((text: string, langCode: SupportedLanguage = 'en') => {
    if (!('speechSynthesis' in window)) {
      console.warn('Speech synthesis not supported');
      return;
    }

    // Stop any current speech
    window.speechSynthesis.cancel();

    const langOption = LANGUAGE_OPTIONS.find(l => l.code === langCode);
    const targetLang = langOption?.voiceLang || 'en-US';
    
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Select the best available voice
    const bestVoice = getBestVoice(voices, targetLang);
    if (bestVoice) {
      utterance.voice = bestVoice;
      utterance.lang = bestVoice.lang;
    } else {
      utterance.lang = targetLang;
    }

    // Optimize for natural speech
    utterance.rate = 0.95; // Slightly slower for clarity
    utterance.pitch = 1.0; // Natural pitch
    utterance.volume = 1.0;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, [voices]);

  const stop = useCallback(() => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }, []);

  return { speak, stop, isSpeaking };
}
