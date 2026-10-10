import React from 'react'
import {
  ArrowRight,
  Check,
  ClipboardCheck,
  FileText,
  MapPinned,
  RefreshCw,
  ShieldCheck,
  Workflow,
} from 'lucide-react'
import type { ProfileFaqGroup, ProfileGuide } from '@/lib/profile/content'
import { guides as sourceGuides, type GuideSection } from '@/lib/profile/guideData'
import type { Locale } from './i18n'
import { route, sharedCopy, text, visibleFaqAnswer } from './i18n'
import {
  AssetPlaceholder,
  Breadcrumbs,
  ButtonLink,
  PageHero,
  SectionHeading,
  SmartLink,
  TruthNotice,
} from './Primitives'

export function GuidesView({ locale, guides }: { locale: Locale; guides: ProfileGuide[] }) {
  const isId = locale === 'id'
  return (
    <>
      <PageHero compact eyebrow={isId ? 'Panduan' : 'Guides'} title={isId ? 'Bangun pemahaman sebelum memilih capability.' : 'Build shared understanding before selecting a capability.'} description={isId ? 'Panduan ini berfokus pada boundary, definition, denominator, validation, dan site assessment—bukan SEO article tipis.' : 'These guides focus on boundaries, definitions, denominators, validation, and site assessment—not thin SEO articles.'} />
      <section className="section"><div className="container guide-grid">{guides.map((guide) => {
        const updated = sourceGuides.find((item) => item.slug === guide.slug)?.updated
        return <article key={guide.slug} className="guide-card"><FileText aria-hidden="true" size={24} />{updated && <p className="guide-card__meta">{isId ? 'Diperbarui' : 'Updated'} {updated}</p>}<h2>{guide.title}</h2><p>{guide.description}</p><SmartLink className="text-link" href={route(locale, `/guides/${guide.slug}`)}>{isId ? 'Baca panduan' : 'Read guide'} <ArrowRight aria-hidden="true" size={16} /></SmartLink></article>
      })}</div></section>
      <section className="section section--muted"><div className="container"><TruthNotice locale={locale}><p>{isId ? 'Panduan bersifat edukatif dan tidak menetapkan compatibility, accuracy, capability, atau commercial scope untuk deployment tertentu.' : 'Guides are educational and do not establish compatibility, accuracy, capability, or commercial scope for a particular deployment.'}</p></TruthNotice></div></section>
    </>
  )
}

export function GuideArticle({
  locale,
  title,
  description,
  updated,
  sections,
}: {
  locale: Locale
  title: string
  description: string
  updated?: string
  sections: GuideSection[]
}) {
  const isId = locale === 'id'
  return (
    <article className="section article-page">
      <div className="container article-shell">
        <Breadcrumbs locale={locale} items={[{ label: isId ? 'Beranda' : 'Home', href: route(locale) }, { label: isId ? 'Panduan' : 'Guides', href: route(locale, '/guides') }, { label: title }]} />
        <header><p className="eyebrow">{isId ? 'Panduan SmartCounter' : 'SmartCounter Guide'}</p><h1>{title}</h1><p className="article-page__lead">{description}</p>{updated && <p className="article-page__meta">{isId ? 'Terakhir diperbarui' : 'Last updated'}: {updated}</p>}</header>
        <TruthNotice locale={locale}><p>{isId ? 'Konten ini menjelaskan prinsip dan pertanyaan assessment. Keputusan deployment tetap memerlukan konteks site dan scope disetujui.' : 'This content explains principles and assessment questions. Deployment decisions still require site context and an approved scope.'}</p></TruthNotice>
        <div className="article-page__content">{sections.map((section) => <section key={section.title.en}><h2>{text(locale, section.title)}</h2>{section.paragraphs.map((paragraph) => <p key={paragraph.en}>{text(locale, paragraph)}</p>)}{section.points && <ul className="check-list">{section.points.map((point) => <li key={point.en}><Check aria-hidden="true" size={17} />{text(locale, point)}</li>)}</ul>}</section>)}</div>
        <footer className="article-page__footer"><ButtonLink href={route(locale, '/validation')} variant="secondary">{isId ? 'Tinjau validasi' : 'Review validation'}</ButtonLink><ButtonLink href={route(locale, '/contact')}>{text(locale, sharedCopy.discussSite)}</ButtonLink></footer>
      </div>
    </article>
  )
}

