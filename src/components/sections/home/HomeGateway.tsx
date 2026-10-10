import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import type { HomeCopy } from '@/lib/i18n/home-copy'

interface HomeGatewayProps {
  locale: string
  copy: HomeCopy['gateway']
}

export function HomeGateway({ locale, copy }: HomeGatewayProps) {
  const paths = [
    {
      ...copy.retail,
      href: `/${locale}/solutions/retail`,
      tone: 'retail',
    },
    {
      ...copy.mall,
      href: `/${locale}/solutions/mall`,
      tone: 'mall',
    },
  ]

  return (
    <section className="home-section" id="context" aria-labelledby="home-gateway-title">
      <div className="home-container">
        <div className="home-section-heading home-section-heading--wide">
          <p className="home-kicker">{copy.eyebrow}</p>
          <h2 id="home-gateway-title" className="home-heading">{copy.title}</h2>
          <p className="home-lead">{copy.description}</p>
        </div>

        <div className="home-gateway-grid">
          {paths.map(({ tone, ...path }, index) => (
            <Link className={`home-gateway-path home-gateway-path--${tone}`} href={path.href} key={path.label}>
              <div className="home-gateway-path__topline">
                <span className="home-gateway-path__index" aria-hidden="true">0{index + 1}</span>
                <span className="home-data-label">{path.label}</span>
                <ArrowUpRight className="home-gateway-path__arrow" aria-hidden="true" size={20} />
              </div>
              <h3>{path.title}</h3>
              <p>{path.description}</p>
              <div className="home-gateway-path__context">
                <span>{path.contextLabel}</span>
                <strong>{path.context}</strong>
              </div>
              <span className="home-gateway-path__cta">{path.cta}<ArrowUpRight aria-hidden="true" size={16} /></span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
