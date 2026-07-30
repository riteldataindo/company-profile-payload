import { NextResponse } from 'next/server'
import { authorizeAdminRequest } from '@/lib/admin-auth'

const CTA_TRANSLATIONS = {
  id: 'Hubungi Kami',
  ko: '문의하기',
  ja: 'お問い合わせ',
  zh: '联系我们',
} as const

export async function POST(request: Request) {
  try {
    const authorization = await authorizeAdminRequest(request, 'write')
    if (!authorization.ok) return authorization.response
    const { payload } = authorization
    let updated = 0
    const errors: string[] = []

    const tiers = await payload.find({ collection: 'pricing-tiers', limit: 100, locale: 'en' })

    for (const tier of tiers.docs) {
      for (const locale of Object.keys(CTA_TRANSLATIONS) as Array<keyof typeof CTA_TRANSLATIONS>) {
        const ctaText = CTA_TRANSLATIONS[locale]
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
