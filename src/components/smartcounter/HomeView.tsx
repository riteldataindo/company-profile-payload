import React from 'react'
import {
  BarChart3,
  Building2,
  Layers3,
  MapPinned,
  Route as RouteIcon,
  ShieldCheck,
  ShoppingBag,
  Store,
  Users,
  Workflow,
} from 'lucide-react'
import type { ProfileFaqGroup, ProfilePackage } from '@/lib/profile/content'
import type { Locale, LocalText } from './i18n'
import { route, sharedCopy, text, visibleFaqAnswer } from './i18n'
import {
  AssetPlaceholder,
  ButtonLink,
  Eyebrow,
  SectionHeading,
  SmartLink,
  StatusPill,
} from './Primitives'

type LocalItem = { title: LocalText; body: LocalText }

const trust = [
  [Store, { en: 'Retail & Mall', id: 'Retail & Mall' }, { en: 'Dual-solution platform', id: 'Platform dual-solution' }],
  [Layers3, { en: 'Actual Product UI', id: 'UI Produk Aktual' }, { en: 'Demo and anonymized views', id: 'Tampilan demo dan anonim' }],
  [BarChart3, { en: 'Defined Metrics', id: 'Metrik Terdefinisi' }, { en: 'Clear scope and units', id: 'Scope dan unit yang jelas' }],
  [ShieldCheck, { en: 'Representative Validation', id: 'Validasi Representatif' }, { en: 'Reviewed per deployment', id: 'Ditinjau per deployment' }],
  [Users, { en: 'Local Support', id: 'Dukungan Lokal' }, { en: 'Implementation and guidance', id: 'Implementasi dan panduan' }],
] as const

const decisionGroups = [
  {
    icon: BarChart3,
    label: { en: 'Traffic', id: 'Traffic' },
    title: { en: 'How much movement is arriving?', id: 'Seberapa banyak pergerakan yang datang?' },
    body: { en: 'Review configured entry, exit, passer-by, and period signals with visible scope.', id: 'Tinjau entry, exit, passer-by, dan period signal dengan scope yang terlihat.' },
  },
  {
    icon: RouteIcon,
    label: { en: 'Flow & Zones', id: 'Flow & Zone' },
    title: { en: 'Where does movement happen?', id: 'Di mana pergerakan terjadi?' },
    body: { en: 'Compare approved zones, paths, dwell context, and spatial density.', id: 'Bandingkan zone, path, konteks dwell, dan kepadatan spasial yang disetujui.' },
  },
  {
    icon: Workflow,
    label: { en: 'Operations', id: 'Operasional' },
    title: { en: 'What should an operator review next?', id: 'Apa yang perlu ditinjau operator berikutnya?' },
    body: { en: 'Bring defined signals into staffing, layout, gate, floor, or property review.', id: 'Bawa sinyal terdefinisi ke tinjauan staffing, layout, gate, floor, atau property.' },
  },
]

const faq: Array<{ q: LocalText; a: LocalText }> = [
  {
    q: { en: 'Can SmartCounter assess an existing camera or video input?', id: 'Apakah SmartCounter dapat menilai input kamera atau video yang sudah ada?' },
    a: { en: 'Yes, through a site assessment covering scene, stream access, boundary, performance need, privacy, and the intended measurement. This is not a universal compatibility promise.', id: 'Ya, melalui assessment scene, stream access, boundary, kebutuhan performance, privacy, dan measurement yang dituju. Ini bukan janji kompatibilitas universal.' },
  },
  {
    q: { en: 'How is a metric validated?', id: 'Bagaimana metric divalidasi?' },
    a: { en: 'Definition, boundary, timeframe, reference, and representative comparison are agreed for the deployment. The public site does not use one universal accuracy number.', id: 'Definisi, boundary, timeframe, reference, dan representative comparison disepakati untuk deployment. Website tidak memakai satu angka akurasi universal.' },
  },
  {
    q: { en: 'Is every advanced capability included?', id: 'Apakah semua advanced capability langsung termasuk?' },
    a: { en: 'No. Availability depends on the approved site, topology, input, processing, package, and validation scope.', id: 'Tidak. Ketersediaan bergantung pada site, topology, input, processing, package, dan validation scope yang disetujui.' },
  },
]

