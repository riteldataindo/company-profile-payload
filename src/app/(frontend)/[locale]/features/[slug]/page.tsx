import type { Locale } from '@/lib/i18n/config'
import { isValidLocale } from '@/lib/i18n/config'
import { getDictionary } from '@/lib/i18n/getDictionary'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { buildMetadata } from '@/lib/seo/metadata'
import { serviceSchema, breadcrumbSchema } from '@/lib/seo/jsonld'
import { JsonLd } from '@/components/seo/JsonLd'
import Link from 'next/link'
import {
  Users, Flame, ScanFace, Timer, LayoutGrid, ArrowRightLeft,
  Percent, Gauge, UserCog, ListOrdered, Route, Download,
  ArrowRight, CheckCircle2,
} from 'lucide-react'
import { ScrollReveal } from '@/components/sections/ScrollReveal'
import { FeatureMockup } from '@/components/sections/FeatureMockup'
import type { ComponentType } from 'react'

const iconMap: Record<string, ComponentType<{ size?: number }>> = {
  users: Users, flame: Flame, 'scan-face': ScanFace, timer: Timer,
  'layout-grid': LayoutGrid, 'arrow-right-left': ArrowRightLeft,
  percent: Percent, gauge: Gauge, 'user-cog': UserCog,
  'list-ordered': ListOrdered, route: Route, download: Download,
}

