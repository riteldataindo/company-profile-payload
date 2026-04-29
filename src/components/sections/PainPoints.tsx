'use client'

import { AlertCircle, Clock, TrendingDown } from 'lucide-react'
import { ScrollReveal } from './ScrollReveal'
import type { ComponentType } from 'react'

const icons: ComponentType<{ size?: number }>[] = [AlertCircle, Clock, TrendingDown]

interface PainPointsProps {
  dict: Record<string, any>
}

export function PainPoints({ dict }: PainPointsProps) {
  const painPoints = (dict.painPoints.items || []).map((item: any, i: number) => ({
    icon: icons[i] || AlertCircle,
    ...item,
  }))
  return (
    <section className="bg-bg-surface px-4 py-20 md:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <ScrollReveal>
            <h2 className="mb-3 text-3xl font-bold tracking-tight md:text-4xl">{dict.painPoints.title}</h2>
          </ScrollReveal>
          <ScrollReveal delay={100}>
            <p className="mx-auto max-w-xl text-base text-text-secondary">{dict.painPoints.subtitle}</p>
          </ScrollReveal>
        </div>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {painPoints.map((item, i) => (
            <ScrollReveal key={item.title} delay={i * 100} className="flex">
              <div className="flex flex-1 flex-col rounded-2xl border border-white/[0.06] bg-bg-card/60 p-6 backdrop-blur-xl transition-all duration-250 hover:-translate-y-1 hover:border-primary-500/20 hover:shadow-[0_0_20px_rgba(239,68,68,0.15)]">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary-500/10 text-primary-500">
                  <item.icon size={24} />
                </div>
                <h3 className="mb-2 text-lg font-semibold">{item.title}</h3>
                <p className="text-sm leading-relaxed text-text-secondary">{item.desc}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
