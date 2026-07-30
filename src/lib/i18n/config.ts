export const locales = ['en', 'id', 'ko', 'ja', 'zh'] as const
export type Locale = (typeof locales)[number]
export const defaultLocale: Locale = 'en'
export const indexableLocales = ['en', 'id'] as const satisfies readonly Locale[]
export type IndexableLocale = (typeof indexableLocales)[number]

export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale)
}

export function isIndexableLocale(locale: string): locale is IndexableLocale {
  return indexableLocales.includes(locale as IndexableLocale)
}
