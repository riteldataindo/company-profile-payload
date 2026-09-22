import {
  CheckCircle2,
} from 'lucide-react'
import { ContactSubmitForm } from '@/components/smartcounter/SubmitForms'
import type { Locale } from './i18n'
import { route, sharedCopy, text } from './i18n'
import {
  AssetPlaceholder,
  ButtonLink,
  DefinitionList,
  PageHero,
  SectionHeading,
  TruthNotice,
} from './Primitives'

export function CompanyView({ locale }: { locale: Locale }) {
  const isId = locale === 'id'
  return (
    <>
      <PageHero
        compact
        eyebrow={isId ? 'Identitas perusahaan' : 'Company identity'}
        title={isId ? 'SmartCounter adalah produk PT Ritel Data Indonesia.' : 'SmartCounter is a product of PT Ritel Data Indonesia.'}
        description={isId ? 'Halaman ini sengaja menjadi verified legal-identity surface yang ringkas, bukan corporate story yang belum memiliki evidence.' : 'This page is intentionally a concise verified legal-identity surface, not an unsupported corporate story.'}
        actions={<ButtonLink href={route(locale, '/contact')}>{text(locale, sharedCopy.discussSite)}</ButtonLink>}
      />
      <section className="section"><div className="container company-grid">
        <div><SectionHeading eyebrow={isId ? 'Scope bisnis' : 'Business scope'} title={isId ? 'People Counting & Visitor Analytics untuk Retail dan Mall.' : 'People Counting & Visitor Analytics for Retail and Mall.'} /><p>{isId ? 'SmartCounter membantu tim meninjau traffic dan spatial signal agregat dengan boundary, definition, prerequisite, limitation, dan validation context yang terlihat.' : 'SmartCounter helps teams review aggregate traffic and spatial signals with visible boundaries, definitions, prerequisites, limitations, and validation context.'}</p></div>
        <DefinitionList items={[
          { term: isId ? 'Nama legal' : 'Legal name', description: 'PT Ritel Data Indonesia' },
          { term: isId ? 'Alamat terverifikasi' : 'Verified address', description: text(locale, sharedCopy.notAvailable) },
          { term: 'Email', description: text(locale, sharedCopy.notAvailable) },
          { term: 'WhatsApp / phone', description: text(locale, sharedCopy.notAvailable) },
          { term: isId ? 'Social link disetujui' : 'Approved social links', description: text(locale, sharedCopy.notAvailable) },
        ]} />
      </div></section>
      <section className="section section--muted"><div className="container"><TruthNotice locale={locale} tone="warning"><p>{isId ? 'Team profile, corporate timeline, certification, partner, customer count, dan deployment footprint tidak ditampilkan karena evidence atau permission belum tersedia.' : 'Team profiles, corporate timeline, certifications, partners, customer counts, and deployment footprint are not displayed because evidence or permission is not available.'}</p></TruthNotice></div></section>
    </>
  )
}

export function ContactView({
  locale,
  solution = 'shared',
  packageName = '',
}: {
  locale: Locale
  solution?: 'shared' | 'retail' | 'mall'
  packageName?: string
}) {
  const isId = locale === 'id'
  return (
    <>
      <PageHero compact eyebrow={isId ? 'Site discussion' : 'Site discussion'} title={isId ? 'Diskusikan operating question dan konteks lokasi.' : 'Discuss the operating question and site context.'} description={isId ? 'Form ini memprioritaskan qualification, bukan meminta semua detail teknis sebelum percakapan.' : 'This form prioritizes qualification rather than asking for every technical detail before a conversation.'} />
      <section className="section"><div className="container contact-grid">
        <div>
          <SectionHeading eyebrow={isId ? 'Yang membantu' : 'Useful context'} title={isId ? 'Bawa pertanyaan, bukan jawaban architecture.' : 'Bring the question, not an architecture answer.'} />
          <ul className="check-list">
            <li><CheckCircle2 aria-hidden="true" />{isId ? 'Konteks Retail atau Mall' : 'Retail or Mall context'}</li>
            <li><CheckCircle2 aria-hidden="true" />{isId ? 'Jumlah lokasi atau tipe property' : 'Location count or property type'}</li>
            <li><CheckCircle2 aria-hidden="true" />{isId ? 'Operating question dan target waktu' : 'Operating question and timeline'}</li>
          </ul>
          <TruthNotice locale={locale} tone="warning"><p>{isId ? 'Email, WhatsApp, dan alamat publik yang terverifikasi belum ditampilkan. Permintaan dari form ini tetap dikirim.' : 'Verified public email, WhatsApp, and address are not published yet. Requests from this form are still sent.'}</p></TruthNotice>
        </div>
        <ContactSubmitForm locale={locale} solution={solution} packageName={packageName} />
      </div></section>
    </>
  )
}

function LegalPlaceholder({ locale, kind }: { locale: Locale; kind: 'privacy' | 'terms' }) {
  const isId = locale === 'id'
  const privacy = kind === 'privacy'
  return (
    <>
      <PageHero compact eyebrow={privacy ? (isId ? 'Privasi' : 'Privacy') : (isId ? 'Ketentuan' : 'Terms')} title={isId ? 'Legal copy final belum tersedia.' : 'Final legal copy is not available.'} description={isId ? 'Halaman ini adalah structural placeholder dan tetap noindex sampai ditinjau serta disetujui.' : 'This page is a structural placeholder and remains noindex until reviewed and approved.'} />
      <section className="section"><div className="container article-shell"><TruthNotice locale={locale} tone="warning"><p>{privacy ? (isId ? 'Processing, field, retention, access, deletion, lawful basis, dan contact point belum dapat dipublikasikan.' : 'Processing, fields, retention, access, deletion, lawful basis, and contact point cannot yet be published.') : (isId ? 'Commercial terms, license, liability, jurisdiction, support, SLA, dan dispute language belum dapat dipublikasikan.' : 'Commercial terms, licence, liability, jurisdiction, support, SLA, and dispute language cannot yet be published.')}</p></TruthNotice><AssetPlaceholder locale={locale} title={privacy ? { en: 'Approved Privacy document', id: 'Dokumen Privasi disetujui' } : { en: 'Approved Terms document', id: 'Dokumen Ketentuan disetujui' }} description={{ en: 'Legal review and publication approval required.', id: 'Legal review dan publication approval diperlukan.' }} /></div></section>
    </>
  )
}

export function PrivacyView({ locale }: { locale: Locale }) {
  return <LegalPlaceholder locale={locale} kind="privacy" />
}

export function TermsView({ locale }: { locale: Locale }) {
  return <LegalPlaceholder locale={locale} kind="terms" />
}
