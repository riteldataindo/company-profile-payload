import type { Locale } from './config'
import { translateDict } from '@/lib/translate'

async function getSourceDict() {
  return import('./dictionaries/en.json').then((m) => m.default)
}

export async function getDictionary(locale: Locale) {
  const source = await getSourceDict()
  if (locale === 'en') return source
  return translateDict(source, locale)
}
