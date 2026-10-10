import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import test from 'node:test'
import * as landingCopy from '../src/components/smartcounter/landing/copy'
import {
  clockAt,
  intersect,
  mallCounters,
  preparedScenes,
  prepareScene,
  retailCounters,
  type SimScene,
} from '../src/components/smartcounter/landing/simulation'
import {
  approvedContact,
  formatWhatsapp,
  resolveCompanyContact,
  whatsappHref,
} from '../src/lib/profile/contact'
import {
  productScreenProblems,
  productScreens,
  screensFor,
  type ProductScreen,
} from '../src/lib/profile/productEvidence'

test('retail simulation derives Entering Rate from entries over passer-by observations', () => {
  const { retail } = preparedScenes()
  const final = retailCounters(retail, retail.end)
  assert.equal(final.entries, 9)
  assert.equal(final.passersBy, 27)
  assert.equal(final.rate, Math.round((final.entries / final.passersBy) * 100))
  assert.deepEqual(retailCounters(retail, 0), { entries: 0, passersBy: 0, rate: 0 })
})

test('retail counters never decrease while the timeline plays forward', () => {
  const { retail } = preparedScenes()
  let previous = retailCounters(retail, 0)
  for (let t = 250; t <= retail.end; t += 250) {
    const next = retailCounters(retail, t)
    assert.ok(next.entries >= previous.entries)
    assert.ok(next.passersBy >= previous.passersBy)
    previous = next
  }
})

test('mall visits count outer-gate entries only, never internal gate crossings', () => {
  const { mall } = preparedScenes()
  const final = mallCounters(mall, mall.end)
  const outerEntries = mall.events.filter((event) => event.kind === 'outer' && event.dir === 'in').length
  const internalCrossings = mall.events.filter((event) => event.kind === 'internal').length
  assert.equal(final.visits, outerEntries)
  assert.equal(final.internal, internalCrossings)
  assert.ok(internalCrossings > 0)
  assert.equal(final.visits, 13)
  assert.equal(final.occupancy, 7)
})

test('crossing direction follows the configured inside of each line', () => {
  const scene: SimScene = {
    id: 'retail',
    width: 100,
    height: 100,
    end: 2000,
    lines: [{ id: 'entry', kind: 'entry', a: [0, 50], b: [100, 50], inside: [50, 0] }],
    zones: [],
    agents: [{ start: 0, speed: 100, points: [[50, 90], [50, 10], [60, 90]] }],
  }
  const prepared = prepareScene(scene)
  assert.deepEqual(prepared.events.map((event) => event.dir), ['in', 'out'])
  assert.equal(retailCounters(prepared, scene.end).entries, 1)
  assert.equal(intersect([0, 0], [10, 0], [5, 5], [5, 10]), null)
})

test('simulated clock stays inside the published 10:00–10:15 window', () => {
  const { retail } = preparedScenes()
  assert.equal(clockAt(retail, 0), '10:00')
  assert.equal(clockAt(retail, retail.end), '10:15')
  assert.equal(clockAt(retail, retail.end * 2), '10:15')
})

test('company contact uses the owner-approved details until Site Settings are verified', () => {
  assert.deepEqual(resolveCompanyContact(null), approvedContact)
  assert.deepEqual(resolveCompanyContact({ identityVerified: false, contactEmail: 'someone@example.com' }), approvedContact)
  const verified = resolveCompanyContact({
    identityVerified: true,
    contactEmail: 'sales@example.co.id',
    whatsappNumber: '+62 811-2222-3333',
    contactAddress: 'Jl. Contoh 1, Jakarta',
  })
  assert.equal(verified.email, 'sales@example.co.id')
  assert.equal(verified.whatsappNumber, '6281122223333')
  assert.equal(verified.whatsappDisplay, '+62 811-2222-3333')
  assert.equal(verified.address, 'Jl. Contoh 1, Jakarta')
  const partial = resolveCompanyContact({ identityVerified: true, contactEmail: 'not an email', whatsappNumber: '12' })
  assert.equal(partial.email, approvedContact.email)
  assert.equal(partial.whatsappNumber, approvedContact.whatsappNumber)
  assert.equal(formatWhatsapp('6288210019165'), approvedContact.whatsappDisplay)
  assert.equal(whatsappHref(approvedContact, 'Halo SmartCounter'), 'https://wa.me/6288210019165?text=Halo%20SmartCounter')
})

