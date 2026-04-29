'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { ScrollReveal } from './ScrollReveal'
import { extractText } from '@/lib/richtext'

interface FaqAccordionProps {
  dict: Record<string, any>
  faqItems?: any[]
}

export function FaqAccordion({ dict, faqItems: payloadFaqItems }: FaqAccordionProps) {
  const faqItems = payloadFaqItems && payloadFaqItems.length > 0
    ? payloadFaqItems.map((item: any) => ({
        q: typeof item.question === 'string' ? item.question : extractText(item.question),
        a: typeof item.answer === 'string' ? item.answer : extractText(item.answer),
      }))
    : (dict.faqItems || [])

  const [openItems, setOpenItems] = useState<Set<number>>(new Set())

  const toggle = (i: number) => {
    setOpenItems((prev) => {
      const next = new Set(prev)
      next.has(i) ? next.delete(i) : next.add(i)
      return next
    })
  }

  return (
    <section className="bg-bg-surface px-4 py-20 md:py-32" id="faq">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <ScrollReveal>
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">{dict.faq.title}</h2>
          </ScrollReveal>
        </div>
        <div className="mx-auto flex max-w-3xl flex-col gap-2">
          {faqItems.map((item: any, i: number) => {
            const isOpen = openItems.has(i)
            return (
              <ScrollReveal key={i} delay={i * 50}>
                <div className="overflow-hidden rounded-xl border border-white/[0.06] bg-bg-card/60 backdrop-blur-xl">
                  <button
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-[0.9375rem] font-semibold"
                    onClick={() => toggle(i)}
                    aria-expanded={isOpen}
                  >
                    {item.q}
                    <ChevronDown
                      size={18}
                      className={`shrink-0 text-text-muted transition-transform duration-250 ${isOpen ? 'rotate-180' : ''}`}
                    />
                  </button>
                  <div
                    className="grid transition-all duration-300"
                    style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}
                  >
                    <div className="overflow-hidden">
                      <p className="px-5 pb-4 text-[0.9375rem] leading-relaxed text-text-secondary">{item.a}</p>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
