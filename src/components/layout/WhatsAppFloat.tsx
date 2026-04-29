'use client'

import { useState, useRef, useEffect } from 'react'
import { MessageCircle, X, Send, HelpCircle, CreditCard, Wrench, CalendarCheck, Sparkles } from 'lucide-react'
import type { ComponentType } from 'react'

const suggestionIcons: ComponentType<{ size?: number }>[] = [
  HelpCircle, CreditCard, Wrench, CalendarCheck, Sparkles,
]

const WA_NUMBER = '6288210019165'

interface WhatsAppFloatProps {
  dict: Record<string, any>
}

export function WhatsAppFloat({ dict }: WhatsAppFloatProps) {
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState('')
  const ref = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const wa = dict.waFloat || {}
  const suggestions: string[] = wa.suggestions || []

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  useEffect(() => {
    if (open && inputRef.current) inputRef.current.focus()
  }, [open])

  function sendMessage(text: string) {
    if (!text.trim()) return
    window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text.trim())}`, '_blank')
    setMessage('')
    setOpen(false)
  }

  function handleSuggestion(text: string) {
    setMessage(text)
    inputRef.current?.focus()
  }

  return (
    <div ref={ref} className="fixed right-5 bottom-5 z-50">
      {open && (
        <div className="mb-3 w-80 overflow-hidden rounded-2xl border border-border-subtle bg-bg-card shadow-[0_8px_40px_rgba(0,0,0,0.25)]">
          <div className="relative border-b border-border-subtle px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-500/10">
                <MessageCircle size={20} className="text-primary-500" />
              </div>
              <div>
                <div className="text-sm font-bold text-text-primary">{wa.title || 'SmartCounter'}</div>
                <div className="flex items-center gap-1.5 text-[11px] text-text-muted">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#25D366]" />
                  {wa.status || 'Online'}
                </div>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="absolute top-3 right-3 rounded-lg p-1.5 text-text-muted transition-colors hover:bg-bg-elevated hover:text-text-primary"
            >
              <X size={16} />
            </button>
          </div>

          <div className="p-4">
            <p className="mb-3 text-xs leading-relaxed text-text-secondary">
              {wa.intro || 'How can we help?'}
            </p>

            <div className="mb-4 flex flex-col gap-1.5">
              {suggestions.map((text, i) => {
                const Icon = suggestionIcons[i] || HelpCircle
                return (
                  <button
                    key={i}
                    onClick={() => handleSuggestion(text)}
                    className="flex items-center gap-2.5 rounded-xl border border-border-subtle bg-bg-surface px-3 py-2 text-left text-[12px] leading-snug text-text-secondary transition-all hover:border-primary-500/30 hover:bg-primary-500/5 hover:text-text-primary"
                  >
                    <Icon size={14} className="shrink-0 text-primary-500" />
                    <span>{text}</span>
                  </button>
                )
              })}
            </div>

            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage(message)}
                placeholder={wa.placeholder || 'Write your message...'}
                className="flex-1 rounded-xl border border-border-subtle bg-bg-surface px-3.5 py-2.5 text-sm text-text-primary outline-none transition-all placeholder:text-text-muted focus:border-primary-500/50 focus:ring-2 focus:ring-primary-500/10"
              />
              <button
                onClick={() => sendMessage(message)}
                disabled={!message.trim()}
                className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-xl bg-[#25D366] text-white transition-all hover:brightness-110 disabled:opacity-40 disabled:hover:brightness-100"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen(!open)}
        aria-label="Chat on WhatsApp"
        className="flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_4px_14px_rgba(37,211,102,0.4)] transition-all duration-300 hover:scale-110 hover:shadow-[0_6px_20px_rgba(37,211,102,0.5)]"
      >
        {open ? <X size={26} /> : <MessageCircle size={26} fill="white" />}
      </button>
    </div>
  )
}
