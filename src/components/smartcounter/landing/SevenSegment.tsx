import React from 'react'

// Segment order: a (top), b, c, d (bottom), e, f, g (middle).
const segments = [
  '2.3,1 9.7,1 10.7,2 9.7,3 2.3,3 1.3,2',
  '10.7,2.8 11.7,3.8 11.7,8.2 10.7,9.2 9.7,8.2 9.7,3.8',
  '10.7,10.8 11.7,11.8 11.7,16.2 10.7,17.2 9.7,16.2 9.7,11.8',
  '2.3,17 9.7,17 10.7,18 9.7,19 2.3,19 1.3,18',
  '1.3,10.8 2.3,11.8 2.3,16.2 1.3,17.2 0.3,16.2 0.3,11.8',
  '1.3,2.8 2.3,3.8 2.3,8.2 1.3,9.2 0.3,8.2 0.3,3.8',
  '2.3,9 9.7,9 10.7,10 9.7,11 2.3,11 1.3,10',
]

const glyphs: Record<string, string> = {
  '0': 'abcdef',
  '1': 'bc',
  '2': 'abged',
  '3': 'abgcd',
  '4': 'fgbc',
  '5': 'afgcd',
  '6': 'afgedc',
  '7': 'abc',
  '8': 'abcdefg',
  '9': 'abcdfg',
  '-': 'g',
  ' ': '',
}

function Digit({ char }: { char: string }) {
  const lit = glyphs[char] ?? ''
  return (
    <svg className="seg__digit" viewBox="-1 0 13 20" aria-hidden="true" focusable="false">
      <g transform="skewX(-6) translate(1.4 0)">
        {segments.map((points, index) => (
          <polygon
            key={points}
            points={points}
            data-on={lit.includes('abcdefg'[index]) ? 'true' : 'false'}
          />
        ))}
      </g>
    </svg>
  )
}

// A seven-segment readout like the digits in the SmartCounter mark. Leading
// positions stay as unlit segments so the width never jumps while counting.
export function SevenSegment({
  value,
  digits = 3,
  className = '',
}: {
  value: number
  digits?: number
  className?: string
}) {
  const textValue = String(Math.max(0, Math.round(value)))
  const padded = textValue.length >= digits ? textValue : `${' '.repeat(digits - textValue.length)}${textValue}`
  return (
    <span className={`seg ${className}`.trim()}>
      {padded.split('').map((char, index) => (
        <Digit key={index} char={char} />
      ))}
    </span>
  )
}
