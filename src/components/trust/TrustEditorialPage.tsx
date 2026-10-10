import Link from 'next/link'
import { ArrowRight, CircleHelp } from 'lucide-react'
import type { TrustPageCopy } from '@/lib/i18n/trust-copy'
import { TrustDiagram } from './TrustDiagram'

interface TrustEditorialPageProps {
  locale: string
  copy: TrustPageCopy
}

export function TrustEditorialPage({ locale, copy }: TrustEditorialPageProps) {
  return (
    <article className="px-4 pt-28 pb-16 md:pt-32 md:pb-24">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-10 border-b border-border-default pb-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
          <header className="max-w-3xl">
            <p className="mb-4 font-mono text-xs font-semibold uppercase tracking-[0.16em] text-text-muted">{copy.eyebrow}</p>
            <h1 className="text-4xl font-bold tracking-tight md:text-6xl">{copy.title}</h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-text-secondary md:text-xl">{copy.intro}</p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link href={`/${locale}${copy.primaryHref}`} className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-5 py-3 text-sm font-semibold text-white transition-[background-color,transform] hover:bg-primary-700 active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600">
                {copy.primaryCta}<ArrowRight size={16} aria-hidden="true" />
              </Link>
              <Link href={`/${locale}${copy.secondaryHref}`} className="inline-flex items-center gap-2 rounded-lg border border-border-default px-5 py-3 text-sm font-semibold transition-[border-color,transform] hover:border-text-primary active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600">
                {copy.secondaryCta}
              </Link>
            </div>
          </header>

          <aside className="border-l-2 border-primary-600 pl-5" aria-label={copy.statusLabel}>
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-text-muted">{copy.statusLabel}</p>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-text-secondary">{copy.statusBody}</p>
          </aside>
        </div>

        <div className="mt-16">
          <TrustDiagram {...copy.diagram} />
        </div>

        <div className="mt-16 grid gap-16">
          {copy.sections.map((section) => (
            <section className="grid gap-8 lg:grid-cols-[0.7fr_1.3fr]" key={section.title} aria-labelledby={`trust-section-${section.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}>
              <div>
                <h2 id={`trust-section-${section.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`} className="text-2xl font-bold tracking-tight md:text-3xl">{section.title}</h2>
                {section.intro && <p className="mt-3 max-w-xl text-base leading-relaxed text-text-secondary">{section.intro}</p>}
              </div>
              <div className="border-t border-border-default">
                {section.items.map((item) => (
                  <article key={item.label} className="grid gap-3 border-b border-border-default py-5 sm:grid-cols-[minmax(9rem,0.55fr)_minmax(0,1.45fr)]">
                    <div>
                      <h3 className="text-base font-semibold">{item.label}</h3>
                      {item.status && <p className="mt-2 font-mono text-[0.68rem] font-semibold uppercase tracking-[0.1em] text-text-muted">{item.status}</p>}
                    </div>
                    <p className="text-sm leading-relaxed text-text-secondary">{item.body}</p>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>

        <aside className="mt-16 flex max-w-4xl gap-4 border-l-2 border-border-default py-2 pl-5" aria-labelledby="trust-unknowns-title">
          <CircleHelp className="mt-0.5 shrink-0 text-primary-600" size={22} aria-hidden="true" />
          <div>
            <h2 id="trust-unknowns-title" className="text-lg font-semibold">{copy.unknownsTitle}</h2>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-text-secondary">{copy.unknownsBody}</p>
          </div>
        </aside>

        <footer className="mt-16 flex flex-wrap items-center justify-between gap-4 border-t border-border-subtle pt-8">
          <p className="max-w-xl text-sm leading-relaxed text-text-secondary">
            {copy.statusBody}
          </p>
          <Link
            href={`/${locale}${copy.primaryHref}`}
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary-600 underline decoration-primary-600/40 underline-offset-4 hover:text-primary-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
          >
            {copy.primaryCta}
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </footer>
      </div>
    </article>
  )
}
