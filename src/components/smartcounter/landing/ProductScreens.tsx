import React from 'react'
import Image from 'next/image'
import { screensFor, type ProductScreen } from '@/lib/profile/productEvidence'
import type { Locale } from '../i18n'
import { text } from '../i18n'
import { screensCopy } from './copy'

function Screen({ screen, locale }: { screen: ProductScreen; locale: Locale }) {
  return (
    <figure className="lp-screen">
      <div className="lp-screen__frame">
        <Image
          src={screen.src}
          alt={text(locale, screen.alt)}
          width={screen.width}
          height={screen.height}
          sizes="(min-width: 1280px) 820px, (min-width: 900px) 64vw, 100vw"
        />
        {screen.callouts.map((callout, index) => (
          <span
            key={callout.text.en}
            className="lp-screen__pin"
            style={{ left: `${callout.x}%`, top: `${callout.y}%` }}
            aria-hidden="true"
          >
            {index + 1}
          </span>
        ))}
      </div>
      <figcaption className="lp-screen__notes">
        <strong>{text(locale, screen.title)}</strong>
        {screen.callouts.length > 0 && (
          <ol>
            {screen.callouts.map((callout) => <li key={callout.text.en}>{text(locale, callout.text)}</li>)}
          </ol>
        )}
        <p>{text(locale, screen.dataNote)}</p>
      </figcaption>
    </figure>
  )
}

// Renders approved product screenshots only; returns nothing while none exist.
export function ProductScreens({
  locale,
  solution,
  screens,
}: {
  locale: Locale
  solution?: 'retail' | 'mall'
  screens?: ProductScreen[]
}) {
  const shown = screensFor(solution, screens)
  if (shown.length === 0) return null
  return (
    <section className="lp-section lp-screens" aria-labelledby="lp-screens-title">
      <div className="container">
        <header className="lp-heading">
          <h2 id="lp-screens-title">{text(locale, screensCopy.title)}</h2>
          <p>{text(locale, screensCopy.lead)}</p>
        </header>
        <div className="lp-screens__list">
          {shown.map((screen) => <Screen key={screen.id} screen={screen} locale={locale} />)}
        </div>
      </div>
    </section>
  )
}
