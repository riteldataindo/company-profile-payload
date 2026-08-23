'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, CircleAlert } from 'lucide-react'
import { useEffect, useState, type KeyboardEvent } from 'react'
import { getFeatureGroups, type SolutionKind } from '@/lib/i18n/solution-copy'
import { trackEvent } from '@/lib/analytics/events'

interface FeaturesGridProps {
  locale: string
  dict?: Record<string, any>
  features?: any[]
  headingLevel?: 'h1' | 'h2'
}

const solutionLabels: Record<SolutionKind, { en: string; id: string }> = {
  retail: { en: 'Retail', id: 'Retail' },
  mall: { en: 'Mall', id: 'Mall' },
}

type FeatureGroupId = 'traffic' | 'flow-zones' | 'operations'

const solutionKinds = ['retail', 'mall'] as const

function handleTabKey<T extends string>(
  event: KeyboardEvent<HTMLButtonElement>,
  values: readonly T[],
  active: T,
  select: (value: T) => void,
) {
  const currentIndex = values.indexOf(active)
  let nextIndex = currentIndex

  if (event.key === 'ArrowRight') nextIndex = (currentIndex + 1) % values.length
  else if (event.key === 'ArrowLeft') nextIndex = (currentIndex - 1 + values.length) % values.length
  else if (event.key === 'Home') nextIndex = 0
  else if (event.key === 'End') nextIndex = values.length - 1
  else return

  event.preventDefault()
  select(values[nextIndex])
  event.currentTarget.parentElement
    ?.querySelectorAll<HTMLButtonElement>('[role="tab"]')[nextIndex]
    ?.focus()
}

const featureVisuals: Record<SolutionKind, Record<FeatureGroupId, {
  src: string
  alt: { en: string; id: string }
  caption: { en: string; id: string }
}>> = {
  retail: {
    traffic: {
      src: '/editorial/device-pov-entry-line-v1.webp',
      alt: {
        en: 'Fictional device view with anonymous visitors, entry lines, a coverage boundary, and detection boxes.',
        id: 'POV perangkat fiktif dengan pengunjung anonim, entry line, batas coverage, dan kotak deteksi.',
      },
      caption: {
        en: 'Conceptual entry-line geometry; not production output or customer data.',
        id: 'Geometri entry line konseptual; bukan output produksi atau data pelanggan.',
      },
    },
    'flow-zones': {
      src: '/editorial/device-pov-retail-heatmap-v1.webp',
      alt: {
        en: 'Fictional overhead retail view with soft heatmap zones and route fragments.',
        id: 'POV retail fiktif dari atas dengan heatmap zona lembut dan fragmen jalur.',
      },
      caption: {
        en: 'Conceptual zone intensity and path context; not measured visitor activity.',
        id: 'Intensitas zona dan konteks jalur konseptual; bukan aktivitas pengunjung terukur.',
      },
    },
    operations: {
      src: '/editorial/device-pov-queue-zone-v1.webp',
      alt: {
        en: 'Fictional service area with an anonymous queue, monitored-zone boundary, and detection boxes.',
        id: 'Area layanan fiktif dengan antrean anonim, batas zona pantau, dan kotak deteksi.',
      },
      caption: {
        en: 'Conceptual queue and service-zone geometry; not a wait-time claim.',
        id: 'Geometri antrean dan zona layanan konseptual; bukan klaim waktu tunggu.',
      },
    },
  },
  mall: {
    traffic: {
      src: '/editorial/device-pov-bidirectional-v1.webp',
      alt: {
        en: 'Fictional mall entrance view with bidirectional threshold lines and anonymous visitor detection boxes.',
        id: 'POV entrance mall fiktif dengan line dua arah dan kotak deteksi pengunjung anonim.',
      },
      caption: {
        en: 'Conceptual bidirectional threshold geometry; not production output.',
        id: 'Geometri ambang dua arah konseptual; bukan output produksi.',
      },
    },
    'flow-zones': {
      src: '/editorial/device-pov-mall-coverage-v1.webp',
      alt: {
        en: 'Fictional two-level mall view with conceptual corridor paths, coverage zones, and anonymous targets.',
        id: 'POV mall dua lantai fiktif dengan jalur koridor, zona coverage, dan target anonim konseptual.',
      },
      caption: {
        en: 'Conceptual multi-floor coverage; property boundaries require site assessment.',
        id: 'Coverage multi-lantai konseptual; batas properti memerlukan asesmen lokasi.',
      },
    },
    operations: {
      src: '/editorial/device-pov-queue-zone-v1.webp',
      alt: {
        en: 'Fictional service area with an anonymous queue, monitored-zone boundary, and detection boxes.',
        id: 'Area layanan fiktif dengan antrean anonim, batas zona pantau, dan kotak deteksi.',
      },
      caption: {
        en: 'Conceptual service-zone view; availability depends on the approved deployment.',
        id: 'POV zona layanan konseptual; ketersediaan bergantung pada deployment yang disetujui.',
      },
    },
  },
}

