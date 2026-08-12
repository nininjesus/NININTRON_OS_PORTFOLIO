import { es } from './translations/es';
import { en } from './translations/en';
import { SITE_URL } from '../data/site.js';

const translations = { es, en };

export function getLangFromUrl(url: URL | string): 'es' | 'en' {
  const pathname = typeof url === 'string' ? new URL(url).pathname : url.pathname;
  if (pathname.startsWith('/en')) {
    return 'en';
  }
  return 'es'; // Fallback
}

export function t(lang: 'es' | 'en', key: string): string | any {
  const dictionary = translations[lang] || translations.es;
  const keys = key.split('.');
  
  let result: any = dictionary;
  for (const k of keys) {
    if (result && typeof result === 'object' && k in result) {
      result = result[k];
    } else {
      return key; // Return the key itself if not found
    }
  }
  return result;
}

export function getAlternateUrls(): { href: string; hreflang: string }[] {
  // Elimina la barra final si existe
  const baseUrl = SITE_URL.endsWith('/') ? SITE_URL.slice(0, -1) : SITE_URL;
  return [
    { href: `${baseUrl}/es`, hreflang: 'es' },
    { href: `${baseUrl}/en`, hreflang: 'en' },
    { href: baseUrl, hreflang: 'x-default' }
  ];
}
