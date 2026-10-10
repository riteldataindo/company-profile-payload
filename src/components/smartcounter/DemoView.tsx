import { CheckCircle2 } from 'lucide-react'
import type { CompanyContact } from '@/lib/profile/contact'
import { DemoSubmitForm } from '@/components/smartcounter/SubmitForms'
import type { Locale, LocalText } from './i18n'
import { text } from './i18n'
import { PageHero } from './Primitives'
import { ContactLinks } from './landing/ContactLinks'

const agenda: LocalText[] = [
  {
    en: 'The dashboard for your case: visitor counts by hour and day, entrances or gates, and how locations compare.',
    id: 'Dashboard sesuai kebutuhan Anda: jumlah pengunjung per jam dan hari, entrance atau gate, dan perbandingan lokasi.',
  },
  {
    en: 'Which add-ons fit your questions, such as time spent, heatmaps, occupancy, or entering rate.',
    id: 'Tambahan yang sesuai pertanyaan Anda, seperti waktu kunjungan, heatmap, occupancy, atau entering rate.',
  },
  {
    en: 'What a site check involves and what we need from you.',
    id: 'Apa saja yang dilakukan saat cek lokasi dan apa yang kami butuhkan dari Anda.',
  },
  {
    en: 'How pricing works for your number of entrances and locations.',
    id: 'Cara penentuan harga berdasarkan jumlah entrance dan lokasi.',
  },
]

export function DemoView({
  locale,
  solution = 'retail',
  contact,
}: {
  locale: Locale
  solution?: 'retail' | 'mall'
  contact: CompanyContact
}) {
  const isId = locale === 'id'

  return (
    <>
      <PageHero
        compact
        eyebrow="Demo"
        title={isId ? 'Jadwalkan demo SmartCounter' : 'Book a SmartCounter demo'}
        description={isId
          ? 'Tim kami menunjukkan dashboard untuk toko atau mall, dan membahas apa yang bisa kami hitung di lokasi Anda.'
          : 'Our team walks you through the dashboard for stores or malls, and talks through what we would count at your site.'}
      />
      <section className="section">
        <div className="container contact-grid demo-layout">
          <div className="demo-agenda">
            <h2>{isId ? 'Yang akan kita bahas' : 'What we’ll cover'}</h2>
            <ul className="check-list">
              {agenda.map((item) => (
                <li key={item.en}><CheckCircle2 aria-hidden="true" />{text(locale, item)}</li>
              ))}
            </ul>
            <div className="demo-alt">
              <h3>{isId ? 'Lebih suka kirim pesan?' : 'Prefer to message us?'}</h3>
              <ContactLinks locale={locale} contact={contact} showAddress />
            </div>
          </div>
          <div className="demo-form">
            <DemoSubmitForm locale={locale} solution={solution} />
          </div>
        </div>
      </section>
    </>
  )
}
