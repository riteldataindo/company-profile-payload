'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation.js'

interface Command {
  id: string
  label: string
  category: string
  icon: string
  path?: string
  action?: string
}

const COMMANDS: Command[] = [
  { id: 'dashboard', label: 'Dashboard', category: 'Navigate', icon: 'grid', path: '/admin' },
  { id: 'posts', label: 'Blog Posts', category: 'Navigate', icon: 'file-text', path: '/admin/collections/blog-posts' },
  { id: 'features', label: 'Features', category: 'Navigate', icon: 'zap', path: '/admin/collections/features' },
  { id: 'usecases', label: 'Use Cases', category: 'Navigate', icon: 'bar-chart', path: '/admin/collections/use-cases' },
  { id: 'faq', label: 'FAQs', category: 'Navigate', icon: 'list', path: '/admin/collections/faq-items' },
  { id: 'pricing', label: 'Packages', category: 'Navigate', icon: 'package', path: '/admin/collections/pricing-tiers' },
  { id: 'inbox', label: 'Submissions', category: 'Navigate', icon: 'inbox', path: '/admin/collections/form-submissions' },
  { id: 'locations', label: 'Locations', category: 'Navigate', icon: 'map-pin', path: '/admin/collections/deployment-locations' },
  { id: 'media', label: 'Media', category: 'Navigate', icon: 'image', path: '/admin/collections/media' },
  { id: 'users', label: 'Users', category: 'Navigate', icon: 'users', path: '/admin/collections/users' },
  { id: 'settings', label: 'Site Settings', category: 'Navigate', icon: 'settings', path: '/admin/globals/site-settings' },
  { id: 'new-post', label: 'New Blog Post', category: 'Actions', icon: 'plus', path: '/admin/collections/blog-posts/create' },
  { id: 'visit-site', label: 'Visit Site', category: 'Actions', icon: 'external-link', action: 'visit-site' },
]

const ICON_PATHS: Record<string, string> = {
  grid: 'M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z',
  'file-text': 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M16 13H8M16 17H8M10 9H8',
  zap: 'M13 2 3 14h9l-1 10 10-12h-9l1-10z',
  'bar-chart': 'M12 20V10M18 20V4M6 20v-4',
  list: 'M8 6h13M8 12h13M8 18h13',
  package: 'M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16ZM3.3 7l8.7 5 8.7-5M12 22V12',
  inbox: 'M22 12h-6l-2 3H10l-2-3H2M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z',
  'map-pin': 'M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z',
  image: 'M3 3h18v18H3z',
  users: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M12 7a4 4 0 1 0-8 0 4 4 0 0 0 8 0M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75',
  settings: 'M12 12m-3 0a3 3 0 1 0 6 0 3 3 0 1 0-6 0M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72 1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42',
  plus: 'M12 5v14M5 12h14',
  search: 'M21 21l-4.3-4.3',
  'external-link': 'M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14 21 3',
}

export default function CmdPalette() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [selectedIdx, setSelectedIdx] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setOpen(true)
      }
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  useEffect(() => {
    if (open) {
      setQuery('')
      setSelectedIdx(0)
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [open])

  if (!open) return null

  const filtered = COMMANDS.filter((c) =>
    c.label.toLowerCase().includes(query.toLowerCase())
  )

  const grouped: Record<string, Command[]> = {}
  filtered.forEach((c) => {
    ;(grouped[c.category] = grouped[c.category] || []).push(c)
  })

  const select = (cmd: Command) => {
    if (cmd.path) router.push(cmd.path)
    if (cmd.action === 'visit-site') window.open('/', '_blank')
    setOpen(false)
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIdx((i) => Math.min(i + 1, filtered.length - 1))
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIdx((i) => Math.max(i - 1, 0))
    }
    if (e.key === 'Enter' && filtered[selectedIdx]) {
      select(filtered[selectedIdx])
    }
  }

  return (
    <div
      onClick={(e) => { if (e.target === e.currentTarget) setOpen(false) }}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.5)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingTop: '15vh',
        animation: 'overlay-in 0.15s ease',
      }}
    >
      <div
        style={{
          width: 500,
          maxWidth: 'calc(100vw - 32px)',
          maxHeight: 400,
          background: 'var(--sc-sidebar-bg, #0c0c0e)',
          border: '1px solid var(--sc-border-hover)',
          borderRadius: 14,
          boxShadow: '0 18px 45px rgba(0,0,0,0.5)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          animation: 'scale-in 0.15s ease',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '14px 16px',
            borderBottom: '1px solid var(--sc-border)',
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--sc-text-muted)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
          </svg>
          <input
            ref={inputRef}
            style={{
              flex: 1,
              fontSize: 15,
              fontWeight: 500,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: 'var(--sc-text)',
              fontFamily: 'var(--font-sans)',
            }}
            placeholder="Type a command..."
            value={query}
            onChange={(e) => { setQuery(e.target.value); setSelectedIdx(0) }}
            onKeyDown={onKeyDown}
          />
          <button
            onClick={() => setOpen(false)}
            style={{
              padding: 4,
              color: 'var(--sc-text-muted)',
              border: 'none',
              background: 'none',
              cursor: 'pointer',
            }}
          >
            <span
              style={{
                fontSize: 11,
                fontFamily: 'var(--font-mono)',
                border: '1px solid var(--sc-border)',
                borderRadius: 4,
                padding: '1px 5px',
              }}
            >
              ESC
            </span>
          </button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: 6 }}>
          {Object.entries(grouped).map(([cat, items]) => (
            <div key={cat}>
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: 'var(--sc-text-muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  padding: '8px 10px 4px',
                  fontFamily: 'var(--font-mono)',
                }}
              >
                {cat}
              </div>
              {items.map((cmd) => {
                const gi = filtered.indexOf(cmd)
                return (
                  <div
                    key={cmd.id}
                    onClick={() => select(cmd)}
                    onMouseEnter={() => setSelectedIdx(gi)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      padding: '8px 10px',
                      borderRadius: 8,
                      fontSize: 14,
                      fontWeight: 500,
                      cursor: 'pointer',
                      background: gi === selectedIdx ? 'var(--sc-surface-2)' : 'transparent',
                      color: gi === selectedIdx ? 'var(--sc-text)' : 'var(--sc-text-secondary)',
                      transition: 'background 0.1s',
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d={ICON_PATHS[cmd.icon] || ICON_PATHS.grid} />
                    </svg>
                    {cmd.label}
                  </div>
                )
              })}
            </div>
          ))}
          {filtered.length === 0 && (
            <div style={{ padding: 24, textAlign: 'center', color: 'var(--sc-text-muted)', fontSize: 14 }}>
              No results.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
