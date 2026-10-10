import React from 'react'
import {
  Activity,
  ArrowRight,
  Check,
  DoorOpen,
  Layers3,
  MapPinned,
  ScanLine,
  Workflow,
} from 'lucide-react'
import type { ProfileCapability, ProfilePackage } from '@/lib/profile/content'
import { mallMetrics, retailMetrics, type Metric } from '@/lib/profile/metricData'
import type { Locale } from './i18n'
import { route, sharedCopy, text } from './i18n'
import {
  AssetPlaceholder,
  ButtonLink,
  PageHero,
  SectionHeading,
  StatusPill,
  TruthNotice,
} from './Primitives'

function ConceptualPlatformFlow({ locale }: { locale: Locale }) {
  const steps = [
    [MapPinned, 'Physical context', 'Konteks fisik'],
    [ScanLine, 'Approved input', 'Input disetujui'],
    [DoorOpen, 'Configured boundary', 'Boundary terkonfigurasi'],
    [Activity, 'Aggregate signal', 'Sinyal agregat'],
    [Layers3, 'SmartCounter platform', 'Platform SmartCounter'],
    [Workflow, 'Operational review', 'Tinjauan operasional'],
  ] as const
  return (
    <figure className="concept-flow">
      <div className="concept-flow__row">
        {steps.map(([Icon, en, id], index) => (
          <React.Fragment key={en}>
            <div className="concept-flow__step"><Icon aria-hidden="true" size={22} /><span>{locale === 'id' ? id : en}</span></div>
            {index < steps.length - 1 && <ArrowRight className="concept-flow__arrow" aria-hidden="true" size={18} />}
          </React.Fragment>
        ))}
      </div>
      <figcaption>{locale === 'id' ? 'Alur konseptual · bukan architecture deployment yang dijanjikan.' : 'Conceptual flow · not a promised deployment architecture.'}</figcaption>
    </figure>
  )
}

function MetricRegister({ locale, metrics }: { locale: Locale; metrics: Metric[] }) {
  const isId = locale === 'id'
  return (
    <div className="metric-register">
      {metrics.map((metric) => (
        <article key={`${metric.name.en}-${metric.unit.en}`} className="metric-register__row">
          <div className="metric-register__title"><h3>{text(locale, metric.name)}</h3><StatusPill locale={locale} status={metric.status} /></div>
          <dl>
            <div><dt>{isId ? 'Definisi' : 'Definition'}</dt><dd>{text(locale, metric.definition)}</dd></div>
            <div><dt>Unit</dt><dd>{text(locale, metric.unit)}</dd></div>
            <div><dt>{isId ? 'Keputusan' : 'Decision'}</dt><dd>{text(locale, metric.decision)}</dd></div>
            <div><dt>{isId ? 'Prasyarat' : 'Prerequisite'}</dt><dd>{text(locale, metric.prerequisite)}</dd></div>
            <div className="metric-register__wide"><dt>{isId ? 'Batasan' : 'Limitation'}</dt><dd>{text(locale, metric.limitation)}</dd></div>
          </dl>
        </article>
      ))}
    </div>
  )
}

export function PlatformView({ locale }: { locale: Locale }) {
  const isId = locale === 'id'
  return (
    <>
      <PageHero
        eyebrow="Platform"
        title={isId ? 'Satu platform untuk konteks Retail dan Mall yang berbeda.' : 'One platform for distinct Retail and Mall operating contexts.'}
        description={isId ? 'SmartCounter menghubungkan physical context, boundary, metric scope, validation, dan operational review dalam model yang dapat ditinjau.' : 'SmartCounter connects physical context, boundaries, metric scope, validation, and operational review in one inspectable model.'}
        actions={<><ButtonLink href={route(locale, '/demo')}>{text(locale, sharedCopy.seeInAction)}</ButtonLink><ButtonLink href={route(locale, '/capabilities')} variant="secondary">{isId ? 'Tinjau kapabilitas' : 'Review capabilities'}</ButtonLink></>}
        aside={<AssetPlaceholder locale={locale} type="product" tone="dark" title={{ en: 'Unified platform overview', id: 'Overview unified platform' }} description={{ en: 'Actual SmartCounter UI across Retail and Mall contexts.', id: 'UI SmartCounter aktual untuk konteks Retail dan Mall.' }} />}
      />
      <section className="section section--muted"><div className="container"><SectionHeading eyebrow={isId ? 'Dari ruang ke keputusan' : 'From space to decision'} title={isId ? 'Setiap sinyal punya konteks sebelum menjadi dashboard.' : 'Every signal has context before it becomes a dashboard.'} description={isId ? 'Diagram device-neutral ini tidak mengunci satu processing architecture.' : 'This device-neutral diagram does not lock one processing architecture.'} /><ConceptualPlatformFlow locale={locale} /></div></section>
      <section className="section"><div className="container platform-context-grid">
        <article><h2>Retail</h2><p>{isId ? 'Brand → store → entrance → zone → period comparison.' : 'Brand → store → entrance → zone → period comparison.'}</p></article>
        <article><h2>Mall</h2><p>{isId ? 'Property → floor → outer gate → internal gate → zone / tenant.' : 'Property → floor → outer gate → internal gate → zone / tenant.'}</p></article>
        <article><h2>{isId ? 'Measurement Integrity' : 'Measurement Integrity'}</h2><p>{isId ? 'Boundary, denominator, unit, timeframe, prerequisite, limitation, dan validation tetap terlihat.' : 'Boundary, denominator, unit, timeframe, prerequisite, limitation, and validation remain visible.'}</p></article>
      </div></section>
      <section className="section section--dark"><div className="container split-section"><div><SectionHeading eyebrow={isId ? 'Public boundary' : 'Public boundary'} title={isId ? 'Device-neutral, bukan kompatibilitas universal.' : 'Device-neutral, not universal compatibility.'} /><TruthNotice locale={locale} tone="warning"><p>{isId ? 'SmartCounter tidak dipresentasikan berdasarkan satu device atau manufacturer, tetapi input dan processing tetap memerlukan assessment.' : 'SmartCounter is not presented around one device or manufacturer, but input and processing still require assessment.'}</p></TruthNotice></div><AssetPlaceholder locale={locale} title={{ en: 'Measurement contract diagram', id: 'Diagram measurement contract' }} description={{ en: 'Boundary, unit, timeframe, denominator, validation, and freshness.', id: 'Boundary, unit, timeframe, denominator, validation, dan freshness.' }} /></div></section>
    </>
  )
}

