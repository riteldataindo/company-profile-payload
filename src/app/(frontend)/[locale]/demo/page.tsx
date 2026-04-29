'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Zap, Monitor, Settings, MessageCircle, Tag, Check, Send, ExternalLink, Play } from 'lucide-react'
import { ScrollReveal } from '@/components/sections/ScrollReveal'
import { submitForm } from '@/app/actions/submitForm'

const benefits = [
  { icon: Monitor, title: 'Live product walkthrough', desc: 'See every feature in action with your store type.' },
  { icon: Settings, title: 'Setup tailored for your store', desc: "We'll configure the dashboard for your layout and goals." },
  { icon: MessageCircle, title: 'Q&A with our analytics team', desc: 'Ask anything — integration, data, hardware, pricing.' },
  { icon: Tag, title: 'Custom pricing for your scale', desc: 'Get a quote that matches your location count and needs.' },
]

export default function DemoPage() {
  const [submitted, setSubmitted] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const name = form.get('name') as string
    const email = form.get('email') as string
    const phone = form.get('phone') as string
    const company = form.get('company') as string
    const storeCount = form.get('storeCount') as string
    const message = form.get('message') as string

    // Client-side validation
    const errs: Record<string, string> = {}
    if (!name || name.length < 2) errs.name = 'Required'
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = 'Valid email required'
    if (!phone || phone.replace(/\D/g, '').length < 8) errs.phone = 'Valid WhatsApp number required'
    if (!company || company.length < 2) errs.company = 'Required'
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    setErrors({})

    // Submit to server
    setIsLoading(true)
    try {
      const result = await submitForm({
        formType: 'demo',
        name,
        email,
        phone,
        company,
        storeCount: storeCount || undefined,
        message: message || undefined,
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
    <div className="min-h-screen">
      <section className="relative overflow-hidden pt-32 pb-12 px-4 text-center">
        <div className="absolute -top-[10%] left-1/2 -translate-x-1/2 w-[800px] h-[600px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(239,68,68,0.12) 0%, transparent 70%)' }} />
        <div className="relative z-10 mx-auto max-w-3xl">
          <ScrollReveal>
            <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary-400">
              <Zap size={14} /> Free, No Commitment
            </p>
          </ScrollReveal>
          <ScrollReveal delay={50}><h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3">See AI People Counting in Action</h1></ScrollReveal>
          <ScrollReveal delay={100}><p className="text-text-secondary text-lg mb-6">Get a personalized demo of SmartCounter&apos;s CCTV AI analytics — takes only 30 minutes.</p></ScrollReveal>
          <ScrollReveal delay={150}>
            <ul className="flex flex-wrap justify-center gap-6 text-sm text-text-secondary">
              {['No credit card required', 'Setup in minutes', 'Free support included'].map(t => (
                <li key={t} className="flex items-center gap-1.5"><Check size={16} className="text-primary-500" />{t}</li>
              ))}
            </ul>
          </ScrollReveal>
        </div>
      </section>

      <section className="px-4 pb-20">
        <div className="mx-auto max-w-5xl grid md:grid-cols-[5fr_7fr] gap-8">
          <ScrollReveal>
            <div>
              <h2 className="text-xl font-bold mb-5">What you&apos;ll get in the demo</h2>
              <ul className="flex flex-col gap-4 mb-8">
                {benefits.map(b => (
                  <li key={b.title} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary-500/10 flex items-center justify-center shrink-0 text-primary-500"><b.icon size={16} /></div>
                    <div><strong className="block text-sm font-semibold">{b.title}</strong><span className="text-xs text-text-secondary">{b.desc}</span></div>
                  </li>
                ))}
              </ul>
              <div className="rounded-xl border border-white/[0.06] bg-bg-card/60 backdrop-blur-xl p-5">
                <div className="font-mono text-2xl font-bold text-primary-400 mb-1">300+</div>
                <div className="text-xs text-text-muted mb-4">stores already using SmartCounter</div>
                <p className="text-sm italic text-text-secondary mb-2">&quot;SmartCounter transformed how we understand our store traffic. The heatmap data alone paid for the entire subscription in the first month.&quot;</p>
                <p className="text-xs text-text-muted">— Head of Retail Operations, BeautyHaul</p>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={150}>
            <div className="rounded-2xl border border-white/[0.06] bg-bg-card/60 backdrop-blur-xl p-8">
              {!submitted ? (
                <>
                  <h2 className="text-xl font-bold mb-6">Request Your Free Demo</h2>
                  <form onSubmit={handleSubmit} noValidate>
                    {errors.form && <div className="mb-4 p-3 rounded-lg bg-primary-500/10 border border-primary-500 text-sm text-primary-500">{errors.form}</div>}
                    {[
                      { name: 'name', label: 'Full Name', placeholder: 'Your full name', required: true },
                      { name: 'email', label: 'Business Email', placeholder: 'you@company.com', type: 'email', required: true },
                      { name: 'phone', label: 'WhatsApp Number', placeholder: '+62 812 3456 7890', type: 'tel', required: true },
                      { name: 'company', label: 'Company Name', placeholder: 'PT Example Indonesia', required: true },
                    ].map(f => (
                      <div key={f.name} className="mb-4">
                        <label className="block text-xs font-semibold text-text-secondary mb-1.5">{f.label} {f.required && <span className="text-primary-500">*</span>}</label>
                        <input name={f.name} type={f.type || 'text'} placeholder={f.placeholder} disabled={isLoading} className={`w-full px-4 py-3 rounded-lg bg-bg-card border text-sm text-text-primary outline-none transition-all focus:border-primary-600 focus:ring-[3px] focus:ring-primary-600/15 disabled:opacity-50 ${errors[f.name] ? 'border-primary-500' : 'border-border-default'}`} onChange={() => setErrors(e => ({...e, [f.name]: ''}))} />
                        {errors[f.name] && <p className="text-xs text-primary-500 mt-1">{errors[f.name]}</p>}
                      </div>
                    ))}
                    <div className="mb-4">
                      <label className="block text-xs font-semibold text-text-secondary mb-1.5">Number of Stores</label>
                      <select name="storeCount" disabled={isLoading} className="w-full px-4 py-3 rounded-lg bg-bg-card border border-border-default text-sm text-text-primary outline-none appearance-none disabled:opacity-50">
                        <option value="">Select range</option>
                        <option value="1-5">1 – 5 stores</option>
                        <option value="6-20">6 – 20 stores</option>
                        <option value="21-50">21 – 50 stores</option>
                        <option value="50+">50+ stores</option>
                      </select>
                    </div>
                    <div className="mb-6">
                      <label className="block text-xs font-semibold text-text-secondary mb-1.5">Any specific questions?</label>
                      <textarea name="message" rows={3} placeholder="Tell us about your goals..." disabled={isLoading} className="w-full px-4 py-3 rounded-lg bg-bg-card border border-border-default text-sm text-text-primary outline-none resize-y transition-all focus:border-primary-600 focus:ring-[3px] focus:ring-primary-600/15 disabled:opacity-50" />
                    </div>
                    <button type="submit" disabled={isLoading} className="w-full flex items-center justify-center gap-2 rounded-lg bg-primary-600 px-5 py-3.5 text-sm font-semibold text-white transition-all hover:bg-primary-700 hover:shadow-[0_0_20px_rgba(239,68,68,0.15)] disabled:opacity-50 disabled:cursor-not-allowed">
                      <Send size={18} /> {isLoading ? 'Sending...' : 'Request Free Demo'}
                    </button>
                    <div className="flex items-center gap-4 my-5 text-xs text-text-muted"><div className="flex-1 h-px bg-border-subtle" /><span>or try it yourself</span><div className="flex-1 h-px bg-border-subtle" /></div>
                    <a href="https://demo.smartcounter.id" target="_blank" rel="noopener noreferrer" className="w-full flex items-center justify-center gap-2 rounded-lg border border-primary-600 px-5 py-3.5 text-sm font-semibold text-primary-500 transition-all hover:bg-primary-600/10">
                      <ExternalLink size={16} /> Try Live Demo
                    </a>
                  </form>
                </>
              ) : (
                <div className="text-center py-12">
                  <div className="w-14 h-14 rounded-full bg-green-600/15 flex items-center justify-center mx-auto mb-4 text-green-500"><Check size={28} /></div>
                  <h3 className="text-xl font-bold mb-2">Demo Request Sent</h3>
                  <p className="text-text-secondary text-sm">Our team will contact you within 24 hours via WhatsApp or email.</p>
                </div>
              )}
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section className="bg-bg-surface px-4 py-20">
        <div className="mx-auto max-w-4xl">
          <ScrollReveal>
            <div className="grid md:grid-cols-2 gap-8 items-center rounded-2xl border border-white/[0.06] bg-bg-card/60 backdrop-blur-xl p-10">
              <div>
                <h2 className="text-2xl font-bold mb-2">Prefer to Explore on Your Own?</h2>
                <p className="text-sm text-text-secondary mb-6">Jump into our self-service demo dashboard with real sample data. No registration needed.</p>
                <a href="https://demo.smartcounter.id" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-7 py-3 text-base font-semibold text-white transition-all hover:bg-primary-700">
                  <Play size={18} /> Try Live Demo
                </a>
                <p className="text-xs text-text-muted mt-3">Sample data from demo stores.</p>
              </div>
              <div className="aspect-[16/10] rounded-xl bg-bg-card border border-border-subtle flex items-center justify-center text-sm text-text-muted shadow-[0_0_20px_rgba(239,68,68,0.15)]">
                [Dashboard Preview]
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  )
}
