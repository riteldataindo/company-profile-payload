'use client'

import { useEffect, useState, type FormEvent } from 'react'
import { submitForm } from '@/app/actions/submitForm'
import { formCopy, readContactQuery, type ContactSolution } from '@/lib/profile/form-query'
import type { Locale } from './i18n'

type Solution = ContactSolution

type Feedback = { tone: 'success' | 'error'; message: string } | null

function Honeypot() {
  return (
    <input
      aria-hidden="true"
      autoComplete="off"
      name="website"
      tabIndex={-1}
      type="text"
      style={{ position: 'absolute', left: '-10000px' }}
    />
  )
}

function FeedbackNote({ feedback }: { feedback: Feedback }) {
  if (!feedback) return null
  return (
    <p className={feedback.tone === 'error' ? 'form-message form-message--error' : 'form-message'} role={feedback.tone === 'error' ? 'alert' : 'status'}>
      {feedback.message}
    </p>
  )
}

function SolutionField({
  id,
  locale,
  value,
  onChange,
}: {
  id: string
  locale: Locale
  value: Solution
  onChange: (value: Solution) => void
}) {
  const copy = formCopy(locale)
  const options: { value: Solution; label: string }[] = [
    { value: 'shared', label: copy.shared },
    { value: 'retail', label: copy.retail },
    { value: 'mall', label: copy.mall },
  ]
  return (
    <div className="field">
      <label htmlFor={id}>{copy.context}</label>
      <select id={id} name="solution" value={value} onChange={(event) => onChange(event.target.value as Solution)}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
    </div>
  )
}

export function ContactSubmitForm({
  locale,
  solution: initialSolution = 'shared',
  packageName: initialPackage = '',
}: {
  locale: Locale
  solution?: Solution
  packageName?: string
}) {
  const copy = formCopy(locale)
  const [feedback, setFeedback] = useState<Feedback>(null)
  const [pending, setPending] = useState(false)
  const [solution, setSolution] = useState<Solution>(initialSolution)
  const [packageName, setPackageName] = useState(initialPackage)

  useEffect(() => {
    const fromProps = initialSolution !== 'shared' || initialPackage
    const query = fromProps
      ? { solution: initialSolution, packageName: initialPackage }
      : readContactQuery(window.location.search)
    setSolution(query.solution)
    setPackageName(query.packageName)
  }, [initialSolution, initialPackage])

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const data = new FormData(form)
    const phone = String(data.get('phone') || '')
    const company = String(data.get('company') || '')
    setPending(true)
    setFeedback(null)
    try {
      const result = await submitForm({
        formType: 'contact',
        solution,
        packageName: packageName || undefined,
        name: String(data.get('name') || ''),
        email: String(data.get('email') || ''),
        phone: phone || undefined,
        company: company || undefined,
        message: String(data.get('message') || ''),
        privacyConsent: data.get('privacyConsent') === 'on',
        website: String(data.get('website') || ''),
      })
      if (result.success) {
        setFeedback({ tone: 'success', message: copy.sentContact })
        form.reset()
      } else {
        setFeedback({ tone: 'error', message: result.error || copy.failed })
      }
    } catch {
      setFeedback({ tone: 'error', message: copy.failed })
    } finally {
      setPending(false)
    }
  }

  return (
    <form className="contact-form" onSubmit={onSubmit}>
      <Honeypot />
      <FeedbackNote feedback={feedback} />
      <SolutionField id="contact-submit-solution" locale={locale} value={solution} onChange={setSolution} />
      {packageName ? (
        <div className="field">
          <label htmlFor="contact-submit-package">{copy.packageLabel}</label>
          <input id="contact-submit-package" name="packageName" value={packageName} readOnly />
        </div>
      ) : null}
      <div className="field">
        <label htmlFor="contact-submit-name">{copy.name}</label>
        <input id="contact-submit-name" name="name" type="text" autoComplete="name" required minLength={2} />
      </div>
      <div className="field">
        <label htmlFor="contact-submit-email">{copy.email}</label>
        <input id="contact-submit-email" name="email" type="email" autoComplete="email" required />
      </div>
      <div className="field">
        <label htmlFor="contact-submit-phone">{copy.phone}</label>
        <input id="contact-submit-phone" name="phone" type="tel" autoComplete="tel" />
      </div>
      <div className="field">
        <label htmlFor="contact-submit-company">{copy.company}</label>
        <input id="contact-submit-company" name="company" type="text" autoComplete="organization" required minLength={2} />
      </div>
      <div className="field">
        <label htmlFor="contact-submit-message">{copy.message}</label>
        <textarea id="contact-submit-message" name="message" rows={5} required minLength={10} />
      </div>
      <label className="form-consent" htmlFor="contact-submit-consent">
        <input id="contact-submit-consent" name="privacyConsent" type="checkbox" required />
        {' '}{copy.consentContact}
      </label>
      <button className="button button--primary" type="submit" disabled={pending}>
        {pending ? copy.sending : copy.send}
      </button>
    </form>
  )
}