export function SolutionView({ locale, kind }: { locale: Locale; kind: 'retail' | 'mall' }) {
  const isId = locale === 'id'
  const isMall = kind === 'mall'
  const metrics = isMall ? mallMetrics : retailMetrics
  const title = isMall
    ? (isId ? 'Pisahkan gate, floor, zone, dan tenant context.' : 'Keep gates, floors, zones, and tenant context distinct.')
    : (isId ? 'Tinjau traffic toko dan zone terkonfigurasi.' : 'Review store traffic and configured zones.')
  const description = isMall
    ? (isId ? 'Mall membutuhkan topology serta denominator yang eksplisit agar movement internal tidak menjadi visit baru.' : 'Mall operations need explicit topology and denominators so internal movement does not become a new visit.')
    : (isId ? 'Retail berfokus pada entrance, period comparison, zone, dwell, heatmap, journey, Entering Rate, dan multi-location review.' : 'Retail focuses on entrances, period comparison, zones, dwell, heatmap, journey, Entering Rate, and multi-location review.')
  return (
    <>
      <PageHero
        eyebrow={isMall ? 'Mall Intelligence' : 'Retail Intelligence'}
        title={title}
        description={description}
        actions={<><ButtonLink href={`${route(locale, '/demo')}?solution=${kind}`}>{text(locale, sharedCopy.seeInAction)}</ButtonLink><ButtonLink href={`${route(locale, '/contact')}?solution=${kind}`} variant="secondary">{text(locale, sharedCopy.discussSite)}</ButtonLink></>}
        aside={<AssetPlaceholder locale={locale} type="product" tone="dark" title={isMall ? { en: 'Mall overview interface', id: 'Interface overview Mall' } : { en: 'Retail overview interface', id: 'Interface overview Retail' }} description={{ en: 'Approved actual SmartCounter interface required.', id: 'Interface SmartCounter aktual yang disetujui diperlukan.' }} />}
      />
      <section className="section section--muted"><div className="container solution-workflow"><SectionHeading eyebrow={isId ? 'Alur operasional' : 'Operating workflow'} title={isMall ? (isId ? 'Dari klasifikasi gate ke operational review.' : 'From gate classification to operational review.') : (isId ? 'Dari entrance ke multi-location review.' : 'From entrance to multi-location review.')} /><ol className="numbered-steps">{(isMall ? ['Classify outer and internal gates', 'Map floors, zones, and ownership', 'Review aligned operating signals'] : ['Define entrances and periods', 'Review zones and spatial context', 'Compare stores and operating actions']).map((item, index) => <li key={item}><span>0{index + 1}</span><div><strong>{item}</strong><p>{isId ? 'Scope dan output dikonfirmasi saat assessment.' : 'Scope and output are confirmed during assessment.'}</p></div></li>)}</ol></div></section>
      <section className="section"><div className="container"><SectionHeading eyebrow={isId ? 'Measurement register' : 'Measurement register'} title={isId ? 'Definisi, unit, keputusan, prerequisite, dan limitation tetap berdekatan.' : 'Definitions, units, decisions, prerequisites, and limitations stay together.'} /><MetricRegister locale={locale} metrics={metrics} /></div></section>
      <section className="section section--dark"><div className="container evidence-grid evidence-grid--two"><AssetPlaceholder locale={locale} type="product" title={isMall ? { en: 'Mall gate and floor evidence', id: 'Bukti gate dan floor Mall' } : { en: 'Retail traffic and period evidence', id: 'Bukti traffic dan periode Retail' }} description={{ en: 'Actual approved product screenshot.', id: 'Screenshot produk aktual disetujui.' }} /><AssetPlaceholder locale={locale} type="product" title={isMall ? { en: 'Mall zone / occupancy evidence', id: 'Bukti zone / occupancy Mall' } : { en: 'Retail heatmap / dwell evidence', id: 'Bukti heatmap / dwell Retail' }} description={{ en: 'Actual approved product screenshot.', id: 'Screenshot produk aktual disetujui.' }} /></div></section>
    </>
  )
}

