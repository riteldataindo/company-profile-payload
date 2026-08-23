import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import type { HomeCopy } from '@/lib/i18n/home-copy'

interface HomeDemoProps {
  locale: string
  copy: HomeCopy['demo']
}

export function HomeDemo({ locale, copy }: HomeDemoProps) {
  return (
    <section className="home-section home-section--accent" id="demo" aria-labelledby="home-demo-title">
      <div className="home-container home-demo__grid">
        <div className="home-section-heading">
          <p className="home-kicker">{copy.eyebrow}</p>
          <h2 id="home-demo-title" className="home-heading">{copy.title}</h2>
          <p className="home-lead">{copy.description}</p>
          <div className="home-actions">
            <Link className="home-button home-button--primary" href={`/${locale}/demo`}>
              {copy.primaryCta}<ArrowRight aria-hidden="true" size={18} />
            </Link>
            <Link className="home-button home-button--secondary" href={`/${locale}/contact`}>
              {copy.secondaryCta}
            </Link>
          </div>
          <p className="home-caption">{copy.footnote}</p>
        </div>

        <ol className="home-demo-steps">
          {copy.steps.map((step, index) => {
            return (
              <li key={step.title}>
                <span className="home-demo-step__number" aria-hidden="true">0{index + 1}</span>
                <div><h3>{step.title}</h3><p>{step.description}</p></div>
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
