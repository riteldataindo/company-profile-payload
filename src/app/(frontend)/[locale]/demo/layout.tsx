import type { Metadata } from 'next'
import { buildMetadata } from '@/lib/seo/metadata'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  return buildMetadata({
    title: locale === 'id' ? 'Minta Demo SmartCounter' : 'Request a SmartCounter Demo',
    description: locale === 'id'
      ? 'Minta walkthrough kecocokan lokasi SmartCounter untuk operasional Retail atau Mall.'
      : 'Request a SmartCounter site-fit walkthrough for Retail or Mall operations.',
    locale,
    path: '/demo',
  })
}

export default function DemoLayout({ children }: { children: React.ReactNode }) {
  return children
}
