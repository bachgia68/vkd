import { Language, MultilingualText } from '../types/siteConfig';

export const DEFAULT_LANGUAGE: Language = 'vi';
export const SUPPORTED_LANGUAGES: Language[] = ['vi', 'en', 'fr', 'zh'];

export function getText(text: MultilingualText | string, lang: Language = DEFAULT_LANGUAGE): string {
  if (typeof text === 'string') return text;
  return (text[lang] || text.vi || Object.values(text)[0] || '');
}

export function getTextOrDefault(
  text: MultilingualText | string | undefined,
  lang: Language = DEFAULT_LANGUAGE,
  fallback: string = ''
): string {
  if (!text) return fallback;
  return getText(text, lang);
}

export function createMultilingualText(vi: string, translations?: Partial<Record<Language, string>>): MultilingualText {
  return {
    vi,
    en: translations?.en,
    fr: translations?.fr,
    zh: translations?.zh,
    ...translations,
  };
}

export function updateMultilingualText(
  existing: MultilingualText | undefined,
  updates: Partial<Record<Language, string>>
): MultilingualText {
  return {
    vi: updates.vi || existing?.vi || '',
    en: updates.en !== undefined ? updates.en : existing?.en,
    fr: updates.fr !== undefined ? updates.fr : existing?.fr,
    zh: updates.zh !== undefined ? updates.zh : existing?.zh,
  };
}

export function getAvailableLanguages(text: MultilingualText): Language[] {
  return SUPPORTED_LANGUAGES.filter((lang) => text[lang]);
}

export function isMultilingualText(value: unknown): value is MultilingualText {
  return typeof value === 'object' && value !== null && 'vi' in value;
}
