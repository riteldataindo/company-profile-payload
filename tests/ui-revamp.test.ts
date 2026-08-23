import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'
import { getHomeCopy } from '../src/lib/i18n/home-copy'
import { getFeatureGroups } from '../src/lib/i18n/solution-copy'
import { getConversionCopy } from '../src/lib/i18n/conversion-copy'
import { getDictionary } from '../src/lib/i18n/getDictionary'
import { getDeploymentCopy, getPrivacyCopy } from '../src/lib/i18n/trust-copy'
import { signalDiagramCopy } from '../src/components/sections/home/SignalDiagram'

test('hero copy names people counting and visitor analytics for retail and mall', () => {
  const en = getHomeCopy('en')
  const id = getHomeCopy('id')
  assert.match(en.hero.title, /people counting/i)
  assert.match(en.hero.title, /visitor analytics/i)
  assert.match(en.hero.title, /retail/i)
  assert.match(en.hero.title, /mall/i)
  assert.doesNotMatch(en.hero.title, /easier to inspect/i)
  assert.match(id.hero.title, /people counting/i)
  assert.match(id.hero.title, /analitik pengunjung/i)
  assert.match(id.hero.title, /retail/i)
  assert.match(id.hero.title, /mall/i)
  assert.doesNotMatch(id.hero.title, /lebih mudah ditinjau/i)
})

test('nav dictionaries share one site-fit demo label and retail/mall destinations', async () => {
  const [en, id] = await Promise.all([getDictionary('en'), getDictionary('id')])
  assert.equal(en.nav.getDemo, 'Request a site-fit demo')
  assert.equal(id.nav.getDemo, 'Minta demo site-fit')
  assert.equal(en.nav.retail, 'Retail')
  assert.equal(id.nav.retail, 'Retail')
  assert.equal(en.nav.mall, 'Mall')
  assert.equal(id.nav.mall, 'Mall')
})

test('navbar no longer points primary journey at decorative use-cases', () => {
  const navbar = readFileSync('src/components/layout/Navbar.tsx', 'utf8')
  assert.match(navbar, /\/solutions\/retail/)
  assert.match(navbar, /\/solutions\/mall/)
  assert.doesNotMatch(navbar, /href: '\/use-cases'/)
  assert.match(navbar, /aria-current/)
  assert.match(navbar, /site-header/)
})

