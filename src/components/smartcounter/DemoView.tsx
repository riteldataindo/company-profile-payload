'use client'

import { useEffect, useState } from 'react'
import { DemoSubmitForm } from '@/components/smartcounter/SubmitForms'
import type { Locale } from './i18n'
import { route, sharedCopy, text } from './i18n'
import {
  AssetPlaceholder,
  ButtonLink,
  PageHero,
} from './Primitives'

function WalkthroughOption({ locale, kind }: { locale: Locale; kind: 'retail' | 'mall' }) {
  const isId = locale === 'id'
  const isMall = kind === 'mall'
  return (
    <article className="walkthrough-option">
      <div><span>{isMall ? 'Mall' : 'Retail'}</span><h2>{isMall ? (isId ? 'Gate, floor, zone, dan occupancy context.' : 'Gate, floor, zone, and occupancy context.') : (isId ? 'Traffic, dwell, heatmap, dan store comparison.' : 'Traffic, dwell, heatmap, and store comparison.')}</h2><p>{isId ? 'Walkthrough final harus memakai interface aktual, demo/anonymized dataset, caption, transcript, poster, dan user-triggered playback.' : 'The final walkthrough must use actual UI, a demo/anonymized dataset, captions, transcript, poster, and user-triggered playback.'}</p></div>
      <AssetPlaceholder locale={locale} type="video" tone="dark" title={isMall ? { en: 'Mall product walkthrough', id: 'Walkthrough produk Mall' } : { en: 'Retail product walkthrough', id: 'Walkthrough produk Retail' }} description={isMall ? { en: 'Required duration: 30–60 seconds.', id: 'Durasi dibutuhkan: 30–60 detik.' } : { en: 'Required duration: 60–90 seconds.', id: 'Durasi dibutuhkan: 60–90 detik.' }} />
      <div className="evidence-grid evidence-grid--two"><AssetPlaceholder locale={locale} type="product" title={isMall ? { en: 'Mall overview screenshot', id: 'Screenshot Mall overview' } : { en: 'Retail overview screenshot', id: 'Screenshot Retail overview' }} description={{ en: 'Approved actual Product UI.', id: 'UI Produk aktual disetujui.' }} /><AssetPlaceholder locale={locale} type="product" title={isMall ? { en: 'Mall gate / floor evidence', id: 'Bukti gate / floor Mall' } : { en: 'Retail heatmap / dwell evidence', id: 'Bukti heatmap / dwell Retail' }} description={{ en: 'Approved actual Product UI.', id: 'UI Produk aktual disetujui.' }} /></div>
    </article>
  )
}

export function DemoView({ locale, solution = 'retail' }: { locale: Locale; solution?: 'retail' | 'mall' }) {
  const isId = locale === 'id'
  const [kind, setKind] = useState<'retail' | 'mall'>(solution)

  useEffect(() => {
    setKind(solution)
  }, [solution])

  return (
    <>
      <PageHero compact eyebrow={isId ? 'Product walkthrough' : 'Product walkthrough'} title={isId ? 'Lihat SmartCounter tanpa mengisi form.' : 'See SmartCounter without filling in a form.'} description={isId ? 'Pilih Retail atau Mall. Aset yang belum tersedia tetap ditandai secara eksplisit.' : 'Choose Retail or Mall. Missing assets remain explicitly marked.'} />
      <section className="section"><div className="container">
        <div className="context-switch" role="group" aria-label={isId ? 'Pilih walkthrough' : 'Choose walkthrough'}><button type="button" aria-pressed={kind === 'retail'} onClick={() => setKind('retail')}>Retail</button><button type="button" aria-pressed={kind === 'mall'} onClick={() => setKind('mall')}>Mall</button></div>
        <WalkthroughOption key={kind} locale={locale} kind={kind} />
      </div></section>
      <section className="section section--muted">
        <div className="container contact-grid">
          <div>
            <h2>{isId ? 'Minta walkthrough untuk site Anda.' : 'Request a walkthrough for your site.'}</h2>
            <p>{isId ? 'Kirim konteks Retail atau Mall, nama, email, nomor telepon, dan perusahaan. Permintaan demo dikirim.' : 'Send the Retail or Mall context, name, email, phone number, and company. The demo request is sent.'}</p>
          </div>
          <DemoSubmitForm locale={locale} solution={kind} />
        </div>
      </section>
      <section className="final-cta"><div className="container final-cta__inner"><div><h2>{isId ? 'Siap membahas site yang nyata?' : 'Ready to discuss a real site?'}</h2><p>{isId ? 'Bagikan operating question, konteks, dan skala lokasi.' : 'Share the operating question, context, and location scale.'}</p></div><ButtonLink href={`${route(locale, '/contact')}?solution=${kind}`}>{text(locale, sharedCopy.discussSite)}</ButtonLink></div></section>
    </>
  )
}
