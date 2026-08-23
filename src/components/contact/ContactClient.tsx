'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { Check, ChevronDown, Globe, Mail, MapPin, MessageCircle, Send } from 'lucide-react'
import { submitForm } from '@/app/actions/submitForm'
import { trackEvent } from '@/lib/analytics/events'
import { getConversionCopy, type SolutionContext } from '@/lib/i18n/conversion-copy'

interface ContactClientProps {
  locale: string
  contactInfo: {
    identityVerified: boolean
    email?: string
    phone?: string
    whatsapp?: string
    address?: string
    socialLinks: Record<string, string>
  }
}

function validWhatsApp(value: string | undefined): string | null {
  const number = value?.replace(/\D/g, '')
  return number && number.length >= 8 ? number : null
}

export function ContactClient({ locale, contactInfo }: ContactClientProps) {
  const copy = getConversionCopy(locale).contact
  const solutionOptions = getConversionCopy(locale).demo.solutionOptions
  const [submitted, setSubmitted] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)
  const errorSummaryRef = useRef<HTMLDivElement>(null)
  const successRef = useRef<HTMLDivElement>(null)
  const whatsapp = validWhatsApp(contactInfo.whatsapp)
  const canShowContact = contactInfo.identityVerified

  const infoItems = [
    canShowContact && contactInfo.email ? { icon: Mail, label: copy.email, value: contactInfo.email, href: `mailto:${contactInfo.email}` } : null,
    canShowContact && contactInfo.phone ? { icon: MessageCircle, label: copy.phone, value: contactInfo.phone } : null,
    canShowContact && contactInfo.address ? { icon: MapPin, label: copy.address, value: contactInfo.address } : null,
  ].filter((item): item is NonNullable<typeof item> => Boolean(item))
  const hasSocial = Boolean(
    canShowContact && (contactInfo.socialLinks.linkedin || contactInfo.socialLinks.instagram || contactInfo.socialLinks.youtube),
  )
  const showIdentity = infoItems.length > 0 || Boolean(canShowContact && whatsapp) || hasSocial

  useEffect(() => {
    if (submitted) successRef.current?.focus()
  }, [submitted])

  function focusFirstError() {
    window.requestAnimationFrame(() => {
      const target = formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')
        || errorSummaryRef.current
      target?.focus()
    })
  }

  function clearError(field: string) {
    setErrors((current) => {
      if (!current[field] && !current.form) return current
      const next = { ...current }
      delete next[field]
      delete next.form
      return next
    })
  }

  function solutionChange(value: string) {
    if (value === 'retail' || value === 'mall' || value === 'shared') {
      trackEvent('solution_select', { locale, solution: value, placement: 'contact_form' })
    }
    clearError('solution')
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const solution = String(form.get('solution') || 'shared') as SolutionContext
    const name = String(form.get('name') || '')
    const email = String(form.get('email') || '')
    const message = String(form.get('message') || '')
    const phone = String(form.get('phone') || '')
    const company = String(form.get('company') || '')
    const privacyConsent = form.get('privacyConsent') === 'on'
    const website = String(form.get('website') || '')

    const nextErrors: Record<string, string> = {}
    if (name.trim().length < 2) nextErrors.name = copy.validation.name
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) nextErrors.email = copy.validation.email
    if (message.trim().length < 10) nextErrors.message = copy.validation.message
    if (!privacyConsent) nextErrors.privacyConsent = copy.validation.consent
    if (Object.keys(nextErrors).length > 0) {
      setErrors({ ...nextErrors, form: copy.retryError })
      focusFirstError()
      trackEvent('contact_submit_error', { locale, solution, category: 'validation' })
      return
    }

    setErrors({})
    setIsLoading(true)
    try {
      const result = await submitForm({
        formType: 'contact',
        solution,
        name,
        email,
        message,
        phone: phone || undefined,
        company: company || undefined,
        privacyConsent,
        website,
      })
      if (result.success) {
        setSubmitted(true)
        trackEvent('contact_submit_success', { locale, solution })
      } else {
        const field = typeof result.field === 'string' ? result.field : 'form'
        setErrors({ [field]: result.error || copy.genericError, form: copy.retryError })
        focusFirstError()
        trackEvent('contact_submit_error', { locale, solution, category: 'server' })
      }
    } catch {
      setErrors({ form: copy.genericError })
      focusFirstError()
      trackEvent('contact_submit_error', { locale, solution, category: 'network' })
    } finally {
      setIsLoading(false)
    }
  }

  function resetForm() {
    setSubmitted(false)
    setErrors({})
    window.requestAnimationFrame(() => document.getElementById('contact-name')?.focus())
  }

  return (
    <div className="px-4 pt-32 pb-28 sm:pb-20">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h1 className="mb-3 text-4xl font-bold tracking-tight md:text-5xl">{copy.title}</h1>
          <p className="text-lg text-text-secondary">{copy.intro}</p>
        </div>

        <div className={`mx-auto grid gap-8 ${showIdentity ? 'max-w-5xl md:grid-cols-[5fr_7fr]' : 'max-w-xl'}`}>
          {showIdentity && (
            <div className="rounded-2xl border border-border-subtle bg-bg-card p-8">
              {infoItems.length > 0 && (
                <div className="flex flex-col gap-6">
                  {infoItems.map((item) => (
                    <div key={item.label} className="flex items-start gap-3.5">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-500/10 text-primary-500">
                        <item.icon size={16} aria-hidden="true" />
                      </div>
                      <div>
                        <div className="mb-0.5 text-[11px] font-semibold uppercase tracking-wider text-text-muted">{item.label}</div>
                        {item.href ? (
                          <a href={item.href} className="whitespace-pre-line text-sm text-text-secondary transition-colors hover:text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600">{item.value}</a>
                        ) : (
                          <span className="whitespace-pre-line text-sm text-text-secondary">{item.value}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {canShowContact && whatsapp && (
                <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noopener noreferrer" className="mt-7 flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#25D366] px-5 py-3 text-sm font-semibold text-white transition-transform duration-100 ease-out hover:brightness-110 active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#25D366]">
                  <MessageCircle size={18} aria-hidden="true" /> {copy.whatsapp}
                </a>
              )}

              {hasSocial && (
                <div className="mt-7 flex gap-3 border-t border-border-subtle pt-6">
                  {[
                    { key: 'linkedin', label: 'LinkedIn', icon: Globe },
                    { key: 'instagram', label: 'Instagram', icon: Globe },
                    { key: 'youtube', label: 'YouTube', icon: Globe },
                  ].map(({ key, label, icon: Icon }) => {
                    const href = contactInfo.socialLinks[key]
                    return href ? (
                      <a key={key} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg border border-border-subtle text-text-muted transition-colors hover:border-border-default hover:text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600">
                        <Icon size={18} aria-hidden="true" />
                      </a>
                    ) : null
                  })}
                </div>
              )}
            </div>
          )}

          <div className="rounded-2xl border border-border-subtle bg-bg-card p-8">
            {!submitted ? (
              <>
                <h2 className="mb-6 text-xl font-bold">{copy.messageTitle}</h2>
                <form ref={formRef} onSubmit={handleSubmit} noValidate aria-busy={isLoading}>
                  <input aria-hidden="true" autoComplete="off" className="absolute -left-[10000px]" name="website" tabIndex={-1} type="text" />
                  {errors.form && (
                    <div ref={errorSummaryRef} tabIndex={-1} role="alert" className="mb-4 rounded-lg border border-primary-500 bg-primary-500/10 p-3 text-sm text-primary-500">
                      {errors.form}
                    </div>
                  )}

                  <div className="mb-4 grid gap-4 sm:grid-cols-2">
                    <Field
                      error={errors.name}
                      id="contact-name"
                      label={copy.name}
                      onChange={() => clearError('name')}
                      required
                      autoComplete="name"
                      disabled={isLoading}
                    />
                    <Field
                      autoComplete="email"
                      error={errors.email}
                      id="contact-email"
                      label={copy.emailField}
                      onChange={() => clearError('email')}
                      required
                      type="email"
                      disabled={isLoading}
                    />
                  </div>

                  <div className="mb-4 grid gap-4 sm:grid-cols-2">
                    <Field autoComplete="tel" disabled={isLoading} id="contact-phone" label={copy.phoneField} onChange={() => clearError('phone')} type="tel" />
                    <Field autoComplete="organization" disabled={isLoading} id="contact-company" label={copy.company} onChange={() => clearError('company')} />
                  </div>

                  <div className="mb-4">
                    <label htmlFor="contact-solution" className="mb-1.5 block text-xs font-semibold text-text-secondary">{copy.solution}</label>
                    <div className="relative">
                      <select id="contact-solution" name="solution" defaultValue="shared" onChange={(event) => solutionChange(event.target.value)} disabled={isLoading} className="min-h-11 w-full appearance-none rounded-lg border border-border-default bg-bg-card px-4 py-3 pr-10 text-base text-text-primary outline-none transition-[border-color] focus-visible:border-primary-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 disabled:opacity-50 sm:text-sm">
                        {solutionOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-text-muted" size={16} aria-hidden="true" />
                    </div>
                  </div>

                  <div className="mb-6">
                    <label htmlFor="contact-message" className="mb-1.5 block text-xs font-semibold text-text-secondary">{copy.message} <span className="text-primary-500">*</span></label>
                    <textarea id="contact-message" name="message" rows={5} autoComplete="off" placeholder={copy.message} disabled={isLoading} aria-invalid={Boolean(errors.message)} aria-describedby={errors.message ? 'contact-message-error' : undefined} className={`w-full resize-y rounded-lg border bg-bg-card px-4 py-3 text-base text-text-primary outline-none transition-[border-color] focus-visible:border-primary-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 disabled:opacity-50 sm:text-sm ${errors.message ? 'border-primary-500' : 'border-border-default'}`} onChange={() => clearError('message')} />
                    {errors.message && <p id="contact-message-error" className="mt-1 text-xs text-primary-500">{errors.message}</p>}
                  </div>

                  <label className="mb-5 flex items-start gap-3 text-xs leading-relaxed text-text-secondary">
                    <input id="contact-consent" name="privacyConsent" type="checkbox" required disabled={isLoading} aria-invalid={Boolean(errors.privacyConsent)} aria-describedby={errors.privacyConsent ? 'contact-consent-error' : 'contact-consent-help'} className="mt-0.5 h-4 w-4 shrink-0 accent-primary-600" onChange={() => clearError('privacyConsent')} />
                    <span id="contact-consent-help">{copy.consent} <Link href={`/${locale}/privacy`} className="underline transition-colors hover:text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600">{copy.privacyLink}</Link>{errors.privacyConsent && <span id="contact-consent-error" className="mt-1 block text-primary-500">{errors.privacyConsent}</span>}</span>
                  </label>

                  <button type="submit" disabled={isLoading} className="flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-primary-600 px-5 py-3.5 text-sm font-semibold text-white transition-transform duration-100 ease-out hover:bg-primary-700 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600">
                    {!isLoading && <Send size={16} aria-hidden="true" />}
                    <span>{isLoading ? copy.submitting : copy.submit}</span>
                  </button>
                </form>
              </>
            ) : (
              <div ref={successRef} role="status" aria-live="polite" tabIndex={-1} className="py-12 text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-600/15 text-green-500"><Check size={28} aria-hidden="true" /></div>
                <h2 className="mb-2 text-xl font-bold">{copy.sentTitle}</h2>
                <p className="text-sm text-text-secondary">{copy.sentBody}</p>
                <button type="button" onClick={resetForm} className="mt-6 rounded-lg border border-border-default px-4 py-2.5 text-sm font-semibold text-text-secondary transition-colors hover:bg-bg-surface hover:text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600">{copy.retry}</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function Field({
  autoComplete,
  error,
  id,
  label,
  onChange,
  required,
  disabled,
  type = 'text',
}: {
  autoComplete: string
  error?: string
  id: string
  label: string
  onChange: () => void
  required?: boolean
  disabled?: boolean
  type?: string
}) {
  const name = id.replace('contact-', '')
  const errorId = `${id}-error`
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-xs font-semibold text-text-secondary">{label} {required && <span className="text-primary-500">*</span>}</label>
      <input id={id} name={name} autoComplete={autoComplete} type={type} required={required} disabled={disabled} aria-invalid={Boolean(error)} aria-describedby={error ? errorId : undefined} onChange={onChange} className={`min-h-11 w-full rounded-lg border bg-bg-card px-4 py-3 text-base text-text-primary outline-none transition-[border-color] focus-visible:border-primary-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 disabled:opacity-50 sm:text-sm ${error ? 'border-primary-500' : 'border-border-default'}`} />
      {error && <p id={errorId} className="mt-1 text-xs text-primary-500">{error}</p>}
    </div>
  )
}
