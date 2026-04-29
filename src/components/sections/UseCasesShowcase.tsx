'use client'

import Link from 'next/link'
import { ShoppingBag, Building2, Shirt, Pill, ShoppingCart, Crown, ArrowRight } from 'lucide-react'
import { ScrollReveal } from './ScrollReveal'
import type { ComponentType } from 'react'

const iconMap: Record<string, ComponentType<{ size?: number }>> = {
  'shopping-bag': ShoppingBag, 'building-2': Building2, shirt: Shirt,
  pill: Pill, 'shopping-cart': ShoppingCart, crown: Crown,
}

const useCaseSlugs = ['retail', 'mall', 'fashion', 'pharmacy', 'supermarket', 'luxury']
const useCaseIcons = ['shopping-bag', 'building-2', 'shirt', 'pill', 'shopping-cart', 'crown']

interface UseCasesShowcaseProps {
  locale: string
  dict: Record<string, any>
  useCases?: any[]
}

export function UseCasesShowcase({ locale, dict, useCases: payloadUseCases }: UseCasesShowcaseProps) {
  // Use Payload use cases if provided, otherwise use dict items
  const useCases = payloadUseCases && payloadUseCases.length > 0
    ? payloadUseCases
    : (dict.useCases?.items || [])

  return (
    <section className="bg-bg-surface px-4 py-20 md:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <ScrollReveal>
            <h2 className="mb-3 text-3xl font-bold tracking-tight md:text-4xl">{dict.useCases.title}</h2>
          </ScrollReveal>
          <ScrollReveal delay={100}>
            <p className="mx-auto max-w-xl text-base text-text-secondary">{dict.useCases.subtitle}</p>
          </ScrollReveal>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {useCases.map((uc: any, i: number) => {
            const icon = uc.icon || useCaseIcons[i % useCaseIcons.length]
            const Icon = iconMap[icon] || ShoppingBag
            const slug = uc.slug || useCaseSlugs[i % useCaseSlugs.length]
            const name = uc.industryName || uc.name
            const desc = uc.shortDescription || uc.desc
            return (
              <ScrollReveal key={slug} delay={i * 80}>
                <Link href={`/${locale}/use-cases/${slug}`} className="group flex flex-col overflow-hidden rounded-2xl transition-all duration-250 hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(239,68,68,0.15)]">
                  <div className="flex aspect-video items-center justify-center bg-bg-elevated transition-colors group-hover:bg-bg-card">
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary-500/15 text-primary-400 transition-transform group-hover:scale-110">
                      <Icon size={24} />
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col border border-t-0 border-white/[0.06] bg-bg-card/60 p-5 backdrop-blur-xl">
                    <h3 className="mb-1.5 text-base font-semibold">{name}</h3>
                    <p className="mb-3 flex-1 text-sm leading-relaxed text-text-secondary">{desc}</p>
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
