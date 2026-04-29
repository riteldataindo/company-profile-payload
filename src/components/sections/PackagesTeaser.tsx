'use client'

import Link from 'next/link'
import { Check } from 'lucide-react'
import { ScrollReveal } from './ScrollReveal'

const packageMeta = [
  { featured: false },
  { featured: true },
  { featured: false },
]

interface PackagesTeaserProps {
  locale: string
  dict: Record<string, any>
  pricingTiers?: any[]
}

export function PackagesTeaser({ locale, dict, pricingTiers: payloadPricingTiers }: PackagesTeaserProps) {
  // Use Payload pricing tiers if provided, otherwise use dict items
  const packages = payloadPricingTiers && payloadPricingTiers.length > 0
    ? payloadPricingTiers.map((tier: any) => ({
        name: tier.name,
        desc: tier.description,
        badge: tier.isFeatured ? 'Featured' : null,
        features: tier.features?.map((f: any) => f.featureText) || [],
        featured: tier.isFeatured,
      }))
    : (dict.packages?.items || [])

  return (
    <section className="px-4 py-20 md:py-32" id="packages">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <ScrollReveal>
            <h2 className="mb-3 text-3xl font-bold tracking-tight md:text-4xl">{dict.packages.title}</h2>
          </ScrollReveal>
          <ScrollReveal delay={100}>
            <p className="mx-auto max-w-xl text-base text-text-secondary">{dict.packages.subtitle}</p>
          </ScrollReveal>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 items-stretch gap-5 md:grid-cols-3">
          {packages.map((pkg: any, i: number) => {
            const isFeatured = pkg.featured || packageMeta[i]?.featured || false
            return (
            <ScrollReveal key={i} delay={i * 100}>
              <div
                className={`relative flex h-full flex-col rounded-2xl border p-8 backdrop-blur-xl transition-all duration-250 hover:-translate-y-1 ${
                  isFeatured
                    ? 'border-primary-600 bg-primary-600/5 shadow-[0_0_40px_rgba(239,68,68,0.25)]'
                    : 'border-white/[0.06] bg-bg-card/60 hover:border-primary-500/20 hover:shadow-[0_0_20px_rgba(239,68,68,0.15)]'
                }`}
              >
                {pkg.badge && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary-600 px-4 py-1 text-[0.6875rem] font-bold uppercase tracking-wider text-white">
                    {pkg.badge}
                  </span>
                )}
                <div className="mb-3 text-xs font-semibold uppercase tracking-widest text-text-muted">{pkg.name}</div>
                <p className="mb-6 border-b border-border-subtle pb-4 text-sm text-text-secondary">{pkg.desc}</p>
                <ul className="mb-8 flex flex-1 flex-col gap-3">
                  {(pkg.features || []).map((f: string, idx: number) => (
                    <li key={idx} className="flex items-center gap-2.5 text-sm">
                      <Check size={16} className="shrink-0 text-primary-500" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href={`/${locale}/contact`}
                  className={`mt-auto w-full rounded-lg py-3 text-center text-sm font-semibold transition-all ${
                    isFeatured
                      ? 'bg-primary-600 text-white hover:bg-primary-700 hover:shadow-[0_0_20px_rgba(239,68,68,0.15)]'
                      : 'border border-primary-600 text-primary-500 hover:bg-primary-600/10'
                  }`}
                >
                  {dict.common.contactUs}
                </Link>
              </div>
            </ScrollReveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
