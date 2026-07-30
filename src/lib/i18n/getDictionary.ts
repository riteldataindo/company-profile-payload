import type { Locale } from './config'

const dictionaries = {
  en: () => import('./dictionaries/en.json').then((module) => module.default),
  id: () => import('./dictionaries/id.json').then((module) => module.default),
  ko: () => import('./dictionaries/ko.json').then((module) => module.default),
  ja: () => import('./dictionaries/ja.json').then((module) => module.default),
  zh: () => import('./dictionaries/zh.json').then((module) => module.default),
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function mergeDictionaries(
  source: Record<string, unknown>,
  translation: Record<string, unknown>,
): Record<string, unknown> {
  const merged = { ...source }

  for (const [key, translatedValue] of Object.entries(translation)) {
    const sourceValue = merged[key]
    merged[key] = isRecord(sourceValue) && isRecord(translatedValue)
      ? mergeDictionaries(sourceValue, translatedValue)
      : translatedValue
  }

  return merged
}

export async function getDictionary(locale: Locale): Promise<Record<string, any>> {
  const source = await dictionaries.en()
  if (locale === 'en') return source

  const translation = await dictionaries[locale]()
  return mergeDictionaries(source, translation)
}
