'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  ArrowRight,
  ArrowRightLeft,
  Flame,
  Footprints,
  Gauge,
  LayoutGrid,
  ListOrdered,
  MousePointer2,
  Percent,
  Route,
  ScanFace,
  Sparkles,
  Timer,
  UserCog,
  Users,
} from 'lucide-react'
import { FeatureMockup } from './FeatureMockup'
import { ScrollReveal } from './ScrollReveal'
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
  footprints: Footprints,
}

interface FeaturesGridProps {
  locale: string
  dict: Record<string, any>
  features?: any[]
  headingLevel?: 'h1' | 'h2'
}

interface NormalizedFeature {
  key: string
  slug: string
  name: string
  description: string
  icon: string
}

export function FeaturesGrid({
  locale,
  dict,
  features: payloadFeatures,
  headingLevel = 'h2',
}: FeaturesGridProps) {
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null)
  const Heading = headingLevel

  const sourceFeatures = payloadFeatures && payloadFeatures.length > 0
    ? payloadFeatures
    : (dict.features?.items || [])

  const features: NormalizedFeature[] = sourceFeatures.map((feature: any, index: number) => {
    const slug = feature.slug || String(feature.name || `feature-${index + 1}`)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')

    return {
      key: String(feature.id || slug || index),
      slug,
      name: feature.name,
      description: feature.shortDescription || feature.desc || '',
      icon: feature.icon || 'users',
    }
  })

  const activeFeature = features.find((feature) => feature.slug === selectedSlug) || features[0]
  const leftFeatures = features.slice(0, Math.ceil(features.length / 2))
  const rightFeatures = features.slice(Math.ceil(features.length / 2))

  const copy = locale === 'id'
    ? {
        hint: 'Arahkan atau klik fitur untuk melihat analitik',
      }
    : {
        hint: 'Hover or select a feature to explore the analytics',
      }

  const renderCallout = (feature: NormalizedFeature, side: 'left' | 'right') => {
    const Icon = iconMap[feature.icon] || Users
    const isActive = activeFeature?.slug === feature.slug

    return (
      <button
        key={feature.key}
        type="button"
        className={`feature-callout feature-callout--${side} ${isActive ? 'is-active' : ''}`}
        aria-pressed={isActive}
        onMouseEnter={() => setSelectedSlug(feature.slug)}
        onFocus={() => setSelectedSlug(feature.slug)}
        onClick={() => setSelectedSlug(feature.slug)}
      >
        <span className="feature-callout__content">
          <span className="feature-callout__icon"><Icon size={17} /></span>
          <span className="feature-callout__copy">
            <strong>{feature.name}</strong>
          </span>
        </span>
        <span className="feature-callout__connector" aria-hidden="true">
          <span className="feature-callout__line" />
          <span className="feature-callout__dot" />
        </span>
      </button>
    )
  }

  if (!activeFeature) return null

  return (
    <section
      className="features-showcase relative scroll-mt-20 overflow-hidden bg-bg-surface px-4 py-20 md:py-32"
      id="features"
    >
      <div className="features-showcase__glow features-showcase__glow--one" />
      <div className="features-showcase__glow features-showcase__glow--two" />

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <ScrollReveal>
            <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary-400">
              <Sparkles size={14} />
              {dict.features.badge}
            </p>
          </ScrollReveal>
          <ScrollReveal delay={50}>
            <Heading className="mb-3 text-3xl font-bold tracking-tight md:text-4xl">
              {dict.features.title}
            </Heading>
          </ScrollReveal>
          <ScrollReveal delay={100}>
            <p className="mx-auto max-w-xl text-base text-text-secondary">
              {dict.features.subtitle}
            </p>
          </ScrollReveal>
        </div>

        <ScrollReveal delay={150}>
          <div className="feature-spotlight">
            <div className="feature-spotlight__topbar">
              <span className="feature-spotlight__instruction">
                <MousePointer2 size={13} />
                {copy.hint}
              </span>
            </div>

            <div className="feature-spotlight__layout">
              <div className="feature-spotlight__callouts feature-spotlight__callouts--left">
                {leftFeatures.map((feature) => renderCallout(feature, 'left'))}
              </div>

              <div className="feature-spotlight__center">
                <div className="feature-spotlight__visual">
                  <div
                    key={activeFeature.slug}
                    className="feature-spotlight__mockup"
                  >
                    <FeatureMockup slug={activeFeature.slug} />
                  </div>
                  <div className="feature-spotlight__scan" aria-hidden="true" />
                  <span className="feature-spotlight__corner feature-spotlight__corner--tl" />
                  <span className="feature-spotlight__corner feature-spotlight__corner--tr" />
                  <span className="feature-spotlight__corner feature-spotlight__corner--bl" />
                  <span className="feature-spotlight__corner feature-spotlight__corner--br" />
                </div>

                <div className="feature-spotlight__detail" aria-live="polite">
                  <div className="feature-spotlight__detail-copy">
                    <h3>{activeFeature.name}</h3>
                    <p>{activeFeature.description}</p>
                  </div>
                  <Link
                    href={`/${locale}/features/${activeFeature.slug}`}
                    className="feature-spotlight__link"
                  >
                    {dict.common.learnMore}
                    <ArrowRight size={15} />
                  </Link>
                </div>
              </div>

              <div className="feature-spotlight__callouts feature-spotlight__callouts--right">
                {rightFeatures.map((feature) => renderCallout(feature, 'right'))}
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
