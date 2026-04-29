'use client'

import Link from 'next/link'
import { Sparkles, Users, Flame, ScanFace, Timer, LayoutGrid, ArrowRightLeft, Percent, Gauge, UserCog, ListOrdered, Route, Footprints, ArrowRight } from 'lucide-react'
import { ScrollReveal } from './ScrollReveal'
import type { ComponentType } from 'react'

const iconMap: Record<string, ComponentType<{ size?: number }>> = {
  users: Users, flame: Flame, 'scan-face': ScanFace, timer: Timer,
  'layout-grid': LayoutGrid, 'arrow-right-left': ArrowRightLeft, percent: Percent,
  gauge: Gauge, 'user-cog': UserCog, 'list-ordered': ListOrdered, route: Route, footprints: Footprints,
}

const featureSlugs = [
  'visitor-traffic', 'in-out-traffic', 'dwell-time', 'passers-by',
  'entering-rate', 'group-rate', 'demographic', 'occupancy',
  'service-efficiency', 'heatmap', 'queuing', 'in-store-routes',
]

const featureIcons = [
  'users', 'arrow-right-left', 'timer', 'route',
  'percent', 'layout-grid', 'scan-face', 'gauge',
  'user-cog', 'flame', 'list-ordered', 'footprints',
]

interface FeaturesGridProps {
  locale: string
  dict: Record<string, any>
}

export function FeaturesGrid({ locale, dict }: FeaturesGridProps) {
  return (
    <section className="bg-bg-surface px-4 py-20 md:py-32" id="features">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <ScrollReveal>
            <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary-400">
              <Sparkles size={14} />
              {dict.features.badge}
            </p>
          </ScrollReveal>
          <ScrollReveal delay={50}>
            <h2 className="mb-3 text-3xl font-bold tracking-tight md:text-4xl">{dict.features.title}</h2>
          </ScrollReveal>
          <ScrollReveal delay={100}>
            <p className="mx-auto max-w-xl text-base text-text-secondary">{dict.features.subtitle}</p>
          </ScrollReveal>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {(dict.features.items || []).map((f: any, i: number) => {
            const Icon = iconMap[featureIcons[i]] || Users
            const slug = featureSlugs[i]
            return (
              <ScrollReveal key={slug} delay={i * 50} className="flex">
                <Link
                  href={`/${locale}/features/${slug}`}
                  className="group flex flex-1 flex-col rounded-2xl border border-white/[0.06] bg-bg-card/60 p-5 backdrop-blur-xl transition-all duration-250 hover:-translate-y-1 hover:border-primary-500/20 hover:shadow-[0_0_20px_rgba(239,68,68,0.15)]"
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
