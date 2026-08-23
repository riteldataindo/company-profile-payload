import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import type { HomeCopy } from '@/lib/i18n/home-copy'

interface HomeHowItWorksProps {
  locale: string
  copy: HomeCopy['howItWorks']
}

export function HomeHowItWorks({ locale, copy }: HomeHowItWorksProps) {
  return (
    <section className="home-section home-section--muted" id="how-it-works" aria-labelledby="home-how-title">
      <div className="home-container">
        <div className="home-section-heading">
          <p className="home-kicker">{copy.eyebrow}</p>
          <h2 id="home-how-title" className="home-heading">{copy.title}</h2>
          <p className="home-lead">{copy.description}</p>
        </div>

        <ol className="home-flow-chain">
          {copy.steps.map((step, index) => (
            <li className="home-flow-chain__step" key={step.title}>
              <span className="home-flow-chain__index" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </li>
          ))}
        </ol>

        <div className="home-section-footer home-section-footer--split">
          <p className="home-caption">{copy.caption}</p>
          <Link className="home-text-link" href={`/${locale}/faq`}>
            {copy.cta}
            <ArrowRight aria-hidden="true" size={16} />
          </Link>
        </div>
      </div>
    </section>
  )
}
