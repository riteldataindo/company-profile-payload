import assert from 'node:assert/strict'
import test from 'node:test'
import {
  fallbackCapabilities,
  fallbackFaq,
  fallbackGuides,
  fallbackPackages,
  loadProfileContent,
  mapCapabilities,
  mapFaq,
  mapGuides,
  mapPackages,
} from '../src/lib/profile/content'
import type { Where } from "payload";
import type { BlogPost } from "../src/payload-types";

function richText(text: string): NonNullable<BlogPost['content']> {
  return {
    root: {
      type: 'root',
      children: [
        {
          type: 'paragraph',
          version: 1,
          children: [{ type: 'text', version: 1, text }],
        },
      ],
      direction: 'ltr',
      format: '',
      indent: 0,
      version: 1,
    },
  }
}

test('empty package docs fall back to the commercial packages', () => {
  const en = mapPackages([], 'en')
  const id = mapPackages([], 'id')
  assert.deepEqual(en.map((item) => item.name), ['Core Platform', 'Advanced Analytics', 'Enterprise'])
  assert.match(en[0].body, /Defined traffic/)
  assert.match(id[0].body, /Fondasi traffic/)
  assert.deepEqual(en.map((item) => item.status), ['scope', 'assessment', 'assessment'])
  assert.equal(fallbackPackages('id')[1].label, 'Paling umum')
})

test('mapped packages replace the fallback instead of mixing rows', () => {
  const mapped = mapPackages([
    {
      name: 'Core Platform',
      slug: 'core-platform--scope',
      description: 'Seeded core body',
      ctaText: 'Core',
      isFeatured: true,
      sortOrder: 2,
      features: [{ featureText: 'One line', included: true }, { featureText: 'Hidden', included: false }],
    },
    {
      name: 'Only Custom',
      slug: 'only-custom--deployment',
      description: 'Custom body',
      sortOrder: 1,
    },
  ], 'en')
  assert.deepEqual(mapped.map((item) => item.name), ['Only Custom', 'Core Platform'])
  assert.equal(mapped[0].status, 'deployment')
  assert.equal(mapped[1].status, 'scope')
  assert.deepEqual(mapped[1].items, ['One line'])
  assert.equal(mapped[1].label, 'Core')
  assert.equal(mapped[0].label, 'Only Custom')
})

test('empty guide docs fall back to the people counting guide', () => {
  const en = mapGuides([], 'en')
  const id = mapGuides([], 'id')
  assert.equal(fallbackGuides('en')[0].slug, 'what-is-a-people-counting-system')
  assert.equal(en[0].title, 'What Is a People Counting System?')
  assert.ok(id.some((guide) => guide.title.includes('Apa Itu People Counting System?')))
  const fromContent = mapGuides([{
    title: 'Custom guide',
    slug: 'custom-guide',
    content: richText(`${'Alpha beta gamma '.repeat(30)}tail`),
  }], 'en')
  assert.equal(fromContent.length, 1)
  assert.equal(fromContent[0].slug, 'custom-guide')
  assert.match(fromContent[0].description, /^Alpha beta gamma/)
  assert.ok(fromContent[0].description.length <= 180)
})

test('empty faq docs fall back to product and measurement', () => {
  const en = mapFaq([], 'en')
  const id = fallbackFaq('id')
  assert.ok(en.some((group) => group.title === 'Product and measurement'))
  assert.equal(id[0].title, 'Produk dan measurement')
  const grouped = mapFaq([
    { question: 'Later', answer: richText('Second answer'), category: 'Product and measurement', sortOrder: 2 },
    { question: 'Earlier', answer: richText('First answer'), category: 'Product and measurement', sortOrder: 1 },
  ], 'en')
  assert.equal(grouped.length, 1)
  assert.deepEqual(grouped[0].items.map((item) => item.answer), ['First answer', 'Second answer'])
})

