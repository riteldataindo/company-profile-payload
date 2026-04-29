'use client'

import { useEffect, useState, useRef } from 'react'
import { ScrollReveal } from './ScrollReveal'
import { useTheme } from '@/components/layout/ThemeProvider'

interface DeploymentDot {
  cityName: string
  longitude: number
  latitude: number
  isMajor?: boolean
}

const fallbackDeployments: DeploymentDot[] = [
  { cityName: 'Medan', longitude: 98.67, latitude: 3.59, isMajor: false },
  { cityName: 'Pekanbaru', longitude: 101.45, latitude: 0.51, isMajor: false },
  { cityName: 'Padang', longitude: 100.35, latitude: -0.95, isMajor: false },
  { cityName: 'Palembang', longitude: 104.75, latitude: -2.98, isMajor: false },
  { cityName: 'Lampung', longitude: 105.26, latitude: -5.43, isMajor: false },
  { cityName: 'Jakarta', longitude: 106.85, latitude: -6.21, isMajor: true },
  { cityName: 'Bandung', longitude: 107.61, latitude: -6.91, isMajor: false },
  { cityName: 'Semarang', longitude: 110.42, latitude: -6.97, isMajor: false },
  { cityName: 'Surabaya', longitude: 112.75, latitude: -7.25, isMajor: true },
  { cityName: 'Malang', longitude: 112.63, latitude: -7.98, isMajor: false },
  { cityName: 'Bali', longitude: 115.19, latitude: -8.41, isMajor: true },
  { cityName: 'Kupang', longitude: 123.59, latitude: -10.17, isMajor: false },
  { cityName: 'Pontianak', longitude: 109.34, latitude: -0.02, isMajor: false },
  { cityName: 'Samarinda', longitude: 117.15, latitude: -0.50, isMajor: false },
  { cityName: 'Balikpapan', longitude: 116.83, latitude: -1.27, isMajor: false },
  { cityName: 'Manado', longitude: 124.84, latitude: 1.47, isMajor: false },
  { cityName: 'Makassar', longitude: 119.43, latitude: -5.14, isMajor: true },
  { cityName: 'Kendari', longitude: 122.51, latitude: -3.97, isMajor: false },
  { cityName: 'Jayapura', longitude: 140.72, latitude: -2.54, isMajor: true },
  { cityName: 'Sorong', longitude: 131.25, latitude: -0.88, isMajor: false },
]

const TILE_URLS = {
  dark: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
  light: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
}

function IndonesiaMap({ dots, resolved }: { dots: DeploymentDot[]; resolved: 'light' | 'dark' }) {
  const mapRef = useRef<HTMLDivElement>(null)
  const leafletMap = useRef<L.Map | null>(null)
  const tileLayerRef = useRef<L.TileLayer | null>(null)

  useEffect(() => {
    if (!mapRef.current || leafletMap.current) return

    let map: L.Map

    import('leaflet').then((L) => {
      if (!mapRef.current || leafletMap.current) return

      map = L.map(mapRef.current, {
        center: [-2.5, 117],
        zoom: 5,
        minZoom: 4,
        maxZoom: 10,
        zoomControl: false,
        attributionControl: false,
        scrollWheelZoom: false,
      })

      L.control.zoom({ position: 'bottomright' }).addTo(map)

      const tileLayer = L.tileLayer(TILE_URLS[resolved], {
        subdomains: 'abcd',
      }).addTo(map)
      tileLayerRef.current = tileLayer

      dots.forEach((city, i) => {
        const size = city.isMajor ? 14 : 9
        const icon = L.divIcon({
          className: 'deployment-dot',
          html: `<span class="deployment-marker ${city.isMajor ? 'major' : 'minor'}" style="animation-delay:${(i % 7) * 0.4}s"></span>`,
          iconSize: [size, size],
          iconAnchor: [size / 2, size / 2],
        })

        const marker = L.marker([city.latitude, city.longitude], { icon })
          .addTo(map)

        marker.bindTooltip(city.cityName, {
          permanent: city.isMajor,
          direction: 'top',
          offset: [0, city.isMajor ? -10 : -6],
          className: 'deployment-tooltip',
        })
      })

      leafletMap.current = map

      setTimeout(() => map.invalidateSize(), 100)
    })

    return () => {
      if (leafletMap.current) {
        leafletMap.current.remove()
        leafletMap.current = null
      }
    }
  }, [dots, resolved])

  useEffect(() => {
    if (!tileLayerRef.current) return
    tileLayerRef.current.setUrl(TILE_URLS[resolved])
  }, [resolved])

  return <div ref={mapRef} className="h-[300px] w-full rounded-2xl sm:h-[400px] lg:h-[480px]" />
}

interface DeploymentMapProps {
  dict: Record<string, any>
  locations?: DeploymentDot[]
}

export function DeploymentMap({ dict, locations }: DeploymentMapProps) {
  const [mounted, setMounted] = useState(false)
  const { resolved } = useTheme()
  const dots = locations && locations.length > 0 ? locations : fallbackDeployments

  useEffect(() => { setMounted(true) }, [])

  return (
    <div>
      <div className="mb-12 text-center">
        <ScrollReveal>
          <h2 className="mb-3 text-3xl font-bold tracking-tight md:text-4xl">{dict.coverage.title}</h2>
        </ScrollReveal>
        <ScrollReveal delay={100}>
          <p className="mx-auto max-w-xl text-base text-text-secondary">{dict.coverage.subtitle}</p>
        </ScrollReveal>
      </div>

      <ScrollReveal>
        <div className="mx-auto max-w-5xl">
          {mounted ? (
            <IndonesiaMap dots={dots} resolved={resolved} />
          ) : (
            <div className="flex items-center justify-center rounded-2xl bg-bg-base" style={{ aspectRatio: '2.2/1' }}>
              <div className="text-sm text-text-muted">Loading map...</div>
            </div>
          )}
        </div>
      </ScrollReveal>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-8">
        <div className="flex items-center gap-2 text-xs text-text-muted">
          <span className="h-2.5 w-2.5 rounded-full bg-primary-500 shadow-[0_0_6px_rgba(239,68,68,0.5)]" />
          Active deployment
        </div>
        <div className="text-sm text-text-secondary">
          <span className="mr-1 font-mono text-lg font-bold text-text-primary">{dots.length}</span> cities
        </div>
        <div className="text-sm text-text-secondary">
          <span className="mr-1 font-mono text-lg font-bold text-text-primary">300+</span> stores
        </div>
      </div>
    </div>
  )
}
