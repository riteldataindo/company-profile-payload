import type { Metadata } from 'next'
import { buildMetadata } from '@/lib/seo/metadata'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  return buildMetadata({
    title: 'Request a SmartCounter Demo',
    description: 'Request a personalized walkthrough of SmartCounter CCTV analytics for your retail format and store network.',
    locale,
    path: '/demo',
  })
}

export default function DemoLayout({ children }: { children: React.ReactNode }) {
  return children
}
