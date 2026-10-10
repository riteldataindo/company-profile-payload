'use client'

import { useState, type MouseEvent } from 'react'
import Link from 'next/link'
import { ChevronDown, ArrowRight } from 'lucide-react'

interface FaqItem {
  question: string
  answer: string
}
interface FaqCategory {
  category: string
  items: FaqItem[]
}

function faqId(category: string, categoryIndex: number, itemIndex: number) {
  const slug = category.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'group'
  return `faq-answer-${slug}-${categoryIndex}-${itemIndex}`
}

function AccordionItem({
  question,
  answer,
  panelId,
  isOpen,
  onChange,
  animate,
}: {
  question: string
  answer: string
  panelId: string
  isOpen: boolean
  onChange: (event: MouseEvent<HTMLButtonElement>) => void
  animate: boolean
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-border-subtle bg-bg-card">
      <button
        type="button"
        onClick={onChange}
        aria-expanded={isOpen}
        aria-controls={panelId}
        className="group flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-base font-semibold transition-colors hover:bg-bg-surface focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-primary-600"
      >
        <span>{question}</span>
        <ChevronDown
          size={19}
          className={`faq-toggle__icon shrink-0 text-primary-600 transition-transform duration-[180ms] ease-out motion-reduce:duration-0 ${isOpen ? 'rotate-180' : ''}`}
          aria-hidden="true"
        />
      </button>
      <div
        id={panelId}
        role="region"
        aria-label={question}
        aria-hidden={!isOpen}
        inert={!isOpen}
        data-animate={animate ? 'true' : 'false'}
        className={`grid transition-[grid-template-rows] duration-[220ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:duration-0 ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
      >
        <div className="min-h-0 overflow-hidden">
          <div className="border-t border-border-subtle px-5 py-4">
            <p className="max-w-3xl text-sm leading-relaxed text-text-secondary">{answer}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export function FaqClient({
  faqData,
  locale,
}: {
  faqData: FaqCategory[]
  locale: string
}) {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set())
  const [animatePanels, setAnimatePanels] = useState(false)

  const toggleItem = (id: string, animate: boolean) => {
    setAnimatePanels(animate)
    setOpenItems((current) => {
      const next = new Set(current)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const isId = locale === 'id'

  return (
    <>
      <div className="space-y-10">
        {faqData.map((categoryGroup, categoryIndex) => (
          <section key={categoryGroup.category} aria-labelledby={`faq-category-${categoryIndex}`}>
            <h2 id={`faq-category-${categoryIndex}`} className="mb-4 text-lg font-bold text-primary-600">
              {categoryGroup.category}
            </h2>
            <div className="space-y-3">
              {categoryGroup.items.map((item, itemIndex) => {
                const panelId = faqId(categoryGroup.category, categoryIndex, itemIndex)
                return (
                  <AccordionItem
                    key={panelId}
                    question={item.question}
                    answer={item.answer}
                    panelId={panelId}
                    isOpen={openItems.has(panelId)}
                    animate={animatePanels}
                    onChange={(event) => toggleItem(panelId, event.detail > 0)}
                  />
                )
              })}
            </div>
          </section>
        ))}
      </div>

      <aside className="mt-14 rounded-xl border border-border-default bg-bg-surface p-6 md:p-8" aria-labelledby="faq-next-step">
        <h2 id="faq-next-step" className="text-xl font-bold tracking-tight">
          {isId ? 'Masih punya pertanyaan?' : 'Still have a question?'}
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-text-secondary">
          {isId
            ? 'Bawa konteks lokasi, kamera, dan keputusan operasional Anda ke diskusi site-fit. Tim dapat menilai kebutuhan teknis dan batas data yang relevan.'
            : 'Bring your site context, cameras, and operating decision to a site-fit discussion. The team can assess the relevant technical requirements and data boundary.'}
        </p>
        <div className="mt-5 flex flex-wrap items-center gap-4 text-sm font-semibold">
          <Link
            href={`/${locale}/demo`}
            className="home-button home-button--primary"
          >
            {isId ? 'Minta demo site-fit' : 'Request a site-fit demo'}
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
          <Link
            href={`/${locale}/contact`}
            className="text-primary-600 underline decoration-primary-600/40 underline-offset-4 hover:text-primary-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
          >
            {isId ? 'Hubungi tim' : 'Contact the team'}
          </Link>
        </div>
      </aside>
    </>
  )
}
