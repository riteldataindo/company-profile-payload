import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import type { HomeCopy } from '@/lib/i18n/home-copy'
import { getMediaUrl } from '@/lib/data'
import { ClientLogoRail, type ClientLogoItem } from './ClientLogoRail'
import { SignalDiagram } from './SignalDiagram'

interface HomeEvidenceProps {
  clientLogos?: unknown[]
  locale: string
  copy: HomeCopy['evidence']
}

function clientLogoItems(records: unknown[]): ClientLogoItem[] {
  return records.flatMap((value) => {
    if (!value || typeof value !== 'object') return []
    const record = value as Record<string, unknown>
    const logo = record.logo
    const darkLogo = record.darkModeLogo
    const url = getMediaUrl(logo)
    if (!url || !logo || typeof logo !== 'object') return []

    const media = logo as Record<string, unknown>
    const darkUrl = getMediaUrl(darkLogo)
    const name = typeof record.companyName === 'string' ? record.companyName.trim() : ''
    if (!name) return []

    return [{
      alt: typeof media.alt === 'string' && media.alt.trim() ? media.alt : `${name} logo`,
      darkUrl,
      height: typeof media.height === 'number' ? media.height : 200,
      id: typeof record.id === 'number' || typeof record.id === 'string' ? record.id : name,
      url,
      width: typeof media.width === 'number' ? media.width : 500,
    }]
  })
}

export function HomeEvidence({ clientLogos = [], locale, copy }: HomeEvidenceProps) {
  const logos = clientLogoItems(clientLogos)

  return (
    <section className="home-section home-section--muted" id="evidence" aria-labelledby="home-evidence-title">
      <div className="home-container">
        <div className="home-evidence__grid">
          <div className="home-section-heading">
            <p className="home-kicker">{copy.eyebrow}</p>
            <h2 id="home-evidence-title" className="home-heading">{copy.title}</h2>
            <p className="home-lead">{copy.description}</p>
            <div className="home-evidence__links">
              <Link className="home-text-link" href={`/${locale}/faq`}>{copy.faqCta}<ArrowRight aria-hidden="true" size={16} /></Link>
              <Link className="home-text-link" href={`/${locale}/privacy`}>{copy.privacyCta}<ArrowRight aria-hidden="true" size={16} /></Link>
            </div>
          </div>

          <div className="home-evidence-register">
            <figure className="home-evidence-register__intro">
              <div className="home-evidence-register__diagrams">
                <SignalDiagram kind="traffic" locale={locale} />
                <SignalDiagram kind="flow-zones" locale={locale} />
                <SignalDiagram kind="operations" locale={locale} />
              </div>
              <figcaption>
                <span className="home-data-label">{copy.sampleLabel}</span>
                <h3>{copy.sampleTitle}</h3>
                <p>{copy.sampleCaption}</p>
              </figcaption>
            </figure>
            {copy.trustItems.map((item) => (
              <div className="home-evidence-register__row" key={item.label}>
                <h3>{item.label}</h3>
                <p>{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        <ClientLogoRail locale={locale} logos={logos} />
      </div>
    </section>
  )
}
