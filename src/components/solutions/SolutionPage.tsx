import Link from 'next/link'
import { ArrowRight, Check, CircleAlert } from 'lucide-react'
import { getSolutionCopy, type CapabilityStatus, type SolutionKind } from '@/lib/i18n/solution-copy'
import { SolutionMeasuredStage } from './SolutionMeasuredStage'

type SolutionPageProps = {
  locale: string
  kind: SolutionKind
}

const statusLabel: Record<CapabilityStatus, { en: string; id: string }> = {
  available: { en: 'Available', id: 'Tersedia' },
  'deployment-dependent': { en: 'Deployment-dependent', id: 'Bergantung deployment' },
  'assessment-required': { en: 'Requires assessment', id: 'Perlu assessment' },
}

function StatusText({ status, locale }: { status: CapabilityStatus; locale: string }) {
  return (
    <span className="flex items-center gap-2 text-xs font-semibold text-text-muted">
      <span className="h-1.5 w-1.5 rounded-full bg-primary-600" aria-hidden="true" />
      {statusLabel[status][locale === 'id' ? 'id' : 'en']}
    </span>
  )
}

function SectionHeading({ eyebrow, title, text }: { eyebrow: string; title: string; text?: string }) {
  return (
    <div className="max-w-2xl">
      <p className="mb-3 font-mono text-xs font-semibold uppercase tracking-[0.14em] text-text-muted">{eyebrow}</p>
      <h2 className="text-balance text-2xl font-bold tracking-tight text-text-primary md:text-3xl">{title}</h2>
      {text && <p className="mt-3 text-pretty text-base leading-7 text-text-secondary">{text}</p>}
    </div>
  )
}

