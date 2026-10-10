import Link from 'next/link'
import { ArrowRight, ChevronDown, MessageCircle } from 'lucide-react'
import type { HomeCopy } from '@/lib/i18n/home-copy'

interface HomeFaqFooterTransitionProps {
  locale: string
  copy: HomeCopy['faq']
}

export function HomeFaqFooterTransition({ locale, copy }: HomeFaqFooterTransitionProps) {
  return (
    <section className="home-section home-section--faq" id="faq" aria-labelledby="home-faq-title">
      <div className="home-container home-faq__grid">
        <div className="home-section-heading">
          <p className="home-kicker">{copy.eyebrow}</p>
          <h2 id="home-faq-title" className="home-heading">{copy.title}</h2>
          <div className="home-faq__contact">
            <MessageCircle aria-hidden="true" size={18} />
            <span>{copy.footerLead}</span>
            <Link className="home-text-link" href={`/${locale}/contact`}>{copy.footerCta}<ArrowRight aria-hidden="true" size={16} /></Link>
          </div>
        </div>

        <div className="home-faq-list">
          {copy.items.map((item, index) => (
            <details key={item.question} className="home-faq-item" open={index === 0}>
              <summary>
                <span>{item.question}</span>
                <ChevronDown aria-hidden="true" size={18} />
              </summary>
              <p>{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
