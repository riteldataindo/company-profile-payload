import Link from 'next/link'
import { Globe, Mail, ExternalLink } from 'lucide-react'

interface FooterProps {
  locale: string
  dict: Record<string, any>
  siteSettings?: any
  navigation?: any
}

export function Footer({ locale, dict, siteSettings, navigation }: FooterProps) {
  const email = siteSettings?.contactEmail || 'info@riteldata.id'
  const phone = siteSettings?.contactPhone || '+62 882-1001-9165'
  const whatsapp = siteSettings?.whatsappNumber || '6288210019165'
  const address = siteSettings?.contactAddress || 'Komplek Griya Inti Sentosa, Sunter Agung, Jakarta Utara 14350'
  const social = siteSettings?.socialLinks || {}

  const productLinks = navigation?.footerMenu?.product?.length > 0
    ? navigation.footerMenu.product
    : [
        { label: dict.nav.features, link: '/features' },
        { label: dict.nav.packages, link: '/packages' },
        { label: dict.nav.useCases, link: '/use-cases' },
        { label: 'Demo', link: '/demo' },
      ]

  const resourceLinks = navigation?.footerMenu?.resources?.length > 0
    ? navigation.footerMenu.resources
    : [
        { label: dict.nav.blog, link: '/blog' },
        { label: dict.nav.faq, link: '/faq' },
        { label: dict.nav.contact, link: '/contact' },
      ]

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
            <h4 className="mb-4 text-xs font-bold uppercase tracking-widest text-text-muted">
              {dict.footer.product}
            </h4>
            <ul className="flex flex-col gap-2">
              {productLinks.map((item: any, i: number) => (
                <li key={i}>
                  <Link href={`/${locale}${item.link}`} className="text-sm text-text-secondary transition-colors hover:text-text-primary">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-xs font-bold uppercase tracking-widest text-text-muted">
              {dict.footer.resources}
            </h4>
            <ul className="flex flex-col gap-2">
              {resourceLinks.map((item: any, i: number) => (
                <li key={i}>
                  <Link href={`/${locale}${item.link}`} className="text-sm text-text-secondary transition-colors hover:text-text-primary">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-xs font-bold uppercase tracking-widest text-text-muted">
              {dict.footer.contactInfo}
            </h4>
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
            {social.linkedin && <a href={social.linkedin} aria-label="LinkedIn" className="text-text-muted transition-colors hover:text-text-primary"><Globe size={18} /></a>}
            {social.instagram && <a href={social.instagram} aria-label="Instagram" className="text-text-muted transition-colors hover:text-text-primary"><Mail size={18} /></a>}
            {social.youtube && <a href={social.youtube} aria-label="YouTube" className="text-text-muted transition-colors hover:text-text-primary"><ExternalLink size={18} /></a>}
            {!social.linkedin && !social.instagram && !social.youtube && (
              <>
                <a href="#" aria-label="LinkedIn" className="text-text-muted transition-colors hover:text-text-primary"><Globe size={18} /></a>
                <a href="#" aria-label="Instagram" className="text-text-muted transition-colors hover:text-text-primary"><Mail size={18} /></a>
                <a href="#" aria-label="YouTube" className="text-text-muted transition-colors hover:text-text-primary"><ExternalLink size={18} /></a>
              </>
            )}
          </div>
        </div>
      </div>
    </footer>
  )
}
