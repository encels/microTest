'use client';

import { ReactNode, useEffect, useState } from 'react';
import { I18N_LANGUAGES, namespaces } from '@/i18n/config';
import { loadResources } from '@/i18n/resources';
import { DirectionProvider as RadixDirectionProvider } from '@radix-ui/react-direction';
import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { I18nextProvider, initReactI18next } from 'react-i18next';

interface I18nProviderProps {
  children: ReactNode;
}

function I18nProvider({ children }: I18nProviderProps) {
  const [isI18nInitialized, setIsI18nInitialized] = useState(false);

  useEffect(() => {
    const init = async () => {
      const resources = await loadResources();

      if (!i18n.isInitialized) {
        await i18n
          .use(LanguageDetector)
          .use(initReactI18next)
          .init({
            resources,
            ns: namespaces,
            defaultNS: namespaces[0],
            fallbackLng: 'en',
            debug: process.env.NODE_ENV === 'development',
            interpolation: { escapeValue: false },
            detection: {
              order: ['localStorage', 'navigator', 'htmlTag'],
              caches: ['localStorage'],
              lookupLocalStorage: 'language',
            },
            react: { useSuspense: false },
          });
      }

      setIsI18nInitialized(true);
    };

    init();

    const handleLanguageChange = (lng: string) => {
      const language = I18N_LANGUAGES.find((lang) => lang.code === lng);
      if (language?.direction) {
        document.documentElement.setAttribute('dir', language.direction);
      }
    };

    i18n.on('languageChanged', handleLanguageChange);
    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, []);

  const currentLanguage =
    I18N_LANGUAGES.find((lang) => lang.code === (i18n.language || 'en')) ||
    I18N_LANGUAGES[0];

  if (!isI18nInitialized) {
    return (
      <RadixDirectionProvider dir="ltr">{children}</RadixDirectionProvider>
    );
  }

  return (
    <I18nextProvider i18n={i18n}>
      <RadixDirectionProvider dir={currentLanguage.direction}>
        {children}
      </RadixDirectionProvider>
    </I18nextProvider>
  );
}

const useLanguage = () => {
  const currentLanguage =
    I18N_LANGUAGES.find((lang) => lang.code === i18n.language) ||
    I18N_LANGUAGES[0];

  const changeLanguage = (code: string) => {
    i18n.changeLanguage(code);
  };

  return {
    languageCode: i18n.language,
    language: currentLanguage,
    changeLanguage,
  };
};

export { I18nProvider, useLanguage };