export function SolutionPage({ locale, kind }: SolutionPageProps) {
  const copy = getSolutionCopy(locale, kind)
  const demoHref = `/${locale}/demo?solution=${kind}`
  const featuresHref = `/${locale}/features?solution=${kind}`
  const isMall = kind === 'mall'
  const isId = locale === 'id'

  return (
    <div className="bg-bg-base">
      <section className="border-b border-border-subtle px-4 pb-16 pt-28 md:pb-24 md:pt-32">
        <div className={`mx-auto grid max-w-7xl gap-12 lg:items-end ${isMall ? 'lg:grid-cols-[0.85fr_1.15fr]' : 'lg:grid-cols-[1.05fr_0.95fr]'}`}>
          <div className={isMall ? 'lg:order-2' : undefined}>
            <p className="mb-5 font-mono text-xs font-semibold uppercase tracking-[0.14em] text-primary-600 dark:text-primary-400">{copy.eyebrow}</p>
            <h1 className="max-w-3xl text-balance text-4xl font-bold tracking-tight text-text-primary md:text-6xl">{copy.title}</h1>
            <p className="mt-6 max-w-2xl text-pretty text-lg leading-8 text-text-secondary">{copy.lead}</p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link href={demoHref} className="home-button home-button--primary">
                {copy.ctaLabel}<ArrowRight size={16} aria-hidden="true" />
              </Link>
              <Link href={featuresHref} className="home-button home-button--secondary">
                {copy.secondaryLabel}
              </Link>
            </div>
            <p className="mt-4 max-w-xl text-sm text-text-muted">{copy.ctaNote}</p>
          </div>
          <div className={isMall ? 'lg:order-1' : undefined}>
            <SolutionMeasuredStage kind={kind} locale={locale} />
          </div>
        </div>
      </section>

      <section className="px-4 py-16 md:py-20">
        <div className={`mx-auto grid max-w-7xl gap-12 ${isMall ? 'lg:grid-cols-[1.1fr_0.9fr]' : 'lg:grid-cols-[0.8fr_1.2fr]'}`}>
          <div className={isMall ? 'lg:order-2' : undefined}>
            <SectionHeading eyebrow={copy.eyebrow} title={copy.audienceTitle} />
            <p className="mt-5 max-w-xl text-base leading-7 text-text-secondary">{copy.audienceText}</p>
            <div className="mt-8 border-l-2 border-primary-600 pl-5">
              <p className="text-sm font-semibold text-text-primary">{copy.jobTitle}</p>
              <p className="mt-2 text-sm leading-6 text-text-secondary">{copy.jobText}</p>
            </div>
          </div>

          <div className={isMall ? 'lg:order-1' : undefined}>
            <SectionHeading eyebrow={isId ? 'Cara membaca' : 'How to read it'} title={copy.workflowTitle} />
            {isMall ? (
              <ol className="mt-7 border-l border-border-default pl-6">
                {copy.workflow.map((step, index) => (
                  <li key={step.title} className="relative pb-7 last:pb-0">
                    <span className="absolute -left-[1.7rem] top-1 h-2 w-2 rounded-full bg-primary-600" aria-hidden="true" />
                    <span className="font-mono text-xs font-semibold text-text-muted">0{index + 1}</span>
                    <h3 className="mt-2 text-base font-semibold text-text-primary">{step.title}</h3>
                    <p className="mt-2 max-w-xl text-sm leading-6 text-text-secondary">{step.text}</p>
                  </li>
                ))}
              </ol>
            ) : (
              <ol className="mt-7 grid border-t border-border-default md:grid-cols-3">
                {copy.workflow.map((step, index) => (
                  <li key={step.title} className="border-b border-border-subtle py-5 md:border-b-0 md:border-r md:px-5 md:first:pl-0 md:last:border-r-0 md:last:pr-0">
                    <span className="font-mono text-xs font-semibold text-text-muted">0{index + 1}</span>
                    <h3 className="mt-5 text-base font-semibold text-text-primary">{step.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-text-secondary">{step.text}</p>
                  </li>
                ))}
              </ol>
            )}
          </div>
        </div>
      </section>

      <section className="border-y border-border-subtle bg-bg-surface px-4 py-16 md:py-20">
        <div className="mx-auto max-w-7xl">
          <SectionHeading eyebrow={isId ? 'Batas metrik' : 'Metric boundary'} title={copy.metricsTitle} text={isMall
            ? (isId ? 'Gate, lantai, zona, occupancy, dan dwell hanya bermakna sesuai batas serta denominator yang dipilih.' : 'Gate, floor, zone, occupancy, and dwell only mean what their selected boundary and denominator allow.')
            : (isId ? 'Setiap sinyal membutuhkan input, unit, keputusan, prasyarat, dan batasan yang jelas.' : 'Every signal needs a clear input, unit, decision, prerequisite, and limitation.')} />
          <div className="mt-8 border-t border-border-default">
            {copy.metrics.map((metric) => (
              <article key={metric.label} className="grid gap-5 border-b border-border-default py-7 lg:grid-cols-[0.45fr_1.55fr]">
                <div>
                  <h3 className="text-lg font-semibold text-text-primary">{metric.label}</h3>
                  <div className="mt-2"><StatusText status={metric.status} locale={locale} /></div>
                </div>
                <dl className="grid gap-x-6 gap-y-4 text-sm md:grid-cols-2">
                  <div><dt className="font-semibold text-text-primary">{isId ? 'Definisi' : 'Definition'}</dt><dd className="mt-1 leading-6 text-text-secondary">{metric.definition}</dd></div>
                  <div><dt className="font-semibold text-text-primary">{isId ? 'Unit' : 'Unit'}</dt><dd className="mt-1 leading-6 text-text-secondary">{metric.unit}</dd></div>
                  <div><dt className="font-semibold text-text-primary">{isId ? 'Keputusan' : 'Decision'}</dt><dd className="mt-1 leading-6 text-text-secondary">{metric.decision}</dd></div>
                  <div><dt className="font-semibold text-text-primary">{isId ? 'Prasyarat' : 'Prerequisite'}</dt><dd className="mt-1 leading-6 text-text-secondary">{metric.prerequisite}</dd></div>
                  <div className="md:col-span-2"><dt className="font-semibold text-text-primary">{isId ? 'Batasan' : 'Limitation'}</dt><dd className="mt-1 leading-6 text-text-secondary">{metric.limitation}</dd></div>
                </dl>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-16 md:py-20">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2">
          <div className="border-t border-border-default pt-6">
            <SectionHeading eyebrow={isId ? 'Site-fit' : 'Site fit'} title={copy.requirementsTitle} />
            <ul className="mt-6 space-y-4">
              {copy.requirements.map((item) => <li key={item} className="flex gap-3 text-sm leading-6 text-text-secondary"><Check size={17} className="mt-1 shrink-0 text-emerald-600" aria-hidden="true" /><span>{item}</span></li>)}
            </ul>
          </div>
          <div className="border-t border-border-default pt-6">
            <SectionHeading eyebrow={isId ? 'Batasan' : 'Limitations'} title={copy.limitationsTitle} />
            <ul className="mt-6 space-y-4">
              {copy.limitations.map((item) => <li key={item} className="flex gap-3 text-sm leading-6 text-text-secondary"><CircleAlert size={17} className="mt-1 shrink-0 text-amber-600" aria-hidden="true" /><span>{item}</span></li>)}
            </ul>
          </div>
        </div>
      </section>

      <section className="border-y border-border-subtle bg-bg-surface px-4 py-16 md:py-20">
        <div className="mx-auto grid max-w-7xl border-t border-border-default md:grid-cols-3">
          {[
            { title: copy.deploymentTitle, text: copy.deploymentText, href: `/${locale}/deployment`, link: isId ? 'Baca deployment' : 'Review deployment' },
            { title: copy.privacyTitle, text: copy.privacyText, href: `/${locale}/privacy`, link: isId ? 'Baca privasi' : 'Review privacy' },
            { title: copy.evidenceTitle, text: copy.evidenceText },
          ].map((item) => (
            <article key={item.title} className="border-b border-border-default py-6 md:border-r md:px-6 md:first:pl-0 md:last:border-r-0 md:last:pr-0">
              <h2 className="text-base font-semibold text-text-primary">{item.title}</h2>
              <p className="mt-3 text-sm leading-6 text-text-secondary">{item.text}</p>
              {item.href && <Link href={item.href} className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300">{item.link}<ArrowRight size={15} aria-hidden="true" /></Link>}
            </article>
          ))}
        </div>
      </section>

      <section className="px-4 py-16 md:py-20">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-6 border-t border-border-default pt-8 md:flex-row md:items-end">
          <div>
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-text-muted">{copy.eyebrow}</p>
            <h2 className="mt-3 max-w-2xl text-3xl font-bold tracking-tight text-text-primary md:text-4xl">{copy.ctaLabel}</h2>
            <p className="mt-3 max-w-2xl text-base leading-7 text-text-secondary">{copy.ctaNote}</p>
          </div>
          <Link href={demoHref} className="home-button home-button--primary shrink-0">
            {copy.ctaLabel}<ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </section>
    </div>
  )
}
