import { execFile } from 'node:child_process'
import { mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { promisify } from 'node:util'
import { getPayload } from 'payload'
import config from '../src/payload.config'

const runCommand = promisify(execFile)
const payload = await getPayload({ config })
const temporaryDirectory = await mkdtemp(join(tmpdir(), 'smartcounter-antasari-logo-'))

try {
  const result = await payload.find({
    collection: 'client-logos',
    where: { companyName: { equals: 'Antasari Place' } },
    limit: 1,
    depth: 0,
  })
  const client = result.docs[0]
  if (!client) throw new Error('Antasari Place client record was not found.')

  const previousMediaId = typeof client.logo === 'number' ? client.logo : client.logo.id
  const normalizedPath = resolve(temporaryDirectory, 'antasari-new.png')

  await runCommand('magick', [
    resolve(process.cwd(), '../client-logos/antasari-new.jpg'),
    '-alpha', 'on',
    '-fuzz', '6%',
    '-transparent', 'white',
    '-trim',
    '+repage',
    '-resize', '190x190',
    '-gravity', 'center',
    '-background', 'none',
    '-extent', '200x200',
    normalizedPath,
  ])

  const media = await payload.create({
    collection: 'media',
    draft: false,
    data: {
      alt: 'Antasari Place logo',
      caption: 'Client logo — Antasari Place',
      provenanceStatus: 'unreviewed',
      permissionStatus: 'unreviewed',
    },
    filePath: normalizedPath,
  })

  await payload.update({
    collection: 'client-logos',
    id: client.id,
    data: { logo: media.id },
  })

  const previousMedia = await payload.findByID({ collection: 'media', id: previousMediaId })
  if (previousMedia.caption?.startsWith('Client logo —')) {
    await payload.delete({ collection: 'media', id: previousMediaId })
  }

  console.log(`Replaced Antasari Place logo with media ${media.id}.`)
} finally {
  await rm(temporaryDirectory, { recursive: true, force: true })
}

process.exit(0)
