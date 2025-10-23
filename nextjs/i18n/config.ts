// src/config/languages.ts

export type Locale = 'en' | 'es';
export interface Language {
  code: Locale;
  name: string;
  shortName: string;
  direction: 'ltr' | 'rtl';
  flag: string;
}

export const I18N_LANGUAGES: Language[] = [
  {
    code: 'en',
    name: 'English',
    shortName: 'EN',
    direction: 'ltr',
    flag: '/media/flags/united-states.svg',
  },
  {
    code: 'es',
    name: 'Spanish',
    shortName: 'ES',
    direction: 'ltr',
    flag: '/media/flags/spain.svg',
  },
];

export const namespaces = ['common', 'pages'];
