import type { Locale } from './config'

const dictionaries = {
  en: () => import('./dictionaries/en.json').then((module) => module.default),
  id: () => import('./dictionaries/id.json').then((module) => module.default),
}

export async function getDictionary(locale: Locale): Promise<Record<string, any>> {
  // A locale dictionary is a complete public contract. Do not deep-merge EN
  // into another locale: that silently publishes mixed-language pages.
  return dictionaries[locale]()
}
