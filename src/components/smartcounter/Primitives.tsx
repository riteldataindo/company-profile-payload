import React from 'react'
import {
  CircleAlert,
  FileImage,
  FileVideo2,
  ImageOff,
  ShieldCheck,
} from 'lucide-react'
import Link from 'next/link'
import type { ComponentProps } from 'react'
import type { Locale, LocalText } from './i18n'
import { sharedCopy, text } from './i18n'

type SmartLinkProps = Omit<ComponentProps<typeof Link>, 'href'> & {
  href: string
}

export function SmartLink({ href, ...props }: SmartLinkProps) {
  return <Link href={href} {...props} />
}

export function ButtonLink({
  href,
  children,
  variant = 'primary',
  className = '',
  onClick,
  icon,
  external = false,
}: {
  href: string
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'text'
  className?: string
  onClick?: (event: React.MouseEvent<HTMLAnchorElement>) => void
  icon?: React.ReactNode
  external?: boolean
}) {
  const classes = `button button--${variant} ${className}`.trim()
  const content = (
    <>
      {icon}
      <span>{children}</span>
    </>
  )
  if (external) {
    return (
      <a className={classes} href={href} target="_blank" rel="noopener noreferrer" onClick={onClick}>
        {content}
      </a>
    )
  }
  return (
    <SmartLink className={classes} href={href} onClick={onClick}>
      {content}
    </SmartLink>
  )
}

export function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className="eyebrow">{children}</p>
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'left',
}: {
  eyebrow?: React.ReactNode
  title: React.ReactNode
  description?: React.ReactNode
  align?: 'left' | 'center'
}) {
  return (
    <header className={`section-heading section-heading--${align}`}>
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <h2>{title}</h2>
      {description && <p>{description}</p>}
    </header>
  )
}

export function PageHero({
  eyebrow,
  title,
  description,
  actions,
  aside,
  compact = false,
}: {
  eyebrow: React.ReactNode
  title: React.ReactNode
  description: React.ReactNode
  actions?: React.ReactNode
  aside?: React.ReactNode
  compact?: boolean
}) {
  return (
    <section className={`page-hero ${compact ? 'page-hero--compact' : ''}`}>
      <div className="container page-hero__grid">
        <div className="page-hero__copy">
          <Eyebrow>{eyebrow}</Eyebrow>
          <h1>{title}</h1>
          <p className="page-hero__lead">{description}</p>
          {actions && <div className="page-hero__actions">{actions}</div>}
        </div>
        {aside && <div className="page-hero__aside">{aside}</div>}
      </div>
    </section>
  )
}

export function AssetPlaceholder({
  locale,
  title,
  description,
  requirements = [],
  type = 'image',
  tone = 'light',
  ratio = 'wide',
}: {
  locale: Locale
  title: LocalText | string
  description: LocalText | string
  requirements?: Array<LocalText | string>
  type?: 'image' | 'video' | 'product'
  tone?: 'light' | 'dark' | 'red'
  ratio?: 'wide' | 'portrait' | 'square' | 'auto'
}) {
  const resolve = (value: LocalText | string) =>
    typeof value === 'string' ? value : text(locale, value)
  const Icon = type === 'video' ? FileVideo2 : type === 'product' ? FileImage : ImageOff

  return (
    <figure
      className={`asset-placeholder asset-placeholder--${tone} asset-placeholder--${ratio}`}
      aria-label={`${resolve(title)}: ${text(locale, sharedCopy.assetUnavailable)}`}
    >
      <div className="asset-placeholder__mark" aria-hidden="true">
        <Icon size={26} strokeWidth={1.7} />
      </div>
      <div className="asset-placeholder__body">
        <span className="asset-placeholder__status">
          <CircleAlert aria-hidden="true" size={14} />
          {text(locale, sharedCopy.assetUnavailable)}
        </span>
        <strong className="asset-placeholder__title">{resolve(title)}</strong>
        <p>{resolve(description)}</p>
        {requirements.length > 0 && (
          <ul>
            {requirements.map((item) => (
              <li key={resolve(item)}>{resolve(item)}</li>
            ))}
          </ul>
        )}
      </div>
      <figcaption>
        {type === 'video'
          ? text(locale, { en: 'Video slot', id: 'Slot video' })
          : type === 'product'
            ? text(locale, sharedCopy.actualProductUi)
            : text(locale, { en: 'Media slot', id: 'Slot media' })}
      </figcaption>
    </figure>
  )
}

const statusLabels = {
  deployment: sharedCopy.deploymentDependent,
  assessment: sharedCopy.assessmentRequired,
  scope: sharedCopy.availableByScope,
  unavailable: sharedCopy.notAvailable,
} as const

export type StatusName = keyof typeof statusLabels

export function normalizeStatus(status: string): StatusName {
  if (status in statusLabels) return status as StatusName
  return 'scope'
}

export function StatusPill({
  locale,
  status,
}: {
  locale: Locale
  status: string
}) {
  const name = normalizeStatus(status)
  return (
    <span className={`status-pill status-pill--${name}`}>
      <span aria-hidden="true" />
      {text(locale, statusLabels[name])}
    </span>
  )
}

export function TruthNotice({
  locale,
  title,
  children,
  tone = 'neutral',
}: {
  locale: Locale
  title?: LocalText | string
  children: React.ReactNode
  tone?: 'neutral' | 'warning' | 'success'
}) {
  const resolvedTitle = title
    ? typeof title === 'string'
      ? title
      : text(locale, title)
    : text(locale, { en: 'Published boundary', id: 'Batas publikasi' })

  return (
    <aside className={`truth-notice truth-notice--${tone}`}>
      <ShieldCheck aria-hidden="true" size={21} />
      <div>
        <h3>{resolvedTitle}</h3>
        <div>{children}</div>
      </div>
    </aside>
  )
}

export function DefinitionList({
  items,
}: {
  items: Array<{ term: React.ReactNode; description: React.ReactNode }>
}) {
  return (
    <dl className="definition-list">
      {items.map((item, index) => (
        <div key={index}>
          <dt>{item.term}</dt>
          <dd>{item.description}</dd>
        </div>
      ))}
    </dl>
  )
}

export function Breadcrumbs({
  locale,
  items,
}: {
  locale: Locale
  items: Array<{ label: string; href?: string }>
}) {
  return (
    <nav className="breadcrumbs" aria-label={locale === 'id' ? 'Breadcrumb' : 'Breadcrumb'}>
      <ol>
        {items.map((item, index) => (
          <li key={`${item.label}-${index}`}>
            {item.href ? <SmartLink href={item.href}>{item.label}</SmartLink> : <span aria-current="page">{item.label}</span>}
          </li>
        ))}
      </ol>
    </nav>
  )
}

export function EmptyEvidence({ locale, message }: { locale: Locale; message?: LocalText }) {
  return (
    <div className="empty-evidence" role="status">
      <ImageOff aria-hidden="true" size={22} />
      <strong>{text(locale, sharedCopy.notAvailable)}</strong>
      <span>
        {text(
          locale,
          message || {
            en: 'No approved evidence asset has been supplied for this slot.',
            id: 'Belum ada aset bukti yang disetujui untuk slot ini.',
          },
        )}
      </span>
    </div>
  )
}
