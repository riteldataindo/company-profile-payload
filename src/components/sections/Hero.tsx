'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { Sparkles, Play } from 'lucide-react'

interface HeroProps {
  locale: string
  dict: Record<string, any>
}

function CountUp({ target, suffix, decimal }: { target: number; suffix: string; decimal?: boolean }) {
  const ref = useRef<HTMLSpanElement>(null)
  const counted = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || counted.current) return
        counted.current = true
        const duration = 1600
        const start = performance.now()
        const step = (now: number) => {
          const t = Math.min((now - start) / duration, 1)
          const ease = 1 - Math.pow(1 - t, 3)
          const val = ease * target
          el.textContent = (decimal ? val.toFixed(1) : Math.round(val).toString()) + suffix
          if (t < 1) requestAnimationFrame(step)
        }
        requestAnimationFrame(step)
      },
      { threshold: 0.5 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [target, suffix, decimal])

  return <span ref={ref} className="font-mono text-3xl font-bold tabular-nums text-text-primary md:text-4xl">0{suffix}</span>
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
        <div className="mb-16 flex flex-wrap items-center justify-center gap-4">
          <Link
            href={`/${locale}/demo`}
            className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-7 py-3 text-base font-semibold text-white transition-all hover:bg-primary-700 hover:shadow-[0_0_20px_rgba(239,68,68,0.15)]"
          >
            <Play size={16} />
            {dict.hero.ctaPrimary}
          </Link>
          <a
            href="#features"
            className="inline-flex items-center gap-2 rounded-lg border border-primary-600 px-7 py-3 text-base font-semibold text-primary-500 transition-all hover:bg-primary-600/10"
          >
            {dict.hero.ctaSecondary}
          </a>
        </div>
        <div className="mx-auto grid max-w-xl grid-cols-3 gap-8 rounded-2xl border border-white/[0.06] bg-bg-card/60 p-6 backdrop-blur-xl">
          <div className="text-center">
            <CountUp target={99.9} suffix="%" decimal />
            <div className="mt-1 text-xs text-text-muted">{dict.common.accuracy}</div>
          </div>
          <div className="text-center">
            <CountUp target={12} suffix="+" />
            <div className="mt-1 text-xs text-text-muted">{dict.common.analyticsFeatures}</div>
          </div>
          <div className="text-center">
            <CountUp target={300} suffix="+" />
            <div className="mt-1 text-xs text-text-muted">{dict.common.storesServed}</div>
          </div>
        </div>
      </div>
    </section>
  )
}
