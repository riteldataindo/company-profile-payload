import { execFile } from 'node:child_process'
import { mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { promisify } from 'node:util'
import { getPayload } from 'payload'
import config from '../src/payload.config'

const runCommand = promisify(execFile)
const payload = await getPayload({ config })
const temporaryDirectory = await mkdtemp(join(tmpdir(), 'smartcounter-dark-client-logos-'))
const darkVariantCompanies = new Set([
  '707',
  'Carhartt',
  'Fred Perry',
  'On',
  'Executive',
  'Wrangler',
  'Melissa',
  'Nudie Jeans Co',
  'Thule Sweden',
  'Lojel',
  'Stanley 1913',
  'Bags City',
  'Colorbox',
  'Et Cetera',
  'Wood',
  'The Palace National Jeweler',
  'Jenahara',
  'Scents of Pluto',
])

try {
  const result = await payload.find({
    collection: 'client-logos',
    limit: 100,
    depth: 0,
  })

  for (const client of result.docs) {
    if (!darkVariantCompanies.has(client.companyName)) continue

    const lightMediaId = typeof client.logo === 'number' ? client.logo : client.logo.id
    const previousDarkMediaId = typeof client.darkModeLogo === 'number'
      ? client.darkModeLogo
      : client.darkModeLogo?.id
    const lightMedia = await payload.findByID({ collection: 'media', id: lightMediaId })
    if (!lightMedia.filename) throw new Error(`Missing media filename for ${client.companyName}`)

    const darkModePath = resolve(
      temporaryDirectory,
      `${client.companyName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-dark.png`,
    )

    await runCommand('magick', [
      resolve(process.cwd(), 'public/media', lightMedia.filename),
      '-bordercolor', 'none',
      '-border', '2',
      '(',
      '+clone',
      '-channel', 'A',
      '-morphology', 'EdgeOut', 'Diamond:2',
      '+channel',
      '-fill', 'rgba(255,255,255,0.55)',
      '-colorize', '100',
      ')',
      '-compose', 'DstOver',
      '-composite',
      darkModePath,
    ])

    const darkModeMedia = await payload.create({
      collection: 'media',
      draft: false,
      data: {
        alt: `${client.companyName} logo for dark mode`,
        caption: `Client dark logo — ${client.companyName}`,
        provenanceStatus: 'unreviewed',
        permissionStatus: 'unreviewed',
      },
      filePath: darkModePath,
    })

    await payload.update({
      collection: 'client-logos',
      id: client.id,
      data: { darkModeLogo: darkModeMedia.id },
    })

    if (previousDarkMediaId) {
      const previousDarkMedia = await payload.findByID({
        collection: 'media',
        id: previousDarkMediaId,
      })
      if (previousDarkMedia.caption?.startsWith('Client dark logo —')) {
        await payload.delete({ collection: 'media', id: previousDarkMediaId })
      }
    }

    console.log(`Generated dark-mode logo for ${client.companyName}`)
  }
} finally {
  await rm(temporaryDirectory, { recursive: true, force: true })
}

process.exit(0)
