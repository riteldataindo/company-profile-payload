'use client'

import Link from 'next/link'
import { Sparkles, Play } from 'lucide-react'

interface HeroProps {
  locale: string
  dict: Record<string, any>
}

export function Hero({ locale, dict }: HeroProps) {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden pt-24">
      <div
        className="pointer-events-none absolute top-[20%] left-1/2 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(239,68,68,0.12) 0%, transparent 70%)' }}
        aria-hidden="true"
      />
      <div className="relative z-10 mx-auto w-full max-w-5xl px-4 text-center">
        <p className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary-400">
          <Sparkles size={14} />
          {dict.hero.badge}
        </p>
        <h1 className="mb-5 text-4xl font-bold leading-[1.1] tracking-tight md:text-7xl">
          {dict.hero.title}
          <br />
          <span className="text-primary-500">{dict.hero.titleHighlight}</span>
        </h1>
        <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-text-secondary md:text-xl">
          {dict.hero.subtitle}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            href={`/${locale}/demo`}
            className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-7 py-3 text-base font-semibold text-white transition-all hover:bg-primary-700 hover:shadow-[0_0_20px_rgba(239,68,68,0.15)]"
          >
            <Play size={16} />
            {dict.hero.ctaPrimary}
          </Link>
          <Link
            href={`/${locale}/features`}
            className="inline-flex items-center gap-2 rounded-lg border border-primary-600 px-7 py-3 text-base font-semibold text-primary-500 transition-all hover:bg-primary-600/10"
          >
            {dict.hero.ctaSecondary}
          </Link>
        </div>
      </div>
    </section>
  )
}
