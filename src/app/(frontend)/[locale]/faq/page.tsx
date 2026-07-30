import type { Locale } from '@/lib/i18n/config'
import { isValidLocale } from '@/lib/i18n/config'
import { getDictionary } from '@/lib/i18n/getDictionary'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { buildMetadata } from '@/lib/seo/metadata'
import { JsonLd } from '@/components/seo/JsonLd'
import { breadcrumbSchema } from '@/lib/seo/jsonld'
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
        q: 'How is counting performance evaluated?',
        a: 'Counting performance depends on camera position, lighting, entrance layout, and scene conditions. The deployment team reviews these conditions and should validate results against a representative manual sample.',
      },
      {
        q: 'Do you collect personal data (PII)?',
        a: 'SmartCounter is designed to produce aggregate visitor analytics. Data handling and retention requirements should be confirmed for each deployment and documented in the applicable agreement.',
      },
      {
        q: 'How many locations can I track with SmartCounter?',
        a: 'SmartCounter supports both single-location and multi-location reporting. The practical scope depends on the selected package and deployment architecture.',
      },
    ],
  },
  {
    category: 'Installation',
    items: [
      {
        q: 'What hardware do I need?',
        a: 'Compatibility depends on the camera stream, resolution, placement, network, and required analytics. The team assesses the existing setup before confirming a deployment design.',
      },
      {
        q: 'How long does installation take?',
        a: 'Installation time depends on store size, entrance count, camera readiness, network access, and calibration requirements. A timeline is provided after assessment.',
      },
      {
        q: 'Do I need internet for SmartCounter?',
        a: 'Network requirements depend on the agreed deployment architecture and dashboard access requirements. They are reviewed during the technical assessment.',
      },
      {
        q: 'What if I have an older CCTV system?',
        a: 'Older systems may still be usable if they provide a compatible, stable video stream. Camera and recorder compatibility must be checked before deployment.',
      },
    ],
  },
  {
    category: 'Analytics',
    items: [
      {
        q: 'How real-time is the data?',
        a: 'Update frequency depends on the analytic, processing architecture, and network conditions. The expected interval is documented for the selected deployment.',
      },
      {
        q: 'How far back is historical data available?',
        a: 'Historical retention depends on the package and the data-retention terms agreed for the deployment.',
      },
      {
        q: 'Can I export data?',
        a: 'Export, scheduled reporting, and integration options depend on the selected package. Confirm the required format during the demo.',
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
        a: 'Pricing depends on the package, analytics scope, camera requirements, and number of locations. Contact the team for a deployment-specific quote.',
      },
      {
        q: 'Are there setup fees?',
        a: 'Setup, hardware, subscription, and support terms are listed in the commercial proposal for the deployment.',
      },
      {
        q: 'Can I pay monthly or annually?',
        a: 'Available billing terms are provided in the current commercial proposal.',
      },
      {
        q: 'What if I want to cancel?',
        a: 'Cancellation and renewal terms follow the signed service agreement.',
      },
    ],
  },
  {
    category: 'Technical',
    items: [
      {
        q: 'What if my store has poor lighting?',
        a: 'Poor or changing lighting can affect computer-vision performance. Camera placement, exposure, and scene lighting are reviewed during assessment and calibration.',
      },
      {
        q: 'How many entrances can I monitor?',
        a: 'Multiple entrances can be configured and aggregated. The supported scope depends on the deployment design and package.',
      },
      {
        q: 'What happens if my internet goes down?',
        a: 'Offline behavior depends on whether processing is local, cloud-based, or hybrid. Recovery and synchronization behavior is documented for the selected architecture.',
      },
      {
        q: 'How secure is my data?',
        a: 'Security controls, hosting, access, retention, and deletion requirements should be reviewed during technical scoping and recorded in the applicable agreement.',
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

  return (
    <section className="px-4 py-20 md:py-32">
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