const featuresData: Record<string, {
  icon: string
  name: string
  title: string
  subtitle: string
  description: string
  benefits: string[]
  useCases: string[]
  relatedFeatures: string[]
}> = {
  'visitor-traffic': {
    icon: 'users',
    name: 'Visitor Traffic',
    title: 'Monitor Visitor Count in Real-Time with 99.9% Accuracy',
    subtitle: 'Track every visitor entering and leaving your store with AI-powered CCTV analytics',
    description: 'SmartCounter uses advanced AI computer vision to detect and track visitors in real-time. Data flows directly to your dashboard without delay — monitor entries, exits, and net foot traffic across all entrances. Perfect for retail stores, malls, pharmacies, and any physical business.',
    benefits: [
      'Real-time visitor entry and exit counting',
      '99.9% counting accuracy across all entrances',
      'Hourly, daily, weekly, and monthly trend reports',
      'Peak hour identification for staffing decisions',
      'Multi-entrance tracking and aggregation',
      'Privacy-compliant — no personal data collected',
    ],
    useCases: [
      'Measure retail performance by foot traffic volume',
      'Benchmark locations against company averages',
      'Track the impact of marketing campaigns on store visits',
      'Optimize staffing based on real traffic patterns',
    ],
    relatedFeatures: ['in-out-traffic', 'entering-rate', 'demographic'],
  },
  'in-out-traffic': {
    icon: 'arrow-right-left',
    name: 'In-Out Traffic',
    title: 'Analyze Visitor Entry-Exit Patterns at Any Time',
    subtitle: 'Understand when visitors come in and when they leave — down to the hour',
    description: 'In-Out Traffic analytics show the flow of visitors entering and exiting your store throughout the day. Compare day-over-day trends, identify peak entry and exit times, and measure the impact of promotions on foot traffic patterns.',
    benefits: [
      'Separate entry and exit counting per entrance',
      'Hourly in-out flow visualization',
      'Day-over-day and week-over-week comparison',
      'Net occupancy calculation (entries minus exits)',
      'Peak entry and exit hour identification',
      'Multi-entrance aggregation and breakdown',
    ],
    useCases: [
      'Identify optimal store opening and closing hours',
      'Measure promotion impact on visitor flow',
      'Calculate real-time store occupancy from in-out data',
      'Plan staffing around entry-exit patterns',
    ],
    relatedFeatures: ['visitor-traffic', 'occupancy', 'service-efficiency'],
  },
  'dwell-time': {
    icon: 'timer',
    name: 'Dwell Time',
    title: 'Measure How Long Visitors Spend in Your Store',
    subtitle: 'Longer dwell time correlates with higher conversion and engagement',
    description: 'Track how long customers spend in your store or specific zones. Dwell time is one of the strongest indicators of purchase intent. Use this metric to identify which areas engage customers the most and which need improvement.',
    benefits: [
      'Average dwell time per visit',
      'Zone-level dwell time tracking',
      'Peak engagement hour identification',
      'Dwell time trends by day and week',
      'Correlation with conversion rate data',
      'Segment dwell by demographic group',
    ],
    useCases: [
      'Measure engagement with new product displays',
      'Optimize fitting room placement in fashion stores',
      'Improve pharmacy consultation area flow',
      'Track in-store event and promotion performance',
    ],
    relatedFeatures: ['heatmap', 'in-store-routes', 'service-efficiency'],
  },
  'passers-by': {
    icon: 'route',
    name: 'Passers-by',
    title: 'Count Potential Visitors Passing by Your Store',
    subtitle: 'Measure your capture rate and optimize your storefront',
    description: 'Count the number of people who walk past your store entrance but do not enter. By combining passers-by data with visitor traffic, you get your capture rate — a key metric for evaluating storefront effectiveness, signage impact, and window display performance.',
    benefits: [
      'Accurate passers-by counting outside your store',
      'Capture rate calculation (visitors / passers-by)',
      'Hourly and daily passers-by trends',
      'Compare capture rate across locations',
      'Measure window display and signage effectiveness',
      'Track seasonal and weather-related patterns',
    ],
    useCases: [
      'Evaluate storefront redesign impact',
      'Compare capture rates between mall locations',
      'Optimize window displays based on data',
      'Justify rental costs with traffic data',
    ],
    relatedFeatures: ['entering-rate', 'visitor-traffic', 'heatmap'],
  },
  'entering-rate': {
    icon: 'percent',
    name: 'Entering Rate',
    title: 'Conversion Rate from Passers-by to Actual Visitors',
    subtitle: 'Understand how effective your storefront is at attracting walk-ins',
    description: 'Entering Rate measures the percentage of passers-by who actually enter your store. This metric directly reflects the effectiveness of your storefront, signage, window displays, and external promotions. Track changes over time to measure improvement.',
    benefits: [
      'Real-time entering rate calculation',
      'Trend tracking by hour, day, and week',
      'Location-by-location benchmarking',
      'Before/after campaign measurement',
      'Seasonal and time-of-day patterns',
      'Correlation with weather and events',
    ],
    useCases: [
      'Measure the ROI of storefront renovations',
      'Compare entering rates across branches',
      'Evaluate seasonal promotion effectiveness',
      'Justify investments in signage and displays',
    ],
    relatedFeatures: ['passers-by', 'visitor-traffic', 'demographic'],
  },
  'group-rate': {
    icon: 'layout-grid',
    name: 'Group Rate',
    title: 'Identify Group or Individual Visit Patterns',
    subtitle: 'Know whether customers shop alone or in groups',
    description: 'Group Rate identifies whether visitors arrive individually or in groups. This insight helps you optimize your service approach — solo shoppers may need more staff assistance, while groups may need wider aisles and seating areas.',
    benefits: [
      'Individual vs group visit classification',
      'Average group size tracking',
      'Group rate trends by time and day',
      'Service approach optimization data',
      'Space layout recommendations',
      'Correlation with transaction value',
    ],
    useCases: [
      'Optimize seating and waiting areas for groups',
      'Adjust service approach based on group patterns',
      'Design store layouts for group shopping',
      'Measure family vs individual shopper segments',
    ],
    relatedFeatures: ['demographic', 'dwell-time', 'visitor-traffic'],
  },
  demographic: {
    icon: 'scan-face',
    name: 'Demographic',
    title: 'Complete Age and Gender Visitor Profiles',
    subtitle: 'Privacy-compliant AI analysis without personal data collection',
    description: 'SmartCounter uses AI computer vision to estimate age groups and gender distribution of your visitors — all without storing personally identifiable information. 100% compliant with data privacy regulations. Use demographic insights for targeted marketing, product assortment, and staffing decisions.',
    benefits: [
      'Age group segmentation (6 groups)',
      'Gender distribution analysis (Male/Female)',
      'No personal data collection or storage',
      '100% privacy regulation compliant',
      'Demographic trends by time of day',
      'Cross-location demographic comparison',
    ],
    useCases: [
      'Target product assortment to your customer base',
      'Align marketing campaigns to visitor demographics',
      'Measure demographic reach of promotions',
      'Compare demographic profiles across locations',
    ],
    relatedFeatures: ['visitor-traffic', 'dwell-time', 'entering-rate'],
  },
  occupancy: {
    icon: 'gauge',
    name: 'Occupancy',
    title: 'Store Capacity and Real-Time Density Levels',
    subtitle: 'Ensure safety compliance and manage crowd flow',
    description: 'Real-time occupancy monitoring tracks how many people are in your store or specific zones at any moment. Set configurable thresholds and receive alerts when zones approach capacity. Essential for safety compliance, fire codes, and crowd management.',
    benefits: [
      'Real-time occupancy tracking per zone',
      'Configurable capacity thresholds and alerts',
      'Historical occupancy trends and patterns',
      'Zone-level density monitoring',
      'Compliance reporting for audits',
      'Crowd flow management insights',
    ],
    useCases: [
      'Maintain safety capacity limits',
      'Prevent overcrowding in high-traffic zones',
      'Monitor event capacity in malls',
      'Generate compliance documentation for audits',
    ],
    relatedFeatures: ['in-out-traffic', 'queuing', 'service-efficiency'],
  },
  'service-efficiency': {
    icon: 'user-cog',
    name: 'Service Efficiency',
    title: 'Evaluate Staff Service Speed and Efficiency',
    subtitle: 'Align staffing levels with visitor traffic patterns',
    description: 'Service Efficiency combines visitor traffic data with staff presence to measure how well your team serves customers. Identify peak hours that need more staff, slow periods where you can reduce costs, and optimize scheduling for maximum customer satisfaction.',
    benefits: [
      'Staff-to-visitor ratio tracking',
      'Service speed measurement per zone',
      'Peak hour staffing recommendations',
      'Labor cost optimization insights',
      'Customer wait time reduction',
      'Shift scheduling data',
    ],
    useCases: [
      'Reduce labor costs during off-peak hours',
      'Boost staffing during peak traffic times',
      'Improve checkout and service wait times',
      'Optimize department-level staff allocation',
    ],
    relatedFeatures: ['visitor-traffic', 'queuing', 'occupancy'],
  },
  heatmap: {
    icon: 'flame',
    name: 'Heatmap',
    title: 'Visualize Busiest Areas for Layout Optimization',
    subtitle: 'AI-powered CCTV heatmaps show exactly where customers spend time',
    description: 'Heatmap analytics overlay movement data onto your store floor plan, showing hot zones where customers cluster and cold zones that need attention. Use this CCTV AI insight to optimize product placement, promotional displays, signage, and overall store layout.',
    benefits: [
      'Real-time movement visualization on floor plan',
      'Identify hot zones and dead zones instantly',
      'Time-based filtering (peak vs off-peak)',
      'Compare before/after layout changes',
      'Export heatmaps for presentations',
      'Multi-floor support for malls',
    ],
    useCases: [
      'Redesign store layout to boost engagement',
      'Optimize promotional display placement',
      'Reduce dead zone product waste',
      'Improve customer flow through entrance areas',
    ],
    relatedFeatures: ['dwell-time', 'in-store-routes', 'occupancy'],
  },
  queuing: {
    icon: 'list-ordered',
    name: 'Queuing',
    title: 'Queue Management and Customer Wait Time Tracking',
    subtitle: 'Detect queue lengths and improve checkout efficiency',
    description: 'AI-powered queue detection identifies when lines form, measures queue length and estimated wait time, and alerts staff when thresholds are exceeded. Reduce customer abandonment and improve the checkout experience with real-time queue data.',
    benefits: [
      'Real-time queue length detection',
      'Estimated wait time calculation',
      'Configurable queue threshold alerts',
      'Multiple queue tracking (checkout, service, etc.)',
      'Peak queue hour analysis',
      'Service speed metrics per counter',
    ],
    useCases: [
      'Alert staff when checkout lines grow too long',
      'Optimize number of active checkout counters',
      'Manage pharmacy and service counter queues',
      'Reduce customer complaints about wait times',
    ],
    relatedFeatures: ['service-efficiency', 'occupancy', 'visitor-traffic'],
  },
  'in-store-routes': {
    icon: 'download',
    name: 'In-Store Routes',
    title: 'Map Visitor Journey Paths Inside Your Store',
    subtitle: 'Understand entry-to-exit movement and optimize product placement',
    description: 'Track how visitors move through multiple zones inside your store. See which paths are most common, identify high-traffic corridors, and find out which routes lead to purchase vs drop-off. Optimize zone sequencing and product placement based on actual customer behavior.',
    benefits: [
      'Multi-zone path tracking and visualization',
      'Purchase-leading route identification',
      'Drop-off point detection between zones',
      'Zone sequence optimization insights',
      'Average zones visited per customer',
      'Funnel analysis from entrance to checkout',
    ],
    useCases: [
      'Optimize store layout for conversion',
      'Identify products that increase basket size',
      'Improve cross-selling zone placement',
      'Reduce customer drop-off before checkout',
    ],
    relatedFeatures: ['heatmap', 'dwell-time', 'entering-rate'],
  },
}

