'use client';

import { useState, useCallback, useEffect } from 'react';
import { Language, DEFAULT_LANGUAGE, SUPPORTED_LANGUAGES } from '../utils/translation';

const LANGUAGE_STORAGE_KEY = 'ta-language';

export function useLanguage() {
  const [language, setLanguageState] = useState<Language>(DEFAULT_LANGUAGE);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY) as Language | null;
      const browserLang = navigator.language?.split('-')[0] as Language;
      const detectedLang = (stored || browserLang || DEFAULT_LANGUAGE) as Language;
      const validLang = SUPPORTED_LANGUAGES.includes(detectedLang) ? detectedLang : DEFAULT_LANGUAGE;
      setLanguageState(validLang);
      setIsLoaded(true);
    }
  }, []);

  const setLanguage = useCallback((lang: Language) => {
    if (SUPPORTED_LANGUAGES.includes(lang)) {
      setLanguageState(lang);
      if (typeof window !== 'undefined') {
        localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
      }
    }
  }, []);

  return { language, setLanguage, isLoaded, supportedLanguages: SUPPORTED_LANGUAGES };
}
