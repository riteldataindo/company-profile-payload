export const MAX_MEDIA_UPLOAD_BYTES = 10 * 1024 * 1024

const mimeExtensions: Record<string, Set<string>> = {
  'image/jpeg': new Set(['jpg', 'jpeg']),
  'image/png': new Set(['png']),
  'image/gif': new Set(['gif']),
  'image/webp': new Set(['webp']),
  'image/avif': new Set(['avif']),
  'video/mp4': new Set(['mp4']),
  'application/pdf': new Set(['pdf']),
}

function startsWith(buffer: Buffer, bytes: number[]): boolean {
  return bytes.every((byte, index) => buffer[index] === byte)
}

export function detectMediaMime(buffer: Buffer): string | null {
  if (startsWith(buffer, [0xff, 0xd8, 0xff])) return 'image/jpeg'
  if (startsWith(buffer, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) {
    return 'image/png'
  }
  if (
    buffer.subarray(0, 6).toString('ascii') === 'GIF87a'
    || buffer.subarray(0, 6).toString('ascii') === 'GIF89a'
  ) {
    return 'image/gif'
  }
  if (
    buffer.subarray(0, 4).toString('ascii') === 'RIFF'
    && buffer.subarray(8, 12).toString('ascii') === 'WEBP'
  ) {
    return 'image/webp'
  }
  if (buffer.subarray(4, 8).toString('ascii') === 'ftyp') {
    const brand = buffer.subarray(8, 12).toString('ascii')
    if (brand === 'avif' || brand === 'avis') return 'image/avif'
    return 'video/mp4'
  }
  if (buffer.subarray(0, 5).toString('ascii') === '%PDF-') return 'application/pdf'
  return null
}

export function validateMediaUpload(file: {
  data: Buffer
  mimetype: string
  name: string
  size: number
}): string {
  if (!Number.isSafeInteger(file.size) || file.size < 1) {
    throw new Error('The uploaded file is empty or has an invalid size')
  }
  if (file.size > MAX_MEDIA_UPLOAD_BYTES || file.data.length > MAX_MEDIA_UPLOAD_BYTES) {
    throw new Error('Media files must be 10 MB or smaller')
  }

  const detectedMime = detectMediaMime(file.data)
  if (!detectedMime) {
    throw new Error('Unsupported file signature; SVG and unknown formats are not allowed')
  }

  const claimedMime = file.mimetype.toLocaleLowerCase() === 'image/jpg'
    ? 'image/jpeg'
    : file.mimetype.toLocaleLowerCase()
  if (claimedMime !== detectedMime) {
    throw new Error(`File content does not match the declared MIME type (${claimedMime})`)
  }

  const extension = file.name.split('.').pop()?.toLocaleLowerCase() || ''
  if (!mimeExtensions[detectedMime]?.has(extension)) {
    throw new Error(`File extension does not match ${detectedMime}`)
  }

  return detectedMime
}