test('header and hero CSS drop the 12ch poster lock and keep the header opaque', () => {
  const css = readFileSync('src/app/globals.css', 'utf8')
  assert.match(css, /--sc-nav-offset/)
  assert.match(css, /--sc-press: 0\.97/)
  assert.match(css, /--sc-motion-fast: 100ms/)
  assert.match(css, /--sc-motion-hero: 480ms/)
  assert.match(css, /\.site-header/)
  assert.match(css, /background: var\(--color-bg-base\)/)
  assert.doesNotMatch(css, /max-width: 12ch/)
  assert.match(css, /\.home-heading--hero \{[\s\S]*max-width: 20ch/)
  assert.match(css, /\.home-hero__instrument \{ order: -1; \}/)
  assert.match(css, /--sc-traffic: #3b82f6/)
  assert.match(css, /--sc-flow: #14b8a6/)
  assert.doesNotMatch(css, /client-logo-marquee/)
})

test('hero stage uses the cone-free plate and data-color overlays', () => {
  const stage = readFileSync('src/components/sections/home/HeroSignalStage.tsx', 'utf8')
  assert.match(stage, /home-device-coverage-v4\.webp/)
  assert.doesNotMatch(stage, /home-device-coverage-v3\.webp/)
  assert.match(stage, /#3B82F6/)
  assert.doesNotMatch(stage, /#f97316|#dc2626/)
})

test('how-it-works is one chain and decision groups attach diagrams on a light section', () => {
  const how = readFileSync('src/components/sections/home/HomeHowItWorks.tsx', 'utf8')
  const decisions = readFileSync('src/components/sections/home/HomeDecisionGroups.tsx', 'utf8')
  assert.match(how, /home-flow-chain/)
  assert.doesNotMatch(how, /home-flow-grid/)
  assert.match(decisions, /SignalDiagram/)
  assert.doesNotMatch(decisions, /home-section--dark/)
})

test('contact does not keep an empty identity card when unverified', () => {
  const contact = readFileSync('src/components/contact/ContactClient.tsx', 'utf8')
  assert.match(contact, /infoItems\.length > 0/)
  assert.doesNotMatch(
    contact,
    /infoItems\.length > 0 \? \([\s\S]*\) : \(\s*<p className="text-sm leading-relaxed text-text-secondary">\{copy\.neutralContact\}<\/p>/,
  )
})

test('whatsapp float stays off demo and contact conversion pages', () => {
  const whatsapp = readFileSync('src/components/layout/WhatsAppFloat.tsx', 'utf8')
  assert.match(whatsapp, /\/demo|\/contact/)
  assert.doesNotMatch(whatsapp, /0_4px_14px_rgba\(37,211,102,0\.4\)/)
})

test('mall feature questions are mall-operator questions, not retail nouns', () => {
  const retail = getFeatureGroups('en', 'retail')
  const mall = getFeatureGroups('en', 'mall')
  const mallId = getFeatureGroups('id', 'mall')
  const mallTraffic = mall.find((group) => group.id === 'traffic')
  const retailTraffic = retail.find((group) => group.id === 'traffic')
  assert.ok(mallTraffic && retailTraffic)
  assert.notEqual(mallTraffic.question, retailTraffic.question)
  assert.match(mallTraffic.question, /gate/i)
  assert.match(mall.find((group) => group.id === 'flow-zones')?.question || '', /floor/i)
  assert.match(mallId.find((group) => group.id === 'traffic')?.question || '', /gate/i)
})

test('demo conversion copy uses the shared site-fit demo label', () => {
  const en = getConversionCopy('en')
  const id = getConversionCopy('id')
  assert.equal(en.demo.submit, 'Request a site-fit demo')
  assert.equal(id.demo.submit, 'Minta demo site-fit')
  assert.doesNotMatch(en.demo.submit, /walkthrough/i)
})

test('trust demo CTAs use the shared site-fit demo label', () => {
  assert.equal(getDeploymentCopy('en').primaryCta, 'Request a site-fit demo')
  assert.equal(getPrivacyCopy('id').primaryCta, 'Minta demo site-fit')
})

test('solution stages use measured overlays on cleaned plates', () => {
  const page = readFileSync('src/components/solutions/SolutionPage.tsx', 'utf8')
  const stage = readFileSync('src/components/solutions/SolutionMeasuredStage.tsx', 'utf8')
  assert.match(page, /SolutionMeasuredStage/)
  assert.doesNotMatch(page, /retail-path-zones-v3|mall-flow-zones-v3/)
  assert.match(stage, /retail-path-zones-v4\.webp/)
  assert.match(stage, /mall-flow-zones-v4\.webp/)
  assert.match(stage, /solution-stage__legend/)
  assert.match(stage, />Z1</)
  assert.match(stage, /#14B8A6/)
  assert.match(stage, /#F59E0B/)
  assert.match(stage, /#8B5CF6/)
  assert.match(stage, /fillOpacity="0.18"/)
})

test('home evidence uses the diagram family instead of a campaign POV still', () => {
  const evidence = readFileSync('src/components/sections/home/HomeEvidence.tsx', 'utf8')
  assert.match(evidence, /SignalDiagram/)
  assert.match(evidence, /kind="traffic"/)
  assert.doesNotMatch(evidence, /device-pov-entry-line-v1/)
  const en = getHomeCopy('en')
  assert.match(en.evidence.sampleTitle, /Traffic, flow, and operations/)
})

test('404 drops glow and Sparkles and does not send Solutions to use-cases', () => {
  const notFound = readFileSync('src/app/(frontend)/[locale]/not-found.tsx', 'utf8')
  assert.doesNotMatch(notFound, /Sparkles/)
  assert.doesNotMatch(notFound, /radial-gradient/)
  assert.doesNotMatch(notFound, /\/use-cases/)
  assert.match(notFound, /\/solutions\/retail/)
})

test('footer omits the unverified contact column and uses real social icons', () => {
  const footer = readFileSync('src/components/layout/Footer.tsx', 'utf8')
  assert.match(footer, /hasContactDetails/)
  assert.doesNotMatch(footer, /Contact details are available after/)
  assert.match(footer, /LinkedinIcon/)
  assert.match(footer, /InstagramIcon/)
  assert.match(footer, /YoutubeIcon/)
  assert.doesNotMatch(footer, /icon: Globe/)
})

test('features figure swap applies the 160ms opacity class', () => {
  const features = readFileSync('src/components/sections/FeaturesGrid.tsx', 'utf8')
  const css = readFileSync('src/app/globals.css', 'utf8')
  assert.match(features, /feature-detail-swap/)
  assert.match(css, /\.feature-detail-swap \{[\s\S]*transition: opacity var\(--sc-motion-standard\)/)
  assert.match(css, /--sc-motion-standard: 160ms/)
})

test('signal diagram ID labels are Indonesian, not English leftovers', () => {
  assert.equal(signalDiagramCopy.id.traffic, 'Lalu lintas pintu masuk')
  assert.equal(signalDiagramCopy.id.flow, 'Perbandingan zona')
  assert.equal(signalDiagramCopy.id.operations, 'Tinjauan operasional')
  assert.doesNotMatch(signalDiagramCopy.id.traffic, /Traffic entrance/)
})

test('public chrome does not use decorative blur', () => {
  const css = readFileSync('src/app/globals.css', 'utf8')
  const consent = readFileSync('src/components/analytics/ConsentAnalytics.tsx', 'utf8')
  assert.doesNotMatch(css, /\.state-icon__glyph \{[\s\S]*filter: blur/)
  assert.doesNotMatch(css, /\.consent-banner \{[\s\S]*filter: blur/)
  assert.doesNotMatch(consent, /backdrop-blur-xl/)
})
