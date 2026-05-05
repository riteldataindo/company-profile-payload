'use client'

import React from 'react'

export default function Avatar() {
  const [initials, setInitials] = React.useState('AD')
  const [name, setName] = React.useState('Admin')

  React.useEffect(() => {
    fetch('/api/users/me')
      .then((r) => r.json())
      .then((data) => {
        const user = data?.user || data
        if (user?.name) {
          setName(user.name)
          const parts = user.name.trim().split(/\s+/)
          setInitials(
            parts.length >= 2
              ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
              : user.name.substring(0, 2).toUpperCase(),
          )
        }
      })
      .catch(() => {})
  }, [])

  return (
    <div
      title={name}
      style={{
        width: 32,
        height: 32,
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #DC2626, #991b1b)',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '12px',
        fontWeight: 700,
        fontFamily: "'JetBrains Mono', monospace",
        letterSpacing: '0.03em',
        cursor: 'pointer',
        boxShadow: '0 0 0 2px rgba(220, 38, 38, 0.2)',
        transition: 'box-shadow 150ms ease, transform 150ms ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 0 0 3px rgba(220, 38, 38, 0.4)'
        e.currentTarget.style.transform = 'scale(1.08)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = '0 0 0 2px rgba(220, 38, 38, 0.2)'
        e.currentTarget.style.transform = 'scale(1)'
      }}
    >
      {initials}
    </div>
  )
}