function ValidationFlow({ locale }: { locale: Locale }) {
  const isId = locale === 'id'
  const steps = [
    [MapPinned, isId ? 'Definisi & boundary' : 'Definition & boundary'],
    [ClipboardCheck, isId ? 'Reference & sample' : 'Reference & sample'],
    [Workflow, isId ? 'Representative comparison' : 'Representative comparison'],
    [ShieldCheck, isId ? 'Acceptance & limitation' : 'Acceptance & limitation'],
    [RefreshCw, isId ? 'Revalidation trigger' : 'Revalidation trigger'],
  ] as const
  return <ol className="validation-flow">{steps.map(([Icon, label], index) => <li key={label}><span>0{index + 1}</span><Icon aria-hidden="true" /><strong>{label}</strong></li>)}</ol>
}

export function ValidationView({ locale }: { locale: Locale }) {
  const isId = locale === 'id'
  return (
    <>
      <PageHero eyebrow={isId ? 'Measurement Integrity' : 'Measurement Integrity'} title={isId ? 'Validasi dimulai dari definisi yang dapat ditinjau.' : 'Validation begins with a reviewable definition.'} description={isId ? 'Accuracy statement tidak lengkap tanpa metric, boundary, direction, period, reference, comparison method, acceptance rule, dan limitation.' : 'An accuracy statement is incomplete without a metric, boundary, direction, period, reference, comparison method, acceptance rule, and limitation.'} actions={<ButtonLink href={route(locale, '/contact')}>{text(locale, sharedCopy.discussSite)}</ButtonLink>} aside={<AssetPlaceholder locale={locale} title={{ en: 'Validation-method diagram', id: 'Diagram metode validasi' }} description={{ en: 'Device-neutral diagram with HTML text equivalent.', id: 'Diagram device-neutral dengan HTML text equivalent.' }} />} />
      <section className="section section--muted"><div className="container"><SectionHeading eyebrow={isId ? 'Alur validasi' : 'Validation flow'} title={isId ? 'Buat comparison plan yang representatif.' : 'Build a representative comparison plan.'} /><ValidationFlow locale={locale} /></div></section>
      <section className="section"><div className="container validation-grid">{[
        ['Metric contract', 'Kontrak metric', 'Name the metric, unit, boundary, direction, period, filters, and freshness.', 'Sebutkan metric, unit, boundary, arah, periode, filter, dan freshness.'],
        ['Reference', 'Reference', 'Document who or what provides the comparison source and how it is reviewed.', 'Dokumentasikan siapa atau apa yang menjadi comparison source dan cara review.'],
        ['Representative sample', 'Sample representatif', 'Cover relevant traffic patterns, operating periods, scene conditions, and edge cases.', 'Cakup traffic pattern, operating period, scene condition, dan edge case relevan.'],
        ['Acceptance & limits', 'Acceptance & limit', 'Record the acceptance rule, known limitations, and conditions that trigger revalidation.', 'Catat acceptance rule, known limitation, dan kondisi yang memicu revalidation.'],
      ].map(([en, id, enBody, idBody]) => <article key={en}><h2>{isId ? id : en}</h2><p>{isId ? idBody : enBody}</p></article>)}</div></section>
      <section className="section section--dark"><div className="container"><TruthNotice locale={locale} tone="warning" title={{ en: 'No universal accuracy claim', id: 'Tanpa klaim akurasi universal' }}><p>{isId ? 'Website tidak mempublikasikan satu persentase akurasi untuk semua metric, scene, traffic pattern, boundary, lighting, atau deployment.' : 'The site does not publish one accuracy percentage for every metric, scene, traffic pattern, boundary, lighting condition, or deployment.'}</p></TruthNotice></div></section>
    </>
  )
}

