'use client'

import React, { createContext, useCallback, useContext, useState } from 'react'

type ToastType = 'success' | 'error' | 'info'

interface Toast {
  id: number
  msg: string
  type: ToastType
}

interface ToastContextValue {
  toast: (msg: string, type?: ToastType) => void
}

const ToastContext = createContext<ToastContextValue>({ toast: () => {} })

export function useToast() {
  return useContext(ToastContext)
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const toast = useCallback((msg: string, type: ToastType = 'success') => {
    const id = Date.now()
    setToasts((t) => [...t, { id, msg, type }])
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3500)
  }, [])

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <ToastStack toasts={toasts} />
    </ToastContext.Provider>
  )
}

const typeConfig: Record<ToastType, { icon: string; bg: string; label: string }> = {
  success: { icon: 'M20 6 9 17l-5-5', bg: 'var(--sc-green)', label: 'Success' },
  error: { icon: 'M18 6 6 18M6 6l12 12', bg: 'var(--sc-red)', label: 'Error' },
  info: { icon: 'M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10.3 21a1.94 1.94 0 0 0 3.4 0', bg: 'var(--sc-blue)', label: 'Info' },
}

function ToastStack({ toasts }: { toasts: Toast[] }) {
  if (!toasts.length) return null

  return (
    <div
      style={{
        position: 'fixed',
        top: 68,
        right: 24,
        zIndex: 200,
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        pointerEvents: 'none',
      }}
    >
      {toasts.map((t) => {
        const cfg = typeConfig[t.type]
        return (
          <div
            key={t.id}
            style={{
              background: 'var(--sc-surface)',
              border: '1px solid var(--sc-border)',
              borderRadius: 14,
              padding: '14px 16px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
              animation: 'scale-in 0.25s ease',
              display: 'flex',
              alignItems: 'flex-start',
              gap: 12,
              width: 340,
              maxWidth: '100%',
              pointerEvents: 'auto',
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 10,
                background: cfg.bg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d={cfg.icon} />
              </svg>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 2 }}>{cfg.label}</div>
              <div style={{ fontSize: 13, color: 'var(--sc-text-secondary)', lineHeight: 1.4 }}>{t.msg}</div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
