'use client'

import React, { memo, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Pause, Play, RotateCcw } from 'lucide-react'
import type { Locale } from '../i18n'
import { text } from '../i18n'
import { simCopy } from './copy'
import { SevenSegment } from './SevenSegment'
import {
  agentFrame,
  clockAt,
  inZone,
  mallCounters,
  occupancyAt,
  preparedScenes,
  retailCounters,
  type PreparedScene,
  type SceneId,
  type SimEvent,
} from './simulation'

const useIsoLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect

type Status = 'idle' | 'playing' | 'paused' | 'done'
type Counters = Record<string, number>

type SceneRefs = {
  agents: Array<SVGGElement | null>
  trails: Array<SVGPathElement | null>
  zones: Record<string, SVGRectElement | null>
  glows: Record<string, SVGLineElement | null>
  pings: SVGGElement | null
}

function countersFor(scene: PreparedScene, t: number): Counters {
  return scene.id === 'retail' ? retailCounters(scene, t) : mallCounters(scene, t)
}

function sameCounters(a: Counters, b: Counters) {
  return Object.keys(b).every((key) => a[key] === b[key])
}

function journeyVisible(scene: PreparedScene, index: number) {
  if (scene.id === 'mall') return true
  return scene.agents[index].points.some((point) => point[1] < 296)
}

function agentState(scene: PreparedScene, index: number, t: number, x: number, y: number) {
  if (scene.zones.some((zone) => inZone(zone, x, y))) return 'zone'
  const entered = scene.prepared[index].enteredAt
  return entered !== null && t >= entered ? 'counted' : 'moving'
}

const pathD = (points: ReadonlyArray<readonly [number, number]>) =>
  points.map((point, index) => `${index === 0 ? 'M' : 'L'}${point[0]} ${point[1]}`).join(' ')

function RetailDecor({ locale, refs }: { locale: Locale; refs: React.MutableRefObject<SceneRefs> }) {
  const labels = simCopy.retail.labels
  return (
    <g className="sim__decor">
      <rect className="sim__lane" x="0" y="312" width="640" height="80" />
      <path className="sim__lane-guide" d="M0 352 H640" />
      <rect className="sim__approach" x="150" y="312" width="340" height="80" rx="3" />
      <text className="sim__label sim__label--flow" x="158" y="327">{text(locale, labels.approach)}</text>
      <text className="sim__label sim__label--muted" x="16" y="385">{text(locale, labels.lane)}</text>

      <rect className="sim__floor" x="32" y="28" width="576" height="268" rx="14" />
      <path className="sim__wall" d="M32 296 H276 M364 296 H608" />
      <path className="sim__jamb" d="M276 287 V305 M364 287 V305" />

      <rect className="sim__fixture" x="42" y="58" width="12" height="206" rx="3" />
      <rect className="sim__fixture" x="118" y="190" width="72" height="36" rx="6" />
      <path className="sim__fixture-line" d="M420 88 H552 M420 118 H552 M420 148 H552" />
      <rect className="sim__fixture" x="250" y="50" width="88" height="36" rx="6" />
      <rect className="sim__fixture" x="588" y="196" width="12" height="84" rx="3" />

      <rect ref={(el) => { refs.current.zones['zone-a'] = el }} className="sim__zone sim__zone--dwell" x="64" y="150" width="168" height="112" rx="10" />
      <text className="sim__label sim__label--dwell" x="70" y="143">{text(locale, labels.zoneA)}</text>
      <rect ref={(el) => { refs.current.zones['zone-b'] = el }} className="sim__zone sim__zone--dwell" x="396" y="56" width="180" height="120" rx="10" />
      <text className="sim__label sim__label--dwell" x="402" y="191">{text(locale, labels.zoneB)}</text>

      <line ref={(el) => { refs.current.glows['approach-west'] = el }} className="sim__glow sim__glow--flow" x1="150" y1="312" x2="150" y2="392" />
      <line ref={(el) => { refs.current.glows['approach-east'] = el }} className="sim__glow sim__glow--flow" x1="490" y1="312" x2="490" y2="392" />
      <line className="sim__line sim__line--flow" x1="150" y1="312" x2="150" y2="392" />
      <line className="sim__line sim__line--flow" x1="490" y1="312" x2="490" y2="392" />

      <line ref={(el) => { refs.current.glows.entry = el }} className="sim__glow sim__glow--signal" x1="278" y1="296" x2="362" y2="296" />
      <line className="sim__line sim__line--signal" x1="278" y1="296" x2="362" y2="296" />
      <text className="sim__label sim__label--signal" x="372" y="287">{text(locale, labels.entry)}</text>
    </g>
  )
}

