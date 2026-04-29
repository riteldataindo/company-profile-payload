'use client'

import type { Locale } from '@/lib/i18n/config'
import { isValidLocale } from '@/lib/i18n/config'
import { getDictionary } from '@/lib/i18n/getDictionary'
import { notFound } from 'next/navigation'
import { useEffect, useState } from 'react'
import { ChevronDown, Mail, MessageCircle, Search } from 'lucide-react'
import { ScrollReveal } from '@/components/sections/ScrollReveal'

const faqData = [
  {
    category: 'General',
    items: [
      {
        q: 'What is SmartCounter?',
        a: 'SmartCounter is an AI-powered people counting system that uses CCTV cameras to provide real-time visitor analytics, heatmaps, demographics, and conversion rate tracking for retail stores, shopping malls, and other retail environments.',
      },
      {
        q: 'How does the 99.9% accuracy work?',
        a: 'Our computer vision AI model is trained on millions of hours of CCTV footage. It uses advanced object detection to count people entering and exiting, with validation against ground truth data from multiple retail environments.',
      },
      {
        q: 'Do you collect personal data (PII)?',
        a: 'No. SmartCounter uses computer vision to count people and estimate demographics (age, gender) without storing any personally identifiable information. Fully GDPR and Indonesia privacy law compliant.',
      },
      {
        q: 'How many locations can I track with SmartCounter?',
        a: 'With SmartCounter, you can track unlimited locations. The dashboard scales from single-store boutiques to 500+ location chains.',
      },
    ],
  },
  {
    category: 'Installation',
    items: [
      {
        q: 'What hardware do I need?',
        a: 'SmartCounter works with any existing CCTV camera (IP cameras, analog cameras via converters, etc.). We also offer compatible hardware packages. Our team will assess your existing setup.',
      },
      {
        q: 'How long does installation take?',
        a: 'Installation typically takes 4-8 hours per location depending on your store size and layout. Our technicians handle everything, including camera positioning, network setup, and dashboard training.',
      },
      {
        q: 'Do I need internet for SmartCounter?',
        a: 'Yes, an internet connection is required for real-time dashboards and cloud analytics. We support connections as low as 2 Mbps. On-premise analytics are available for enterprise customers.',
      },
      {
        q: 'What if I have an older CCTV system?',
        a: 'Most CCTV systems from the last 10 years are compatible. We assess your cameras free during consultation. If upgrades are needed, we offer affordable options.',
      },
    ],
  },
  {
    category: 'Analytics',
    items: [
      {
        q: 'How real-time is the data?',
        a: 'People counting data updates every 1-5 seconds. All other analytics (heatmaps, demographics, conversion rates) update in real-time on your dashboard.',
      },
      {
        q: 'How far back is historical data available?',
        a: 'All SmartCounter packages include 24 months of historical data. Enterprise customers can extend to unlimited history.',
      },
      {
        q: 'Can I export data?',
        a: 'Yes. All packages allow CSV, PDF, and PNG exports. Premium includes scheduled automated reports. Enterprise includes API access for custom integrations.',
      },
      {
        q: 'How do you calculate conversion rate?',
        a: 'Conversion rate is calculated by connecting CCTV people count data with your POS system transaction data: (Total Transactions / Total Visitors) × 100. No POS connection required for basic analytics.',
      },
    ],
  },
  {
    category: 'Pricing',
    items: [
      {
        q: 'What is the cost of SmartCounter?',
        a: 'Pricing depends on your package (Basic, Add-On, Premium) and number of locations. Contact us for a custom quote. All packages include hardware and installation.',
      },
      {
        q: 'Are there setup fees?',
        a: 'No hidden fees. Our pricing is transparent: monthly/annual subscription + hardware (one-time). Enterprise customers may have custom terms.',
      },
      {
        q: 'Can I pay monthly or annually?',
        a: 'Both options available. Annual subscriptions include a 15% discount.',
      },
      {
        q: 'What if I want to cancel?',
        a: 'Month-to-month subscriptions can be cancelled anytime with 30 days notice. Annual plans include early cancellation options.',
      },
    ],
  },
  {
    category: 'Technical',
    items: [
      {
        q: 'What if my store has poor lighting?',
        a: 'SmartCounter works in all lighting conditions, including dim environments. Our AI is trained on diverse lighting scenarios. Very dark environments (less than 20 lux) may reduce accuracy slightly.',
      },
      {
        q: 'How many entrances can I monitor?',
        a: 'Unlimited. You can set up separate counters for each entrance and the system will automatically sum them into total traffic.',
      },
      {
        q: 'What happens if my internet goes down?',
        a: 'The camera continues counting locally. Data syncs to the cloud automatically when connection is restored. No data is lost.',
      },
      {
        q: 'How secure is my data?',
        a: 'We use enterprise-grade encryption (AES-256), secure cloud infrastructure (AWS), and regular security audits. Compliance: SOC 2, GDPR, Indonesia DPA.',
      },
    ],
  },
]

interface FaqItem {
  q: string
  a: string
}

interface FaqCategory {
  category: string
  items: FaqItem[]
}

function AccordionItem({ question, answer, isOpen, onChange }: { question: string; answer: string; isOpen: boolean; onChange: () => void }) {
  return (
    <div className="rounded-lg border border-white/[0.06] bg-bg-card/60 backdrop-blur-xl overflow-hidden transition-all duration-250">
      <button
        onClick={onChange}
        className="flex w-full items-center justify-between p-5 text-left hover:bg-bg-surface/30 transition-colors"
      >
        <span className="font-semibold">{question}</span>
        <ChevronDown
          size={20}
          className={`flex-shrink-0 text-primary-500 transition-transform duration-250 ${isOpen ? 'rotate-180' : ''}`}
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

async function FaqPageContent({ locale }: { locale: string }) {
  const dict = await getDictionary(locale as Locale)

  return (
    <section className="px-4 py-20 md:py-32">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <ScrollReveal>
            <h1 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl">
              {dict.faq.title}
            </h1>
          </ScrollReveal>
          <ScrollReveal delay={100}>
            <p className="mx-auto max-w-2xl text-lg text-text-secondary">
              Find answers to common questions about SmartCounter people counting and CCTV analytics.
            </p>
          </ScrollReveal>
        </div>

        {/* Client Component */}
        <FaqClient faqData={faqData} locale={locale} />
      </div>
    </section>
  )
}

function FaqClient({ faqData, locale }: { faqData: FaqCategory[]; locale: string }) {
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
          item.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.a.toLowerCase().includes(searchQuery.toLowerCase()),
      )

      if (filteredItems.length > 0) {
        acc.push({
          ...categoryGroup,
          items: filteredItems,
        })
      }

      return acc
    },
    [] as FaqCategory[],
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
              setOpenItems(new Set()) // Reset open items on search
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
                setOpenItems(new Set()) // Reset open items on category change
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
                        question={item.q}
                        answer={item.a}
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
              href="https://wa.me/62XXX" // Replace with actual WhatsApp number
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

export default async function FaqPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!isValidLocale(locale)) notFound()

  return <FaqPageContent locale={locale} />
}
