import {
  fallbackCapabilities,
  fallbackFaq,
  fallbackGuides,
  fallbackPackages,
  type ProfileCapability,
  type ProfileFaqGroup,
  type ProfileGuide,
  type ProfileLocale,
  type ProfilePackage,
} from './fallback'

export type {
  ProfileCapability,
  ProfileFaqGroup,
  ProfileGuide,
  ProfileLocale,
  ProfilePackage,
}

export type PackageView = ProfilePackage
export type CapabilityView = ProfileCapability
export type GuideView = ProfileGuide
export type FaqGroupView = ProfileFaqGroup

export type ProfileContent = {
  packages: ProfilePackage[]
  capabilities: ProfileCapability[]
  guides: ProfileGuide[]
  faq: ProfileFaqGroup[]
}

export {
  fallbackCapabilities,
  fallbackFaq,
  fallbackGuides,
  fallbackPackages,
}

export type PackageDoc = {
  name?: unknown
  slug?: unknown
  description?: unknown
  features?: Array<{ featureText?: unknown; included?: unknown }> | null
  isFeatured?: unknown
  sortOrder?: unknown
  ctaText?: unknown
}

export type GuideDoc = {
  title?: unknown
  slug?: unknown
  excerpt?: unknown
  content?: unknown
}

export type FaqDoc = {
  question?: unknown
  answer?: unknown
  category?: unknown
  sortOrder?: unknown
}

export type CapabilityDoc = {
  name?: unknown
  shortDescription?: unknown
  sortOrder?: unknown
  productTruth?: {
    solutionType?: unknown
    publicAvailability?: unknown
    unitAndTimeWindow?: unknown
    decisionSupported?: unknown
    inputAndPrerequisites?: unknown
    limitationsAndValidation?: unknown
  } | null
}

const packageStatuses = ['deployment', 'assessment', 'scope'] as const
type PackageStatus = (typeof packageStatuses)[number]

function text(value: unknown): string {
  return typeof value === 'string' ? value.trim() : ''
}

function sortNumber(value: unknown): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : 0
}

function nodeText(node: unknown): string {
  if (!node || typeof node !== 'object') return ''
  const record = node as { text?: unknown; children?: unknown[] }
  const own = typeof record.text === 'string' ? record.text : ''
  const nested = Array.isArray(record.children) ? record.children.map(nodeText).join('') : ''
  return `${own}${nested}`
}

function plainText(value: unknown): string {
  if (typeof value === 'string') return value.trim()
  if (!value || typeof value !== 'object') return ''
  const children = (value as { root?: { children?: unknown[] } }).root?.children
  if (!Array.isArray(children)) return ''
  return children.map(nodeText).map((line) => line.trim()).filter(Boolean).join('\n').trim()
}

function sliceText(value: string, max = 180): string {
  if (value.length <= max) return value
  return value.slice(0, max).trim()
}

function isPackageStatus(value: string): value is PackageStatus {
  return packageStatuses.some((status) => status === value)
}

// Slug suffix `--deployment|--assessment|--scope` wins. Featured tiers are assessment.
function packageStatus(doc: PackageDoc): PackageStatus {
  const suffix = text(doc.slug).match(/--(deployment|assessment|scope)$/)?.[1] ?? ''
  if (isPackageStatus(suffix)) return suffix
  return doc.isFeatured === true ? 'assessment' : 'scope'
}

function packageLabel(doc: PackageDoc, locale: ProfileLocale): string {
  const cta = text(doc.ctaText)
  if (cta && cta !== 'Contact Us') return cta
  const known = fallbackPackages(locale).find((item) => item.name === text(doc.name))
  if (known) return known.label
  return cta || text(doc.name)
}

function bySortOrder<T extends { sortOrder?: unknown }>(docs: readonly T[]): T[] {
  return docs
    .map((doc, index) => ({ doc, index }))
    .sort((left, right) => sortNumber(left.doc.sortOrder) - sortNumber(right.doc.sortOrder) || left.index - right.index)
    .map(({ doc }) => doc)
}

