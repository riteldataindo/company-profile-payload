import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { FaqClient } from '@/components/faq/FaqClient'
import { JsonLd } from '@/components/seo/JsonLd'
import { getFaqItems } from '@/lib/data'
import { extractText } from '@/lib/richtext'
import { isValidLocale } from '@/lib/i18n/config'
import { getTrustFaq } from '@/lib/i18n/trust-copy'
import { breadcrumbSchema } from '@/lib/seo/jsonld'
import { buildMetadata } from '@/lib/seo/metadata'

interface FaqItem {
  question: string
  answer: string
}

interface FaqCategory {
  category: string
  items: FaqItem[]
}

const percentagePattern = new RegExp(`[0-9]+\\s*${String.fromCharCode(37)}`)

function toFaqText(value: unknown): string {
  return (typeof value === 'string' ? value : extractText(value)).trim()
}

function isUsableFaqItem(item: unknown): item is Record<string, unknown> {
  if (!item || typeof item !== 'object') return false

  const record = item as Record<string, unknown>
  const question = toFaqText(record.question)
  const answer = toFaqText(record.answer)
  if (!question || !answer) return false

  const text = `${question} ${answer}`
  return !/placeholder|test fixture|guarantee|guaranteed|absolutely|always|never|1[-–]2\s+business\s+days|immediately/i.test(text)
    && !percentagePattern.test(text)
}

function fallbackFaq(locale: string): FaqCategory[] {
  const groups = new Map<string, FaqItem[]>()

  for (const item of getTrustFaq(locale)) {
    const items = groups.get(item.category) || []
    items.push({ question: item.question, answer: item.answer })
    groups.set(item.category, items)
  }

  return Array.from(groups, ([category, items]) => ({ category, items }))
}

function payloadFaq(locale: string, records: unknown[]): FaqCategory[] {
  const grouped = new Map<string, FaqItem[]>()

  for (const record of records) {
    if (!isUsableFaqItem(record)) continue

    const categoryValue = toFaqText(record.category)
    const category = categoryValue || (locale === 'id' ? 'Umum' : 'General')
    const items = grouped.get(category) || []
    items.push({
      question: toFaqText(record.question),
      answer: toFaqText(record.answer),
    })
    grouped.set(category, items)
  }

  return Array.from(grouped, ([category, items]) => ({ category, items }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const isId = locale === 'id'

  return buildMetadata({
    title: isId ? 'FAQ — Pertanyaan evaluasi SmartCounter' : 'FAQ — SmartCounter evaluation questions',
    description: isId
      ? 'Jawaban hati-hati tentang validasi, kompatibilitas, deployment, integrasi, privasi, dan dukungan SmartCounter.'
      : 'Cautious answers about SmartCounter validation, compatibility, deployment, integration, privacy, and support.',
    locale,
    path: '/faq',
  })
}

export default async function FaqPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!isValidLocale(locale)) notFound()

  const payloadItems = await getFaqItems(locale)
  const configuredFaq = payloadFaq(locale, payloadItems)
  const faqData = configuredFaq.length > 0 ? configuredFaq : fallbackFaq(locale)
  const isId = locale === 'id'

  return (
    <section className="px-4 pt-28 pb-16 md:pt-32 md:pb-24">
      <JsonLd data={breadcrumbSchema([
        { name: 'Home', url: `/${locale}` },
        { name: 'FAQ', url: `/${locale}/faq` },
      ])} />
      <div className="mx-auto max-w-4xl">
        <header className="max-w-3xl">
          <p className="mb-4 font-mono text-xs font-semibold uppercase tracking-[0.2em] text-primary-600">
            FAQ
          </p>
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
            {isId ? 'Jawaban untuk evaluasi SmartCounter' : 'Answers for your SmartCounter evaluation'}
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-text-secondary">
            {isId
              ? 'Mulai dari validasi dan kompatibilitas, lalu tinjau batas deployment serta data sebelum meminta diskusi site-fit.'
              : 'Start with validation and compatibility, then review deployment and data boundaries before requesting a site-fit discussion.'}
          </p>
          <nav className="mt-6 flex flex-wrap gap-4 text-sm font-semibold" aria-label={isId ? 'Tautan ke informasi kepercayaan' : 'Trust information links'}>
            <a
              href={`/${locale}/deployment`}
              className="text-primary-600 underline decoration-primary-600/40 underline-offset-4 hover:text-primary-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
            >
              {isId ? 'Baca Deployment' : 'Read Deployment'}
            </a>
            <a
              href={`/${locale}/privacy`}
              className="text-primary-600 underline decoration-primary-600/40 underline-offset-4 hover:text-primary-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
            >
              {isId ? 'Baca Privasi' : 'Read Privacy'}
            </a>
          </nav>
        </header>

        <div className="mt-12">
          <FaqClient faqData={faqData} locale={locale} />
        </div>
      </div>
    </section>
  )
}