function GatewayCard({
  locale,
  kind,
  title,
  body,
  features,
}: {
  locale: Locale
  kind: 'retail' | 'mall'
  title: LocalText
  body: LocalText
  features: string[]
}) {
  const Icon = kind === 'retail' ? ShoppingBag : Building2
  return (
    <article className={`gateway-card gateway-card--${kind}`}>
      <AssetPlaceholder
        locale={locale}
        title={kind === 'retail' ? { en: 'Retail context photography', id: 'Fotografi konteks Retail' } : { en: 'Mall context photography', id: 'Fotografi konteks Mall' }}
        description={kind === 'retail' ? { en: 'Entrance, store, or zone context.', id: 'Konteks entrance, store, atau zone.' } : { en: 'Gate, floor, zone, or common-area context.', id: 'Konteks gate, floor, zone, atau common area.' }}
      />
      <div className="gateway-card__body">
        <div className="gateway-card__icon"><Icon aria-hidden={true} /></div>
        <p className="gateway-card__label">{kind === 'retail' ? 'Retail' : 'Mall'}</p>
        <h3>{text(locale, title)}</h3>
        <p>{text(locale, body)}</p>
        <ul className="inline-feature-list">{features.map((feature) => <li key={feature}>{feature}</li>)}</ul>
        <SmartLink className="text-link" href={route(locale, `/solutions/${kind}`)}>
          {locale === 'id' ? `Jelajahi solusi ${kind === 'retail' ? 'Retail' : 'Mall'}` : `Explore ${kind === 'retail' ? 'Retail' : 'Mall'} solution`}
        </SmartLink>
      </div>
    </article>
  )
}

function Pillar({ icon: Icon, item, locale }: { icon: React.ComponentType<{ 'aria-hidden'?: boolean }>; item: LocalItem; locale: Locale }) {
  return (
    <article>
      <div className="pillar-grid__icon"><Icon aria-hidden={true} /></div>
      <h3>{text(locale, item.title)}</h3>
      <p>{text(locale, item.body)}</p>
    </article>
  )
}

const defaultPackages = (isId: boolean): ProfilePackage[] => [
  {
    name: 'Core Platform',
    label: 'Core',
    body: isId
      ? 'Traffic, period comparison, dashboard ter-scope, reporting, dan local support.'
      : 'Traffic, period comparison, scoped dashboard, reporting, and local support.',
    items: [],
    status: 'scope',
  },
  {
    name: 'Advanced Analytics',
    label: isId ? 'Paling umum' : 'Most common',
    body: isId
      ? 'Optional modules: dwell, journey, passers-by, Entering Rate, heatmap, dan staff exclusion.'
      : 'Optional modules: dwell, journey, passers-by, Entering Rate, heatmap, and staff exclusion.',
    items: [],
    status: 'assessment',
  },
  {
    name: 'Enterprise',
    label: 'Enterprise',
    body: isId
      ? 'Multi-location/property rollout, selected modules, integration, reporting, dan contract-specific support.'
      : 'Multi-location/property rollout, selected modules, integration, reporting, and contract-specific support.',
    items: [],
    status: 'assessment',
  },
]

