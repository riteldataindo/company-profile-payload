import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { NextResponse } from 'next/server'

const CTA_TRANSLATIONS: Record<string, string> = {
  id: 'Hubungi Kami',
  ko: '문의하기',
  ja: 'お問い合わせ',
  zh: '联系我们',
}

export async function POST() {
  try {
    const payload = await getPayload({ config: configPromise })
    let updated = 0
    const errors: string[] = []

    const tiers = await payload.find({ collection: 'pricing-tiers', limit: 100, locale: 'en' })

    for (const tier of tiers.docs) {
      for (const [locale, ctaText] of Object.entries(CTA_TRANSLATIONS)) {
        try {
          await payload.update({
            collection: 'pricing-tiers',
            id: tier.id,
            locale,
            data: { ctaText },
          })
          updated++
        } catch (err) {
          errors.push(`Tier ${tier.id} ${locale}: ${err instanceof Error ? err.message : 'Unknown'}`)
        }
      }
    }

    return NextResponse.json({ message: `Updated ${updated} pricing tier translations`, updated, errors })
  } catch (error) {
    return NextResponse.json({ error: 'Failed', message: error instanceof Error ? error.message : 'Unknown' }, { status: 500 })
  }
}
