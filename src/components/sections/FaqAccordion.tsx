'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronDown, ArrowRight } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { getTrustFaq } from '@/lib/i18n/trust-copy'

interface FaqAccordionProps {
  dict: Record<string, any>
  faqItems?: any[]
}

const percentagePattern = new RegExp(`[0-9]+\\s*${String.fromCharCode(37)}`)

function faqText(value: unknown): string {
  if (typeof value === 'string') return value.trim()
  if (!value || typeof value !== 'object') return ''

  const root = (value as { root?: { children?: unknown[] } }).root
  if (!Array.isArray(root?.children)) return ''

  return root.children
    .map((node: any) => {
      if (node?.type === 'text') return typeof node.text === 'string' ? node.text : ''
      return Array.isArray(node?.children)
        ? node.children.map((child: any) => typeof child?.text === 'string' ? child.text : '').join('')
        : ''
    })
    .join('\n')
    .trim()
}

function usablePayloadFaq(item: unknown): item is Record<string, unknown> {
  if (!item || typeof item !== 'object') return false

  const record = item as Record<string, unknown>
  const question = faqText(record.question)
  const answer = faqText(record.answer)
  if (!question || !answer) return false

  const text = `${question} ${answer}`
  return !/placeholder|test fixture|guarantee|guaranteed|absolutely|always|never|1[-–]2\s+business\s+days|immediately|privacy compliant|compliance/i.test(text)
    && !percentagePattern.test(text)
}

export function FaqAccordion({ dict, faqItems: payloadFaqItems }: FaqAccordionProps) {
  const pathname = usePathname()
  const locale = pathname.split('/').filter(Boolean)[0] || 'en'
  const configuredItems = (payloadFaqItems || [])
    .filter(usablePayloadFaq)
    .map((item) => ({
      q: faqText(item.question),
      a: faqText(item.answer),
    }))
  const fallbackItems = getTrustFaq(locale).slice(0, 4).map((item) => ({
    q: item.question,
    a: item.answer,
  }))
  const faqItems = configuredItems.length > 0 ? configuredItems : fallbackItems
  const [openItems, setOpenItems] = useState<Set<number>>(new Set())

  const toggle = (index: number) => {
    setOpenItems((current) => {
      const next = new Set(current)
      if (next.has(index)) next.delete(index)
      else next.add(index)
      return next
    })
  }

  return (
    <section className="bg-bg-surface px-4 py-20 md:py-32" id="faq">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">{dict.faq.title}</h2>
        </div>
        <div className="mx-auto flex max-w-3xl flex-col gap-3">
          {faqItems.map((item: any, index: number) => {
            const isOpen = openItems.has(index)
            const panelId = `homepage-faq-answer-${index}`

            return (
              <div key={panelId} className="overflow-hidden rounded-xl border border-border-subtle bg-bg-card">
                <button
                  type="button"
                  className="group flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-[0.9375rem] font-semibold transition-colors hover:bg-bg-surface focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-primary-600"
                  onClick={() => toggle(index)}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                >
                  <span>{item.q}</span>
                  <ChevronDown
                    size={18}
                    className={`shrink-0 text-primary-600 transition-transform duration-200 group-focus-visible:transition-none ${isOpen ? 'rotate-180' : ''}`}
                    aria-hidden="true"
                  />
                </button>
                <div
                  id={panelId}
                  role="region"
                  aria-label={item.q}
                  hidden={!isOpen}
                  className="border-t border-border-subtle px-5 py-4"
                >
                  <p className="text-[0.9375rem] leading-relaxed text-text-secondary">{item.a}</p>
                </div>
              </div>
            )
          })}
        </div>
        <div className="mx-auto mt-8 flex max-w-3xl flex-wrap gap-4 text-sm font-semibold">
          <Link
            href={`/${locale}/deployment`}
            className="inline-flex items-center gap-2 text-primary-600 underline decoration-primary-600/40 underline-offset-4 hover:text-primary-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
          >
            {locale === 'id' ? 'Baca Deployment' : 'Read Deployment'}
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
          <Link
            href={`/${locale}/privacy`}
            className="text-primary-600 underline decoration-primary-600/40 underline-offset-4 hover:text-primary-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
          >
            {locale === 'id' ? 'Baca Privasi' : 'Read Privacy'}
          </Link>
        </div>
      </div>
    </section>
  )
}
