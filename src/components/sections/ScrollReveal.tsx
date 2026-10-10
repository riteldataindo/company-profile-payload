import type { ReactNode } from 'react'

interface ScrollRevealProps {
  children: ReactNode
  className?: string
  delay?: number
}

/**
 * Content-first wrapper: the complete content is rendered without JavaScript.
 * The delay prop remains part of the shared API for existing callers, but no
 * observer is required for reading or interaction.
 */
export function ScrollReveal({ children, className = '', delay }: ScrollRevealProps) {
  return (
    <div className={className} data-reveal-delay={delay || undefined}>
      {children}
    </div>
  )
}
