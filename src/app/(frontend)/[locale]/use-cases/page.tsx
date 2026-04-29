import type { Locale } from '@/lib/i18n/config'
import { isValidLocale } from '@/lib/i18n/config'
import { getDictionary } from '@/lib/i18n/getDictionary'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { ShoppingBag, Building2, Shirt, Pill, ShoppingCart, Crown, ArrowRight } from 'lucide-react'
import { ScrollReveal } from '@/components/sections/ScrollReveal'
import type { ComponentType } from 'react'

const iconMap: Record<string, ComponentType<{ size?: number }>> = {
  'shopping-bag': ShoppingBag,
  'building-2': Building2,
  shirt: Shirt,
  pill: Pill,
  'shopping-cart': ShoppingCart,
  crown: Crown,
}

const useCases = [
  {
    icon: 'shopping-bag',
    name: 'Retail Store',
    desc: 'Optimize foot traffic, measure conversion rates, and align staffing with peak hours across every outlet.',
    slug: 'retail',
  },
  {
    icon: 'building-2',
    name: 'Shopping Mall',
    desc: 'Floor-level occupancy, tenant benchmarking, and zone analytics for multi-level retail environments.',
    slug: 'mall',
  },
  {
    icon: 'shirt',
    name: 'Fashion Store',
    desc: 'Track fitting room conversion, dwell time by collection zone, and campaign impact on foot traffic.',
    slug: 'fashion',
  },
  {
    icon: 'pill',
    name: 'Pharmacy',
    desc: 'Monitor prescription counter queues, track consultation area usage, and optimize pharmacist scheduling.',
    slug: 'pharmacy',
  },
  {
    icon: 'shopping-cart',
    name: 'Supermarket',
    desc: 'Aisle-level traffic flow, checkout queue management, and peak-hour staffing optimization at scale.',
    slug: 'supermarket',
  },
  {
    icon: 'crown',
    name: 'Luxury Retail',
    desc: 'High-touch clienteling insights, VIP traffic patterns, and privacy-compliant demographic analytics.',
    slug: 'luxury',
  },
]

export const metadata: Metadata = {
  title: 'Use Cases — SmartCounter CCTV Analytics for Retail Indonesia',
  description:
    'See how SmartCounter people counting works for retail stores, malls, fashion, pharmacies, supermarkets, and luxury retail.',
}

export default async function UseCasesPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!isValidLocale(locale)) notFound()

  const dict = await getDictionary(locale as Locale)

  return (
    <section className="px-4 py-20 md:py-32">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-16 text-center">
          <ScrollReveal>
            <h1 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl">
              People Counting for Every Retail Format
            </h1>
          </ScrollReveal>
          <ScrollReveal delay={100}>
            <p className="mx-auto max-w-2xl text-lg text-text-secondary">{dict.useCases.subtitle}</p>
          </ScrollReveal>
        </div>

        {/* Use Cases Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {useCases.map((uc, i) => {
            const Icon = iconMap[uc.icon] || ShoppingBag
            return (
              <ScrollReveal key={uc.slug} delay={i * 80}>
                <Link
                  href={`/${locale}/use-cases/${uc.slug}`}
                  className="group flex flex-col overflow-hidden rounded-2xl transition-all duration-250 hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(239,68,68,0.15)]"
                >
                  <div className="flex aspect-video items-center justify-center bg-bg-elevated transition-colors group-hover:bg-bg-card">
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary-500/15 text-primary-400 transition-transform group-hover:scale-110">
                      <Icon size={24} />
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col border border-t-0 border-white/[0.06] bg-bg-card/60 p-5 backdrop-blur-xl">
                    <h3 className="mb-1.5 text-base font-semibold">{uc.name}</h3>
                    <p className="mb-3 flex-1 text-sm leading-relaxed text-text-secondary">{uc.desc}</p>
                    <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-500 transition-all group-hover:gap-2.5">
                      {dict.common.explore} <ArrowRight size={14} />
                    </span>
                  </div>
                </Link>
              </ScrollReveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
