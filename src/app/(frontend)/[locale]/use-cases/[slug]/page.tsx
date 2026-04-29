import type { Locale } from '@/lib/i18n/config'
import { isValidLocale } from '@/lib/i18n/config'
import { getDictionary } from '@/lib/i18n/getDictionary'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import {
  ShoppingBag,
  Building2,
  Shirt,
  Pill,
  ShoppingCart,
  Crown,
  ArrowRight,
  TrendingUp,
  Clock,
  Users,
} from 'lucide-react'
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

const useCasesData: Record<
  string,
  {
    icon: string
    name: string
    title: string
    subtitle: string
    description: string
    stats: Array<{
      metric: string
      value: string
      icon: string
    }>
    challenges: string[]
    solutions: string[]
    results: string[]
    features: string[]
    relatedUseCases: string[]
  }
> = {
  retail: {
    icon: 'shopping-bag',
    name: 'Retail Store',
    title: 'People Counting for Independent & Chain Retail Stores',
    subtitle: 'Optimize every store location with visitor analytics',
    description:
      'Whether you run a single boutique or a chain of 50+ stores, SmartCounter provides real-time foot traffic data for each location. Track conversion rates, occupancy, and staffing efficiency — all from your mobile dashboard.',
    stats: [
      { metric: 'Average Conversion Improvement', value: '+23%', icon: 'trending-up' },
      { metric: 'Labor Cost Reduction', value: '-18%', icon: 'clock' },
      { metric: 'Customer Satisfaction', value: '+34%', icon: 'users' },
    ],
    challenges: [
      'No visibility into actual foot traffic vs. sales',
      'Difficult to benchmark performance across multiple stores',
      'Overstaffed during slow hours, understaffed during peaks',
      'Unable to measure ROI of marketing campaigns',
    ],
    solutions: [
      '99.9% accurate people counting for all entrances',
      'Real-time conversion rate tracking (visitors vs. sales)',
      'AI-powered staffing recommendations by hour',
      'Campaign impact measurement on foot traffic',
    ],
    results: [
      'Increase conversion rate by 15-30% with data-driven layout optimization',
      'Reduce labor costs by 15-25% while improving service levels',
      'Identify and fix store performance outliers within weeks',
      'Prove marketing campaign ROI with traffic lift data',
    ],
    features: ['people-counting', 'conversion-rate', 'staff-optimization', 'heatmap', 'zone-analytics'],
    relatedUseCases: ['mall', 'fashion'],
  },
  mall: {
    icon: 'building-2',
    name: 'Shopping Mall',
    title: 'Shopping Mall Occupancy & Tenant Analytics',
    subtitle: 'Track foot traffic across multiple floors and tenants',
    description:
      'Shopping malls need visibility into floor-level traffic, tenant benchmarking, and overall occupancy. SmartCounter enables malls to track traffic per tenant, identify underperforming zones, and make data-driven decisions about tenant mix.',
    stats: [
      { metric: 'Tenant Satisfaction', value: '+41%', icon: 'users' },
      { metric: 'Occupancy Compliance', value: '100%', icon: 'trending-up' },
      { metric: 'Revenue per SqM', value: '+28%', icon: 'clock' },
    ],
    challenges: [
      'No visibility into tenant-level foot traffic performance',
      'Difficulty managing occupancy capacity limits',
      'Unable to identify high-traffic vs. dead zones',
      'Tenant disputes over traffic fairness',
    ],
    solutions: [
      'Per-tenant entrance counting and benchmarking',
      'Floor-level occupancy monitoring with threshold alerts',
      'Heatmap visualization of high-traffic zones',
      'Transparent traffic reports for all tenants',
    ],
    results: [
      'Resolve tenant disputes with transparent traffic data',
      'Optimize tenant mix based on foot traffic correlation',
      'Reduce occupancy violations to zero',
      'Increase mall occupancy by 12-20% through data-driven planning',
    ],
    features: ['people-counting', 'zone-analytics', 'occupancy', 'heatmap', 'demographic'],
    relatedUseCases: ['retail', 'fashion'],
  },
  fashion: {
    icon: 'shirt',
    name: 'Fashion Store',
    title: 'Fashion Retail Analytics: Fitting Rooms & Dwell Time',
    subtitle: 'Track customer engagement by zone and collection',
    description:
      'Fashion retailers need to understand which zones generate engagement (fittingroom conversion, dwell time), track collection-level traffic, and measure campaign impact. SmartCounter provides collection-level analytics and fitting room conversion insights.',
    stats: [
      { metric: 'Fitting Room Conversion', value: '+31%', icon: 'trending-up' },
      { metric: 'Dwell Time Increase', value: '+22 min', icon: 'clock' },
      { metric: 'Campaign ROI Clarity', value: '+100%', icon: 'users' },
    ],
    challenges: [
      'No data on fitting room utilization and conversion',
      'Unclear which collections drive engagement',
      'Campaign impact measurement on in-store traffic',
      'Difficulty optimizing seasonal layout changes',
    ],
    solutions: [
      'Fitting room zone occupancy and queue detection',
      'Collection-level dwell time and conversion tracking',
      'Demographic-based engagement insights',
      'Campaign A/B testing with traffic impact data',
    ],
    results: [
      'Increase fitting room conversion by 20-35% with targeted flow design',
      'Boost dwell time in low-engagement zones by 15+ minutes',
      'Prove seasonal campaign impact with foot traffic metrics',
      'Optimize collection placement based on demographic engagement',
    ],
    features: ['dwelling-time', 'zone-analytics', 'demographic', 'conversion-rate', 'heatmap'],
    relatedUseCases: ['retail', 'luxury'],
  },
  pharmacy: {
    icon: 'pill',
    name: 'Pharmacy',
    title: 'Pharmacy Analytics: Counter Queues & Consultation Tracking',
    subtitle: 'Optimize pharmacist scheduling and counter flow',
    description:
      'Pharmacies operate with tight schedules and regulatory requirements. SmartCounter tracks prescription counter queue depth, consultation area utilization, and helps optimize pharmacist scheduling based on actual traffic patterns.',
    stats: [
      { metric: 'Queue Wait Time', value: '-65%', icon: 'clock' },
      { metric: 'Pharmacist Utilization', value: '+34%', icon: 'users' },
      { metric: 'Customer Satisfaction', value: '+42%', icon: 'trending-up' },
    ],
    challenges: [
      'Long prescription counter queues during peak hours',
      'Over or understaffing during different times',
      'Unclear consultation area usage patterns',
      'Medication aisle traffic not tracked',
    ],
    solutions: [
      'Real-time prescription counter queue monitoring',
      'Pharmacist shift scheduling based on traffic predictions',
      'Consultation area occupancy and dwell time tracking',
      'Aisle-level medication category traffic analysis',
    ],
    results: [
      'Reduce prescription counter wait times from 15+ min to under 5 min',
      'Optimize pharmacist scheduling to reduce labor costs by 12-18%',
      'Improve customer satisfaction scores by 30-45%',
      'Identify medication aisle layout improvements for faster shopping',
    ],
    features: ['queue-management', 'zone-analytics', 'staff-optimization', 'occupancy', 'dwelling-time'],
    relatedUseCases: ['supermarket', 'retail'],
  },
  supermarket: {
    icon: 'shopping-cart',
    name: 'Supermarket',
    title: 'Supermarket Analytics: Aisle Flow & Checkout Optimization',
    subtitle: 'Track traffic across aisles and optimize checkout',
    description:
      'Supermarkets need aisle-level traffic data, checkout queue management, and staff scheduling optimization. SmartCounter provides detailed zone analytics for aisles, real-time queue monitoring, and checkout performance metrics.',
    stats: [
      { metric: 'Checkout Efficiency', value: '+38%', icon: 'trending-up' },
      { metric: 'Self-Checkout Adoption', value: '+56%', icon: 'users' },
      { metric: 'Customer Basket Size', value: '+19%', icon: 'clock' },
    ],
    challenges: [
      'Checkout bottlenecks during peak hours',
      'Aisle layout not optimized for customer flow',
      'Self-checkout adoption unclear',
      'Stockout areas identified too late',
    ],
    solutions: [
      'Real-time checkout queue management with dynamic staffing alerts',
      'Aisle-level traffic heatmaps to optimize product placement',
      'Self-checkout vs. traditional checkout performance comparison',
      'Zone occupancy alerts for stockout prevention',
    ],
    results: [
      'Reduce checkout wait times by 30-50% with smart lane staffing',
      'Increase self-checkout adoption by 25-40%',
      'Boost basket size by 15-25% with aisle flow optimization',
      'Reduce stockout-driven lost sales by up to 20%',
    ],
    features: ['queue-management', 'zone-analytics', 'staff-optimization', 'heatmap', 'traffic-flow'],
    relatedUseCases: ['pharmacy', 'retail'],
  },
  luxury: {
    icon: 'crown',
    name: 'Luxury Retail',
    title: 'Luxury Retail: VIP Traffic & Clienteling Insights',
    subtitle: 'High-touch analytics for premium retail',
    description:
      'Luxury retail requires privacy-first demographic insights and VIP traffic pattern analysis. SmartCounter provides privacy-compliant demographic data, luxury segment identification, and high-touch clienteling insights.',
    stats: [
      { metric: 'VIP Spend per Visit', value: '+47%', icon: 'trending-up' },
      { metric: 'Loyalty Program Enrollment', value: '+68%', icon: 'users' },
      { metric: 'Privacy Compliance', value: '100%', icon: 'clock' },
    ],
    challenges: [
      'Identifying high-value VIP customers in-store',
      'Privacy concerns with customer behavior tracking',
      'Unclear luxury segment traffic patterns',
      'Staff allocation for premium service delivery',
    ],
    solutions: [
      'Privacy-compliant demographic analysis (no PII collected)',
      'Premium segment identification via traffic patterns',
      'Dwell time per zone to identify buyer intent',
      'Staff scheduling optimized for VIP traffic hours',
    ],
    results: [
      'Increase VIP spend per visit by 30-50% with tailored experiences',
      'Boost loyalty program enrollment by 50-70%',
      'Ensure 100% privacy compliance with zero PII storage',
      'Improve staff training with demographic and behavior insights',
    ],
    features: ['demographic', 'dwelling-time', 'zone-analytics', 'staff-optimization', 'heatmap'],
    relatedUseCases: ['fashion', 'retail'],
  },
}

