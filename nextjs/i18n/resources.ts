import { I18N_LANGUAGES, Locale, namespaces } from './config';

const locales = I18N_LANGUAGES.map((lang) => lang.code);

export async function loadResources() {
  const resources: Record<Locale, Record<string, any>> = {
    en: {},
    es: {},
  };

  for (const lng of locales) {
    for (const ns of namespaces) {
      const module = await import(`@/i18n/messages/${lng}/${ns}.json`);
      resources[lng][ns] = module.default;
    }
  }

  return resources;
}
