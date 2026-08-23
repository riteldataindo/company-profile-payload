'use client'

import Image from 'next/image'
import { Box, ScanLine, View } from 'lucide-react'
import { useState, type MouseEvent } from 'react'

type SignalMode = 'coverage' | 'entry' | 'targets'

interface HeroSignalStageProps {
  alt: string
  caption: string
  label: string
  locale: string
}

const modes: Array<{ value: SignalMode; icon: typeof View; en: string; id: string }> = [
  { value: 'coverage', icon: View, en: 'Coverage', id: 'Cakupan' },
  { value: 'entry', icon: ScanLine, en: 'Entry line', id: 'Garis' },
  { value: 'targets', icon: Box, en: 'Targets', id: 'Target' },
]

export function HeroSignalStage({ alt, caption, label, locale }: HeroSignalStageProps) {
  const [mode, setMode] = useState<SignalMode>('coverage')
  const [animate, setAnimate] = useState(false)
  const isId = locale === 'id'

  function selectMode(event: MouseEvent<HTMLButtonElement>, nextMode: SignalMode) {
    setAnimate(event.detail > 0)
    setMode(nextMode)
  }

  return (
    <figure className="home-hero__instrument" aria-labelledby="home-instrument-title">
      <div className="spatial-stage editorial-media">
        <Image
          src="/editorial/home-device-coverage-v4.webp"
          alt={alt}
          width={1248}
          height={832}
          priority
          sizes="(min-width: 1024px) 48vw, 100vw"
        />

        <div
          aria-hidden="true"
          className="spatial-stage__overlay"
          data-animate={animate ? 'true' : 'false'}
          data-mode={mode}
        >
          <svg className="spatial-stage__geometry" viewBox="0 0 150 100" preserveAspectRatio="xMidYMid slice">
            <defs>
              <linearGradient id="coverage-fill" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0" stopColor="#3B82F6" stopOpacity="0.06" />
                <stop offset="1" stopColor="#3B82F6" stopOpacity="0.22" />
              </linearGradient>
            </defs>
            <path className="spatial-stage__coverage" d="M71 8 L78 8 L104 86 L42 86 Z" />
            <path className="spatial-stage__entry" d="M38 78 L108 78" />
            <path className="spatial-stage__route" d="M46 86 C54 74 62 62 70 52 S86 34 96 24" />
          </svg>
          <span className="spatial-stage__target spatial-stage__target--one"><b>T-01</b></span>
          <span className="spatial-stage__target spatial-stage__target--two"><b>T-02</b></span>
          <span className="spatial-stage__target spatial-stage__target--three"><b>T-03</b></span>
        </div>

        <div className="spatial-stage__hud" aria-hidden="true">
          <span>CAM-01</span>
          <span>{isId ? 'SAMPEL KONSEPTUAL' : 'CONCEPTUAL SAMPLE'}</span>
        </div>

        <div
          className="spatial-stage__controls"
          role="group"
          aria-label={isId ? 'Lapisan visual konseptual' : 'Conceptual visual layers'}
        >
          {modes.map((item) => {
            const Icon = item.icon
            const selected = mode === item.value
            return (
              <button
                key={item.value}
                type="button"
                aria-pressed={selected}
                className="spatial-stage__control"
                data-active={selected ? 'true' : 'false'}
                onClick={(event) => selectMode(event, item.value)}
              >
                <Icon aria-hidden="true" size={15} strokeWidth={1.8} />
                <span>{isId ? item.id : item.en}</span>
              </button>
            )
          })}
        </div>
      </div>

      <figcaption>
        <span className="home-data-label">{label}</span>
        <strong id="home-instrument-title">{caption}</strong>
      </figcaption>
    </figure>
  )
}
