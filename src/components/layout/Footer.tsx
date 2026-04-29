import Link from 'next/link'
import { Globe, Mail, ExternalLink } from 'lucide-react'

interface FooterProps {
  locale: string
  dict: Record<string, any>
  siteSettings?: any
}

export function Footer({ locale, dict, siteSettings }: FooterProps) {
  const email = siteSettings?.contactEmail || 'info@riteldata.id'
  const phone = siteSettings?.contactPhone || '+62 882-1001-9165'
  const whatsapp = siteSettings?.whatsappNumber || '6288210019165'
  const address = siteSettings?.contactAddress || 'Komplek Griya Inti Sentosa, Sunter Agung, Jakarta Utara 14350'
  const social = siteSettings?.socialLinks || {}

  return (
    <footer className="border-t border-border-subtle bg-bg-base px-4 pt-16 pb-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <span className="text-lg font-bold">
              <span className="text-logo-red" style={{ fontVariant: 'small-caps' }}>SMART</span>
              <span className="text-text-primary">Counter</span>
            </span>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-text-secondary">
              {dict.footer.description}
            </p>
          </div>

          <div>
            <h4 className="mb-4 text-xs font-bold uppercase tracking-widest text-text-muted">{dict.footer.product}</h4>
            <ul className="flex flex-col gap-2">
              <li><Link href={`/${locale}/features`} className="text-sm text-text-secondary transition-colors hover:text-text-primary">{dict.nav.features}</Link></li>
              <li><Link href={`/${locale}/packages`} className="text-sm text-text-secondary transition-colors hover:text-text-primary">{dict.nav.packages}</Link></li>
              <li><Link href={`/${locale}/use-cases`} className="text-sm text-text-secondary transition-colors hover:text-text-primary">{dict.nav.useCases}</Link></li>
              <li><Link href={`/${locale}/demo`} className="text-sm text-text-secondary transition-colors hover:text-text-primary">Demo</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-xs font-bold uppercase tracking-widest text-text-muted">{dict.footer.resources}</h4>
            <ul className="flex flex-col gap-2">
              <li><Link href={`/${locale}/blog`} className="text-sm text-text-secondary transition-colors hover:text-text-primary">{dict.nav.blog}</Link></li>
              <li><Link href={`/${locale}/faq`} className="text-sm text-text-secondary transition-colors hover:text-text-primary">{dict.nav.faq}</Link></li>
              <li><Link href={`/${locale}/contact`} className="text-sm text-text-secondary transition-colors hover:text-text-primary">{dict.nav.contact}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-xs font-bold uppercase tracking-widest text-text-muted">{dict.footer.contactInfo}</h4>
            <ul className="flex flex-col gap-2">
              <li><a href={`mailto:${email}`} className="text-sm text-text-secondary transition-colors hover:text-text-primary">{email}</a></li>
              <li><a href={`https://wa.me/${whatsapp}`} className="text-sm text-text-secondary transition-colors hover:text-text-primary">{phone}</a></li>
              <li><span className="text-sm text-text-secondary">{address}</span></li>
            </ul>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-border-subtle pt-8 text-xs text-text-muted">
          <span>{dict.common.copyright}</span>
          <div className="flex gap-4">
            {social.linkedin && <a href={social.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="text-text-muted transition-colors hover:text-text-primary"><Globe size={18} /></a>}
            {social.instagram && <a href={social.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-text-muted transition-colors hover:text-text-primary"><Mail size={18} /></a>}
            {social.youtube && <a href={social.youtube} target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="text-text-muted transition-colors hover:text-text-primary"><ExternalLink size={18} /></a>}
          </div>
        </div>
      </div>
    </footer>
  )
}