function MallDecor({ locale, refs }: { locale: Locale; refs: React.MutableRefObject<SceneRefs> }) {
  const labels = simCopy.mall.labels
  const units: Array<[number, number, number, number, string]> = [
    [40, 36, 104, 96, 'A'],
    [152, 36, 102, 96, 'B'],
    [40, 268, 104, 96, 'C'],
    [152, 268, 102, 96, 'D'],
    [496, 36, 106, 96, 'E'],
    [496, 268, 106, 96, 'F'],
  ]
  return (
    <g className="sim__decor">
      <rect className="sim__floor" x="24" y="24" width="592" height="352" rx="16" />
      <rect className="sim__corridor" x="24" y="148" width="592" height="104" />
      <path
        className="sim__wall"
        d="M24 172 V40 Q24 24 40 24 H600 Q616 24 616 40 V360 Q616 376 600 376 H466 M406 376 H40 Q24 376 24 360 V228"
      />
      {units.map(([x, y, w, h, name]) => (
        <g key={name}>
          <rect className="sim__unit" x={x} y={y} width={w} height={h} rx="6" />
          <text className="sim__label sim__label--muted" x={x + 8} y={y + 16}>{`${text(locale, labels.tenant)} ${name}`}</text>
        </g>
      ))}
      <rect className="sim__fixture sim__fixture--stairs" x="300" y="40" width="80" height="52" rx="6" />
      <path className="sim__fixture-line" d="M312 44 V88 M324 44 V88 M336 44 V88 M348 44 V88 M360 44 V88 M372 44 V88" />
      <text className="sim__label sim__label--muted" x="36" y="244">{text(locale, labels.corridor)}</text>
      <text className="sim__label sim__label--muted" x="500" y="262">{text(locale, labels.east)}</text>

      <rect ref={(el) => { refs.current.zones.atrium = el }} className="sim__zone sim__zone--occupancy" x="262" y="118" width="156" height="164" rx="44" />
      <text className="sim__label sim__label--occupancy" x="268" y="111">{text(locale, labels.atrium)}</text>

      <line ref={(el) => { refs.current.glows['internal-east'] = el }} className="sim__glow sim__glow--flow" x1="484" y1="150" x2="484" y2="250" />
      <line className="sim__line sim__line--flow sim__line--dashed" x1="484" y1="150" x2="484" y2="250" />
      <text className="sim__label sim__label--flow" x="490" y="143">{text(locale, labels.internal)}</text>

      <line ref={(el) => { refs.current.glows['gate-west'] = el }} className="sim__glow sim__glow--signal" x1="24" y1="172" x2="24" y2="228" />
      <line className="sim__line sim__line--signal" x1="24" y1="172" x2="24" y2="228" />
      <text className="sim__label sim__label--signal" x="34" y="166">{text(locale, labels.gateWest)}</text>

      <line ref={(el) => { refs.current.glows['gate-south'] = el }} className="sim__glow sim__glow--signal" x1="406" y1="376" x2="466" y2="376" />
      <line className="sim__line sim__line--signal" x1="406" y1="376" x2="466" y2="376" />
      <text className="sim__label sim__label--signal" x="474" y="372">{text(locale, labels.gateSouth)}</text>
    </g>
  )
}

