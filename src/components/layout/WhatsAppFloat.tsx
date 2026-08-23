'use client'

import { useEffect, useRef, useState, type MouseEvent as ReactMouseEvent } from 'react'
import { usePathname } from 'next/navigation'
import { MessageCircle, Send, X } from 'lucide-react'

interface WhatsAppFloatProps {
  dict: Record<string, any>
  siteSettings?: any
}

function validWhatsApp(value: unknown): string | null {
  const number = typeof value === 'string' ? value.replace(/\D/g, '') : ''
  return number.length >= 8 ? number : null
}

export function WhatsAppFloat({ dict, siteSettings }: WhatsAppFloatProps) {
  const pathname = usePathname()
  const waNumber = validWhatsApp(siteSettings?.whatsappNumber)
  const [open, setOpen] = useState(false)
  const [animate, setAnimate] = useState(false)
  const [message, setMessage] = useState('')
  const ref = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const wa = dict.waFloat || {}
  const hideOnConvertPath = pathname.includes('/demo') || pathname.includes('/contact')

  useEffect(() => {
    function handleClick(event: globalThis.MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setAnimate(false)
        setOpen(false)
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape' && open) {
        event.preventDefault()
        closePanel()
      }
    }
    document.addEventListener('mousedown', handleClick)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handleClick)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open])

  useEffect(() => {
    if (open) inputRef.current?.focus()
  }, [open])

  if (hideOnConvertPath || siteSettings?.identityVerified !== true || !waNumber) return null

  function closePanel() {
    setAnimate(false)
    setOpen(false)
    window.requestAnimationFrame(() => triggerRef.current?.focus())
  }

  function togglePanel(event: ReactMouseEvent<HTMLButtonElement>) {
    setAnimate(event.detail > 0)
    setOpen((value) => !value)
  }

  function sendMessage() {
    const text = message.trim()
    if (!text) return
    window.open(`https://wa.me/${waNumber}?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer')
    setMessage('')
    closePanel()
  }

  return (
    <div ref={ref} className="fixed right-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-50 sm:right-5 sm:bottom-5">
      {open && (
        <section id="whatsapp-panel" aria-labelledby="whatsapp-panel-title" className="nav-popover whatsapp-popover mb-3 w-[min(20rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-border-subtle bg-bg-card shadow-[0_8px_40px_rgba(0,0,0,0.25)]" data-animate={animate ? 'true' : 'false'}>
          <div className="relative border-b border-border-subtle py-4 pl-5 pr-16">
            <div className="flex items-center gap-3">
              <MessageCircle size={20} className="shrink-0 text-text-primary" aria-hidden="true" />
              <div>
                <div id="whatsapp-panel-title" className="text-sm font-bold text-text-primary">{wa.title || 'SmartCounter'}</div>
                <div className="text-[11px] text-text-muted">{wa.channel}</div>
              </div>
            </div>
            <button
              onClick={closePanel}
              className="nav-state-button absolute top-3 right-3 inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg text-text-muted transition-colors hover:bg-bg-elevated hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
              aria-label={wa.close}
              type="button"
            >
              <X size={16} aria-hidden="true" />
            </button>
          </div>

          <div className="p-4">
            <p className="mb-3 text-xs leading-relaxed text-text-secondary">
              {wa.intro}
            </p>
            <form className="flex gap-2" onSubmit={(event) => { event.preventDefault(); sendMessage() }}>
              <label className="sr-only" htmlFor="whatsapp-message">{wa.messageLabel}</label>
              <input
                ref={inputRef}
                id="whatsapp-message"
                type="text"
                name="message"
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                placeholder={wa.placeholder || 'Write your message…'}
                className="min-h-11 min-w-0 flex-1 rounded-xl border border-border-subtle bg-bg-surface px-3.5 py-2.5 text-base text-text-primary outline-none transition-[border-color,box-shadow] placeholder:text-text-muted focus:border-primary-500/50 focus:ring-2 focus:ring-primary-500/10 sm:text-sm"
              />
              <button
                disabled={!message.trim()}
                className="nav-state-button flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded-xl bg-[#25D366] text-white transition-[filter,opacity,transform] hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2"
                aria-label={wa.sendLabel || 'Send WhatsApp message'}
                type="submit"
              >
                <Send size={16} aria-hidden="true" />
              </button>
            </form>
          </div>
        </section>
      )}

      <button
        ref={triggerRef}
        onClick={togglePanel}
        aria-controls="whatsapp-panel"
        aria-expanded={open}
        aria-label={open ? wa.close : wa.open}
        className="nav-state-button whatsapp-trigger flex min-h-14 min-w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_2px_8px_rgba(0,0,0,0.18)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2"
        type="button"
      >
        <span className="state-icon state-icon--large" data-animate={animate ? 'true' : 'false'} aria-hidden="true">
          <MessageCircle className="state-icon__glyph" data-active={!open ? 'true' : 'false'} fill="white" size={26} />
          <X className="state-icon__glyph" data-active={open ? 'true' : 'false'} size={26} />
        </span>
      </button>
    </div>
  )
}