export function DeploymentView({ locale }: { locale: Locale }) {
  const isId = locale === 'id'
  const steps = [
    ['Operating question', 'Pertanyaan operasional', 'Clarify the decision, metric, location hierarchy, and expected output.', 'Klarifikasi keputusan, metric, hierarchy lokasi, dan output diharapkan.'],
    ['Site assessment', 'Site assessment', 'Review physical context, approved input, boundary, topology, performance, privacy, and validation need.', 'Tinjau physical context, input disetujui, boundary, topology, performance, privacy, dan kebutuhan validasi.'],
    ['Implementation', 'Implementasi', 'Confirm responsibilities, configuration, reporting, access, training, and handover.', 'Konfirmasi responsibility, konfigurasi, reporting, access, training, dan handover.'],
    ['Representative validation', 'Validasi representatif', 'Compare the named measurement against the agreed reference and acceptance approach.', 'Bandingkan measurement dengan reference dan acceptance approach disepakati.'],
    ['Local support', 'Dukungan lokal', 'Support follows the approved commercial and operational scope; no universal response time is promised.', 'Support mengikuti scope komersial dan operasional; tidak ada response time universal yang dijanjikan.'],
  ]
  return (
    <>
      <PageHero eyebrow={isId ? 'Deployment & Local Support' : 'Deployment & Local Support'} title={isId ? 'Mulai dari site dan operating question—bukan satu device.' : 'Start from the site and operating question—not one device.'} description={isId ? 'Architecture, input, processing, capability, validation, ownership, dan support dikonfirmasi sesuai kebutuhan deployment.' : 'Architecture, input, processing, capability, validation, ownership, and support are confirmed for the deployment need.'} actions={<ButtonLink href={route(locale, '/contact')}>{text(locale, sharedCopy.discussSite)}</ButtonLink>} aside={<AssetPlaceholder locale={locale} title={{ en: 'Device-neutral implementation photography', id: 'Fotografi implementasi device-neutral' }} description={{ en: 'Site assessment, boundary review, validation, training, or handover without an identifiable device.', id: 'Site assessment, boundary review, validasi, training, atau handover tanpa device teridentifikasi.' }} />} />
      <section className="section"><div className="container deployment-steps">{steps.map(([en, id, enBody, idBody], index) => <article key={en}><span>0{index + 1}</span><div><h2>{isId ? id : en}</h2><p>{isId ? idBody : enBody}</p></div></article>)}</div></section>
      <section className="section section--muted"><div className="container evidence-grid evidence-grid--two"><AssetPlaceholder locale={locale} title={{ en: 'Retail anonymized deployment story', id: 'Deployment story Retail anonim' }} description={{ en: 'Operating question, scope, validation, output, and limitation.', id: 'Operating question, scope, validation, output, dan limitation.' }} /><AssetPlaceholder locale={locale} title={{ en: 'Mall anonymized deployment story', id: 'Deployment story Mall anonim' }} description={{ en: 'Topology, gate/floor scope, validation, output, and limitation.', id: 'Topology, scope gate/floor, validation, output, dan limitation.' }} /></div></section>
      <section className="section section--dark"><div className="container"><TruthNotice locale={locale} tone="warning"><p>{isId ? 'Detail mode cloud, edge, self-hosted, hybrid, atau offline sengaja tidak dipublikasikan sebagai standard package sampai deployment matrix governed.' : 'Cloud, edge, self-hosted, hybrid, or offline modes are intentionally not published as standard packages until the deployment matrix is governed.'}</p></TruthNotice></div></section>
    </>
  )
}

export function FaqView({ locale, faq }: { locale: Locale; faq: ProfileFaqGroup[] }) {
  const isId = locale === 'id'
  return (
    <>
      <PageHero compact eyebrow="FAQ" title={isId ? 'Pertanyaan buyer yang perlu dijawab dengan scope.' : 'Buyer questions that require scoped answers.'} description={isId ? 'Jawaban sengaja menghindari universal claim dan menunjukkan kapan assessment diperlukan.' : 'Answers intentionally avoid universal claims and show when assessment is required.'} />
      <section className="section"><div className="container faq-page">{faq.map((group) => <section key={group.title}><h2>{group.title}</h2><div className="faq-list">{group.items.map((item) => <details key={item.question}><summary>{item.question}</summary><p>{visibleFaqAnswer(item.answer)}</p></details>)}</div></section>)}</div></section>
      <section className="final-cta"><div className="container final-cta__inner"><div><h2>{isId ? 'Pertanyaan Anda bergantung pada site?' : 'Does your question depend on the site?'}</h2><p>{isId ? 'Bagikan konteks Retail atau Mall dan operating question.' : 'Share the Retail or Mall context and operating question.'}</p></div><ButtonLink href={route(locale, '/contact')}>{text(locale, sharedCopy.discussSite)}</ButtonLink></div></section>
    </>
  )
}