export function HomeView({
  locale,
  packages,
  faqGroups,
}: {
  locale: Locale
  packages?: ProfilePackage[]
  faqGroups?: ProfileFaqGroup[]
}) {
  const isId = locale === 'id'
  const packageCards = packages && packages.length > 0 ? packages : defaultPackages(isId)
  const faqItems = faqGroups && faqGroups.length > 0
    ? faqGroups.flatMap((group) => group.items)
    : faq.map((item) => ({ question: text(locale, item.q), answer: text(locale, item.a) }))
  return (
    <>
      <section className="home-hero">
        <div className="home-hero__signal" aria-hidden="true" />
        <div className="container home-hero__grid">
          <div className="home-hero__copy">
            <Eyebrow>People Counting & Visitor Analytics</Eyebrow>
            <h1>{isId ? 'Pahami pergerakan pengunjung. Ketahui apa yang perlu ditinjau selanjutnya.' : 'Understand visitor movement. Know what to review next.'}</h1>
            <p>{isId ? 'SmartCounter menyatukan analytics Retail dan Mall dalam satu platform, dengan metric yang terdefinisi jelas, validasi representatif, dan dukungan implementasi lokal.' : 'SmartCounter brings Retail and Mall analytics into one platform, with clearly defined metrics, representative validation, and local implementation support.'}</p>
            <div className="home-hero__actions">
              <ButtonLink href={route(locale, '/demo')}>{text(locale, sharedCopy.seeInAction)}</ButtonLink>
              <ButtonLink href={route(locale, '/contact')} variant="text">{text(locale, sharedCopy.discussSite)}</ButtonLink>
            </div>
            <div className="home-hero__boundary"><span>{isId ? 'Boundary jelas' : 'Defined boundary'}</span><span>{isId ? 'Scope dapat ditinjau' : 'Reviewable scope'}</span></div>
          </div>
          <div className="home-hero__evidence">
            <AssetPlaceholder
              locale={locale}
              type="product"
              tone="dark"
              title={{ en: 'Retail overview product interface', id: 'Interface produk overview Retail' }}
              description={{ en: 'Approved actual SmartCounter interface with a demo or anonymized dataset.', id: 'Interface SmartCounter aktual yang disetujui dengan dataset demo atau anonim.' }}
              requirements={[
                { en: 'Traffic trend and period comparison', id: 'Traffic trend dan period comparison' },
                { en: 'Heatmap or zone context', id: 'Konteks heatmap atau zone' },
                { en: 'No customer or device identity', id: 'Tanpa identitas customer atau device' },
              ]}
            />
            <div className="home-hero__context-grid">
              <AssetPlaceholder locale={locale} ratio="portrait" title={{ en: 'Retail entrance context', id: 'Konteks entrance Retail' }} description={{ en: 'Device-neutral physical-space photo.', id: 'Foto ruang fisik device-neutral.' }} />
              <AssetPlaceholder locale={locale} ratio="portrait" title={{ en: 'Mall gate context', id: 'Konteks gate Mall' }} description={{ en: 'Device-neutral physical-space photo.', id: 'Foto ruang fisik device-neutral.' }} />
            </div>
          </div>
        </div>
      </section>

      <section className="trust-strip" aria-label={isId ? 'Ringkasan trust' : 'Trust summary'}>
        <div className="container trust-strip__grid">
          {trust.map(([Icon, title, body]) => <div key={title.en} className="trust-strip__item"><Icon aria-hidden="true" size={22} /><div><strong>{text(locale, title)}</strong><span>{text(locale, body)}</span></div></div>)}
        </div>
      </section>

      <section className="section section--product-proof">
        <div className="container">
          <SectionHeading eyebrow={isId ? 'Bukti produk lebih dulu' : 'Product proof first'} title={isId ? 'Lihat platform sebelum diminta mengisi form.' : 'See the platform before being asked for your details.'} description={isId ? 'Walkthrough dan screenshot final harus memakai interface aktual. Slot tetap jujur sampai aset disetujui tersedia.' : 'Final walkthroughs and screenshots must use the actual interface. Slots remain honest until approved assets exist.'} />
          <div className="evidence-grid evidence-grid--two">
            <AssetPlaceholder locale={locale} type="video" tone="dark" title={{ en: 'Retail product walkthrough', id: 'Walkthrough produk Retail' }} description={{ en: 'Ungated 60–90 second walkthrough with captions, transcript, poster, and demo data.', id: 'Walkthrough tanpa gate 60–90 detik dengan caption, transcript, poster, dan data demo.' }} />
            <AssetPlaceholder locale={locale} type="video" tone="dark" title={{ en: 'Mall product walkthrough', id: 'Walkthrough produk Mall' }} description={{ en: 'Ungated 30–60 second walkthrough covering gate, floor, zone, or occupancy.', id: 'Walkthrough tanpa gate 30–60 detik mencakup gate, floor, zone, atau occupancy.' }} />
          </div>
        </div>
      </section>

      <section className="section section--muted">
        <div className="container">
          <SectionHeading eyebrow={isId ? 'Pilih konteks' : 'Choose the context'} title={isId ? 'Retail dan Mall membutuhkan boundary yang berbeda.' : 'Retail and Mall require different boundaries.'} description={isId ? 'Keduanya memakai fondasi measurement yang sama, tetapi workflow dan denominator-nya berbeda.' : 'Both share a measurement foundation, but their workflow and denominators differ.'} />
          <div className="gateway-grid">
            <GatewayCard locale={locale} kind="retail" title={{ en: 'Review store traffic and configured zones.', id: 'Tinjau traffic toko dan zone terkonfigurasi.' }} body={{ en: 'For multi-location Marketing, Operations, and Owners comparing periods, entrances, stores, and areas.', id: 'Untuk Marketing, Operations, dan Owner multi-location yang membandingkan periode, entrance, store, dan area.' }} features={['Traffic trends', 'Dwell context', 'Heatmap', 'Entry insights']} />
            <GatewayCard locale={locale} kind="mall" title={{ en: 'Keep gates, floors, zones, and tenant context distinct.', id: 'Pisahkan gate, floor, zone, dan tenant context.' }} body={{ en: 'For property teams that need explicit topology, ownership, and denominators.', id: 'Untuk tim property yang membutuhkan topology, ownership, dan denominator eksplisit.' }} features={['Gate analytics', 'Floor context', 'Zone performance', 'Tenant context']} />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHeading eyebrow={isId ? 'Mengapa SmartCounter' : 'Why SmartCounter'} title={isId ? 'Platform yang dapat ditinjau, bukan feature list yang kabur.' : 'A reviewable platform, not an ambiguous feature list.'} />
          <div className="pillar-grid">
            <Pillar locale={locale} icon={Layers3} item={{ title: { en: 'Unified Platform', id: 'Unified Platform' }, body: { en: 'One operating model for Retail and Mall, from brand/store to property/floor/gate/zone.', id: 'Satu model operasional Retail dan Mall, dari brand/store sampai property/floor/gate/zone.' } }} />
            <Pillar locale={locale} icon={ShieldCheck} item={{ title: { en: 'Measurement Integrity', id: 'Measurement Integrity' }, body: { en: 'Metrics expose boundary, unit, timeframe, denominator, prerequisite, and validation context.', id: 'Metric menampilkan boundary, unit, timeframe, denominator, prerequisite, dan konteks validasi.' } }} />
            <Pillar locale={locale} icon={Users} item={{ title: { en: 'Local Support', id: 'Dukungan Lokal' }, body: { en: 'Site discussion, implementation, validation, training, and guidance according to project scope.', id: 'Site discussion, implementasi, validasi, training, dan guidance sesuai scope project.' } }} />
          </div>
        </div>
      </section>

      <section className="section section--dark">
        <div className="container">
          <SectionHeading eyebrow={isId ? 'Kelompok keputusan' : 'Decision groups'} title={isId ? 'Mulai dari tiga pertanyaan operasional.' : 'Start with three operating questions.'} />
          <div className="decision-list">
            {decisionGroups.map((item, index) => { const Icon = item.icon; return <article key={item.label.en}><span className="decision-list__number">0{index + 1}</span><div className="decision-list__icon"><Icon aria-hidden={true} /></div><div><p className="decision-list__label">{text(locale, item.label)}</p><h3>{text(locale, item.title)}</h3><p>{text(locale, item.body)}</p><StatusPill locale={locale} status={index === 0 ? 'deployment' : 'assessment'} /></div></article> })}
          </div>
          <div className="section-actions"><ButtonLink href={route(locale, '/capabilities')}>{isId ? 'Tinjau semua kapabilitas' : 'Review all capabilities'}</ButtonLink></div>
        </div>
      </section>

      <section className="section">
        <div className="container split-section">
          <div>
            <SectionHeading eyebrow={isId ? 'Deployment & validasi' : 'Deployment & validation'} title={isId ? 'Kebutuhan dipastikan dari site dan measurement scope.' : 'Requirements are confirmed from the site and measurement scope.'} description={isId ? 'SmartCounter tidak dipresentasikan berdasarkan satu device, manufacturer, atau model.' : 'SmartCounter is not presented around one device, manufacturer, or model.'} />
            <ol className="numbered-steps">
              {[
                ['Review the question', 'Tinjau pertanyaan'],
                ['Review the site', 'Tinjau lokasi'],
                ['Validate the scope', 'Validasi scope'],
                ['Implement & hand over', 'Implementasi & handover'],
              ].map(([en, id], index) => <li key={en}><span>0{index + 1}</span><div><strong>{isId ? id : en}</strong><p>{isId ? 'Scope, responsibility, dan output disepakati secara eksplisit.' : 'Scope, responsibility, and output are agreed explicitly.'}</p></div></li>)}
            </ol>
            <div className="section-actions"><ButtonLink href={route(locale, '/deployment')} variant="secondary">Deployment</ButtonLink><ButtonLink href={route(locale, '/validation')} variant="text">{isId ? 'Baca validasi' : 'Review validation'}</ButtonLink></div>
          </div>
          <AssetPlaceholder locale={locale} title={{ en: 'Device-neutral deployment photography', id: 'Fotografi deployment device-neutral' }} description={{ en: 'Site assessment, boundary review, validation, training, or handover. No identifiable device.', id: 'Site assessment, boundary review, validasi, training, atau handover. Tanpa device teridentifikasi.' }} />
        </div>
      </section>

      <section className="section section--muted">
        <div className="container">
          <SectionHeading eyebrow={isId ? 'Scope penawaran' : 'Engagement scopes'} title={isId ? 'Mulai dari Core. Tambahkan analytics sesuai kebutuhan.' : 'Start with Core. Add analytics according to the approved need.'} description={isId ? 'Tidak ada fixed public price pada launch.' : 'There is no fixed public price at launch.'} />
          <div className="package-preview">
            {packageCards.map((item, index) => (
              <article key={item.name} className={index === 1 ? 'package-preview__featured' : undefined}>
                <span className="package-preview__kicker">{item.label}</span>
                <h3>{item.name}</h3>
                <p>{item.body}</p>
                <StatusPill locale={locale} status={item.status} />
              </article>
            ))}
          </div>
          <div className="section-actions"><ButtonLink href={route(locale, '/packages')}>{isId ? 'Tinjau package' : 'Review packages'}</ButtonLink></div>
        </div>
      </section>

      <section className="section">
        <div className="container faq-preview">
          <SectionHeading eyebrow={isId ? 'FAQ buyer' : 'Buyer FAQ'} title={isId ? 'Pertanyaan sebelum assessment.' : 'Questions before an assessment.'} />
          <div className="faq-list">{faqItems.map((item) => <details key={item.question}><summary>{item.question}</summary><p>{visibleFaqAnswer(item.answer)}</p></details>)}</div>
          <div className="section-actions"><ButtonLink href={route(locale, '/faq')} variant="secondary">{isId ? 'Buka semua FAQ' : 'Open all FAQ'}</ButtonLink></div>
        </div>
      </section>

      <section className="final-cta">
        <div className="container final-cta__inner"><div><Eyebrow>{isId ? 'Langkah berikutnya' : 'Next step'}</Eyebrow><h2>{isId ? 'Lihat platform. Lalu diskusikan site yang nyata.' : 'See the platform. Then discuss a real site.'}</h2><p>{isId ? 'Tidak perlu form untuk melihat walkthrough.' : 'No form is required to view the walkthrough.'}</p></div><div className="final-cta__actions"><ButtonLink href={route(locale, '/demo')}>{text(locale, sharedCopy.seeInAction)}</ButtonLink><ButtonLink href={route(locale, '/contact')} variant="secondary">{text(locale, sharedCopy.discussSite)}</ButtonLink></div></div>
      </section>
    </>
  )
}