function groupCapabilities(capabilities: ProfileCapability[]) {
  const groups: Array<{ group: string; question: string; items: ProfileCapability[] }> = []
  for (const item of capabilities) {
    const existing = groups.find((group) => group.group === item.group)
    if (existing) {
      if (!existing.question && item.question) existing.question = item.question
      existing.items.push(item)
      continue
    }
    groups.push({ group: item.group, question: item.question, items: [item] })
  }
  return groups
}

export function CapabilitiesView({ locale, capabilities }: { locale: Locale; capabilities: ProfileCapability[] }) {
  const isId = locale === 'id'
  const groups = groupCapabilities(capabilities)
  return (
    <>
      <PageHero compact eyebrow={isId ? 'Kapabilitas' : 'Capabilities'} title={isId ? 'Dari sinyal terdefinisi ke keputusan operasional.' : 'From defined signals to operating decisions.'} description={isId ? 'Semua content penting tampil dalam document order, bukan tersembunyi di balik tab.' : 'All critical content stays in document order instead of being hidden behind tabs.'} actions={<ButtonLink href={route(locale, '/contact')}>{text(locale, sharedCopy.discussSite)}</ButtonLink>} />
      {groups.map((group, index) => (
        <section key={group.group} className={`section ${index % 2 ? 'section--muted' : ''}`}>
          <div className="container">
            <SectionHeading eyebrow={`0${index + 1} · ${group.group}`} title={group.question || group.group} />
            <div className="metric-register">
              {group.items.map((item) => (
                <article key={`${group.group}-${item.name}`} className="metric-register__row">
                  <div className="metric-register__title"><h3>{item.name}</h3><StatusPill locale={locale} status={item.status} /></div>
                  <dl>
                    <div><dt>{isId ? 'Definisi' : 'Definition'}</dt><dd>{item.definition}</dd></div>
                    <div><dt>Unit</dt><dd>{item.unit}</dd></div>
                    <div><dt>{isId ? 'Keputusan' : 'Decision'}</dt><dd>{item.decision}</dd></div>
                    <div><dt>{isId ? 'Prasyarat' : 'Prerequisite'}</dt><dd>{item.prerequisite}</dd></div>
                    <div className="metric-register__wide"><dt>{isId ? 'Batasan' : 'Limitation'}</dt><dd>{item.limitation}</dd></div>
                  </dl>
                </article>
              ))}
            </div>
          </div>
        </section>
      ))}
    </>
  )
}

export function PackagesView({ locale, packages }: { locale: Locale; packages: ProfilePackage[] }) {
  const isId = locale === 'id'
  const cards = packages.length > 0 ? packages : [
    { name: 'Core Platform', label: 'Core', body: '', items: [], status: 'scope' },
    { name: 'Advanced Analytics', label: isId ? 'Paling umum' : 'Most common', body: '', items: [], status: 'assessment' },
    { name: 'Enterprise', label: 'Enterprise', body: '', items: [], status: 'assessment' },
  ]
  return (
    <>
      <PageHero compact eyebrow={isId ? 'Scope penawaran' : 'Engagement scopes'} title={isId ? 'Core Platform, Advanced Analytics, dan Enterprise.' : 'Core Platform, Advanced Analytics, and Enterprise.'} description={isId ? 'Package membantu qualification dan product clarity. Fixed public pricing sengaja tidak dipublikasikan.' : 'Packages support qualification and product clarity. Fixed public pricing is intentionally not published.'} actions={<ButtonLink href={route(locale, '/contact')}>{text(locale, sharedCopy.discussNeeds)}</ButtonLink>} />
      <section className="section"><div className="container package-grid">{cards.map((item, index) => <article key={item.name} className={index === 1 ? 'package-card package-card--featured' : 'package-card'}><span className="package-card__label">{item.label}</span><h2>{item.name}</h2><p>{item.body}</p><StatusPill locale={locale} status={item.status} /><ul className="check-list">{item.items.map((entry) => <li key={entry}><Check aria-hidden="true" size={17} />{entry}</li>)}</ul><ButtonLink href={`${route(locale, '/contact')}?package=${encodeURIComponent(item.name)}`} variant={index === 1 ? 'primary' : 'secondary'}>{text(locale, sharedCopy.discussNeeds)}</ButtonLink></article>)}</div></section>
      <section className="section section--muted"><div className="container"><TruthNotice locale={locale} tone="warning"><p>{isId ? 'Tidak ada discount ribbon, Best Offer, 10% Off, universal 24/7 support, 99.9% uptime, atau hardware bundle di public page.' : 'No discount ribbon, Best Offer, 10% Off, universal 24/7 support, 99.9% uptime, or hardware bundle appears on the public page.'}</p></TruthNotice></div></section>
    </>
  )
}

