import type { Locale } from '@/lib/i18n/config'
import { isValidLocale } from '@/lib/i18n/config'
import { getDictionary } from '@/lib/i18n/getDictionary'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { Sparkles, Users, Flame, ScanFace, Timer, LayoutGrid, ArrowRightLeft, Percent, Gauge, UserCog, ListOrdered, Route, Download, ArrowRight } from 'lucide-react'
import { ScrollReveal } from '@/components/sections/ScrollReveal'
import type { ComponentType } from 'react'

const iconMap: Record<string, ComponentType<{ size?: number }>> = {
  users: Users,
  flame: Flame,
  'scan-face': ScanFace,
  timer: Timer,
  'layout-grid': LayoutGrid,
  'arrow-right-left': ArrowRightLeft,
  percent: Percent,
  gauge: Gauge,
  'user-cog': UserCog,
  'list-ordered': ListOrdered,
  route: Route,
  download: Download,
}

const features = [
  { icon: 'users', name: 'Visitor Traffic', desc: 'Monitor visitor count in real-time with 99.9% accuracy. Track entries, exits, and net foot traffic across all entrances — powered by AI computer vision.', slug: 'visitor-traffic' },
  { icon: 'arrow-right-left', name: 'In-Out Traffic', desc: 'Analyze visitor entry-exit patterns at any time. Understand peak hours, compare day-over-day trends, and measure the impact of promotions on foot traffic.', slug: 'in-out-traffic' },
  { icon: 'timer', name: 'Dwell Time', desc: 'Measure how long visitors spend in your store or specific zones. Longer dwell time correlates with higher conversion and engagement.', slug: 'dwell-time' },
  { icon: 'route', name: 'Passers-by', desc: 'Count potential visitors passing by your store entrance. Measure your capture rate and optimize storefront displays to attract more walk-ins.', slug: 'passers-by' },
  { icon: 'percent', name: 'Entering Rate', desc: 'Conversion rate from passers-by to actual visitors. Understand how effective your storefront, signage, and promotions are at driving foot traffic.', slug: 'entering-rate' },
  { icon: 'layout-grid', name: 'Group Rate', desc: 'Identify group or individual visit patterns. Understand whether customers shop alone or in groups to optimize your service approach and space layout.', slug: 'group-rate' },
  { icon: 'scan-face', name: 'Demographic', desc: 'Complete age and gender visitor profiles without collecting personal data. Privacy-compliant AI computer vision for targeted marketing decisions.', slug: 'demographic' },
  { icon: 'gauge', name: 'Occupancy', desc: 'Store capacity and real-time density levels. Ensure safety compliance, manage crowd flow, and trigger alerts when thresholds are exceeded.', slug: 'occupancy' },
  { icon: 'user-cog', name: 'Service Efficiency', desc: 'Evaluate staff service speed and efficiency. Align staffing levels with visitor traffic patterns to reduce wait times and labor costs.', slug: 'service-efficiency' },
  { icon: 'flame', name: 'Heatmap', desc: 'Visualize busiest areas for layout optimization. AI-powered CCTV heatmaps show hot zones, dead zones, and customer movement patterns in real spatial data.', slug: 'heatmap' },
  { icon: 'list-ordered', name: 'Queuing', desc: 'Queue management and customer wait time tracking. Detect queue lengths, trigger alerts, and improve checkout efficiency with real-time data.', slug: 'queuing' },
  { icon: 'download', name: 'In-Store Routes', desc: 'Map visitor journey paths inside your store. Understand entry-to-exit movement, identify high-traffic corridors, and optimize product placement.', slug: 'in-store-routes' },
]

export const metadata: Metadata = {
  title: 'People Counting & CCTV AI Features',
  description:
    'Explore 12+ AI-powered visitor analytics features: visitor traffic, heatmaps, demographics, dwell time, occupancy, queuing, in-store routes, and more for retail stores and malls.',
}

export default async function FeaturesPage({
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
            <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary-400">
              <Sparkles size={14} />
              {dict.features.badge}
            </p>
          </ScrollReveal>
          <ScrollReveal delay={50}>
            <h1 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl">
              People Counting & CCTV AI Features
            </h1>
          </ScrollReveal>
          <ScrollReveal delay={100}>
            <p className="mx-auto max-w-2xl text-lg text-text-secondary">
              {dict.features.subtitle}
            </p>
          </ScrollReveal>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {features.map((f, i) => {
            const Icon = iconMap[f.icon] || Users
            return (
              <ScrollReveal key={f.slug} delay={i * 50}>
                <Link
                  href={`/${locale}/features/${f.slug}`}
                  className="group flex flex-col rounded-2xl border border-white/[0.06] bg-bg-card/60 p-5 backdrop-blur-xl transition-all duration-250 hover:-translate-y-1 hover:border-primary-500/20 hover:shadow-[0_0_20px_rgba(239,68,68,0.15)]"
                >
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary-500/10 text-primary-500">
                    <Icon size={20} />
                  </div>
                  <h3 className="mb-1 text-base font-semibold">{f.name}</h3>
                  <p className="flex-1 text-sm leading-relaxed text-text-secondary">{f.desc}</p>
                  <span className="mt-3 inline-flex translate-y-1 items-center gap-1 text-xs font-semibold text-primary-500 opacity-0 transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100">
                    {dict.common.learnMore} <ArrowRight size={14} />
                  </span>
                </Link>
              </ScrollReveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
