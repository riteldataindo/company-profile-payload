import { getPayload } from 'payload'
import config from '../src/payload.config'
import { normalizeClientLogoMedia } from '../src/lib/clientLogos/normalizeClientLogo'

const payload = await getPayload({ config })
const squareCompanies = new Set(['FX Sudirman', 'Bags City'])

const clients = await payload.find({
  collection: 'client-logos',
  where: {
    companyName: { in: [...squareCompanies] },
  },
  limit: squareCompanies.size,
  depth: 0,
})

for (const client of clients.docs) {
  const mediaId = typeof client.logo === 'number' ? client.logo : client.logo.id
  const result = await normalizeClientLogoMedia({
    payload,
    mediaId,
    companyName: client.companyName,
  })

  console.log(`${client.companyName}: ${result.canvas} ${result.width}x${result.height}`)
}

process.exit(0)
