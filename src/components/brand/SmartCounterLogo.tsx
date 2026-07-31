import Image from 'next/image'
import type { CSSProperties } from 'react'

interface SmartCounterLogoProps {
  alt?: string
  className?: string
  height?: number
  priority?: boolean
  sizes?: string
  src?: string
  style?: CSSProperties
  width?: number
}

export function SmartCounterLogo({
  alt = 'SmartCounter',
  className,
  height = 236,
  priority = false,
  sizes = '170px',
  src = '/brand/smartcounter-logo.png',
  style,
  width = 1600,
}: SmartCounterLogoProps) {
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      priority={priority}
      sizes={sizes}
      style={style}
    />
  )
}
