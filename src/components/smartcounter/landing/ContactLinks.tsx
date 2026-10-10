import React from 'react'
import { Mail, MapPin, MessageCircle } from 'lucide-react'
import { whatsappHref, type CompanyContact } from '@/lib/profile/contact'
import type { Locale } from '../i18n'
import { text } from '../i18n'
import { heroCopy } from './copy'

export function ContactLinks({
  locale,
  contact,
  showAddress = false,
}: {
  locale: Locale
  contact: CompanyContact
  showAddress?: boolean
}) {
  return (
    <ul className="lp-contact-links">
      <li>
        <a href={`mailto:${contact.email}`}>
          <Mail aria-hidden="true" size={18} />
          <span>{contact.email}</span>
        </a>
      </li>
      <li>
        <a href={whatsappHref(contact, text(locale, heroCopy.whatsappMessage))} target="_blank" rel="noopener noreferrer">
          <MessageCircle aria-hidden="true" size={18} />
          <span>{`WhatsApp ${contact.whatsappDisplay}`}</span>
        </a>
      </li>
      {showAddress && (
        <li>
          <span className="lp-contact-links__static">
            <MapPin aria-hidden="true" size={18} />
            <span>{contact.address}</span>
          </span>
        </li>
      )}
    </ul>
  )
}
