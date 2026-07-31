export function extractText(richText: any): string {
  if (!richText) return ''
  if (typeof richText === 'string') return richText

  const root = richText?.root
  if (!root?.children) return ''

  return root.children
    .map((node: any) => extractNodeText(node))
    .filter(Boolean)
    .join('\n')
}

function extractNodeText(node: any): string {
  if (!node) return ''
  if (node.type === 'text') return node.text || ''
  if (node.children) {
    return node.children.map((child: any) => extractNodeText(child)).join('')
  }
  return ''
}

export function extractParagraphs(richText: any): string[] {
  if (!richText) return []
  if (typeof richText === 'string') return [richText]

  const root = richText?.root
  if (!root?.children) return []

  return root.children
    .map((node: any) => {
      if (node.children) {
        return node.children.map((child: any) => extractNodeText(child)).join('')
      }
      return ''
    })
    .filter(Boolean)
}

export type RichTextHeading = {
  id: string
  title: string
  level: number
}

export function slugifyHeading(value: string): string {
  return value
    .normalize('NFKD')
    .toLocaleLowerCase()
    .replace(/[^\p{Letter}\p{Number}]+/gu, '-')
    .replace(/^-+|-+$/g, '')
    || 'section'
}

export function extractRichTextHeadings(richText: any): RichTextHeading[] {
  const children = richText?.root?.children
  if (!Array.isArray(children)) return []

  const counts = new Map<string, number>()
  return children.flatMap((node: any) => {
    if (node?.type !== 'heading') return []
    const title = extractNodeText(node).trim()
    if (!title) return []

    const baseId = slugifyHeading(title)
    const count = (counts.get(baseId) || 0) + 1
    counts.set(baseId, count)

    return [{
      id: count === 1 ? baseId : `${baseId}-${count}`,
      title,
      level: Number(String(node.tag || 'h2').slice(1)) || 2,
    }]
  })
}

export function safeRichTextHref(value: unknown): string | null {
  if (typeof value !== 'string') return null
  const href = value.trim()
  if (
    href.startsWith('/')
    || href.startsWith('#')
    || href.startsWith('mailto:')
    || href.startsWith('tel:')
  ) {
    return href
  }

  try {
    const parsed = new URL(href)
    return parsed.protocol === 'http:' || parsed.protocol === 'https:'
      ? parsed.toString()
      : null
  } catch {
    return null
  }
}

export function localizedPublicHref(
  value: unknown,
  locale: string,
  fallback: string,
): string {
  const href = safeRichTextHref(value)
  if (!href) return fallback
  if (!href.startsWith('/') || href.startsWith('//')) return href

  const firstSegment = href.split('/')[1]
  if (locales.some(item => item === firstSegment)) return href
  return href === '/' ? `/${locale}` : `/${locale}${href}`
}
import { locales } from '@/lib/i18n/config'
