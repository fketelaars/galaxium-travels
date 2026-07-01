import { createContext, useContext, useState, type ReactNode } from 'react';
import { type Language, type HomeTranslations, translations } from './languageData';

interface LanguageContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: HomeTranslations;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('en');

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t: translations[language] }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextValue => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within a LanguageProvider');
  return ctx;
};

// Made with Bob
