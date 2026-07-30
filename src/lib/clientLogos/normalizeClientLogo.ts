import { mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import type { Payload, PayloadRequest } from 'payload'
import sharp from 'sharp'

const WHITE_EDGE_THRESHOLD = 240
const TRANSPARENT_THRESHOLD = 16
const SQUARE_RATIO_THRESHOLD = 1.35

function removeConnectedWhiteBackground(
  pixels: Buffer,
  width: number,
  height: number,
  channels: number,
) {
  const visited = new Uint8Array(width * height)
  const queue = new Int32Array(width * height)
  let queueStart = 0
  let queueEnd = 0

  const canRemove = (pixelIndex: number) => {
    const offset = pixelIndex * channels
    const alpha = pixels[offset + 3]
    return alpha <= TRANSPARENT_THRESHOLD
      || (
        pixels[offset] >= WHITE_EDGE_THRESHOLD
        && pixels[offset + 1] >= WHITE_EDGE_THRESHOLD
        && pixels[offset + 2] >= WHITE_EDGE_THRESHOLD
      )
  }

  const enqueue = (pixelIndex: number) => {
    if (visited[pixelIndex] || !canRemove(pixelIndex)) return
    visited[pixelIndex] = 1
    queue[queueEnd] = pixelIndex
    queueEnd += 1
  }

  for (let x = 0; x < width; x += 1) {
    enqueue(x)
    enqueue((height - 1) * width + x)
  }
  for (let y = 0; y < height; y += 1) {
    enqueue(y * width)
    enqueue(y * width + width - 1)
  }

  while (queueStart < queueEnd) {
    const pixelIndex = queue[queueStart]
    queueStart += 1

    const offset = pixelIndex * channels
    pixels[offset + 3] = 0

    const x = pixelIndex % width
    const y = Math.floor(pixelIndex / width)
    if (x > 0) enqueue(pixelIndex - 1)
    if (x + 1 < width) enqueue(pixelIndex + 1)
    if (y > 0) enqueue(pixelIndex - width)
    if (y + 1 < height) enqueue(pixelIndex + width)
  }
}

export async function createNormalizedClientLogo(inputPath: string, outputPath: string) {
  const source = await sharp(inputPath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })

  const pixels = Buffer.from(source.data)
  removeConnectedWhiteBackground(
    pixels,
    source.info.width,
    source.info.height,
    source.info.channels,
  )

  const trimmed = await sharp(pixels, {
    raw: {
      width: source.info.width,
      height: source.info.height,
      channels: source.info.channels,
    },
  })
    .trim({ background: { r: 0, g: 0, b: 0, alpha: 0 }, threshold: 1 })
    .png()
    .toBuffer({ resolveWithObject: true })

  const ratio = trimmed.info.width / trimmed.info.height
  const usesSquareCanvas = ratio <= SQUARE_RATIO_THRESHOLD
  const canvas = usesSquareCanvas
    ? { width: 200, height: 200, contentWidth: 190, contentHeight: 190 }
    : { width: 500, height: 200, contentWidth: 440, contentHeight: 160 }

  const resized = await sharp(trimmed.data)
    .resize({
      width: canvas.contentWidth,
      height: canvas.contentHeight,
      fit: 'inside',
      withoutEnlargement: false,
    })
    .png()
    .toBuffer({ resolveWithObject: true })

  const horizontalSpace = canvas.width - resized.info.width
  const verticalSpace = canvas.height - resized.info.height

  await sharp(resized.data)
    .extend({
      left: Math.floor(horizontalSpace / 2),
      right: Math.ceil(horizontalSpace / 2),
      top: Math.floor(verticalSpace / 2),
      bottom: Math.ceil(verticalSpace / 2),
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png({ compressionLevel: 9 })
    .toFile(outputPath)

  return {
    canvas: usesSquareCanvas ? 'square' as const : 'landscape' as const,
    width: canvas.width,
    height: canvas.height,
  }
}

export async function normalizeClientLogoMedia({
  payload,
  mediaId,
  companyName,
  req,
}: {
  payload: Payload
  mediaId: number
  companyName: string
  req?: Partial<PayloadRequest>
}) {
  const media = await payload.findByID({
    collection: 'media',
    id: mediaId,
    depth: 0,
    req,
  })

  if (!media.filename || !media.mimeType?.startsWith('image/')) {
    throw new Error(`Client logo "${companyName}" must use a valid image file.`)
  }

  const temporaryDirectory = await mkdtemp(join(tmpdir(), 'smartcounter-client-logo-'))
  const outputPath = join(temporaryDirectory, `client-logo-${mediaId}.png`)

  try {
    const result = await createNormalizedClientLogo(
      resolve(process.cwd(), 'public/media', media.filename),
      outputPath,
    )

    await payload.update({
      collection: 'media',
      id: mediaId,
      data: {
        alt: media.alt || `${companyName} logo`,
      },
      filePath: outputPath,
      req,
    })

    return result
  } finally {
    await rm(temporaryDirectory, { recursive: true, force: true })
  }
}
