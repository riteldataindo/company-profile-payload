export type Locale = 'en' | 'id'

export type LocalText = {
  en: string
  id: string
}

export type Availability = 'deployment' | 'assessment' | 'scope'

export function text(locale: Locale, value: LocalText | string | null | undefined): string {
  if (!value) return ''
  if (typeof value === 'string') return value
  return value[locale] || value.en || ''
}
