'use client'

import Script from 'next/script'
import { useEffect, useState } from 'react'

const CONSENT_KEY = 'smartcounter-analytics-consent'

export function ConsentAnalytics({ measurementId }: { measurementId?: string }) {
  const [consent, setConsent] = useState<'accepted' | 'declined' | null>(null)

  useEffect(() => {
    const stored = window.localStorage.getItem(CONSENT_KEY)
    if (stored === 'accepted' || stored === 'declined') setConsent(stored)
  }, [])

  if (!measurementId) return null

  function choose(value: 'accepted' | 'declined') {
    window.localStorage.setItem(CONSENT_KEY, value)
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
          aria-label="Analytics consent"
          className="fixed right-4 bottom-4 left-4 z-[120] mx-auto max-w-xl rounded-2xl border border-border-subtle bg-bg-surface/95 p-5 shadow-2xl backdrop-blur-xl sm:left-auto"
        >
          <p className="text-sm leading-relaxed text-text-secondary">
            We use optional analytics to understand site usage. No analytics script
            loads until you accept.
          </p>
          <div className="mt-4 flex justify-end gap-3">
            <button
              className="rounded-lg border border-border-subtle px-4 py-2 text-sm font-semibold text-text-secondary"
              onClick={() => choose('declined')}
              type="button"
            >
              Decline
            </button>
            <button
              className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white"
              onClick={() => choose('accepted')}
              type="button"
            >
              Accept analytics
            </button>
          </div>
        </aside>
      )}
    </>
  )
}
