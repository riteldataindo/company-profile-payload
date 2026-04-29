'use client'

import Link from 'next/link'
import { Play } from 'lucide-react'
import { ScrollReveal } from './ScrollReveal'

interface CtaBannerProps {
  locale: string
  dict: Record<string, any>
}

export function CtaBanner({ locale, dict }: CtaBannerProps) {
  return (
    <section className="relative overflow-hidden px-4 py-20 md:py-32">
      <div
        className="pointer-events-none absolute top-1/2 left-1/2 h-[400px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(239,68,68,0.18) 0%, transparent 70%)',
          animation: 'pulse-glow 4s ease-in-out infinite',
        }}
        aria-hidden="true"
      />
      <div className="relative z-10 mx-auto max-w-3xl text-center">
        <ScrollReveal>
          <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">{dict.cta.title}</h2>
        </ScrollReveal>
        <ScrollReveal delay={100}>
          <p className="mb-8 text-base text-text-secondary">{dict.cta.subtitle}</p>
        </ScrollReveal>
        <ScrollReveal delay={200}>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href={`/${locale}/demo`}
              className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-7 py-3 text-base font-semibold text-white transition-all hover:bg-primary-700 hover:shadow-[0_0_20px_rgba(239,68,68,0.15)]"
            >
              <Play size={16} />
              {dict.hero.ctaPrimary}
            </Link>
            <Link
              href={`/${locale}/contact`}
              className="inline-flex items-center gap-2 rounded-lg border border-primary-600 px-7 py-3 text-base font-semibold text-primary-500 transition-all hover:bg-primary-600/10"
            >
              {dict.common.contactUs}
            </Link>
          </div>
        </ScrollReveal>
      </div>
      <style>{`@keyframes pulse-glow { 0%,100% { opacity:.6;transform:translate(-50%,-50%) scale(1); } 50% { opacity:1;transform:translate(-50%,-50%) scale(1.15); } }`}</style>
    </section>
  )
}