export async function generateStaticParams() {
  return Object.keys(featuresData).map((slug) => ({ slug }))
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string; locale: string }> },
): Promise<Metadata> {
  const { slug, locale } = await params
  const feature = featuresData[slug]
  return buildMetadata({
    title: `${feature?.name || 'Feature'} — People Counting & CCTV AI`,
    description: feature?.subtitle || 'SmartCounter AI-powered visitor analytics feature',
    locale,
    path: `/features/${slug}`,
  })
}

export default async function FeatureDetailPage({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>
}) {
  const { slug, locale } = await params
  if (!isValidLocale(locale)) notFound()

  const feature = featuresData[slug]
  if (!feature) notFound()

  const dict = await getDictionary(locale as Locale)
  const Icon = iconMap[feature.icon] || Users

  return (
    <>
      <JsonLd data={serviceSchema({ name: feature.name, description: feature.subtitle, slug, locale })} />
      <JsonLd data={breadcrumbSchema([
        { name: 'Home', url: `/${locale}` },
        { name: 'Features', url: `/${locale}/features` },
        { name: feature.name, url: `/${locale}/features/${slug}` },
      ])} />
      <section className="relative flex min-h-[60vh] items-center overflow-hidden px-4 pt-24 pb-12">
        <div
          className="pointer-events-none absolute top-[20%] left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(239,68,68,0.12) 0%, transparent 70%)' }}
          aria-hidden="true"
        />
        <div className="relative mx-auto max-w-4xl text-center">
          <ScrollReveal>
            <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-500/10 text-primary-500">
              <Icon size={32} />
            </div>
          </ScrollReveal>
          <ScrollReveal delay={50}>
            <h1 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl">{feature.title}</h1>
          </ScrollReveal>
          <ScrollReveal delay={100}>
            <p className="mx-auto max-w-2xl text-xl text-text-secondary">{feature.subtitle}</p>
          </ScrollReveal>
        </div>
      </section>

      <section className="px-4 py-12">
        <div className="mx-auto max-w-5xl">
          <div className="mb-16 grid items-center gap-12 md:grid-cols-2">
            <ScrollReveal>
              <p className="text-lg leading-relaxed text-text-secondary">{feature.description}</p>
            </ScrollReveal>
            <ScrollReveal delay={200}>
              <FeatureMockup slug={slug} />
            </ScrollReveal>
          </div>

          <div className="mb-16">
            <ScrollReveal>
              <h2 className="mb-8 text-2xl font-bold">Key Benefits</h2>
            </ScrollReveal>
            <div className="grid gap-4 sm:grid-cols-2">
              {feature.benefits.map((benefit, i) => (
                <ScrollReveal key={i} delay={i * 50}>
                  <div className="flex items-start gap-3 rounded-xl border border-white/[0.06] bg-bg-card/60 p-4 backdrop-blur-xl">
                    <CheckCircle2 size={20} className="mt-0.5 flex-shrink-0 text-primary-500" />
                    <span className="text-sm leading-relaxed">{benefit}</span>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>

          <div className="mb-16">
            <ScrollReveal>
              <h2 className="mb-8 text-2xl font-bold">Use Cases</h2>
            </ScrollReveal>
            <div className="space-y-3">
              {feature.useCases.map((useCase, i) => (
                <ScrollReveal key={i} delay={i * 50}>
                  <div className="flex items-center gap-3 rounded-lg border border-white/[0.06] bg-bg-card/60 p-4 backdrop-blur-xl">
                    <div className="h-2 w-2 rounded-full bg-primary-500" />
                    <span className="text-sm">{useCase}</span>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>

          <div className="mb-16">
            <ScrollReveal>
              <h2 className="mb-8 text-2xl font-bold">Works Great With</h2>
            </ScrollReveal>
            <div className="grid gap-4 sm:grid-cols-3">
              {feature.relatedFeatures.map((relatedSlug) => {
                const related = featuresData[relatedSlug]
                if (!related) return null
                const RelatedIcon = iconMap[related.icon] || Users
                return (
                  <ScrollReveal key={relatedSlug}>
                    <Link
                      href={`/${locale}/features/${relatedSlug}`}
                      className="group flex flex-col rounded-xl border border-white/[0.06] bg-bg-card/60 p-4 backdrop-blur-xl transition-all duration-250 hover:-translate-y-1 hover:border-primary-500/20 hover:shadow-[0_0_20px_rgba(239,68,68,0.15)]"
                    >
                      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary-500/10 text-primary-500">
                        <RelatedIcon size={20} />
                      </div>
                      <h4 className="text-sm font-semibold">{related.name}</h4>
                      <span className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-primary-500 opacity-0 transition-all duration-200 group-hover:opacity-100">
                        Learn more <ArrowRight size={12} />
                      </span>
                    </Link>
                  </ScrollReveal>
                )
              })}
            </div>
          </div>

          <ScrollReveal delay={100}>
            <div className="rounded-2xl border border-white/[0.06] bg-primary-500/10 p-8 text-center backdrop-blur-xl sm:p-12">
              <h3 className="mb-3 text-2xl font-bold">Ready to see {feature.name} in action?</h3>
              <p className="mb-6 text-text-secondary">
                Get a personalized demo of SmartCounter for your retail business.
              </p>
              <Link
                href={`/${locale}/demo`}
                className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-6 py-3 font-semibold text-white transition-all duration-250 hover:bg-primary-700 hover:shadow-[0_0_20px_rgba(239,68,68,0.3)]"
              >
                {dict.hero.ctaPrimary} <ArrowRight size={18} />
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  )
}
