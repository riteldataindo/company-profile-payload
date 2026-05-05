'use client'

import React from 'react'
import CmdPalette from './CmdPalette'

export function CmdPaletteProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <CmdPalette />
    </>
  )
}

export default CmdPaletteProvider
