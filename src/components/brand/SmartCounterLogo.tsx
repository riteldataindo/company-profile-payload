import Image from 'next/image'
import type { CSSProperties } from 'react'

interface SmartCounterLogoProps {
  alt?: string
  className?: string
  priority?: boolean
  sizes?: string
  style?: CSSProperties
}

export function SmartCounterLogo({
  alt = 'SmartCounter',
  className,
  priority = false,
  sizes = '170px',
  style,
}: SmartCounterLogoProps) {
  return (
    <Image
      src="/brand/smartcounter-logo.png"
      alt={alt}
      width={1600}
      height={236}
      className={className}
      priority={priority}
      sizes={sizes}
      style={style}
    />
  )
}