export async function generateStaticParams() {
  return Object.keys(useCasesData).map((slug) => ({
    slug,
  }))
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string; locale: string }> },
  _parent: any,
): Promise<Metadata> {
  const { slug } = await params
  const useCase = useCasesData[slug]

  return {
    title: `${useCase?.name || 'Use Case'} — SmartCounter CCTV Analytics`,
    description: useCase?.subtitle || 'Learn how SmartCounter helps retailers',
  }
}

export default async function UseCaseDetailPage({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>
}) {
  const { slug, locale } = await params
  if (!isValidLocale(locale)) notFound()

  const useCase = useCasesData[slug]
  if (!useCase) notFound()

  const dict = await getDictionary(locale as Locale)
  const Icon = iconMap[useCase.icon] || ShoppingBag

  const iconComponentMap: Record<string, ComponentType<{ size?: number }>> = {
    'trending-up': TrendingUp,
    clock: Clock,
    users: Users,
  }

  return (
    <>
      {/* Hero Section */}
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
            <h1 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl">{useCase.title}</h1>
          </ScrollReveal>
          <ScrollReveal delay={100}>
            <p className="mx-auto max-w-2xl text-xl text-text-secondary">{useCase.subtitle}</p>
          </ScrollReveal>
        </div>
      </section>

      {/* Content Section */}
      <section className="px-4 py-12">
        <div className="mx-auto max-w-4xl">
          {/* Stats */}
          <div className="mb-16 grid gap-4 sm:grid-cols-3">
            {useCase.stats.map((stat, i) => {
              const StatIcon = iconComponentMap[stat.icon] || TrendingUp
              return (
                <ScrollReveal key={i} delay={i * 50}>
                  <div className="rounded-xl border border-white/[0.06] bg-bg-card/60 p-6 text-center backdrop-blur-xl">
                    <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary-500/10 text-primary-500">
                      <StatIcon size={20} />
                    </div>
                    <div className="mb-2 text-3xl font-bold text-primary-500">{stat.value}</div>
                    <div className="text-sm text-text-secondary">{stat.metric}</div>
                  </div>
                </ScrollReveal>
              )
            })}
          </div>

          {/* Overview */}
          <ScrollReveal>
            <p className="mb-12 text-lg leading-relaxed text-text-secondary">{useCase.description}</p>
          </ScrollReveal>

          {/* Challenges */}
          <div className="mb-16">
            <ScrollReveal>
              <h2 className="mb-8 text-2xl font-bold">The Challenge</h2>
            </ScrollReveal>
            <div className="space-y-3">
              {useCase.challenges.map((challenge, i) => (
                <ScrollReveal key={i} delay={i * 50}>
                  <div className="flex items-start gap-3 rounded-lg border border-red-500/20 bg-red-500/5 p-4">
                    <div className="mt-1 h-2 w-2 rounded-full bg-red-500 flex-shrink-0" />
                    <span className="text-sm leading-relaxed">{challenge}</span>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>

          {/* Solutions */}
          <div className="mb-16">
            <ScrollReveal>
              <h2 className="mb-8 text-2xl font-bold">The SmartCounter Solution</h2>
            </ScrollReveal>
            <div className="space-y-3">
              {useCase.solutions.map((solution, i) => (
                <ScrollReveal key={i} delay={i * 50}>
                  <div className="flex items-start gap-3 rounded-lg border border-primary-500/20 bg-primary-500/5 p-4">
                    <div className="mt-1 h-2 w-2 rounded-full bg-primary-500 flex-shrink-0" />
                    <span className="text-sm leading-relaxed">{solution}</span>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>

          {/* Results */}
          <div className="mb-16">
            <ScrollReveal>
              <h2 className="mb-8 text-2xl font-bold">Results You Can Expect</h2>
            </ScrollReveal>
            <div className="grid gap-4 sm:grid-cols-2">
              {useCase.results.map((result, i) => (
                <ScrollReveal key={i} delay={i * 50}>
                  <div className="rounded-lg border border-white/[0.06] bg-bg-card/60 p-4 backdrop-blur-xl">
                    <p className="text-sm leading-relaxed">{result}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>

          {/* Related Use Cases */}
          {useCase.relatedUseCases.length > 0 && (
            <div className="mb-16">
              <ScrollReveal>
                <h2 className="mb-8 text-2xl font-bold">Similar Use Cases</h2>
              </ScrollReveal>
              <div className="grid gap-4 sm:grid-cols-2">
                {useCase.relatedUseCases.map((relatedSlug) => {
                  const related = useCasesData[relatedSlug]
                  if (!related) return null
                  const RelatedIcon = iconMap[related.icon] || ShoppingBag
                  return (
                    <ScrollReveal key={relatedSlug}>
                      <Link
                        href={`/${locale}/use-cases/${relatedSlug}`}
                        className="group flex flex-col overflow-hidden rounded-xl transition-all duration-250 hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(239,68,68,0.15)]"
                      >
                        <div className="flex aspect-video items-center justify-center bg-bg-elevated transition-colors group-hover:bg-bg-card">
                          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-500/15 text-primary-400 transition-transform group-hover:scale-110">
                            <RelatedIcon size={20} />
                          </div>
                        </div>
                        <div className="flex flex-col border border-t-0 border-white/[0.06] bg-bg-card/60 p-4 backdrop-blur-xl">
                          <h4 className="text-sm font-semibold">{related.name}</h4>
                          <span className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-primary-500 opacity-0 transition-all duration-200 group-hover:opacity-100">
                            Explore <ArrowRight size={12} />
                          </span>
                        </div>
                      </Link>
                    </ScrollReveal>
                  )
                })}
              </div>
            </div>
          )}

          {/* CTA */}
          <ScrollReveal delay={100}>
            <div className="rounded-2xl border border-white/[0.06] bg-primary-500/10 p-8 text-center backdrop-blur-xl sm:p-12">
              <h3 className="mb-3 text-2xl font-bold">Ready to transform your {useCase.name.toLowerCase()}?</h3>
              <p className="mb-6 text-text-secondary">
                Get a personalized demo showing how SmartCounter works for your business.
              </p>
              <Link
                href={`/${locale}/demo`}
                className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-6 py-3 font-semibold text-white transition-all duration-250 hover:bg-primary-700 hover:shadow-[0_0_20px_rgba(239,68,68,0.3)]"
              >
                Request a Demo <ArrowRight size={18} />
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  )
}
