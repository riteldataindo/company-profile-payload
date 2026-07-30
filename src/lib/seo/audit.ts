export type SeoCheckStatus = 'green' | 'amber' | 'red'
export type SeoCheckTier = 'high' | 'medium' | 'info' | 'geo'

export interface SeoCheck {
  name: string
  score: number
  max: number
  status: SeoCheckStatus
  tip: string
  tier: SeoCheckTier
}

export interface SeoAuditContext {
  metaTitle: string | null
  metaDescription: string | null
  imageId: string | null
  ogImageAlt: string | null
  contentImageAlt: string | null
  sourceContent: string | null
  allTitles: string[]
  contentType: 'blog' | 'feature' | 'usecase'
  hasAuthor: boolean
  hasPublishedAt: boolean
  hasExcerpt: boolean
}

export interface SeoAuditResult {
  coverage: number
  score: number
  passed: number
  applicable: number
  checks: SeoCheck[]
}

const suspiciousClaimPatterns: Array<{ pattern: RegExp; label: string }> = [
  { pattern: /\b(?:#1|number one)\b/i, label: 'market-leadership claim' },
  { pattern: /\b\d+(?:\.\d+)?%\s+(?:accuracy|accurate|uptime|increase|reduction|uplift|improvement)\b/i, label: 'quantified performance claim' },
  { pattern: /\b(?:guaranteed?|fully compliant|100%\s+compliant)\b/i, label: 'guarantee or compliance claim' },
  { pattern: /\b(?:SOC\s*2|ISO\s*27001|GDPR compliant)\b/i, label: 'certification or compliance claim' },
  { pattern: /\bROI\s+(?:within|in)\s+\d/i, label: 'time-bound ROI claim' },
  { pattern: /\b\d+\+\s+(?:stores|clients|locations|customers)\b/i, label: 'customer-count claim' },
]

function check(
  name: string,
  status: SeoCheckStatus,
  tip: string,
  tier: SeoCheckTier,
  applicable = true,
): SeoCheck {
  return {
    name,
    score: applicable && status === 'green' ? 1 : 0,
    max: applicable ? 1 : 0,
    status,
    tip,
    tier,
  }
}

function repeatedPhrase(text: string): string | null {
  const words = text.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter(Boolean)
  const counts = new Map<string, number>()
  for (let index = 0; index < words.length - 1; index++) {
    const phrase = `${words[index]} ${words[index + 1]}`
    counts.set(phrase, (counts.get(phrase) || 0) + 1)
  }
  return Array.from(counts).find(([, count]) => count >= 3)?.[0] || null
}

function suspiciousClaim(text: string): string | null {
  return suspiciousClaimPatterns.find(({ pattern }) => pattern.test(text))?.label || null
}

export function calculateCoverage(checks: SeoCheck[]): number {
  const applicable = checks.reduce((total, item) => total + item.max, 0)
  if (applicable === 0) return 0
  const passed = checks.reduce((total, item) => total + item.score, 0)
  return Math.round((passed / applicable) * 100)
}

export function auditSeoContent(context: SeoAuditContext): SeoAuditResult {
  const checks: SeoCheck[] = []
  const title = context.metaTitle?.trim() || ''
  const description = context.metaDescription?.trim() || ''
  const content = context.sourceContent?.trim() || ''

  checks.push(check(
    'Meta Title',
    title ? 'green' : 'red',
    title
      ? `Present (${title.length} characters). Search engines may rewrite or truncate titles based on the result layout.`
      : 'Missing. Add a descriptive, page-specific title.',
    'high',
  ))

  const duplicateCount = title
    ? context.allTitles.filter((candidate) => candidate.trim().toLowerCase() === title.toLowerCase()).length
    : 0
  checks.push(check(
    'Title Unique',
    !title ? 'red' : duplicateCount <= 1 ? 'green' : 'red',
    !title
      ? 'Cannot check uniqueness without a title.'
      : duplicateCount <= 1
        ? 'Unique across the audited CMS items.'
        : `Duplicated across ${duplicateCount} CMS items.`,
    'high',
  ))

  const titleArtifact = /(?:\s{2,}|—\s*—|\.{2,}|\[\d+\])/.test(title)
  const repeatedTitlePhrase = repeatedPhrase(title)
  checks.push(check(
    'Title Readability',
    !title ? 'red' : titleArtifact || repeatedTitlePhrase ? 'amber' : 'green',
    !title
      ? 'Cannot review readability without a title.'
      : repeatedTitlePhrase
        ? `Repeated phrase detected: “${repeatedTitlePhrase}”.`
        : titleArtifact
          ? 'Possible formatting or generation artifact detected.'
          : 'No obvious repetition or generation artifact detected.',
    'high',
  ))

  checks.push(check(
    'Meta Description',
    description ? 'green' : 'red',
    description
      ? `Present (${description.length} characters). Treat it as descriptive preview copy, not a ranking factor or fixed-length requirement.`
      : 'Missing. Add a concise description that accurately summarizes the page.',
    'medium',
  ))

  const descriptionArtifact = /(?:\s{2,}|\.{2,}|\[\d+\])/.test(description)
  checks.push(check(
    'Description Readability',
    !description ? 'red' : descriptionArtifact ? 'amber' : 'green',
    !description
      ? 'Cannot review readability without a description.'
      : descriptionArtifact
        ? 'Possible formatting or generation artifact detected.'
        : 'No obvious formatting artifact detected.',
    'medium',
  ))

  checks.push(check(
    'Social Image',
    context.imageId ? 'green' : 'amber',
    context.imageId
      ? 'A social preview image is configured.'
      : 'No social preview image is configured; shared links may use an inconsistent preview.',
    'high',
  ))

  checks.push(context.imageId
    ? check(
        'Social Image Alt',
        context.ogImageAlt?.trim() ? 'green' : 'amber',
        context.ogImageAlt?.trim()
          ? 'Alt text is present in the Media library.'
          : 'Add meaningful alt text in the Media library.',
        'high',
      )
    : check('Social Image Alt', 'amber', 'Not applicable until a social image is selected.', 'high', false))

  checks.push(context.contentImageAlt === null
    ? check('Content Image Alt', 'green', 'Not applicable: no content image is configured.', 'high', false)
    : check(
        'Content Image Alt',
        context.contentImageAlt.trim() ? 'green' : 'amber',
        context.contentImageAlt.trim()
          ? 'Content image alt text is present.'
          : 'Add meaningful alt text to the content image.',
        'high',
      ))

  checks.push(check(
    'Public Content',
    content ? 'green' : 'red',
    content
      ? `Content is available (${content.split(/\s+/).filter(Boolean).length} words). Review usefulness and accuracy manually; no universal word-count target is applied.`
      : 'No public body content was found.',
    'info',
  ))

  if (context.contentType === 'blog') {
    checks.push(check(
      'Author Attribution',
      context.hasAuthor ? 'green' : 'amber',
      context.hasAuthor ? 'An author is attributed.' : 'Add a real author or accountable editorial team.',
      'medium',
    ))
    checks.push(check(
      'Publication Date',
      context.hasPublishedAt ? 'green' : 'amber',
      context.hasPublishedAt ? 'A publication date is present.' : 'Add a publication date when the article is published.',
      'medium',
    ))
    checks.push(check(
      'Editorial Summary',
      context.hasExcerpt ? 'green' : 'amber',
      context.hasExcerpt ? 'An editorial summary is present.' : 'Add a factual summary for readers and previews.',
      'info',
    ))
  }

  const claimIssue = suspiciousClaim([title, description, content].join(' '))
  checks.push(check(
    'Claim Verification',
    claimIssue ? 'red' : 'green',
    claimIssue
      ? `Potential ${claimIssue} detected. Attach evidence and scope the wording before publication.`
      : 'No high-risk quantified, leadership, certification, or guarantee claim was detected by this basic scan.',
    'geo',
  ))

  const applicable = checks.reduce((total, item) => total + item.max, 0)
  const passed = checks.reduce((total, item) => total + item.score, 0)
  const coverage = calculateCoverage(checks)

  return { coverage, score: coverage, passed, applicable, checks }
}
