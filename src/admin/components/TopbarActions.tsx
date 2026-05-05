'use client'

import React, { useState, useEffect, useRef } from 'react'

export default function TopbarActions() {
  const [avatarOpen, setAvatarOpen] = useState(false)
  const avatarRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!avatarOpen) return
    const close = (e: MouseEvent) => {
      if (avatarRef.current && !avatarRef.current.contains(e.target as Node)) {
        setAvatarOpen(false)
      }
    }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [avatarOpen])

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') setAvatarOpen(false) }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [])

  const DropdownItem = ({ icon, label, onClick, danger }: { icon: string; label: string; onClick?: () => void; danger?: boolean }) => (
    <button
      onClick={() => { onClick?.(); setAvatarOpen(false) }}
      onMouseEnter={(e) => { e.currentTarget.style.background = danger ? 'var(--sc-red-soft)' : 'var(--sc-surface-2)' }}
      onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        width: '100%',
        padding: '8px 14px',
        borderRadius: 8,
        fontSize: 13,
        fontWeight: 500,
        color: danger ? 'var(--sc-red)' : 'var(--sc-text-secondary)',
        transition: 'all 150ms ease',
        textAlign: 'left',
        border: 'none',
        background: 'transparent',
        cursor: 'pointer',
        fontFamily: 'var(--font-sans)',
      }}
    >
      <DropdownIcon name={icon} />
      {label}
    </button>
  )

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <button
        onClick={() => window.open('/', '_blank')}
        title="Visit site"
        onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--sc-surface-2)' }}
        onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
        style={{
          width: 34,
          height: 34,
          borderRadius: 8,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--sc-text-muted)',
          transition: 'all 150ms ease',
          border: 'none',
          background: 'transparent',
          cursor: 'pointer',
        }}
      >
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
          <polyline points="15 3 21 3 21 9" />
          <line x1="10" x2="21" y1="14" y2="3" />
        </svg>
      </button>

      <div ref={avatarRef} style={{ position: 'relative' }}>
        <button
          onClick={() => setAvatarOpen((o) => !o)}
          style={{
            width: 32,
            height: 32,
            borderRadius: '50%',
            background: 'var(--sc-red)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontSize: 11,
            fontWeight: 700,
            fontFamily: 'var(--font-mono)',
            boxShadow: avatarOpen ? '0 0 0 3px rgba(220,38,38,0.25)' : '0 0 0 2px rgba(220,38,38,0.25)',
            cursor: 'pointer',
            transition: 'box-shadow 150ms ease',
            border: 'none',
          }}
        >
          SA
        </button>

        {avatarOpen && (
          <div
            style={{
              position: 'absolute',
              top: 40,
              right: 0,
              width: 220,
              background: 'var(--sc-sidebar-bg, #0c0c0e)',
              border: '1px solid var(--sc-border-hover)',
              borderRadius: 14,
              boxShadow: '0 18px 45px rgba(0,0,0,0.5)',
              zIndex: 100,
              padding: 6,
              animation: 'scale-in 0.12s ease',
            }}
          >
            <div
              style={{
                padding: '10px 14px 8px',
                borderBottom: '1px solid var(--sc-border)',
                marginBottom: 4,
              }}
            >
              <div style={{ fontSize: 14, fontWeight: 700 }}>Super Admin</div>
              <div style={{ fontSize: 12, color: 'var(--sc-text-muted)', fontFamily: 'var(--font-mono)' }}>
                super@smartcounter.id
              </div>
            </div>
            <DropdownItem icon="user" label="Profile" onClick={() => window.location.href = '/admin/account'} />
            <div style={{ height: 1, background: 'var(--sc-border)', margin: '4px 0' }} />
            <DropdownItem
              icon="theme"
              label="Toggle Theme"
              onClick={() => {
                const html = document.documentElement
                const current = html.getAttribute('data-theme')
                html.setAttribute('data-theme', current === 'dark' ? 'light' : 'dark')
              }}
            />
            <div style={{ height: 1, background: 'var(--sc-border)', margin: '4px 0' }} />
            <DropdownItem icon="logout" label="Log Out" onClick={() => window.location.href = '/admin/logout'} danger />
          </div>
        )}
      </div>
    </div>
  )
}

function DropdownIcon({ name }: { name: string }) {
  const paths: Record<string, string> = {
    user: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z',
    settings: 'M12 12m-3 0a3 3 0 1 0 6 0 3 3 0 1 0-6 0M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72 1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42',
    theme: 'M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z',
    logout: 'M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9',
  }
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d={paths[name] || ''} />
    </svg>
  )
}
