'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { Check, ChevronDown, Send } from 'lucide-react'
import { submitForm } from '@/app/actions/submitForm'
import { trackEvent } from '@/lib/analytics/events'
import { getConversionCopy, type SolutionContext } from '@/lib/i18n/conversion-copy'
import { DemoWalkthrough } from '@/components/demo/DemoWalkthrough'

export default function DemoPage() {
  const pathname = usePathname()
  const locale = pathname.split('/')[1] === 'id' ? 'id' : 'en'
  const copy = getConversionCopy(locale).demo
  const privacyPath = `/${locale}/privacy`
  const [selectedSolution, setSelectedSolution] = useState<SolutionContext>('shared')
  const [submitted, setSubmitted] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const startedRef = useRef(false)
  const formRef = useRef<HTMLFormElement>(null)
  const errorSummaryRef = useRef<HTMLDivElement>(null)
  const successRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (submitted) successRef.current?.focus()
  }, [submitted])

  useEffect(() => {
    const solution = new URLSearchParams(window.location.search).get('solution')
    if (solution === 'retail' || solution === 'mall' || solution === 'shared') {
      setSelectedSolution(solution)
    }
  }, [])

  function markStarted() {
    if (startedRef.current) return
    startedRef.current = true
    trackEvent('demo_start', { locale, solution: selectedSolution, source: 'demo_page' })
  }

  function solutionChange(value: string) {
    if (value !== 'retail' && value !== 'mall' && value !== 'shared') return
    setSelectedSolution(value)
    trackEvent('solution_select', { locale, solution: value, placement: 'demo_form' })
    markStarted()
    clearError('solution')
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

  function focusFirstError() {
    window.requestAnimationFrame(() => {
      const target = formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')
        || errorSummaryRef.current
      target?.focus()
    })
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    markStarted()
    const form = new FormData(event.currentTarget)
    const solution = String(form.get('solution') || 'shared') as SolutionContext
    const name = String(form.get('name') || '')
    const email = String(form.get('email') || '')
    const phone = String(form.get('phone') || '')
    const company = String(form.get('company') || '')
    const storeCount = String(form.get('storeCount') || '')
    const message = String(form.get('message') || '')
    const privacyConsent = form.get('privacyConsent') === 'on'
    const website = String(form.get('website') || '')

    const nextErrors: Record<string, string> = {}
    if (name.trim().length < 2) nextErrors.name = copy.validation.name
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) nextErrors.email = copy.validation.email
    if (phone.replace(/\D/g, '').length < 8) nextErrors.phone = copy.validation.phone
    if (company.trim().length < 2) nextErrors.company = copy.validation.company
    if (!privacyConsent) nextErrors.privacyConsent = copy.validation.consent
    if (Object.keys(nextErrors).length > 0) {
      setErrors({ ...nextErrors, form: copy.retryError })
      focusFirstError()
      trackEvent('demo_submit_error', { locale, solution, category: 'validation' })
      return
    }

    setErrors({})
    setIsLoading(true)
    try {
      const result = await submitForm({
        formType: 'demo',
        solution,
        name,
        email,
        phone,
        company,
        storeCount: storeCount || undefined,
        message: message || undefined,
        privacyConsent,
        website,
      })
      if (result.success) {
        setSubmitted(true)
        trackEvent('demo_submit_success', { locale, solution })
      } else {
        const field = typeof result.field === 'string' ? result.field : 'form'
        setErrors({ [field]: result.error || copy.genericError, form: copy.retryError })
        focusFirstError()
        trackEvent('demo_submit_error', { locale, solution, category: 'server' })
      }
    } catch {
      setErrors({ form: copy.genericError })
      focusFirstError()
      trackEvent('demo_submit_error', { locale, solution, category: 'network' })
    } finally {
      setIsLoading(false)
    }
  }

  function resetForm() {
    setSubmitted(false)
    setErrors({})
    startedRef.current = false
    window.requestAnimationFrame(() => document.getElementById('demo-name')?.focus())
  }

  return (
    <div className="min-h-screen">
      <section className="px-4 pb-28 pt-28 sm:pb-20 md:pt-32">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div>
            <p className="mb-4 font-mono text-xs font-semibold uppercase tracking-[0.14em] text-text-muted">{copy.eyebrow}</p>
            <h1 className="max-w-xl text-4xl font-bold tracking-tight md:text-5xl">{copy.title}</h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-text-secondary">{copy.intro}</p>

            <DemoWalkthrough locale={locale} />

            <h2 className="mt-10 border-t border-border-default pt-6 text-xl font-bold">{copy.benefitsTitle}</h2>
            <ol className="mt-4 border-b border-border-default">
              {copy.benefits.map((benefit, index) => {
                return (
                  <li key={benefit.title} className="grid grid-cols-[2rem_1fr] gap-3 border-t border-border-subtle py-4 first:border-t-0">
                    <span className="font-mono text-xs font-semibold text-primary-600" aria-hidden="true">0{index + 1}</span>
                    <div><strong className="block text-sm font-semibold">{benefit.title}</strong><span className="mt-1 block text-xs leading-5 text-text-secondary">{benefit.description}</span></div>
                  </li>
                )
              })}
            </ol>
            <div className="mt-8 border-l-2 border-primary-600 pl-5">
              <h2 className="mb-2 text-base font-semibold text-text-primary">{copy.contextTitle}</h2>
              <p className="text-sm leading-relaxed text-text-secondary">{copy.contextBody}</p>
            </div>
          </div>

          <div className="rounded-xl border border-border-default bg-bg-card p-6 md:p-8">
            {!submitted ? (
              <>
                <h2 className="mb-6 text-xl font-bold">{copy.formTitle}</h2>
                <form ref={formRef} onSubmit={handleSubmit} noValidate aria-busy={isLoading}>
                  <input aria-hidden="true" autoComplete="off" className="absolute -left-[10000px]" name="website" tabIndex={-1} type="text" />
                  {errors.form && (
                    <div ref={errorSummaryRef} tabIndex={-1} role="alert" className="mb-4 rounded-lg border border-primary-500 bg-primary-500/10 p-3 text-sm text-primary-500">{errors.form}</div>
                  )}

                  <div className="mb-4 grid gap-4 sm:grid-cols-2">
                    <Field autoComplete="name" disabled={isLoading} error={errors.name} id="demo-name" label={copy.name} onChange={() => { markStarted(); clearError('name') }} required />
                    <Field autoComplete="email" disabled={isLoading} error={errors.email} id="demo-email" label={copy.email} onChange={() => { markStarted(); clearError('email') }} required type="email" />
                  </div>

                  <div className="mb-4 grid gap-4 sm:grid-cols-2">
                    <Field autoComplete="tel" disabled={isLoading} error={errors.phone} id="demo-phone" label={copy.phone} onChange={() => { markStarted(); clearError('phone') }} required type="tel" />
                    <Field autoComplete="organization" disabled={isLoading} error={errors.company} id="demo-company" label={copy.company} onChange={() => { markStarted(); clearError('company') }} required />
                  </div>

                  <div className="mb-4 grid gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="demo-solution" className="mb-1.5 block text-xs font-semibold text-text-secondary">{copy.solution}</label>
                      <div className="relative">
                        <select id="demo-solution" name="solution" value={selectedSolution} onChange={(event) => solutionChange(event.target.value)} disabled={isLoading} className="min-h-11 w-full appearance-none rounded-lg border border-border-default bg-bg-card px-4 py-3 pr-10 text-base text-text-primary outline-none transition-[border-color] focus-visible:border-primary-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 disabled:opacity-50 sm:text-sm">
                          {copy.solutionOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-text-muted" size={16} aria-hidden="true" />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="demo-store-count" className="mb-1.5 block text-xs font-semibold text-text-secondary">{copy.storeCount}</label>
                      <div className="relative">
                        <select id="demo-store-count" name="storeCount" defaultValue="" onChange={markStarted} disabled={isLoading} className="min-h-11 w-full appearance-none rounded-lg border border-border-default bg-bg-card px-4 py-3 pr-10 text-base text-text-primary outline-none transition-[border-color] focus-visible:border-primary-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 disabled:opacity-50 sm:text-sm">
                          <option value="">{copy.storeCountPlaceholder}</option>
                          {copy.storeOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-text-muted" size={16} aria-hidden="true" />
                      </div>
                    </div>
                  </div>

                  <div className="mb-6">
                    <label htmlFor="demo-message" className="mb-1.5 block text-xs font-semibold text-text-secondary">{copy.message}</label>
                    <textarea id="demo-message" name="message" rows={3} autoComplete="off" placeholder={copy.message} disabled={isLoading} onChange={markStarted} className="w-full resize-y rounded-lg border border-border-default bg-bg-card px-4 py-3 text-base text-text-primary outline-none transition-[border-color] focus-visible:border-primary-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 disabled:opacity-50 sm:text-sm" />
                  </div>

                  <label className="mb-5 flex items-start gap-3 text-xs leading-relaxed text-text-secondary">
                    <input id="demo-consent" name="privacyConsent" type="checkbox" required disabled={isLoading} aria-invalid={Boolean(errors.privacyConsent)} aria-describedby={errors.privacyConsent ? 'demo-consent-error' : 'demo-consent-help'} className="mt-0.5 h-4 w-4 shrink-0 accent-primary-600" onChange={() => { markStarted(); clearError('privacyConsent') }} />
                    <span id="demo-consent-help">{copy.consent} <Link href={privacyPath} className="underline transition-colors hover:text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600">{copy.privacyLink}</Link>{errors.privacyConsent && <span id="demo-consent-error" className="mt-1 block text-primary-500">{errors.privacyConsent}</span>}</span>
                  </label>

                  <button type="submit" disabled={isLoading} className="flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-primary-600 px-5 py-3.5 text-sm font-semibold text-white transition-transform duration-100 ease-out hover:bg-primary-700 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600">
                    {!isLoading && <Send size={18} aria-hidden="true" />}
                    <span>{isLoading ? copy.submitting : copy.submit}</span>
                  </button>
                </form>
              </>
            ) : (
              <div ref={successRef} role="status" aria-live="polite" tabIndex={-1} className="py-12 text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-600/15 text-green-500"><Check size={24} aria-hidden="true" /></div>
                <h2 className="mb-2 text-xl font-bold">{copy.sentTitle}</h2>
                <p className="text-sm text-text-secondary">{copy.sentBody}</p>
                <button type="button" onClick={resetForm} className="mt-6 rounded-lg border border-border-default px-4 py-2.5 text-sm font-semibold text-text-secondary transition-colors hover:bg-bg-surface hover:text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600">{copy.retry}</button>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}

function Field({
  autoComplete,
  disabled,
  error,
  id,
  label,
  onChange,
  required,
  type = 'text',
}: {
  autoComplete: string
  disabled?: boolean
  error?: string
  id: string
  label: string
  onChange: () => void
  required?: boolean
  type?: string
}) {
  const name = id.replace('demo-', '')
  const errorId = `${id}-error`
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-xs font-semibold text-text-secondary">{label} {required && <span className="text-primary-500">*</span>}</label>
      <input id={id} name={name} autoComplete={autoComplete} type={type} required={required} disabled={disabled} aria-invalid={Boolean(error)} aria-describedby={error ? errorId : undefined} onChange={onChange} className={`min-h-11 w-full rounded-lg border bg-bg-card px-4 py-3 text-base text-text-primary outline-none transition-[border-color] focus-visible:border-primary-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 disabled:opacity-50 sm:text-sm ${error ? 'border-primary-500' : 'border-border-default'}`} />
      {error && <p id={errorId} className="mt-1 text-xs text-primary-500">{error}</p>}
    </div>
  )
}