test('empty capability docs fall back to visitor traffic', () => {
  const en = mapCapabilities([], 'en')
  const traffic = en.find((item) => item.name === 'Visitor traffic')
  assert.ok(traffic)
  assert.equal(traffic.group, 'Traffic')
  assert.match(traffic.decision, /Review traffic patterns/)
  assert.match(traffic.prerequisite, /Approved scene/)
  assert.match(traffic.limitation, /Counts depend on scene/)
  const idTraffic = mapCapabilities([], 'id').find((item) => item.name === 'Visitor traffic')
  assert.ok(idTraffic)
  assert.match(idTraffic.decision, /Meninjau pola traffic/)
  assert.match(idTraffic.prerequisite, /Scene disetujui/)
  assert.match(idTraffic.limitation, /Hitungan bergantung pada scene/)
  assert.equal(fallbackCapabilities('en').length, 14)
  const seeded = mapCapabilities([{
    name: 'Visitor traffic',
    shortDescription: 'Seeded definition',
    productTruth: {
      solutionType: 'retail',
      publicAvailability: 'available',
      unitAndTimeWindow: 'People',
      decisionSupported: 'Seeded decision',
      inputAndPrerequisites: 'Seeded prerequisite',
      limitationsAndValidation: 'Seeded limitation',
    },
  }], 'en')
  assert.equal(seeded.length, 1)
  assert.equal(seeded[0].group, 'retail')
  assert.equal(seeded[0].definition, 'Seeded definition')
  assert.equal(seeded[0].decision, 'Seeded decision')
  assert.equal(seeded[0].prerequisite, 'Seeded prerequisite')
  assert.equal(seeded[0].limitation, 'Seeded limitation')
  assert.equal(seeded[0].status, 'available')
  const unnamed = mapCapabilities([{ name: '  ', shortDescription: 'Ignored' }], 'id')
  assert.ok(unnamed.some((item) => item.name === 'Visitor traffic' && item.group === 'Traffic'))
})

