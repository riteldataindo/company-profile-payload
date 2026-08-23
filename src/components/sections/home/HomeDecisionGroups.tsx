import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import type { HomeCopy } from '@/lib/i18n/home-copy'
import { SignalDiagram } from './SignalDiagram'

interface HomeDecisionGroupsProps {
  locale: string
  copy: HomeCopy['decisions']
}

const diagramKinds = ['traffic', 'flow-zones', 'operations'] as const

export function HomeDecisionGroups({ locale, copy }: HomeDecisionGroupsProps) {
  return (
    <section className="home-section" id="decisions" aria-labelledby="home-decisions-title">
      <div className="home-container">
        <div className="home-section-heading">
          <p className="home-kicker">{copy.eyebrow}</p>
          <h2 id="home-decisions-title" className="home-heading">{copy.title}</h2>
          <p className="home-lead">{copy.description}</p>
        </div>

        <div className="home-decision-list">
          {copy.groups.map((group, index) => (
            <article className="home-decision-row" key={group.label}>
              <div className="home-decision-row__index" aria-hidden="true">0{index + 1}</div>
              <div className="home-decision-row__copy">
                <p className="home-data-label">{group.label}</p>
                <h3>{group.title}</h3>
                <p>{group.description}</p>
                <ul>
                  {group.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <SignalDiagram
                kind={diagramKinds[index]}
                locale={locale}
                caption={locale === 'id' ? 'Diagram konseptual · bukan output produksi.' : 'Conceptual diagram · not production output.'}
              />
            </article>
          ))}
        </div>

        <div className="home-section-footer home-section-footer--split">
          <p className="home-caption">{copy.availability}</p>
          <Link className="home-text-link" href={`/${locale}/features`}>
            {copy.cta}
            <ArrowRight aria-hidden="true" size={16} />
          </Link>
        </div>
      </div>
    </section>
  )
}
