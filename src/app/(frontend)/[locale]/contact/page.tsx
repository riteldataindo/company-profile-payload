'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Mail, Phone, MapPin, Clock, MessageCircle, Globe, Send, Check } from 'lucide-react'
import { ScrollReveal } from '@/components/sections/ScrollReveal'
import { submitForm } from '@/app/actions/submitForm'

const contactInfo = [
  { icon: Mail, label: 'Email', value: 'info@riteldata.id', href: 'mailto:info@riteldata.id' },
  { icon: Phone, label: 'WhatsApp', value: '+62 882-1001-9165', href: 'https://wa.me/6288210019165' },
  { icon: MapPin, label: 'Address', value: 'Komplek Griya Inti Sentosa\nJl. Griya Agung No.3 Blok M\nSunter Agung, Jakarta Utara 14350' },
  { icon: Clock, label: 'Office Hours', value: 'Mon – Fri, 09:00 – 18:00 WIB' },
]

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const name = form.get('name') as string
    const email = form.get('email') as string
    const message = form.get('message') as string
    const phone = form.get('phone') as string
    const company = form.get('company') as string

    // Client-side validation
    const errs: Record<string, string> = {}
    if (!name || name.length < 2) errs.name = 'Name is required (min 2 characters)'
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = 'Valid email required'
    if (!message || message.length < 10) errs.message = 'Message is required (min 10 characters)'
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    setErrors({})

    // Submit to server
    setIsLoading(true)
    try {
      const result = await submitForm({
        formType: 'contact',
        name,
        email,
        message,
        phone: phone || undefined,
        company: company || undefined,
      })

      if (result.success) {
        setSubmitted(true)
      } else {
        setErrors({ form: result.error || 'Failed to submit form' })
      }
    } catch (error) {
      setErrors({ form: 'Failed to submit form. Please try again.' })
      console.error('Form submission error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="pt-32 pb-20 px-4">
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-12">
          <ScrollReveal>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3">Get in Touch</h1>
          </ScrollReveal>
          <ScrollReveal delay={100}>
            <p className="text-text-secondary text-lg">We usually respond within 24 hours.</p>
          </ScrollReveal>
        </div>

        <div className="grid md:grid-cols-[5fr_7fr] gap-8 max-w-5xl mx-auto">
          <ScrollReveal>
            <div className="rounded-2xl border border-white/[0.06] bg-bg-card/60 backdrop-blur-xl p-8">
              {contactInfo.map((item) => (
                <div key={item.label} className="flex items-start gap-3.5 mb-6 last:mb-0">
                  <div className="w-9 h-9 rounded-lg bg-primary-500/10 flex items-center justify-center shrink-0 text-primary-500">
                    <item.icon size={16} />
                  </div>
                  <div>
                    <div className="text-[11px] font-semibold uppercase tracking-wider text-text-muted mb-0.5">{item.label}</div>
                    {item.href ? (
                      <a href={item.href} className="text-sm text-text-secondary hover:text-text-primary transition-colors whitespace-pre-line">{item.value}</a>
                    ) : (
                      <span className="text-sm text-text-secondary whitespace-pre-line">{item.value}</span>
                    )}
                  </div>
                </div>
              ))}
              <div className="mt-7">
                <a href="https://wa.me/6288210019165" target="_blank" rel="noopener noreferrer" className="w-full flex items-center justify-center gap-2 rounded-lg bg-[#25D366] px-5 py-3 text-sm font-semibold text-white transition-all hover:brightness-110">
                  <MessageCircle size={18} /> Chat on WhatsApp
                </a>
              </div>
              <div className="flex gap-3 mt-7 pt-6 border-t border-border-subtle">
                {['LinkedIn', 'Instagram', 'YouTube'].map((s) => (
                  <a key={s} href="#" aria-label={s} className="w-10 h-10 rounded-lg bg-bg-card border border-border-subtle flex items-center justify-center text-text-muted hover:text-text-primary hover:border-border-default transition-all">
                    <Globe size={18} />
                  </a>
                ))}
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={150}>
            <div className="rounded-2xl border border-white/[0.06] bg-bg-card/60 backdrop-blur-xl p-8">
              {!submitted ? (
                <>
                  <h2 className="text-xl font-bold mb-6">Send Us a Message</h2>
                  <form onSubmit={handleSubmit} noValidate>
                    {errors.form && <div className="mb-4 p-3 rounded-lg bg-primary-500/10 border border-primary-500 text-sm text-primary-500">{errors.form}</div>}
                    <div className="grid sm:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-xs font-semibold text-text-secondary mb-1.5">Full Name <span className="text-primary-500">*</span></label>
                        <input name="name" placeholder="Your name" disabled={isLoading} className={`w-full px-4 py-3 rounded-lg bg-bg-card border text-sm text-text-primary outline-none transition-all focus:border-primary-600 focus:ring-[3px] focus:ring-primary-600/15 disabled:opacity-50 ${errors.name ? 'border-primary-500' : 'border-border-default'}`} onChange={() => setErrors(e => ({...e, name: ''}))} />
                        {errors.name && <p className="text-xs text-primary-500 mt-1">{errors.name}</p>}
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-text-secondary mb-1.5">Email <span className="text-primary-500">*</span></label>
                        <input name="email" type="email" placeholder="you@company.com" disabled={isLoading} className={`w-full px-4 py-3 rounded-lg bg-bg-card border text-sm text-text-primary outline-none transition-all focus:border-primary-600 focus:ring-[3px] focus:ring-primary-600/15 disabled:opacity-50 ${errors.email ? 'border-primary-500' : 'border-border-default'}`} onChange={() => setErrors(e => ({...e, email: ''}))} />
                        {errors.email && <p className="text-xs text-primary-500 mt-1">{errors.email}</p>}
                      </div>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-xs font-semibold text-text-secondary mb-1.5">Phone</label>
                        <input name="phone" placeholder="+62 ..." disabled={isLoading} className="w-full px-4 py-3 rounded-lg bg-bg-card border border-border-default text-sm text-text-primary outline-none transition-all focus:border-primary-600 focus:ring-[3px] focus:ring-primary-600/15 disabled:opacity-50" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-text-secondary mb-1.5">Company</label>
                        <input name="company" placeholder="PT Example Indonesia" disabled={isLoading} className="w-full px-4 py-3 rounded-lg bg-bg-card border border-border-default text-sm text-text-primary outline-none transition-all focus:border-primary-600 focus:ring-[3px] focus:ring-primary-600/15 disabled:opacity-50" />
                      </div>
                    </div>
                    <div className="mb-6">
                      <label className="block text-xs font-semibold text-text-secondary mb-1.5">Message <span className="text-primary-500">*</span></label>
                      <textarea name="message" rows={5} placeholder="Tell us how we can help..." disabled={isLoading} className={`w-full px-4 py-3 rounded-lg bg-bg-card border text-sm text-text-primary outline-none transition-all resize-y focus:border-primary-600 focus:ring-[3px] focus:ring-primary-600/15 disabled:opacity-50 ${errors.message ? 'border-primary-500' : 'border-border-default'}`} onChange={() => setErrors(e => ({...e, message: ''}))} />
                      {errors.message && <p className="text-xs text-primary-500 mt-1">{errors.message}</p>}
                    </div>
                    <button type="submit" disabled={isLoading} className="w-full flex items-center justify-center gap-2 rounded-lg bg-primary-600 px-5 py-3.5 text-sm font-semibold text-white transition-all hover:bg-primary-700 hover:shadow-[0_0_20px_rgba(239,68,68,0.15)] disabled:opacity-50 disabled:cursor-not-allowed">
                      <Send size={16} /> {isLoading ? 'Sending...' : 'Send Message'}
                    </button>
                  </form>
                </>
              ) : (
                <div className="text-center py-12">
                  <div className="w-14 h-14 rounded-full bg-green-600/15 flex items-center justify-center mx-auto mb-4 text-green-500"><Check size={28} /></div>
                  <h3 className="text-xl font-bold mb-2">Message Sent</h3>
                  <p className="text-text-secondary text-sm">Thank you! We&apos;ll get back to you within 24 hours.</p>
                </div>
              )}
            </div>
          </ScrollReveal>
        </div>
      </div>
    </div>
  )
}