test('public chrome never prints unverified or unavailable contact labels', () => {
  const layout = readFileSync('src/components/smartcounter/Layout.tsx', 'utf8')
  const company = readFileSync('src/components/smartcounter/CompanyViews.tsx', 'utf8')
  const demo = readFileSync('src/components/smartcounter/DemoView.tsx', 'utf8')
  assert.doesNotMatch(layout, /Verified contact|Kontak terverifikasi|sharedCopy\.notAvailable/)
  assert.doesNotMatch(layout, /Device-neutral public presentation/)
  assert.match(layout, /mailto:\$\{contact\.email\}/)
  assert.doesNotMatch(company, /Verified address|Approved social links/)
  assert.doesNotMatch(demo, /AssetPlaceholder|not available/i)
})

test('product screens stay hidden until an approved, complete screenshot is listed', () => {
  for (const screen of productScreens) {
    assert.deepEqual(productScreenProblems(screen, (src) => existsSync(`public${src}`)), [], screen.id)
  }
  const sample: ProductScreen = {
    id: 'sample',
    solution: 'retail',
    src: '/product/retail-overview.webp',
    width: 1600,
    height: 1000,
    alt: { en: 'Retail overview', id: 'Overview retail' },
    title: { en: 'Traffic by hour', id: 'Traffic per jam' },
    dataNote: { en: 'Actual SmartCounter interface with demo data.', id: 'Interface SmartCounter asli dengan data demo.' },
    callouts: [{ x: 120, y: 40, text: { en: 'Peak hour', id: '' } }],
  }
  const problems = productScreenProblems(sample, () => false)
  assert.ok(problems.includes('missing file public/product/retail-overview.webp'))
  assert.ok(problems.includes('callout 1 needs English and Indonesian text'))
  assert.ok(problems.includes('callout 1 must be positioned inside the image'))
  assert.deepEqual(screensFor('mall', [sample]), [])
  assert.deepEqual(screensFor('retail', [sample]), [sample])
})

function collectLocalText(value: unknown, path: string, found: Array<{ path: string; en: string; id: string }>) {
  if (!value || typeof value !== 'object') return
  const record = value as Record<string, unknown>
  if (typeof record.en === 'string' && typeof record.id === 'string') {
    found.push({ path, en: record.en, id: record.id })
    return
  }
  for (const [key, child] of Object.entries(record)) collectLocalText(child, `${path}.${key}`, found)
}

test('landing copy ships complete EN and ID text for every string', () => {
  const found: Array<{ path: string; en: string; id: string }> = []
  collectLocalText(landingCopy, 'copy', found)
  assert.ok(found.length > 80)
  for (const entry of found) {
    assert.ok(entry.en.trim().length > 0, `${entry.path} is missing English`)
    assert.ok(entry.id.trim().length > 0, `${entry.path} is missing Indonesian`)
  }
  assert.equal(landingCopy.scenesCopy.retail.questions.length, landingCopy.scenesCopy.mall.questions.length)
})

test('landing copy speaks to buyers and avoids unsupported claims', () => {
  const found: Array<{ path: string; en: string; id: string }> = []
  collectLocalText(landingCopy, 'copy', found)
  const all = found.flatMap((entry) => [entry.en, entry.id]).join('\n')
  assert.doesNotMatch(all, /\b(?:#1|number one|guaranteed?|fully compliant|real-time)\b/i)
  assert.doesNotMatch(all, /\b\d+(?:\.\d+)?%/)
  assert.doesNotMatch(all, /know what to review next|ambiguous feature list|denominators|device-neutral, not universal/i)
  assert.doesNotMatch(all, /See the platform before being asked/i)
  assert.match(landingCopy.simCopy.caption.en, /not live data from a customer site/)
  assert.match(landingCopy.scenesCopy.photoNote.en, /not a customer site/)
  assert.match(landingCopy.simCopy.retail.formula.en, /isn’t sales conversion/)
  for (const kind of ['retail', 'mall'] as const) {
    const tags = landingCopy.scenesCopy[kind].questions.map((item) => item.availability)
    assert.ok(tags.includes('included') && tags.includes('addon'))
  }
})

test('landing motion is limited to the hero and respects reduced motion', () => {
  const css = readFileSync('src/styles/smartcounter/landing.css', 'utf8')
  const rootLayout = readFileSync('src/app/(frontend)/layout.tsx', 'utf8')
  const home = readFileSync('src/components/smartcounter/HomeView.tsx', 'utf8')
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/)
  assert.match(css, /\.sc-motion \.sim\[data-ready='false'\][^{]*\{[^}]*animation: lp-failsafe/)
  assert.doesNotMatch(css, /transition: all|transition-all|data-reveal|data-spotlight/)
  assert.match(rootLayout, /prefers-reduced-motion: reduce\)'\)\.matches\)r\.classList\.add\('sc-motion'\)/)
  assert.doesNotMatch(home, /AssetPlaceholder|data-reveal|Actual Product UI/)
})