const SceneSvg = memo(function SceneSvg({
  scene,
  locale,
  refs,
}: {
  scene: PreparedScene
  locale: Locale
  refs: React.MutableRefObject<SceneRefs>
}) {
  const copy = scene.id === 'retail' ? simCopy.retail : simCopy.mall
  const titleId = `sim-${scene.id}-title`
  const descId = `sim-${scene.id}-desc`
  return (
    <svg
      className="sim__svg"
      viewBox={`0 0 ${scene.width} ${scene.height}`}
      role="img"
      aria-labelledby={`${titleId} ${descId}`}
    >
      <title id={titleId}>{text(locale, simCopy.title)}</title>
      <desc id={descId}>{text(locale, copy.description)}</desc>
      <defs>
        <pattern id={`sim-grid-${scene.id}`} width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M20 0 H0 V20" className="sim__grid-line" />
        </pattern>
      </defs>
      <rect width={scene.width} height={scene.height} fill={`url(#sim-grid-${scene.id})`} />
      {scene.id === 'retail' ? <RetailDecor locale={locale} refs={refs} /> : <MallDecor locale={locale} refs={refs} />}
      <g className="sim__trails">
        {scene.prepared.map((agent, index) => {
          if (!journeyVisible(scene, index)) return null
          const frame = agentFrame(agent, scene.end)
          return (
            <path
              key={index}
              ref={(el) => { refs.current.trails[index] = el }}
              className="sim__trail"
              d={pathD(scene.agents[index].points)}
              pathLength={1}
              style={{ strokeDashoffset: 1 - frame.progress }}
              data-done={frame.progress >= 1 ? 'true' : 'false'}
            />
          )
        })}
      </g>
      <g className="sim__agents">
        {scene.prepared.map((agent, index) => {
          const frame = agentFrame(agent, scene.end)
          return (
            <g
              key={index}
              ref={(el) => { refs.current.agents[index] = el }}
              className="sim__agent"
              transform={`translate(${frame.x.toFixed(1)} ${frame.y.toFixed(1)})`}
              style={{ opacity: frame.visible ? 1 : 0 }}
              data-state={agentState(scene, index, scene.end, frame.x, frame.y)}
            >
              <circle className="sim__halo" r="8.5" />
              <circle className="sim__dot" r="3.6" />
            </g>
          )
        })}
      </g>
      <g className="sim__pings" ref={(el) => { refs.current.pings = el }} />
    </svg>
  )
})