export function mapPackages(docs: readonly PackageDoc[], locale: ProfileLocale): ProfilePackage[] {
  const usable = (Array.isArray(docs) ? docs : []).filter((doc) => text(doc?.name))
  if (usable.length === 0) return fallbackPackages(locale)
  return bySortOrder(usable).map((doc) => ({
    name: text(doc.name),
    label: packageLabel(doc, locale),
    body: text(doc.description),
    items: (doc.features ?? []).flatMap((item) => {
      if (!item || item.included === false) return []
      const line = text(item.featureText)
      return line ? [line] : []
    }),
    status: packageStatus(doc),
  }))
}

export function mapGuides(docs: readonly GuideDoc[], locale: ProfileLocale): ProfileGuide[] {
  const usable = (Array.isArray(docs) ? docs : []).filter((doc) => text(doc?.title) && text(doc?.slug))
  if (usable.length === 0) return fallbackGuides(locale)
  return usable.map((doc) => ({
    slug: text(doc.slug),
    title: text(doc.title),
    description: text(doc.excerpt) || sliceText(plainText(doc.content)),
  }))
}

export function mapFaq(docs: readonly FaqDoc[], locale: ProfileLocale): ProfileFaqGroup[] {
  const usable = (Array.isArray(docs) ? docs : []).filter((doc) => text(doc?.question) && plainText(doc?.answer))
  if (usable.length === 0) return fallbackFaq(locale)
  const groups: ProfileFaqGroup[] = []
  const index = new Map<string, ProfileFaqGroup>()
  for (const doc of bySortOrder(usable)) {
    const title = text(doc.category) || 'General'
    let group = index.get(title)
    if (!group) {
      group = { title, items: [] }
      index.set(title, group)
      groups.push(group)
    }
    group.items.push({
      question: text(doc.question),
      answer: plainText(doc.answer),
    })
  }
  return groups
}

export function mapCapabilities(docs: readonly CapabilityDoc[], locale: ProfileLocale): ProfileCapability[] {
  const usable = (Array.isArray(docs) ? docs : []).filter((doc) => text(doc?.name))
  if (usable.length === 0) return fallbackCapabilities(locale)
  return bySortOrder(usable).map((doc) => {
    const truth = doc.productTruth
    return {
      group: text(truth?.solutionType) || 'Capabilities',
      question: text(truth?.decisionSupported),
      name: text(doc.name),
      definition: text(doc.shortDescription),
      unit: text(truth?.unitAndTimeWindow),
      decision: text(truth?.decisionSupported),
      prerequisite: text(truth?.inputAndPrerequisites),
      limitation: text(truth?.limitationsAndValidation),
      status: text(truth?.publicAvailability),
    }
  })
}

export async function loadProfileContent(locale: ProfileLocale): Promise<ProfileContent> {
  const { getPayload } = await import('../payload')
  const payload = await getPayload()
  const shared = {
    locale,
    fallbackLocale: false,
    depth: 0,
    limit: 100,
    pagination: false,
    overrideAccess: true,
  } as const

  const [packages, features, guides, faq] = await Promise.all([
    payload.find({
      ...shared,
      collection: 'pricing-tiers',
      sort: 'sortOrder',
      where: { isVisible: { equals: true } },
    }),
    payload.find({
      ...shared,
      collection: 'features',
      sort: 'sortOrder',
      where: {
        and: [
          { isVisible: { equals: true } },
          { publiclyApproved: { equals: true } },
        ],
      },
    }),
    payload.find({
      ...shared,
      collection: 'blog-posts',
      sort: '-publishedAt',
      where: {
        and: [
          { status: { equals: 'published' } },
          { isVisible: { equals: true } },
        ],
      },
    }),
    payload.find({
      ...shared,
      collection: 'faq-items',
      sort: 'sortOrder',
      where: {
        and: [
          { isVisible: { equals: true } },
          { publiclyApproved: { equals: true } },
        ],
      },
    }),
  ])

  return {
    packages: mapPackages(packages.docs, locale),
    capabilities: mapCapabilities(features.docs, locale),
    guides: mapGuides(guides.docs, locale),
    faq: mapFaq(faq.docs, locale),
  }
}
