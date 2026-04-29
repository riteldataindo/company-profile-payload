'use client'

import { useState } from 'react'
import { ChevronDown, Mail, MessageCircle, Search } from 'lucide-react'
import { ScrollReveal } from '@/components/sections/ScrollReveal'

interface FaqItem {
  question: string
  answer: string
}

interface FaqCategory {
  category: string
  items: FaqItem[]
}

function AccordionItem({
  question,
  answer,
  isOpen,
  onChange,
}: {
  question: string
  answer: string
  isOpen: boolean
  onChange: () => void
}) {
  return (
    <div className="rounded-lg border border-white/[0.06] bg-bg-card/60 backdrop-blur-xl overflow-hidden transition-all duration-250">
      <button
        onClick={onChange}
        className="flex w-full items-center justify-between p-5 text-left hover:bg-bg-surface/30 transition-colors"
      >
        <span className="font-semibold">{question}</span>
        <ChevronDown
          size={20}
          className={`flex-shrink-0 text-primary-500 transition-transform duration-250 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>
      {isOpen && (
        <div className="border-t border-white/[0.06] px-5 py-4">
          <p className="text-sm leading-relaxed text-text-secondary">{answer}</p>
        </div>
      )}
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
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [openItems, setOpenItems] = useState<Set<string>>(new Set())

  const categories = ['All', ...faqData.map((f) => f.category)]

  // Filter FAQ items based on search and category
  const filteredFaqs = faqData.reduce(
    (acc, categoryGroup) => {
      if (selectedCategory !== 'All' && categoryGroup.category !== selectedCategory) {
        return acc
      }

      const filteredItems = categoryGroup.items.filter(
        (item) =>
          searchQuery === '' ||
          item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.answer.toLowerCase().includes(searchQuery.toLowerCase())
      )

      if (filteredItems.length > 0) {
        acc.push({
          ...categoryGroup,
          items: filteredItems,
        })
      }

      return acc
    },
    [] as FaqCategory[]
  )

  const toggleItem = (id: string) => {
    const newOpen = new Set(openItems)
    if (newOpen.has(id)) {
      newOpen.delete(id)
    } else {
      newOpen.add(id)
    }
    setOpenItems(newOpen)
  }

  return (
    <>
      {/* Search and Filter */}
      <div className="mb-12 space-y-4">
        <div className="relative">
          <Search size={18} className="absolute left-4 top-3.5 text-text-muted" />
          <input
            type="text"
            placeholder="Search FAQs..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              setOpenItems(new Set())
            }}
            className="w-full rounded-lg border border-white/[0.06] bg-bg-card/60 py-3 pl-10 pr-4 backdrop-blur-xl outline-none placeholder:text-text-muted focus:border-primary-500/20 focus:ring-1 focus:ring-primary-500/10"
          />
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat)
                setOpenItems(new Set())
              }}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition-all duration-250 ${
                selectedCategory === cat
                  ? 'bg-primary-600 text-white'
                  : 'border border-white/[0.06] bg-bg-card/60 text-text-secondary hover:border-primary-500/20'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* FAQs */}
      {filteredFaqs.length > 0 ? (
        <div className="space-y-8">
          {filteredFaqs.map((categoryGroup) => (
            <div key={categoryGroup.category}>
              <h2 className="mb-4 text-lg font-bold text-primary-400">{categoryGroup.category}</h2>
              <div className="space-y-3">
                {categoryGroup.items.map((item, idx) => {
                  const itemId = `${categoryGroup.category}-${idx}`
                  return (
                    <ScrollReveal key={itemId} delay={idx * 50}>
                      <AccordionItem
                        question={item.question}
                        answer={item.answer}
                        isOpen={openItems.has(itemId)}
                        onChange={() => toggleItem(itemId)}
                      />
                    </ScrollReveal>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-white/[0.06] bg-bg-card/60 p-12 text-center backdrop-blur-xl">
          <p className="text-text-secondary">No FAQs found matching your search. Try different keywords.</p>
        </div>
      )}

      {/* Still Have Questions */}
      <div className="mt-16 grid gap-6 sm:grid-cols-2">
        <ScrollReveal>
          <div className="rounded-2xl border border-white/[0.06] bg-bg-card/60 p-8 text-center backdrop-blur-xl">
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary-500/10 text-primary-500">
              <Mail size={24} />
            </div>
            <h3 className="mb-2 font-semibold">Email Us</h3>
            <p className="mb-4 text-sm text-text-secondary">Send us your question anytime</p>
            <a
              href="mailto:support@smartcounter.id"
              className="inline-flex items-center gap-2 text-primary-500 hover:text-primary-400 font-semibold text-sm"
            >
              support@smartcounter.id
            </a>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={50}>
          <div className="rounded-2xl border border-white/[0.06] bg-bg-card/60 p-8 text-center backdrop-blur-xl">
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary-500/10 text-primary-500">
              <MessageCircle size={24} />
            </div>
            <h3 className="mb-2 font-semibold">WhatsApp</h3>
            <p className="mb-4 text-sm text-text-secondary">Quick response from our team</p>
            <a
              href="https://wa.me/62XXX"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-primary-500 hover:text-primary-400 font-semibold text-sm"
            >
              Chat Now
            </a>
          </div>
        </ScrollReveal>
      </div>
    </>
  )
}