function statusLabel(status: string, locale: string) {
  if (locale === 'id') {
    if (status === 'available') return 'Tersedia'
    if (status === 'deployment-dependent') return 'Bergantung deployment'
    return 'Perlu assessment'
  }
  if (status === 'available') return 'Available'
  if (status === 'deployment-dependent') return 'Deployment-dependent'
  return 'Requires assessment'
}

function statusDotClass(status: string) {
  if (status === 'available') return 'bg-emerald-600'
  if (status === 'deployment-dependent') return 'bg-amber-500'
  return 'bg-text-muted'
}

export function FeaturesGrid({ locale, headingLevel = 'h2' }: FeaturesGridProps) {
  const [solution, setSolution] = useState<SolutionKind>('retail')
  const [activeGroupId, setActiveGroupId] = useState<FeatureGroupId>('traffic')
  const groups = getFeatureGroups(locale, solution)
  const activeGroup = groups.find((group) => group.id === activeGroupId) || groups[0]
  const activeVisual = featureVisuals[solution][activeGroupId]
  const groupIds = groups.map((group) => group.id)
  const Heading = headingLevel
  const isId = locale === 'id'

  useEffect(() => {
    const requestedSolution = new URLSearchParams(window.location.search).get('solution')
    if (requestedSolution === 'retail' || requestedSolution === 'mall') {
      setSolution(requestedSolution)
      setActiveGroupId('traffic')
    }
  }, [])

  function selectSolution(kind: SolutionKind) {
    setSolution(kind)
    setActiveGroupId('traffic')
    trackEvent('solution_select', { locale, solution: kind, placement: 'features' })
  }

  function selectGroup(groupId: FeatureGroupId) {
    setActiveGroupId(groupId)
    trackEvent('feature_explore', { locale, solution, group_id: groupId })
  }

  if (!activeGroup) return null

  return (
    <section className="bg-bg-base px-4 pt-28 pb-16 md:pt-32 md:pb-24" id="features">
      <div className="mx-auto max-w-7xl">
        <header className="grid gap-6 border-b border-border-default pb-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
          <div>
            <p className="mb-4 font-mono text-xs font-semibold uppercase tracking-[0.14em] text-text-muted">
              {isId ? 'Kapabilitas yang dapat ditinjau' : 'Capabilities you can review'}
            </p>
            <Heading className="max-w-xl text-balance text-3xl font-bold tracking-tight text-text-primary md:text-5xl">
              {isId ? 'Dari sinyal menuju keputusan operasional.' : 'From defined signals to operating decisions.'}
            </Heading>
          </div>
          <div className="flex max-w-2xl flex-col gap-5 lg:justify-self-end">
            <p className="text-pretty text-base leading-7 text-text-secondary">
              {isId
                ? 'Pilih konteks dan pertanyaan operasional. Definisi, unit, prasyarat, serta batasannya ditampilkan berdekatan.'
                : 'Choose a context and an operating question. Definitions, units, prerequisites, and limitations stay together.'}
            </p>
            <Link href={`/${locale}/demo?solution=${solution}`} className="home-button home-button--primary self-start">
              {isId ? 'Minta demo site-fit' : 'Request a site-fit demo'}
              <ArrowRight size={15} aria-hidden="true" />
            </Link>
          </div>
        </header>

        <div className="mt-8 flex gap-8 border-b border-border-default" role="tablist" aria-label={isId ? 'Konteks solusi' : 'Solution context'}>
          {solutionKinds.map((kind) => {
            const selected = solution === kind
            return (
              <button
                key={kind}
                id={`solution-${kind}-tab`}
                type="button"
                role="tab"
                aria-controls="feature-solution-panel"
                aria-selected={selected}
                tabIndex={selected ? 0 : -1}
                onClick={() => selectSolution(kind)}
                onKeyDown={(event) => handleTabKey(event, solutionKinds, solution, (next) => {
                  setSolution(next)
                  setActiveGroupId('traffic')
                  trackEvent('solution_select', { locale, solution: next, placement: 'features' })
                })}
                className={`relative min-h-11 pb-3 text-sm font-semibold transition-[color,transform] active:scale-[0.97] ${selected ? 'text-text-primary after:absolute after:inset-x-0 after:-bottom-px after:h-0.5 after:bg-primary-600' : 'text-text-muted hover:text-text-primary'}`}
              >
                {solutionLabels[kind][isId ? 'id' : 'en']}
              </button>
            )
          })}
        </div>

        <div id="feature-solution-panel" role="tabpanel" aria-labelledby={`solution-${solution}-tab`}>
          <div className="mt-8 flex gap-2 overflow-x-auto border-b border-border-subtle pb-3" role="tablist" aria-label={isId ? 'Kelompok keputusan' : 'Decision groups'}>
            {groups.map((group) => {
              const selected = group.id === activeGroup.id
              return (
                <button
                  key={group.id}
                  id={`feature-${solution}-${group.id}-tab`}
                  type="button"
                  role="tab"
                  aria-controls="feature-detail-panel"
                  aria-selected={selected}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => selectGroup(group.id)}
                  onKeyDown={(event) => handleTabKey(event, groupIds, activeGroup.id, (next) => {
                    setActiveGroupId(next)
                    trackEvent('feature_explore', { locale, solution, group_id: next })
                  })}
                  className={`min-h-11 min-w-max rounded-md px-3 py-2 text-sm font-semibold transition-[background-color,color,transform] active:scale-[0.97] ${selected ? 'bg-text-primary text-bg-base' : 'text-text-secondary hover:bg-bg-surface hover:text-text-primary'}`}
                >
                  {group.title}
                </button>
              )
            })}
          </div>

          <div
            id="feature-detail-panel"
            role="tabpanel"
            aria-labelledby={`feature-${solution}-${activeGroup.id}-tab`}
            tabIndex={0}
            className="grid gap-10 py-10 lg:grid-cols-[minmax(14rem,0.65fr)_minmax(0,1.35fr)]"
          >
          <div>
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-text-muted">{activeGroup.title}</p>
            <h2 className="mt-3 max-w-lg text-balance text-2xl font-bold tracking-tight text-text-primary md:text-3xl">{activeGroup.question}</h2>
            <Link href={`/${locale}/solutions/${solution}`} className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary-600 transition-colors hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300">
              {isId ? `Baca alur ${solutionLabels[solution].id}` : `Read the ${solutionLabels[solution].en} workflow`}
              <ArrowRight size={15} aria-hidden="true" />
            </Link>
          </div>

          <div>
            <figure className="mb-8">
              <div className="device-pov-media feature-detail-swap" key={`${solution}-${activeGroup.id}`}>
                <Image
                  src={activeVisual.src}
                  alt={activeVisual.alt[isId ? 'id' : 'en']}
                  width={1672}
                  height={941}
                  sizes="(min-width: 1024px) 58vw, 100vw"
                  className="block aspect-video w-full object-cover"
                />
              </div>
              <figcaption className="mt-3 text-xs leading-5 text-text-muted">
                <span className="mr-2 font-mono font-semibold uppercase tracking-[0.12em] text-primary-600 dark:text-primary-400">
                  {isId ? 'POV perangkat konseptual' : 'Conceptual device POV'}
                </span>
                {activeVisual.caption[isId ? 'id' : 'en']}
              </figcaption>
            </figure>

            <div className="border-t border-border-default">
              {activeGroup.capabilities.map((capability) => (
                <article key={capability.id} className="border-b border-border-default py-7">
                  <div className="grid gap-4 md:grid-cols-[minmax(12rem,0.55fr)_minmax(0,1.45fr)]">
                    <div>
                      <h3 className="text-lg font-semibold text-text-primary">{capability.name}</h3>
                      <p className="mt-2 flex items-center gap-2 text-xs font-semibold text-text-muted">
                        <span className={`h-1.5 w-1.5 rounded-full ${statusDotClass(capability.status)}`} aria-hidden="true" />
                        {statusLabel(capability.status, locale)}
                      </p>
                      {capability.contextNote && <p className="mt-4 border-l-2 border-primary-600 pl-3 text-sm leading-6 text-text-secondary">{capability.contextNote}</p>}
                    </div>
                    <dl className="grid gap-x-6 gap-y-4 text-sm sm:grid-cols-2">
                      <div><dt className="font-semibold text-text-primary">{isId ? 'Definisi' : 'Definition'}</dt><dd className="mt-1 leading-6 text-text-secondary">{capability.definition}</dd></div>
                      <div><dt className="font-semibold text-text-primary">{isId ? 'Unit' : 'Unit'}</dt><dd className="mt-1 leading-6 text-text-secondary">{capability.unit}</dd></div>
                      <div><dt className="font-semibold text-text-primary">{isId ? 'Keputusan' : 'Decision'}</dt><dd className="mt-1 leading-6 text-text-secondary">{capability.decision}</dd></div>
                      <div><dt className="font-semibold text-text-primary">{isId ? 'Prasyarat' : 'Prerequisite'}</dt><dd className="mt-1 leading-6 text-text-secondary">{capability.prerequisite}</dd></div>
                      <div className="sm:col-span-2"><dt className="flex items-center gap-1.5 font-semibold text-text-primary"><CircleAlert size={14} className="text-amber-600" aria-hidden="true" />{isId ? 'Batasan' : 'Limitation'}</dt><dd className="mt-1 leading-6 text-text-secondary">{capability.limitation}</dd></div>
                    </dl>
                  </div>
                </article>
              ))}
            </div>
          </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 border-y border-border-default py-5 text-sm text-text-secondary">
          <p className="max-w-2xl">{isId ? 'Status dikonfirmasi kembali saat assessment, validasi, dan entitlement dibahas.' : 'Status is confirmed again during assessment, validation, and entitlement review.'}</p>
          <Link href={`/${locale}/demo?solution=${solution}`} className="home-button home-button--primary">
            {isId ? 'Minta demo site-fit' : 'Request a site-fit demo'}
            <ArrowRight size={15} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  )
}
