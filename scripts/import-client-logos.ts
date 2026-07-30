import { execFile } from 'node:child_process'
import { mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { promisify } from 'node:util'
import { getPayload } from 'payload'
import config from '../src/payload.config'

const sourceDirectory = resolve(process.cwd(), '../client-logos')
const runCommand = promisify(execFile)
const wordpressUploadBaseUrl = 'https://smartcounter.id/wp-content/uploads'
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

const clientLogos = [
  { filename: '9-300x300.png', companyName: '707' },
  { filename: '10-300x300.png', companyName: 'Carhartt' },
  { filename: '11-300x300.png', companyName: 'Fred Perry' },
  { filename: '12-300x300.png', companyName: 'On' },
  { filename: '13-300x300.png', companyName: 'Executive' },
  { filename: '14-300x300.png', companyName: 'Wrangler' },
  { filename: '15-300x300.png', companyName: 'Melissa' },
  { filename: '16-300x300.png', companyName: 'Nudie Jeans Co' },
  { filename: '17-300x300.png', companyName: 'Thule Sweden' },
  { filename: '18-300x300.png', companyName: 'Lojel' },
  { filename: '19-300x300.png', companyName: 'Stanley 1913' },
  { filename: '20-300x300.png', companyName: 'Bags City' },
  { filename: '21-300x300.png', companyName: 'Colorbox' },
  { filename: '22-300x300.png', companyName: 'Et Cetera' },
  { filename: '23-300x300 (1).png', companyName: 'Wood' },
  { filename: '24-300x300.png', companyName: 'Beauty Haul' },
  { filename: '25-300x300.png', companyName: 'FX Sudirman' },
  { filename: '26-300x300.png', companyName: 'Pollux Mall Paragon' },
  { filename: '27-300x300.png', companyName: 'Antasari Place' },
  { filename: '28-300x300.png', companyName: 'Plaza Indonesia' },
  { filename: '29-300x300.png', companyName: 'Pake Pakai' },
  { filename: '30-300x300.png', companyName: 'The Palace National Jeweler' },
  { filename: '31-300x300.png', companyName: 'Frank & Co' },
  { filename: '32-300x300.png', companyName: 'Mondial' },
  { filename: '23-300x300.png', companyName: '23 Semarang' },
  { filename: '25-300x300 (1).png', companyName: 'Atmos Indonesia' },
  { filename: '26-300x300 (1).png', companyName: 'Jenahara' },
  { filename: '27-300x300 (1).png', companyName: 'Scents of Pluto' },
  { filename: '29-300x300 (1).png', companyName: 'Mitra10' },
] as const

const payload = await getPayload({ config })
const normalizedDirectory = await mkdtemp(join(tmpdir(), 'smartcounter-client-logos-'))

function getWordpressSourceUrl(filename: string): string {
  const number = filename.match(/^\d+/)?.[0]
  if (!number) throw new Error(`Unable to determine WordPress source for ${filename}`)

  const isJuneAsset = ['23', '25', '26', '27', '29']
    .some((value) => filename === `${value}-300x300.png`)
  const month = isJuneAsset ? '06' : '03'

  return `${wordpressUploadBaseUrl}/2026/${month}/${number}.png`
}

try {
  const existing = await payload.find({
    collection: 'client-logos',
    limit: 1000,
    depth: 0,
  })
  const existingMediaIds = new Set(
    existing.docs
      .flatMap((client) => [
        typeof client.logo === 'number' ? client.logo : client.logo.id,
        typeof client.darkModeLogo === 'number' ? client.darkModeLogo : client.darkModeLogo?.id,
      ])
      .filter((id): id is number => typeof id === 'number'),
  )

  await payload.delete({
    collection: 'client-logos',
    where: { id: { exists: true } },
  })

  for (const mediaId of existingMediaIds) {
    const media = await payload.findByID({ collection: 'media', id: mediaId })
    if (media.caption?.startsWith('Client logo —')) {
      await payload.delete({ collection: 'media', id: mediaId })
    }
  }

  for (const [index, client] of clientLogos.entries()) {
    const usesLocalOverride = client.companyName === 'Antasari Place'
    const localSourcePath = resolve(
      sourceDirectory,
      usesLocalOverride ? 'antasari-new.jpg' : client.filename,
    )
    const fullResolutionPath = resolve(normalizedDirectory, `source-${index}.png`)
    const normalizedPath = resolve(normalizedDirectory, client.filename)
    let sourcePath = localSourcePath

    if (!usesLocalOverride) {
      try {
        const response = await fetch(getWordpressSourceUrl(client.filename))
        if (!response.ok) throw new Error(`HTTP ${response.status}`)
        await writeFile(fullResolutionPath, Buffer.from(await response.arrayBuffer()))
        sourcePath = fullResolutionPath
      } catch (error) {
        console.warn(`Full-resolution source unavailable for ${client.companyName}; using local file.`, error)
      }
    }

    const usesSquareCanvas = ['Antasari Place', 'Pake Pakai', '23 Semarang'].includes(client.companyName)

    await runCommand('magick', [
      sourcePath,
      '-alpha', 'on',
      '-fuzz', '6%',
      '-transparent', 'white',
      '-trim',
      '+repage',
      '-resize', usesSquareCanvas ? '190x190' : '440x160',
      '-gravity', 'center',
      '-background', 'none',
      '-extent', usesSquareCanvas ? '200x200' : '500x200',
      normalizedPath,
    ])

    const media = await payload.create({
      collection: 'media',
      data: {
        alt: `${client.companyName} logo`,
        caption: `Client logo — ${client.companyName}`,
      },
      filePath: normalizedPath,
    })

    let darkModeMediaId: number | undefined
    if (darkVariantCompanies.has(client.companyName)) {
      const darkModePath = resolve(normalizedDirectory, `dark-${client.filename.replace(/\.[^.]+$/, '.png')}`)

      await runCommand('magick', [
        normalizedPath,
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
        data: {
          alt: `${client.companyName} logo for dark mode`,
          caption: `Client dark logo — ${client.companyName}`,
        },
        filePath: darkModePath,
      })
      darkModeMediaId = darkModeMedia.id
    }

    await payload.create({
      collection: 'client-logos',
      data: {
        companyName: client.companyName,
        logo: media.id,
        darkModeLogo: darkModeMediaId,
        isVisible: true,
        sortOrder: index + 1,
      },
    })

    console.log(`[${index + 1}/${clientLogos.length}] Imported ${client.companyName}`)
  }

  console.log(`Imported ${clientLogos.length} normalized client logos from ${sourceDirectory}`)
} finally {
  await rm(normalizedDirectory, { recursive: true, force: true })
}

process.exit(0)
