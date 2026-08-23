'use client'

import Script from 'next/script'
import { useEffect, useState } from 'react'
import { ANALYTICS_CONSENT_KEY, trackEvent } from '@/lib/analytics/events'

export function ConsentAnalytics({
  locale,
  measurementId,
}: {
  locale: string
  measurementId?: string
}) {
  const [consent, setConsent] = useState<'accepted' | 'declined' | null | undefined>(undefined)

  useEffect(() => {
    const stored = window.localStorage.getItem(ANALYTICS_CONSENT_KEY)
    setConsent(stored === 'accepted' || stored === 'declined' ? stored : null)
  }, [])

  useEffect(() => {
    function trackNavigation(event: MouseEvent) {
      const link = (event.target as Element | null)?.closest('a[href]') as HTMLAnchorElement | null
      if (!link) return

      const url = new URL(link.href, window.location.href)
      const placement = link.dataset.analyticsPlacement || 'content'
      const solution = url.pathname.match(/\/solutions\/(retail|mall)$/)?.[1]
      if (solution) {
        trackEvent('solution_select', { locale, solution, placement })
      }
      if (url.pathname.endsWith('/demo')) {
        trackEvent('cta_click', {
          locale,
          page: window.location.pathname,
          placement,
          label: 'request_demo',
          destination: `${url.pathname}${url.search}`,
          ...(url.searchParams.get('solution') && { solution: url.searchParams.get('solution') }),
        })
      }
    }

    document.addEventListener('click', trackNavigation)
    return () => document.removeEventListener('click', trackNavigation)
  }, [locale])

  if (!measurementId) return null

  function choose(value: 'accepted' | 'declined') {
    window.localStorage.setItem(ANALYTICS_CONSENT_KEY, value)
    setConsent(value)
  }

  return (
    <>
      {consent === 'accepted' && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
            strategy="afterInteractive"
          />
          <Script id="smartcounter-google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${measurementId}', { anonymize_ip: true });
            `}
          </Script>
        </>
      )}

      {consent === null && (
        <aside
          aria-label={locale === 'id' ? 'Persetujuan analitik' : 'Analytics consent'}
          aria-live="polite"
          className="consent-banner fixed right-4 bottom-[max(1rem,env(safe-area-inset-bottom))] left-4 z-[120] mx-auto max-w-xl rounded-2xl border border-border-subtle bg-bg-surface p-5 shadow-lg sm:left-auto"
        >
          <p className="text-sm leading-relaxed text-text-secondary">
            {locale === 'id'
              ? 'Kami menggunakan analitik opsional untuk memahami penggunaan situs. Skrip analitik tidak dimuat sebelum Anda menyetujuinya.'
              : 'We use optional analytics to understand site usage. No analytics script loads until you accept.'}
          </p>
          <div className="mt-4 flex justify-end gap-3">
            <button
              className="nav-state-button min-h-11 rounded-lg border border-border-subtle px-4 py-2 text-sm font-semibold text-text-secondary transition-[background-color,transform] hover:bg-bg-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
              onClick={() => choose('declined')}
              type="button"
            >
              {locale === 'id' ? 'Tolak' : 'Decline'}
            </button>
            <button
              className="nav-state-button min-h-11 rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white transition-[background-color,transform] hover:bg-primary-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
              onClick={() => choose('accepted')}
              type="button"
            >
              {locale === 'id' ? 'Setujui analitik' : 'Accept analytics'}
            </button>
          </div>
        </aside>
      )}
    </>
  )
}
