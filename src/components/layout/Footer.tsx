import Link from 'next/link'
import type { SVGProps } from 'react'
import { SmartCounterLogo } from '@/components/brand/SmartCounterLogo'

type SocialIconProps = SVGProps<SVGSVGElement> & { size?: number }

function LinkedinIcon({ size = 18, ...props }: SocialIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M4.98 3.5C4.98 4.88 3.88 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.24 8.25h4.52V24H.24zM8.34 8.25h4.33v2.14h.06c.6-1.14 2.08-2.34 4.28-2.34 4.58 0 5.42 3.02 5.42 6.94V24h-4.52v-7.74c0-1.84-.03-4.2-2.56-4.2-2.56 0-2.95 2-2.95 4.06V24H8.34z" transform="translate(1 0)" />
    </svg>
  )
}

function InstagramIcon({ size = 18, ...props }: SocialIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true" {...props}>
      <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.4" cy="6.6" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  )
}

function YoutubeIcon({ size = 18, ...props }: SocialIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M23.5 7.2a3.4 3.4 0 0 0-2.4-2.4C19.2 4.4 12 4.4 12 4.4s-7.2 0-9.1.4A3.4 3.4 0 0 0 .5 7.2 35 35 0 0 0 0 12a35 35 0 0 0 .5 4.8 3.4 3.4 0 0 0 2.4 2.4c1.9.4 9.1.4 9.1.4s7.2 0 9.1-.4a3.4 3.4 0 0 0 2.4-2.4A35 35 0 0 0 24 12a35 35 0 0 0-.5-4.8zM9.75 15.5v-7l6.2 3.5-6.2 3.5z" />
    </svg>
  )
}

interface FooterProps {
  locale: string
  dict: Record<string, any>
  siteSettings?: any
  logo?: {
    alt: string
    height: number
    url: string
    width: number
  }
}

function validText(value: unknown): string | null {
  return typeof value === 'string' && value.trim().length > 0 ? value.trim() : null
}

function validExternalUrl(value: unknown): string | null {
  const url = validText(value)
  if (!url) return null
  try {
    const parsed = new URL(url)
    return parsed.protocol === 'https:' ? parsed.toString() : null
  } catch {
    return null
  }
}

function validWhatsApp(value: unknown): string | null {
  const number = validText(value)?.replace(/\D/g, '')
  return number && number.length >= 8 ? number : null
}

export function Footer({ locale, dict, siteSettings, logo }: FooterProps) {
  const isId = locale === 'id'
  const canShowContact = siteSettings?.identityVerified === true
  const email = canShowContact ? validText(siteSettings?.contactEmail) : null
  const phone = canShowContact ? validText(siteSettings?.contactPhone) : null
  const whatsapp = canShowContact ? validWhatsApp(siteSettings?.whatsappNumber) : null
  const address = canShowContact ? validText(siteSettings?.contactAddress) : null
  const social = siteSettings?.socialLinks || {}
  const socialLinks = [
    { key: 'linkedin', label: 'LinkedIn', icon: LinkedinIcon },
    { key: 'instagram', label: 'Instagram', icon: InstagramIcon },
    { key: 'youtube', label: 'YouTube', icon: YoutubeIcon },
  ]
  const hasContactDetails = Boolean(email || phone || whatsapp || address)
  const privacyLabel = locale === 'id' ? 'Privasi' : 'Privacy'
  const deploymentLabel = locale === 'id' ? 'Deployment' : 'Deployment'
  const footerLinks = [
    { href: `/${locale}/features`, label: dict.nav?.features || 'Features' },
    { href: `/${locale}/solutions/retail`, label: dict.nav?.retail || 'Retail' },
    { href: `/${locale}/solutions/mall`, label: dict.nav?.mall || 'Mall' },
    { href: `/${locale}/deployment`, label: deploymentLabel },
    { href: `/${locale}/privacy`, label: privacyLabel },
    { href: `/${locale}/faq`, label: dict.nav?.faq || 'FAQ' },
    { href: `/${locale}/contact`, label: dict.nav?.contact || 'Contact' },
    { href: `/${locale}/demo`, label: dict.nav?.getDemo || (isId ? 'Minta demo site-fit' : 'Request a site-fit demo') },
  ]

  return (
    <footer className="border-t border-border-subtle bg-bg-base px-4 py-10">
      <div className="mx-auto max-w-7xl">
        <div className={`grid gap-8 border-b border-border-subtle pb-8 lg:items-start ${hasContactDetails ? 'lg:grid-cols-[0.9fr_1.3fr_0.8fr]' : 'lg:grid-cols-[0.9fr_1.3fr]'}`}>
          <div>
            <SmartCounterLogo
              alt={logo?.alt || 'SmartCounter'}
              className="h-auto w-[150px]"
              height={logo?.height}
              src={logo?.url}
              width={logo?.width}
            />
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-text-secondary">
              {dict.footer?.description || 'Visitor analytics for physical retail and mall operations.'}
            </p>
          </div>

          <nav aria-label={isId ? 'Tautan footer' : 'Footer links'}>
            <h2 className="mb-3 text-xs font-bold uppercase tracking-widest text-text-muted">{dict.footer?.product || 'Explore'}</h2>
            <ul className="grid grid-cols-2 gap-x-6 sm:grid-cols-4 lg:grid-cols-2">
              {footerLinks.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} data-analytics-placement="footer" className="inline-flex min-h-10 items-center text-sm text-text-secondary transition-colors hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2">{item.label}</Link>
                </li>
              ))}
            </ul>
          </nav>

          {hasContactDetails && (
            <div>
              <h2 className="mb-4 text-xs font-bold uppercase tracking-widest text-text-muted">{dict.footer?.contactInfo || 'Contact'}</h2>
              <ul className="flex flex-col gap-2">
                {email && <li><a href={`mailto:${email}`} className="text-sm text-text-secondary transition-colors hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2">{email}</a></li>}
                {phone && <li><span className="text-sm text-text-secondary">{phone}</span></li>}
                {whatsapp && <li><a href={`https://wa.me/${whatsapp}`} className="text-sm text-text-secondary transition-colors hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2">WhatsApp</a></li>}
                {address && <li><span className="whitespace-pre-line text-sm text-text-secondary">{address}</span></li>}
              </ul>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4 pt-6 text-xs text-text-muted sm:flex-row sm:items-center sm:justify-between">
          <span>{dict.common?.copyright || '© SmartCounter'}</span>
          <div className="flex gap-3">
            {socialLinks.map(({ key, label, icon: Icon }) => {
              const href = validExternalUrl(social[key])
              return href ? (
                <a key={key} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg text-text-muted transition-colors hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2">
                  <Icon size={18} aria-hidden="true" />
                </a>
              ) : null
            })}
          </div>
        </div>
      </div>
    </footer>
  )
}
