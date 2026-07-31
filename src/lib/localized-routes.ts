import {
  indexableLocales,
  type IndexableLocale,
  type Locale,
} from '@/lib/i18n/config'

export type LocalizedSlugs = Partial<Record<Locale, string>>

export function canonicalSlugForLocale(
  slugs: LocalizedSlugs,
  locale: Locale,
): string | null {
  return slugs[locale] || slugs.en || null
}

export function localizedSectionPaths(
  section: 'features' | 'use-cases' | 'blog',
  slugs: LocalizedSlugs,
): Partial<Record<IndexableLocale, string>> {
  return Object.fromEntries(
    indexableLocales.flatMap((locale) => {
      const slug = slugs[locale]
      return slug ? [[locale, `/${section}/${slug}`]] : []
    }),
  )
}

export function mapDocumentsBySourceSlug<
  T extends { id: number | string; slug?: string | null },
>(
  sourceDocuments: T[],
  localizedDocuments: T[],
): Map<string, T> {
  const localizedById = new Map(
    localizedDocuments.map(document => [String(document.id), document]),
  )

  return new Map(
    sourceDocuments.flatMap((sourceDocument) => {
      const localizedDocument = localizedById.get(String(sourceDocument.id))
      return sourceDocument.slug && localizedDocument
        ? [[sourceDocument.slug, localizedDocument] as const]
        : []
    }),
  )
}