function Readout({
  label,
  value,
  unit,
  tone,
  live,
}: {
  label: string
  value: number
  unit?: string
  tone: 'traffic' | 'flow' | 'signal' | 'occupancy'
  live: boolean
}) {
  const ref = useRef<HTMLDivElement | null>(null)
  const previous = useRef(value)
  useEffect(() => {
    if (live && value > previous.current && ref.current?.animate) {
      ref.current.animate(
        [{ backgroundColor: 'rgba(255, 255, 255, 0.08)' }, { backgroundColor: 'rgba(255, 255, 255, 0)' }],
        { duration: 520, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' },
      )
    }
    previous.current = value
  }, [live, value])
  return (
    <div ref={ref} className={`sim__readout sim__readout--${tone}`}>
      <span className="sim__readout-label"><i aria-hidden="true" />{label}</span>
      <span className="sim__readout-value" aria-hidden="true">
        <SevenSegment value={value} digits={unit ? 2 : 3} />
        {unit && <b>{unit}</b>}
      </span>
      <span className="lp-sr">{`${value}${unit ?? ''}`}</span>
    </div>
  )
}

export function HeroSimulation({ locale }: { locale: Locale }) {
  const scenes = preparedScenes()
  const [sceneId, setSceneId] = useState<SceneId>('retail')
  const scene = scenes[sceneId]
  const [status, setStatus] = useState<Status>('idle')
  const [counters, setCounters] = useState<Counters>(() => countersFor(scene, scene.end))
  const [ready, setReady] = useState(false)
  const rootRef = useRef<HTMLElement | null>(null)
  const rangeRef = useRef<HTMLInputElement | null>(null)
  const clockRef = useRef<HTMLSpanElement | null>(null)
  const refs = useRef<SceneRefs>({ agents: [], trails: [], zones: {}, glows: {}, pings: null })
  const timeRef = useRef(scene.end)
  const lastEventTime = useRef(scene.end)
  const statusRef = useRef<Status>('idle')
  const startedRef = useRef(false)
  const autoPaused = useRef(false)
  const inView = useRef(false)
  const motionOk = useRef(false)
  const copy = sceneId === 'retail' ? simCopy.retail : simCopy.mall

  useEffect(() => {
    statusRef.current = status
  }, [status])

  const ping = useCallback((event: SimEvent) => {
    const layer = refs.current.pings
    if (!layer) return
    const counted = event.dir === 'in' || event.kind === 'internal'
    if (!counted) return
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
    circle.setAttribute('cx', event.x.toFixed(1))
    circle.setAttribute('cy', event.y.toFixed(1))
    circle.setAttribute('r', '10')
    circle.setAttribute('class', `sim__ping sim__ping--${event.kind}`)
    circle.addEventListener('animationend', () => circle.remove(), { once: true })
    layer.appendChild(circle)
    const glow = refs.current.glows[event.line]
    glow?.animate?.([{ opacity: 0.95 }, { opacity: 0 }], { duration: 560, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' })
  }, [])

  const paint = useCallback((t: number, effects: boolean) => {
    const active = scenes[sceneId]
    active.prepared.forEach((agent, index) => {
      const frame = agentFrame(agent, t)
      const group = refs.current.agents[index]
      if (group) {
        group.setAttribute('transform', `translate(${frame.x.toFixed(1)} ${frame.y.toFixed(1)})`)
        group.style.opacity = frame.visible ? '1' : '0'
        group.dataset.state = agentState(active, index, t, frame.x, frame.y)
      }
      const trail = refs.current.trails[index]
      if (trail) {
        trail.style.strokeDashoffset = String(1 - frame.progress)
        trail.dataset.done = frame.progress >= 1 ? 'true' : 'false'
      }
    })
    const occupancy = occupancyAt(active, t)
    for (const zone of active.zones) {
      refs.current.zones[zone.id]?.style.setProperty('--heat', String(Math.min(occupancy[zone.id] ?? 0, 6)))
    }
    if (effects) {
      for (const event of active.events) {
        if (event.t <= lastEventTime.current) continue
        if (event.t > t) break
        ping(event)
      }
    }
    lastEventTime.current = t
    const next = countersFor(active, t)
    setCounters((previous) => (sameCounters(previous, next) ? previous : next))
    const clock = clockAt(active, t)
    if (clockRef.current) clockRef.current.textContent = clock
    const range = rangeRef.current
    if (range) {
      if (document.activeElement !== range) range.value = String(Math.round(t))
      range.setAttribute('aria-valuetext', clock)
      range.style.setProperty('--p', `${(t / active.end) * 100}%`)
    }
  }, [ping, sceneId, scenes])

  // Scene mount: move to the first frame when motion is welcome, otherwise keep the final frame.
  useIsoLayoutEffect(() => {
    motionOk.current = document.documentElement.classList.contains('sc-motion')
    refs.current.pings?.replaceChildren()
    if (motionOk.current) {
      timeRef.current = 0
      lastEventTime.current = -1
      paint(0, false)
      if (startedRef.current) setStatus('playing')
    } else {
      timeRef.current = scene.end
      lastEventTime.current = scene.end
      paint(scene.end, false)
      setStatus('done')
    }
    setReady(true)
  }, [sceneId])

  useEffect(() => {
    if (status !== 'playing') return
    let frame = 0
    let last = performance.now()
    const step = (now: number) => {
      const next = Math.min(scene.end, timeRef.current + Math.min(48, now - last))
      last = now
      timeRef.current = next
      paint(next, true)
      if (next >= scene.end) {
        setStatus('done')
        return
      }
      frame = requestAnimationFrame(step)
    }
    frame = requestAnimationFrame(step)
    return () => cancelAnimationFrame(frame)
  }, [paint, scene.end, status])

  useEffect(() => {
    const root = rootRef.current
    if (!root || !motionOk.current || typeof IntersectionObserver === 'undefined') return
    const observer = new IntersectionObserver(([entry]) => {
      inView.current = entry.isIntersecting
      if (entry.isIntersecting) {
        if (!startedRef.current) {
          startedRef.current = true
          setStatus('playing')
        } else if (autoPaused.current) {
          autoPaused.current = false
          setStatus('playing')
        }
      } else if (statusRef.current === 'playing') {
        autoPaused.current = true
        setStatus('paused')
      }
    }, { threshold: 0.3 })
    observer.observe(root)
    const onVisibility = () => {
      if (document.hidden && statusRef.current === 'playing') {
        autoPaused.current = true
        setStatus('paused')
      } else if (!document.hidden && autoPaused.current && inView.current) {
        autoPaused.current = false
        setStatus('playing')
      }
    }
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      observer.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [])

  const restart = () => {
    timeRef.current = 0
    lastEventTime.current = -1
    refs.current.pings?.replaceChildren()
    paint(0, false)
    startedRef.current = true
    autoPaused.current = false
    setStatus('playing')
  }

  const onControl = () => {
    if (status === 'playing') {
      autoPaused.current = false
      setStatus('paused')
      return
    }
    if (status === 'done' || timeRef.current >= scene.end) {
      restart()
      return
    }
    startedRef.current = true
    setStatus('playing')
  }

  const selectScene = (next: SceneId) => {
    if (next === sceneId) return
    autoPaused.current = false
    startedRef.current = motionOk.current || startedRef.current
    refs.current = { agents: [], trails: [], zones: {}, glows: {}, pings: null }
    setCounters(countersFor(scenes[next], scenes[next].end))
    setSceneId(next)
  }

  const controlLabel = status === 'playing' ? simCopy.pause : status === 'done' ? simCopy.replay : simCopy.play
  const ControlIcon = status === 'playing' ? Pause : status === 'done' ? RotateCcw : Play
  const live = status === 'playing'

  return (
    <figure ref={rootRef} className="sim" data-ready={ready ? 'true' : 'false'} data-status={status} data-scene={sceneId}>
      <div className="sim__head">
        <p className="sim__title">{text(locale, simCopy.title)}</p>
        <div className="sim__controls">
          <div
            className="sim__scenes"
            role="group"
            aria-label={text(locale, simCopy.sceneGroup)}
            data-active={sceneId}
          >
            <span className="sim__scenes-thumb" aria-hidden="true" />
            <button type="button" aria-pressed={sceneId === 'retail'} onClick={() => selectScene('retail')}>{text(locale, simCopy.retail.name)}</button>
            <button type="button" aria-pressed={sceneId === 'mall'} onClick={() => selectScene('mall')}>{text(locale, simCopy.mall.name)}</button>
          </div>
          <button type="button" className="sim__play" onClick={onControl} aria-label={text(locale, controlLabel)} title={text(locale, controlLabel)}>
            <ControlIcon aria-hidden="true" size={16} strokeWidth={2.2} />
          </button>
        </div>
      </div>

      <div className="sim__plan" key={sceneId}>
        <SceneSvg scene={scene} locale={locale} refs={refs} />
      </div>

      <div className="sim__counter">
        <div className="sim__readouts">
          {sceneId === 'retail' ? (
            <>
              <Readout label={text(locale, simCopy.retail.entries)} value={counters.entries ?? 0} tone="traffic" live={live} />
              <Readout label={text(locale, simCopy.retail.passersBy)} value={counters.passersBy ?? 0} tone="flow" live={live} />
              <Readout label={text(locale, simCopy.retail.rate)} value={counters.rate ?? 0} unit="%" tone="signal" live={live} />
            </>
          ) : (
            <>
              <Readout label={text(locale, simCopy.mall.visits)} value={counters.visits ?? 0} tone="traffic" live={live} />
              <Readout label={text(locale, simCopy.mall.internal)} value={counters.internal ?? 0} tone="flow" live={live} />
              <Readout label={text(locale, simCopy.mall.occupancy)} value={counters.occupancy ?? 0} tone="occupancy" live={live} />
            </>
          )}
        </div>
        <div className="sim__timeline">
          <span className="sim__clock" ref={clockRef}>{clockAt(scene, scene.end)}</span>
          <input
            ref={rangeRef}
            className="sim__range"
            type="range"
            min={0}
            max={scene.end}
            step={50}
            defaultValue={scene.end}
            aria-label={text(locale, simCopy.timeline)}
            aria-valuetext={clockAt(scene, scene.end)}
            onChange={(event) => {
              const value = Number(event.currentTarget.value)
              autoPaused.current = false
              startedRef.current = true
              timeRef.current = value
              lastEventTime.current = value
              paint(value, false)
              setStatus(value >= scene.end ? 'done' : 'paused')
            }}
          />
          <span className="sim__window">{text(locale, simCopy.window)}</span>
        </div>
      </div>
      <p className="sim__formula">{text(locale, copy.formula)}</p>
      <figcaption className="sim__caption">{text(locale, simCopy.caption)}</figcaption>
    </figure>
  )
}
