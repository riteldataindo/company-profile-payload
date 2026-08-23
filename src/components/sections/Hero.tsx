import Link from 'next/link'
import { ArrowRight, Check } from 'lucide-react'
import type { HomeCopy } from '@/lib/i18n/home-copy'
import { HeroSignalStage } from '@/components/sections/home/HeroSignalStage'

interface HeroProps {
  locale: string
  copy: HomeCopy['hero']
}

export function Hero({ locale, copy }: HeroProps) {
  return (
    <section className="home-section home-hero" aria-labelledby="home-hero-title">
      <div className="home-container home-hero__grid">
        <div className="home-hero__copy">
          <p className="home-kicker">{copy.eyebrow}</p>
          <h1 id="home-hero-title" className="home-heading home-heading--hero">
            {copy.title}
          </h1>
          <p className="home-lead home-hero__lead">{copy.description}</p>
          <div className="home-actions">
            <Link className="home-button home-button--primary" href={`/${locale}/demo`}>
              {copy.primaryCta}
              <ArrowRight aria-hidden="true" size={18} />
            </Link>
            <a className="home-button home-button--secondary" href="#context">
              {copy.secondaryCta}
            </a>
          </div>
          <p className="home-hero__note">
            <Check aria-hidden="true" size={16} />
            {copy.pathNote}
          </p>
        </div>

        <HeroSignalStage
          alt={copy.visualAlt}
          caption={copy.visualCaption}
          label={copy.visualLabel}
          locale={locale}
        />
      </div>
    </section>
  )
}
