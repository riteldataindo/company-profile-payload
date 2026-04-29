'use client'

import React, { useEffect, useState } from 'react'

export default function FormSubmissionsBadge() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    async function fetchCount() {
      try {
        const res = await fetch('/api/form-submissions?where[status][equals]=new&limit=0')
        const data = await res.json()
        setCount(data.totalDocs || 0)
      } catch {
        // ignore
      }
    }
    fetchCount()
    const interval = setInterval(fetchCount, 60000)
    return () => clearInterval(interval)
  }, [])

  if (count === 0) return null

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: '18px',
        height: '18px',
        borderRadius: '9px',
        backgroundColor: '#DC2626',
        color: '#fff',
        fontSize: '10px',
        fontWeight: 700,
        padding: '0 5px',
        marginLeft: '6px',
        fontFamily: "'Fira Code', monospace",
      }}
    >
      {count}
    </span>
  )
}
