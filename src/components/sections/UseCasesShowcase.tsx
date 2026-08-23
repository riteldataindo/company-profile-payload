import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { HomeGateway } from '@/components/sections/home/HomeGateway'
import { getHomeCopy } from '@/lib/i18n/home-copy'

interface UseCasesShowcaseProps {
  locale: string
  headingLevel?: 'h1' | 'h2'
}

export function UseCasesShowcase({ locale, headingLevel = 'h2' }: UseCasesShowcaseProps) {
  const copy = getHomeCopy(locale)
  const isId = locale === 'id'
  const Heading = headingLevel

  return (
    <section className="bg-bg-base pt-28 pb-16 md:pt-32 md:pb-24">
      <div className="home-container">
        <header className="max-w-2xl">
          <p className="mb-3 font-mono text-xs font-semibold uppercase tracking-[0.14em] text-text-muted">
            {copy.gateway.eyebrow}
          </p>
          <Heading className="text-balance text-3xl font-bold tracking-tight text-text-primary md:text-5xl">
            {copy.gateway.title}
          </Heading>
          <p className="mt-4 text-pretty text-base leading-7 text-text-secondary">
            {copy.gateway.description}
          </p>
        </header>
      </div>

      <div className="[&_.home-section]:pt-10 [&_.home-section]:pb-0 [&_.home-section-heading]:sr-only">
        <HomeGateway locale={locale} copy={copy.gateway} />
      </div>

      <div className="home-container mt-10">
        <Link className="home-button home-button--primary" href={`/${locale}/demo`}>
          {isId ? 'Minta demo site-fit' : 'Request a site-fit demo'}
          <ArrowRight aria-hidden="true" size={18} />
        </Link>
      </div>
    </section>
  )
}
