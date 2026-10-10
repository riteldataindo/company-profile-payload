export type Locale = 'en' | 'id'

export type LocalText = {
  en: string
  id: string
}

export function text(locale: Locale, value: LocalText): string {
  return value[locale]
}

export function route(locale: Locale, path = ''): string {
  const normalized = path && !path.startsWith('/') ? `/${path}` : path
  return `/${locale}${normalized}`
}

export function alternateLocale(locale: Locale): Locale {
  return locale === 'en' ? 'id' : 'en'
}

export const sharedCopy = {
  brandDescription: {
    en: 'People counting and visitor analytics for retail stores and malls.',
    id: 'People counting dan visitor analytics untuk toko retail dan mall.',
  },
  seeInAction: {
    en: 'Book a demo',
    id: 'Jadwalkan demo',
  },
  discussSite: {
    en: 'Discuss your site',
    id: 'Diskusikan lokasi Anda',
  },
  discussNeeds: {
    en: 'Discuss your needs',
    id: 'Diskusikan kebutuhan Anda',
  },
  learnMore: {
    en: 'Learn more',
    id: 'Pelajari lebih lanjut',
  },
  notAvailable: {
    en: 'Not available',
    id: 'Belum tersedia',
  },
  assetUnavailable: {
    en: 'Asset not available',
    id: 'Aset belum tersedia',
  },
  actualProductUi: {
    en: 'Actual Product UI',
    id: 'UI Produk Aktual',
  },
  demoDataset: {
    en: 'Demo dataset',
    id: 'Dataset demo',
  },
  illustrativeConfiguration: {
    en: 'Illustrative configuration',
    id: 'Konfigurasi ilustratif',
  },
  deploymentDependent: {
    en: 'Deployment-dependent',
    id: 'Bergantung deployment',
  },
  assessmentRequired: {
    en: 'Requires assessment',
    id: 'Memerlukan assessment',
  },
  availableByScope: {
    en: 'Available by approved scope',
    id: 'Tersedia sesuai scope yang disetujui',
  },
} satisfies Record<string, LocalText>

export function switchLocale(value: string, locale: Locale): string {
  const hashIndex = value.indexOf('#')
  const hash = hashIndex >= 0 ? value.slice(hashIndex) : ''
  const withoutHash = hashIndex >= 0 ? value.slice(0, hashIndex) : value
  const queryIndex = withoutHash.indexOf('?')
  const search = queryIndex >= 0 ? withoutHash.slice(queryIndex) : ''
  const pathname = queryIndex >= 0 ? withoutHash.slice(0, queryIndex) : withoutHash
  const segments = pathname.split('/').filter(Boolean)
  if (segments.length === 0) segments.push(locale)
  else if (segments[0] === 'en' || segments[0] === 'id') segments[0] = locale
  else segments.unshift(locale)
  return `/${segments.join('/')}${search}${hash}`
}

export function visibleFaqAnswer(answer: string): string {
  return answer
    .replace(/\s*The current implementation does not yet send the form\./g, '')
    .replace(/\s*Implementasi saat ini belum mengirim form\./g, '')
    .trim()
}
