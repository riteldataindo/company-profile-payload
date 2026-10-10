import {
  CheckCircle2,
} from 'lucide-react'
import type { CompanyContact } from '@/lib/profile/contact'
import { ContactSubmitForm } from '@/components/smartcounter/SubmitForms'
import { ContactLinks } from './landing/ContactLinks'
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

export function CompanyView({ locale, contact }: { locale: Locale; contact: CompanyContact }) {
  const isId = locale === 'id'
  return (
    <>
      <PageHero
        compact
        eyebrow={isId ? 'Perusahaan' : 'Company'}
        title={isId ? 'SmartCounter adalah produk PT Ritel Data Indonesia.' : 'SmartCounter is a product of PT Ritel Data Indonesia.'}
        description={isId
          ? 'Kami membangun, memasang, dan mendukung SmartCounter dari Sunter Agung, Jakarta.'
          : 'We build, install, and support SmartCounter from Sunter Agung, Jakarta.'}
        actions={<ButtonLink href={route(locale, '/demo')}>{text(locale, sharedCopy.seeInAction)}</ButtonLink>}
      />
      <section className="section"><div className="container company-grid">
        <div>
          <SectionHeading
            eyebrow={isId ? 'Yang kami kerjakan' : 'What we do'}
            title={isId ? 'People counting dan visitor analytics untuk toko retail dan mall.' : 'People counting and visitor analytics for retail stores and malls.'}
          />
          <p>{isId
            ? 'SmartCounter menghitung pengunjung di entrance toko dan gate mall, lalu menyajikannya dalam dashboard untuk tim retail dan property.'
            : 'SmartCounter counts visitors at store entrances and mall gates and turns the counts into dashboards for retail and property teams.'}</p>
        </div>
        <DefinitionList items={[
          { term: isId ? 'Nama legal' : 'Legal name', description: 'PT Ritel Data Indonesia' },
          { term: isId ? 'Kantor' : 'Office', description: contact.address },
          { term: 'Email', description: <a href={`mailto:${contact.email}`}>{contact.email}</a> },
          { term: 'WhatsApp', description: contact.whatsappDisplay },
        ]} />
      </div></section>
    </>
  )
}

export function ContactView({
  locale,
  contact,
  solution = 'shared',
  packageName = '',
}: {
  locale: Locale
  contact: CompanyContact
  solution?: 'shared' | 'retail' | 'mall'
  packageName?: string
}) {
  const isId = locale === 'id'
  return (
    <>
      <PageHero
        compact
        eyebrow={isId ? 'Kontak' : 'Contact'}
        title={isId ? 'Bicarakan toko atau mall Anda dengan kami.' : 'Talk to us about your stores or mall.'}
        description={isId
          ? 'Kirim pesan lewat form, email, atau WhatsApp. Tim kami ada di Jakarta.'
          : 'Send a message with the form, by email, or on WhatsApp. Our team is in Jakarta.'}
      />
      <section className="section"><div className="container contact-grid">
        <div>
          <h2 className="contact-title">{isId ? 'Hubungi kami langsung' : 'Reach us directly'}</h2>
          <ContactLinks locale={locale} contact={contact} showAddress />
          <h2 className="contact-title">{isId ? 'Yang membantu untuk disertakan' : 'Helpful to include'}</h2>
          <ul className="check-list">
            <li><CheckCircle2 aria-hidden="true" />{isId ? 'Toko retail atau mall' : 'Retail store or mall'}</li>
            <li><CheckCircle2 aria-hidden="true" />{isId ? 'Jumlah lokasi atau entrance' : 'Number of locations or entrances'}</li>
            <li><CheckCircle2 aria-hidden="true" />{isId ? 'Apa yang ingin Anda ketahui, dan kapan' : 'What you want to know, and by when'}</li>
          </ul>
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
