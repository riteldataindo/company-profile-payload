/** Public locales currently approved for navigation, rendering, and indexing. */
export const locales = ['en', 'id'] as const
export type Locale = (typeof locales)[number]

/** Previously configured locales stay known so the edge redirect can fail closed. */
export const inactiveLocales = ['ko', 'ja', 'zh'] as const
export type InactiveLocale = (typeof inactiveLocales)[number]
export const allLocales = [...locales, ...inactiveLocales] as const
export type AnyLocale = (typeof allLocales)[number]

export const defaultLocale: Locale = 'en'
export const indexableLocales = locales satisfies readonly Locale[]
export type IndexableLocale = (typeof indexableLocales)[number]

export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale)
}

export function isInactiveLocale(locale: string): locale is InactiveLocale {
  return inactiveLocales.includes(locale as InactiveLocale)
}

export function isIndexableLocale(locale: string): locale is IndexableLocale {
  return indexableLocales.includes(locale as IndexableLocale)
}
