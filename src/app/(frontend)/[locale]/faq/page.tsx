import type { Locale } from '@/lib/i18n/config'
import { isValidLocale } from '@/lib/i18n/config'
import { getDictionary } from '@/lib/i18n/getDictionary'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { buildMetadata } from '@/lib/seo/metadata'
import { JsonLd } from '@/components/seo/JsonLd'
import { faqPageSchema, breadcrumbSchema } from '@/lib/seo/jsonld'
import { getFaqItems } from '@/lib/data'
import { FaqClient } from '@/components/faq/FaqClient'
import { ScrollReveal } from '@/components/sections/ScrollReveal'
import { extractText } from '@/lib/richtext'

const fallbackFaqData = [
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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  return buildMetadata({
    title: 'FAQ — SmartCounter CCTV Analytics Questions',
    description: 'Frequently asked questions about SmartCounter people counting, installation, analytics, pricing, and technical details.',
    locale,
    path: '/faq',
  })
}

interface FaqItem {
  question: string
  answer: string
}

interface FaqCategory {
  category: string
  items: FaqItem[]
}

export default async function FaqPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!isValidLocale(locale)) notFound()

  const dict = await getDictionary(locale as Locale)
  const payloadFaqItems = await getFaqItems(locale)

  // Group Payload items by category, or use fallback
  let faqData: FaqCategory[] = []

  if (payloadFaqItems.length > 0) {
    const grouped = payloadFaqItems.reduce((acc: Record<string, FaqItem[]>, item: any) => {
      const category = item.category || 'General'
      if (!acc[category]) acc[category] = []
      acc[category].push({
        question: typeof item.question === 'string' ? item.question : extractText(item.question),
        answer: typeof item.answer === 'string' ? item.answer : extractText(item.answer),
      })
      return acc
    }, {})

    faqData = Object.entries(grouped).map(([category, items]) => ({
      category,
      items,
    }))
  } else {
    // Convert fallback format to match FaqCategory interface
    faqData = (fallbackFaqData as any[]).map((cat: any) => ({
      category: cat.category,
      items: cat.items.map((item: any) => ({
        question: item.q,
        answer: item.a,
      })),
    }))
  }

  const allFaqItems = faqData.flatMap((cat) =>
    cat.items.map((item) => ({ question: item.question, answer: item.answer }))
  )

  return (
    <section className="px-4 py-20 md:py-32">
      <JsonLd data={faqPageSchema(allFaqItems)} />
      <JsonLd data={breadcrumbSchema([
        { name: 'Home', url: `/${locale}` },
        { name: 'FAQ', url: `/${locale}/faq` },
      ])} />
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
