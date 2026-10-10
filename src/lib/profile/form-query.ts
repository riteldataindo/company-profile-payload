export type ContactSolution = 'shared' | 'retail' | 'mall'
export type FormLocale = 'en' | 'id'

export function readContactQuery(search: string): { solution: ContactSolution; packageName: string } {
  const query = new URLSearchParams(search.startsWith('?') ? search.slice(1) : search)
  const requested = query.get('solution')
  const solution: ContactSolution = requested === 'retail' || requested === 'mall' || requested === 'shared'
    ? requested
    : 'shared'
  return { solution, packageName: query.get('package') || '' }
}

export function formCopy(locale: FormLocale) {
  const isId = locale === 'id'
  return {
    context: isId ? 'Konteks' : 'Context',
    shared: isId ? 'Retail & Mall / belum pasti' : 'Retail & Mall / not sure',
    retail: 'Retail',
    mall: 'Mall',
    name: isId ? 'Nama' : 'Name',
    email: 'Email',
    phone: isId ? 'Telepon' : 'Phone',
    whatsapp: 'WhatsApp',
    company: isId ? 'Perusahaan' : 'Company',
    message: isId ? 'Pesan' : 'Message',
    locations: isId ? 'Jumlah lokasi' : 'Locations',
    packageLabel: 'Package',
    consentContact: isId
      ? 'Saya setuju SmartCounter memakai data ini untuk membalas permintaan.'
      : 'I agree that SmartCounter may use these details to reply to this request.',
    consentDemo: isId
      ? 'Saya setuju SmartCounter memakai data ini untuk mengatur demo.'
      : 'I agree that SmartCounter may use these details to arrange a demo.',
    send: isId ? 'Kirim pesan' : 'Send message',
    request: isId ? 'Minta demo' : 'Request demo',
    sending: isId ? 'Mengirim…' : 'Sending…',
    sentContact: isId ? 'Terima kasih. Pesan Anda terkirim.' : 'Thanks. Your message was sent.',
    sentDemo: isId ? 'Terima kasih. Permintaan demo terkirim.' : 'Thanks. Your demo request was sent.',
    failed: isId ? 'Form gagal dikirim. Coba lagi nanti.' : 'Failed to submit form. Please try again later.',
  }
}
