'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface ClientLogo {
  id: string | number
  companyName: string
  websiteUrl?: string
  logo: {
    url: string
    alt?: string
  }
}

interface ClientLogosProps {
  logos?: ClientLogo[]
}

function LogoCard({ item, duplicate = false }: { item: ClientLogo; duplicate?: boolean }) {
  const image = (
    <Image
      src={item.logo.url}
      alt={duplicate ? '' : (item.logo.alt || item.companyName)}
      fill
      sizes="(max-width: 767px) 50vw, (max-width: 1023px) 25vw, 17vw"
      className="client-logo-image object-contain"
    />
  )

  const className = 'group relative block h-20 overflow-hidden bg-transparent sm:h-24'

  if (!item.websiteUrl) {
    return (
      <div className={className} title={item.companyName}>
        {image}
      </div>
    )
  }

  return (
    <a
      href={item.websiteUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      title={item.companyName}
      aria-label={`Visit ${item.companyName} website`}
      tabIndex={duplicate ? -1 : undefined}
    >
      {image}
    </a>
  )
}

export function ClientLogos({ logos }: ClientLogosProps) {
  const items = logos?.filter((item) => item.logo?.url) ?? []
  const [currentIndex, setCurrentIndex] = useState(0)
  const [perView, setPerView] = useState(6)
  const [transitionEnabled, setTransitionEnabled] = useState(true)
  const pointerStartX = useRef<number | null>(null)

  const canSlide = items.length > perView
  const slides = canSlide ? [...items, ...items.slice(0, perView)] : items

  const goNext = () => {
    if (canSlide) setCurrentIndex((index) => index + 1)
  }

  const goPrevious = () => {
    if (!canSlide) return

    if (currentIndex === 0) {
      setTransitionEnabled(false)
      setCurrentIndex(items.length)
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setTransitionEnabled(true)
          setCurrentIndex(items.length - 1)
        })
      })
      return
    }

    setCurrentIndex((index) => index - 1)
  }

  useEffect(() => {
    const updatePerView = () => {
      const nextPerView = window.innerWidth < 768 ? 2 : window.innerWidth < 1025 ? 4 : 6
      setPerView(nextPerView)
      setTransitionEnabled(false)
      setCurrentIndex(0)
      requestAnimationFrame(() => setTransitionEnabled(true))
    }

    updatePerView()
    window.addEventListener('resize', updatePerView)
    return () => window.removeEventListener('resize', updatePerView)
  }, [])

  useEffect(() => {
    if (!canSlide || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const interval = window.setInterval(() => {
      setCurrentIndex((index) => index + 1)
    }, 2000)
    return () => window.clearInterval(interval)
  }, [canSlide])

  const handleTransitionEnd = () => {
    if (currentIndex < items.length) return

    setTransitionEnabled(false)
    setCurrentIndex(0)
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setTransitionEnabled(true))
    })
  }

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    pointerStartX.current = event.clientX
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    if (pointerStartX.current === null) return
    const distance = event.clientX - pointerStartX.current
    pointerStartX.current = null

    if (distance > 40) goPrevious()
    if (distance < -40) goNext()
  }

  if (items.length === 0) return null

  return (
    <div
      className="relative mx-auto mt-12 max-w-6xl px-8 sm:px-10"
      aria-label="Client logo carousel"
    >
      <div
        className="overflow-hidden touch-pan-y"
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerCancel={() => { pointerStartX.current = null }}
      >
        <div
          className="flex"
          style={{
            transform: `translate3d(-${currentIndex * (100 / perView)}%, 0, 0)`,
            transition: transitionEnabled ? 'transform 300ms ease' : 'none',
          }}
          onTransitionEnd={handleTransitionEnd}
        >
          {slides.map((item, index) => (
            <div
              className="shrink-0 px-1"
              style={{ width: `${100 / perView}%` }}
              key={`${item.id}-${index}`}
            >
              <LogoCard item={item} duplicate={index >= items.length} />
            </div>
          ))}
        </div>
      </div>

      {canSlide && (
        <>
          <button
            type="button"
            onClick={goPrevious}
            className="absolute left-0 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-red-600 transition-colors hover:bg-black hover:text-white sm:h-10 sm:w-10"
            aria-label="Previous client logos"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            type="button"
            onClick={goNext}
            className="absolute right-0 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-red-600 transition-colors hover:bg-black hover:text-white sm:h-10 sm:w-10"
            aria-label="Next client logos"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </>
      )}

      <style>{`
        html.dark .client-logo-image {
          filter:
            drop-shadow(1px 0 0 rgba(255, 255, 255, 0.72))
            drop-shadow(-1px 0 0 rgba(255, 255, 255, 0.72))
            drop-shadow(0 1px 0 rgba(255, 255, 255, 0.72))
            drop-shadow(0 -1px 0 rgba(255, 255, 255, 0.72))
            drop-shadow(0 0 2px rgba(255, 255, 255, 0.18));
        }

        @media (prefers-reduced-motion: reduce) {
          [aria-label="Client logo carousel"] > div > div {
            transition: none !important;
          }
        }
      `}</style>
    </div>
  )
}
