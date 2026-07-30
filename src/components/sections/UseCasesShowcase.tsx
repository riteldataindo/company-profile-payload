'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  ArrowRight,
  Building2,
  ChartNoAxesCombined,
  Check,
  Crown,
  MousePointer2,
  Pill,
  Shirt,
  ShoppingBag,
  ShoppingCart,
  Store,
} from 'lucide-react'
import { ScrollReveal } from './ScrollReveal'
import type { ComponentType } from 'react'

const iconMap: Record<string, ComponentType<{ size?: number }>> = {
  'shopping-bag': ShoppingBag,
  'building-2': Building2,
  shirt: Shirt,
  pill: Pill,
  'shopping-cart': ShoppingCart,
  crown: Crown,
}

const useCaseSlugs = ['retail', 'mall', 'fashion', 'pharmacy', 'supermarket', 'luxury']
const useCaseIcons = ['shopping-bag', 'building-2', 'shirt', 'pill', 'shopping-cart', 'crown']

interface UseCasesShowcaseProps {
  locale: string
  dict: Record<string, any>
  useCases?: any[]
  headingLevel?: 'h1' | 'h2'
}

interface NormalizedUseCase {
  key: string
  slug: string
  name: string
  description: string
  stat: string | null
  icon: string
}

export function UseCasesShowcase({
  locale,
  dict,
  useCases: payloadUseCases,
  headingLevel = 'h2',
}: UseCasesShowcaseProps) {
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null)
  const Heading = headingLevel
  const fallbackItems = dict.useCases?.items || []
  const sourceUseCases = payloadUseCases && payloadUseCases.length > 0
    ? payloadUseCases
    : fallbackItems

  const useCases: NormalizedUseCase[] = sourceUseCases.map((useCase: any, index: number) => {
    const fallback = fallbackItems[index] || {}
    const slug = useCase.slug || useCaseSlugs[index % useCaseSlugs.length]

    return {
      key: String(useCase.id || slug || index),
      slug,
      name: useCase.industryName || useCase.name || fallback.name || '',
      description: useCase.shortDescription || useCase.desc || fallback.desc || '',
      stat: useCase.stat || fallback.stat || null,
      icon: useCase.icon || useCaseIcons[index % useCaseIcons.length],
    }
  })

  const activeUseCase = useCases.find((useCase) => useCase.slug === selectedSlug) || useCases[0]
  const copy = locale === 'id'
    ? {
        badge: 'Solusi per industri',
        selector: 'Pilih format retail',
        hint: 'Arahkan atau klik',
        fit: 'Konfigurasi yang tepat',
        fitText: 'Analitik disesuaikan dengan alur, luas, dan target operasional setiap lokasi.',
        outcome: 'Dampak utama',
        explore: 'Lihat solusi',
        ready: 'SmartCounter siap',
      }
    : {
        badge: 'Industry solutions',
        selector: 'Select a retail format',
        hint: 'Hover or select',
        fit: 'Built for your format',
        fitText: 'Analytics adapt to each venue’s flow, footprint, and operational goals.',
        outcome: 'Key outcome',
        explore: 'Explore solution',
        ready: 'SmartCounter ready',
      }

  if (!activeUseCase) return null

  const ActiveIcon = iconMap[activeUseCase.icon] || Store

  return (
    <section className="usecase-showcase relative overflow-hidden px-4 py-20 md:py-24">
      <div className="usecase-showcase__glow" aria-hidden="true" />

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="mb-10 text-center">
          <ScrollReveal>
            <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary-400">
              <Store size={14} />
              {copy.badge}
            </p>
          </ScrollReveal>
          <ScrollReveal delay={50}>
            <Heading className="mb-3 text-3xl font-bold tracking-tight md:text-4xl">
              {dict.useCases.title}
            </Heading>
          </ScrollReveal>
          <ScrollReveal delay={100}>
            <p className="mx-auto max-w-xl text-base text-text-secondary">
              {dict.useCases.subtitle}
            </p>
          </ScrollReveal>
        </div>

        <ScrollReveal delay={140}>
          <div className="usecase-selector">
            <div className="usecase-selector__bar">
              <span className="usecase-selector__label">
                <span className="usecase-selector__label-icon">
                  <ChartNoAxesCombined size={14} />
                </span>
                {copy.selector}
              </span>
              <span className="usecase-selector__hint">
                <MousePointer2 size={13} />
                {copy.hint}
              </span>
            </div>

            <div className="usecase-selector__body">
              <div className="usecase-selector__scene" aria-hidden="true">
                <div className="usecase-selector__scene-grid" />
                <span className="usecase-selector__scene-line usecase-selector__scene-line--one" />
                <span className="usecase-selector__scene-line usecase-selector__scene-line--two" />
                <span className="usecase-selector__scene-node usecase-selector__scene-node--one" />
                <span className="usecase-selector__scene-node usecase-selector__scene-node--two" />

                <div key={activeUseCase.slug} className="usecase-selector__venue">
                  <span className="usecase-selector__venue-orbit" />
                  <span className="usecase-selector__venue-icon">
                    <ActiveIcon size={42} />
                  </span>
                  <span className="usecase-selector__venue-name">{activeUseCase.name}</span>
                  <span className="usecase-selector__venue-status">
                    <span />
                    {copy.ready}
                  </span>
                </div>
              </div>

              <div key={`detail-${activeUseCase.slug}`} className="usecase-selector__detail" aria-live="polite">
                <h3>{activeUseCase.name}</h3>
                <p className="usecase-selector__description">{activeUseCase.description}</p>

                <div className="usecase-selector__fit">
                  <span className="usecase-selector__fit-icon"><Check size={13} /></span>
                  <span>
                    <strong>{copy.fit}</strong>
                    <small>{copy.fitText}</small>
                  </span>
                </div>

                <div className="usecase-selector__action">
                  {activeUseCase.stat && (
                    <span className="usecase-selector__stat">
                      <small>{copy.outcome}</small>
                      <strong>{activeUseCase.stat}</strong>
                    </span>
                  )}
                  <Link
                    href={`/${locale}/use-cases/${activeUseCase.slug}`}
                    className="usecase-selector__link"
                  >
                    {copy.explore}
                    <ArrowRight size={15} />
                  </Link>
                </div>
              </div>
            </div>

            <div className="usecase-selector__tabs" aria-label={copy.selector}>
              {useCases.map((useCase) => {
                const Icon = iconMap[useCase.icon] || ShoppingBag
                const isActive = activeUseCase.slug === useCase.slug

                return (
                  <button
                    key={useCase.key}
                    type="button"
                    className={`usecase-tab ${isActive ? 'is-active' : ''}`}
                    aria-pressed={isActive}
                    onMouseEnter={() => setSelectedSlug(useCase.slug)}
                    onFocus={() => setSelectedSlug(useCase.slug)}
                    onClick={() => setSelectedSlug(useCase.slug)}
                  >
                    <span className="usecase-tab__icon"><Icon size={17} /></span>
                    <span className="usecase-tab__copy">
                      <strong>{useCase.name}</strong>
                    </span>
                    <span className="usecase-tab__indicator" aria-hidden="true" />
                  </button>
                )
              })}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