test('loadProfileContent reads seeded bilingual payload docs', { timeout: 180000 }, async () => {
  const { getPayload } = await import('../src/lib/payload')
  const payload = await getPayload()
  const packageSlugs = ['core-platform-qx7', 'advanced-analytics-qx7', 'enterprise-qx7']
  const guideSlug = 'what-is-a-people-counting-system'
  const featureStableId = 'visitor-traffic-qx7'
  const faqQuestions = {
    en: 'What seeded boundary does qx7 measure?',
    id: 'Boundary seeded apa yang diukur qx7?',
  }
  const created = {
    packages: [] as Array<number | string>,
    guides: [] as Array<number | string>,
    faqs: [] as Array<number | string>,
    features: [] as Array<number | string>,
  }

  async function idsFor(collection: 'pricing-tiers' | 'blog-posts' | 'features' | 'faq-items', where: Where) {
    const ids = new Set<number | string>()
    for (const locale of ['en', 'id'] as const) {
      const result = await payload.find({
        collection,
        where,
        locale,
        depth: 0,
        limit: 20,
        overrideAccess: true,
      })
      for (const doc of result.docs) ids.add(doc.id)
    }
    return [...ids]
  }

  async function remove(collection: 'pricing-tiers' | 'blog-posts' | 'features' | 'faq-items', id: number | string) {
    await payload.delete({ collection, id, overrideAccess: true })
  }

  async function preClean() {
    for (const slug of packageSlugs) {
      for (const id of await idsFor('pricing-tiers', { slug: { equals: slug } })) await remove('pricing-tiers', id)
    }
    for (const id of await idsFor('blog-posts', { slug: { equals: guideSlug } })) await remove('blog-posts', id)
    for (const id of await idsFor('features', { stableId: { equals: featureStableId } })) await remove('features', id)
    for (const question of [faqQuestions.en, faqQuestions.id]) {
      for (const id of await idsFor('faq-items', { question: { equals: question } })) await remove('faq-items', id)
    }
  }

  try {
    await preClean()

    const packageSeeds = [
      {
        name: 'Core Platform',
        slug: 'core-platform-qx7',
        sortOrder: 1,
        isFeatured: false,
        label: { en: 'Core', id: 'Core' },
        body: {
          en: 'Seeded core scope qx7-en for an approved reporting boundary.',
          id: 'Seeded core scope qx7-id untuk boundary pelaporan disetujui.',
        },
        item: { en: 'Seeded core item qx7-en', id: 'Seeded core item qx7-id' },
      },
      {
        name: 'Advanced Analytics',
        slug: 'advanced-analytics-qx7',
        sortOrder: 2,
        isFeatured: true,
        label: { en: 'Most common', id: 'Paling umum' },
        body: {
          en: 'Seeded advanced module qx7-en assessed on top of core.',
          id: 'Seeded advanced module qx7-id dinilai di atas core.',
        },
        item: { en: 'Seeded advanced item qx7-en', id: 'Seeded advanced item qx7-id' },
      },
      {
        name: 'Enterprise',
        slug: 'enterprise-qx7',
        sortOrder: 3,
        isFeatured: true,
        label: { en: 'Complex rollout', id: 'Rollout kompleks' },
        body: {
          en: 'Seeded enterprise rollout qx7-en for a governed multi-property scope.',
          id: 'Seeded enterprise rollout qx7-id untuk scope multi-property.',
        },
        item: { en: 'Seeded enterprise item qx7-en', id: 'Seeded enterprise item qx7-id' },
      },
    ]

    for (const seed of packageSeeds) {
      const doc = await payload.create({
        collection: 'pricing-tiers',
        locale: 'en',
        overrideAccess: true,
        data: {
          name: seed.name,
          slug: seed.slug,
          description: seed.body.en,
          ctaText: seed.label.en,
          isVisible: true,
          isFeatured: seed.isFeatured,
          sortOrder: seed.sortOrder,
          features: [{ featureText: seed.item.en, included: true }],
        },
      })
      created.packages.push(doc.id)
      await payload.update({
        collection: 'pricing-tiers',
        id: doc.id,
        locale: 'id',
        overrideAccess: true,
        data: {
          name: seed.name,
          description: seed.body.id,
          ctaText: seed.label.id,
          features: (doc.features ?? []).map((row) => ({
            id: row.id,
            featureText: seed.item.id,
          })),
        },
      })
    }

    const guide = await payload.create({
      collection: 'blog-posts',
      locale: 'en',
      overrideAccess: true,
      data: {
        title: 'What Is a People Counting System?',
        slug: guideSlug,
        excerpt: 'Seeded guide excerpt qx7-en for people counting boundaries.',
        content: richText('Seeded guide content qx7-en for people counting boundaries.'),
        status: 'published',
        isVisible: true,
        publishedAt: '2026-08-27T00:00:00.000Z',
      },
    })
    created.guides.push(guide.id)
    await payload.update({
      collection: 'blog-posts',
      id: guide.id,
      locale: 'id',
      overrideAccess: true,
      data: {
        title: 'Apa Itu People Counting System?',
        slug: guideSlug,
        excerpt: 'Seeded guide excerpt qx7-id untuk boundary people counting.',
        content: richText('Seeded guide content qx7-id untuk boundary people counting.'),
      },
    })

    const faq = await payload.create({
      collection: 'faq-items',
      locale: 'en',
      overrideAccess: true,
      data: {
        question: faqQuestions.en,
        answer: richText('Seeded faq answer qx7-en inside an approved boundary.'),
        category: 'Product and measurement',
        sortOrder: 1,
        publiclyApproved: true,
        isVisible: true,
      },
    })
    created.faqs.push(faq.id)
    await payload.update({
      collection: 'faq-items',
      id: faq.id,
      locale: 'id',
      overrideAccess: true,
      data: {
        question: faqQuestions.id,
        answer: richText('Seeded faq answer qx7-id di dalam boundary disetujui.'),
        category: 'Produk dan measurement',
      },
    })

    const feature = await payload.create({
      collection: 'features',
      locale: 'en',
      overrideAccess: true,
      data: {
        stableId: featureStableId,
        name: 'Visitor traffic',
        slug: featureStableId,
        shortDescription: 'Seeded capability definition qx7-en for visitor traffic.',
        isVisible: true,
        publiclyApproved: true,
        sortOrder: 1,
        productTruth: {
          solutionType: 'retail',
          publicAvailability: 'available',
          commercialEntitlement: 'core',
          unitAndTimeWindow: 'People per seeded boundary qx7-en',
          decisionSupported: 'How should seeded visitor traffic qx7 be reviewed?',
          inputAndPrerequisites: 'Seeded prerequisite qx7-en for the approved scene.',
          limitationsAndValidation: 'Seeded limitation qx7-en for occlusion and boundary.',
        },
        evidence: { mediaStatus: 'none' },
      },
    })
    created.features.push(feature.id)
    await payload.update({
      collection: 'features',
      id: feature.id,
      locale: 'id',
      overrideAccess: true,
      data: {
        name: 'Visitor traffic',
        slug: featureStableId,
        shortDescription: 'Seeded capability definition qx7-id untuk visitor traffic.',
        productTruth: {
          solutionType: 'retail',
          publicAvailability: 'available',
          commercialEntitlement: 'core',
          unitAndTimeWindow: 'Orang per boundary seeded qx7-id',
          decisionSupported: 'Bagaimana traffic visitor seeded qx7 ditinjau?',
          inputAndPrerequisites: 'Seeded prerequisite qx7-id untuk scene disetujui.',
          limitationsAndValidation: 'Seeded limitation qx7-id untuk occlusion dan boundary.',
        },
      },
    })

    const en = await loadProfileContent('en')
    const id = await loadProfileContent('id')

    assert.deepEqual(en.packages.map((item) => item.name), ['Core Platform', 'Advanced Analytics', 'Enterprise'])
    assert.deepEqual(id.packages.map((item) => item.name), ['Core Platform', 'Advanced Analytics', 'Enterprise'])
    assert.deepEqual(en.packages.map((item) => item.status), ['scope', 'assessment', 'assessment'])
    assert.ok(en.packages.every((item) => item.body.includes('qx7-en') && item.items.some((line) => line.includes('qx7-en'))))
    assert.ok(id.packages.every((item) => item.body.includes('qx7-id') && item.items.some((line) => line.includes('qx7-id'))))
    assert.equal(id.packages[1].label, 'Paling umum')
    assert.doesNotMatch(en.packages[0].body, /Defined traffic/)
    assert.doesNotMatch(id.packages[0].body, /Fondasi traffic/)

    assert.equal(en.guides.length, 1)
    assert.equal(en.guides[0].slug, guideSlug)
    assert.equal(en.guides[0].title, 'What Is a People Counting System?')
    assert.match(en.guides[0].description, /qx7-en/)
    assert.equal(id.guides[0].title, 'Apa Itu People Counting System?')
    assert.match(id.guides[0].description, /qx7-id/)

    assert.equal(en.faq.length, 1)
    assert.equal(en.faq[0].title, 'Product and measurement')
    assert.match(en.faq[0].items[0].answer, /qx7-en/)
    assert.equal(id.faq[0].title, 'Produk dan measurement')
    assert.match(id.faq[0].items[0].answer, /qx7-id/)
    assert.match(id.faq[0].items[0].question, /qx7/)

    assert.equal(en.capabilities.length, 1)
    assert.equal(en.capabilities[0].name, 'Visitor traffic')
    assert.equal(en.capabilities[0].group, 'retail')
    assert.match(en.capabilities[0].definition, /qx7-en/)
    assert.match(en.capabilities[0].unit, /qx7-en/)
    assert.equal(id.capabilities[0].name, 'Visitor traffic')
    assert.match(id.capabilities[0].definition, /qx7-id/)
    assert.match(id.capabilities[0].question, /qx7/)
    assert.match(en.capabilities[0].decision, /qx7/)
    assert.match(en.capabilities[0].prerequisite, /qx7-en/)
    assert.match(en.capabilities[0].limitation, /qx7-en/)
    assert.match(id.capabilities[0].decision, /qx7/)
    assert.match(id.capabilities[0].prerequisite, /qx7-id/)
    assert.match(id.capabilities[0].limitation, /qx7-id/)
    assert.doesNotMatch(en.capabilities[0].definition, /Aggregate people observations/)
    assert.doesNotMatch(en.capabilities[0].decision, /Review traffic patterns/)
  } finally {
    for (const id of created.features) await remove('features', id).catch(() => undefined)
    for (const id of created.faqs) await remove('faq-items', id).catch(() => undefined)
    for (const id of created.guides) await remove('blog-posts', id).catch(() => undefined)
    for (const id of created.packages) await remove('pricing-tiers', id).catch(() => undefined)
    await preClean().catch(() => undefined)
    await payload.destroy().catch(() => undefined)
    // Payload keeps a checked-out Postgres client, a type-generation child, and
    // outbound sockets open. Unref those so node:test can exit; leave IPC pipes.
    const handles = (process as NodeJS.Process & {
      _getActiveHandles?: () => Array<{
        constructor?: { name?: string }
        remotePort?: number
        spawnargs?: string[]
        kill?: (signal?: string) => void
        unref?: () => void
      }>
    })._getActiveHandles?.() ?? []
    for (const handle of handles) {
      const name = handle?.constructor?.name
      const args = (handle.spawnargs ?? []).join(' ')
      if (name === 'ChildProcess' && args.includes('generate:types')) {
        handle.kill?.('SIGTERM')
        handle.unref?.()
      }
      if (name === 'TLSSocket' || (name === 'Socket' && handle.remotePort)) handle.unref?.()
    }
  }
})