export function DemoSubmitForm({ locale, solution: initialSolution = 'retail' }: { locale: Locale; solution?: Solution }) {
  const copy = formCopy(locale)
  const [feedback, setFeedback] = useState<Feedback>(null)
  const [pending, setPending] = useState(false)
  const [solution, setSolution] = useState<Solution>(initialSolution)

  useEffect(() => {
    setSolution(initialSolution)
  }, [initialSolution])

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const data = new FormData(form)
    const message = String(data.get('message') || '')
    const storeCount = String(data.get('storeCount') || '')
    setPending(true)
    setFeedback(null)
    try {
      const result = await submitForm({
        formType: 'demo',
        solution,
        name: String(data.get('name') || ''),
        email: String(data.get('email') || ''),
        phone: String(data.get('phone') || '').replace(/\D/g, ''),
        company: String(data.get('company') || ''),
        storeCount: storeCount || undefined,
        message: message || undefined,
        privacyConsent: data.get('privacyConsent') === 'on',
        website: String(data.get('website') || ''),
      })
      if (result.success) {
        setFeedback({ tone: 'success', message: copy.sentDemo })
        form.reset()
      } else {
        setFeedback({ tone: 'error', message: result.error || copy.failed })
      }
    } catch {
      setFeedback({ tone: 'error', message: copy.failed })
    } finally {
      setPending(false)
    }
  }

  return (
    <form className="contact-form" onSubmit={onSubmit}>
      <Honeypot />
      <FeedbackNote feedback={feedback} />
      <SolutionField id="demo-submit-solution" locale={locale} value={solution} onChange={setSolution} />
      <div className="field">
        <label htmlFor="demo-submit-name">{copy.name}</label>
        <input id="demo-submit-name" name="name" type="text" autoComplete="name" required minLength={2} />
      </div>
      <div className="field">
        <label htmlFor="demo-submit-email">{copy.email}</label>
        <input id="demo-submit-email" name="email" type="email" autoComplete="email" required />
      </div>
      <div className="field">
        <label htmlFor="demo-submit-phone">{copy.whatsapp}</label>
        <input id="demo-submit-phone" name="phone" type="tel" autoComplete="tel" required minLength={8} />
      </div>
      <div className="field">
        <label htmlFor="demo-submit-company">{copy.company}</label>
        <input id="demo-submit-company" name="company" type="text" autoComplete="organization" required minLength={2} />
      </div>
      <div className="field">
        <label htmlFor="demo-submit-stores">{copy.locations}</label>
        <input id="demo-submit-stores" name="storeCount" type="text" />
      </div>
      <div className="field">
        <label htmlFor="demo-submit-message">{copy.message}</label>
        <textarea id="demo-submit-message" name="message" rows={4} />
      </div>
      <label className="form-consent" htmlFor="demo-submit-consent">
        <input id="demo-submit-consent" name="privacyConsent" type="checkbox" required />
        {' '}{copy.consentDemo}
      </label>
      <button className="button button--primary" type="submit" disabled={pending}>
        {pending ? copy.sending : copy.request}
      </button>
    </form>
  )
}
