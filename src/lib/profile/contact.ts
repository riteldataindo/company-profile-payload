export type CompanyContact = {
  email: string
  whatsappNumber: string
  whatsappDisplay: string
  address: string
}

type ContactSettings = {
  identityVerified?: boolean | null
  contactEmail?: string | null
  contactAddress?: string | null
  whatsappNumber?: string | null
} | null | undefined

// Owner-approved on 2026-09-24: the contact details from the previous
// smartcounter.id site. Site Settings override them once `identityVerified`
// is switched on in /admin.
export const approvedContact: CompanyContact = {
  email: 'info@riteldata.id',
  whatsappNumber: '6288210019165',
  whatsappDisplay: '+62 882-1001-9165',
  address: 'Sunter Agung, Jakarta, Indonesia',
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function formatWhatsapp(digits: string): string {
  if (!digits.startsWith('62') || digits.length < 11) return `+${digits}`
  const local = digits.slice(2)
  return `+62 ${local.slice(0, 3)}-${local.slice(3, 7)}-${local.slice(7)}`
}

export function resolveCompanyContact(settings: ContactSettings): CompanyContact {
  if (!settings || settings.identityVerified !== true) return approvedContact
  const email = settings.contactEmail?.trim() ?? ''
  const digits = (settings.whatsappNumber ?? '').replace(/\D/g, '')
  const address = settings.contactAddress?.trim() ?? ''
  const whatsappNumber = digits.length >= 10 ? digits : approvedContact.whatsappNumber
  return {
    email: emailPattern.test(email) ? email : approvedContact.email,
    whatsappNumber,
    whatsappDisplay: whatsappNumber === approvedContact.whatsappNumber ? approvedContact.whatsappDisplay : formatWhatsapp(whatsappNumber),
    address: address || approvedContact.address,
  }
}

export function whatsappHref(contact: CompanyContact, message: string): string {
  return `https://wa.me/${contact.whatsappNumber}?text=${encodeURIComponent(message)}`
}
