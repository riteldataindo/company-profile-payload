import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'
import {
  inactiveLocales,
  indexableLocales,
  locales,
  isInactiveLocale,
  isValidLocale,
} from '../src/lib/i18n/config'
import { getDictionary } from '../src/lib/i18n/getDictionary'
import { getSiteUrl, siteUrlForPath } from '../src/lib/seo/site'
import { proxy } from '../src/proxy'
import sitemap from '../src/app/sitemap'
import { NextRequest } from 'next/server'

function leafKeys(value: unknown, prefix = ''): string[] {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return [prefix]
  return Object.entries(value).flatMap(([key, item]) => leafKeys(item, prefix ? `${prefix}.${key}` : key))
}

test('only EN and ID are active/indexable locales', () => {
  assert.deepEqual(locales, ['en', 'id'])
  assert.deepEqual(indexableLocales, ['en', 'id'])
  assert.deepEqual(inactiveLocales, ['ko', 'ja', 'zh'])
  assert.equal(isValidLocale('en'), true)
  assert.equal(isValidLocale('ko'), false)
  assert.equal(isInactiveLocale('zh'), true)
})

test('EN and ID dictionaries have identical key coverage', async () => {
  const [en, id] = await Promise.all([getDictionary('en'), getDictionary('id')])
  assert.deepEqual(leafKeys(id).sort(), leafKeys(en).sort())
})

test('canonical site URL is explicit and path-safe', () => {
  const previous = process.env.NEXT_PUBLIC_SITE_URL
  try {
    process.env.NEXT_PUBLIC_SITE_URL = 'https://release.example.test/'
    assert.equal(getSiteUrl()?.toString(), 'https://release.example.test/')
    assert.equal(siteUrlForPath('/id/privacy'), 'https://release.example.test/id/privacy')

    process.env.NEXT_PUBLIC_SITE_URL = 'https://release.example.test/base'
    assert.equal(getSiteUrl(), undefined)
  } finally {
    if (previous === undefined) delete process.env.NEXT_PUBLIC_SITE_URL
    else process.env.NEXT_PUBLIC_SITE_URL = previous
  }
})

test('FAQPage schema is not exposed', () => {
  const jsonldSource = readFileSync('src/lib/seo/jsonld.ts', 'utf8')
  assert.equal(jsonldSource.includes("'@type': 'FAQPage'"), false)
  assert.equal(jsonldSource.includes('faqPageSchema'), false)
})

test('legacy routes map to approved EN/ID surfaces', () => {
  const nextConfigSource = readFileSync('next.config.ts', 'utf8')
  assert.equal(nextConfigSource.includes("source: '/fitur'"), true)
  assert.equal(nextConfigSource.includes("destination: '/id/features'"), true)
  assert.equal(nextConfigSource.includes("source: '/about'"), true)
  assert.equal(nextConfigSource.includes("destination: '/id/contact'"), true)
})

test('conversion analytics use the PRD event contract without PII', () => {
  const eventsSource = readFileSync('src/lib/analytics/events.ts', 'utf8')
  const demoSource = readFileSync('src/app/(frontend)/[locale]/demo/page.tsx', 'utf8')
  const consentSource = readFileSync('src/components/analytics/ConsentAnalytics.tsx', 'utf8')

  assert.match(eventsSource, /demo_submit_success/)
  assert.match(eventsSource, /demo_submit_error/)
  assert.match(eventsSource, /contact_submit_success/)
  assert.match(eventsSource, /contact_submit_error/)
  assert.match(eventsSource, /feature_explore/)
  assert.doesNotMatch(eventsSource, /\['(?:name|email|phone|company|message)'\]/)
  assert.match(demoSource, /URLSearchParams\(window\.location\.search\)/)
  assert.match(consentSource, /closest\('a\[href\]'\)/)
})

test('public microinteractions are input-aware and avoid decorative autoplay', () => {
  const globalStyles = readFileSync('src/app/globals.css', 'utf8')
  const localeSwitcher = readFileSync('src/components/layout/LocaleSwitcher.tsx', 'utf8')
  const clientLogoRail = readFileSync('src/components/sections/home/ClientLogoRail.tsx', 'utf8')
  const faqClient = readFileSync('src/components/faq/FaqClient.tsx', 'utf8')

  assert.match(globalStyles, /\.state-icon__glyph\[data-active='true'\]/)
  assert.match(globalStyles, /\.nav-popover\[data-animate='true'\]/)
  assert.match(globalStyles, /@media \(prefers-reduced-motion: reduce\)/)
  assert.match(globalStyles, /animation-iteration-count: 1 !important/)
  assert.match(globalStyles, /\.faq-panel\[data-animate='true'\]/)
  assert.match(globalStyles, /button:focus-visible \.faq-toggle__icon/)
  assert.doesNotMatch(globalStyles, /client-logo-marquee/)
  assert.match(localeSwitcher, /<select/)
  assert.doesNotMatch(clientLogoRail, /setInterval|requestAnimationFrame|animation:/)
  assert.match(faqClient, /event\.detail > 0/)
  assert.match(faqClient, /data-animate=/)
})

test('inactive locale requests redirect before rendering', () => {
  const response = proxy(new NextRequest('https://release.example.test/ko/privacy'))
  assert.equal(response.status, 307)
  assert.equal(response.headers.get('location'), 'https://release.example.test/en/privacy')
  assert.equal(response.headers.get('x-robots-tag'), 'noindex, follow')
})

test('sitemap contains only the approved static route matrix', () => {
  const previous = process.env.NEXT_PUBLIC_SITE_URL
  try {
    process.env.NEXT_PUBLIC_SITE_URL = 'https://release.example.test'
    const entries = sitemap()
    assert.equal(entries.length, 20)
    assert.equal(entries.some((entry) => entry.url.includes('/packages')), false)
    assert.equal(entries.some((entry) => entry.url.includes('/blog')), false)
    assert.deepEqual(entries[0]?.alternates?.languages, {
      en: 'https://release.example.test/en',
      id: 'https://release.example.test/id',
      'x-default': 'https://release.example.test/en',
    })
  } finally {
    if (previous === undefined) delete process.env.NEXT_PUBLIC_SITE_URL
    else process.env.NEXT_PUBLIC_SITE_URL = previous
  }
})
