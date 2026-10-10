// Deterministic, seekable movement simulation for the homepage hero.
// Every value is derived from fixed paths, so the server can render the final
// frame and the browser can replay or scrub the same timeline.

export type Point = readonly [number, number]

export type LineKind = 'entry' | 'approach' | 'outer' | 'internal'

export type SimLine = {
  id: string
  kind: LineKind
  a: Point
  b: Point
  inside: Point
}

export type SimZone = {
  id: string
  x: number
  y: number
  w: number
  h: number
}

export type SimAgent = {
  start: number
  speed: number
  points: Point[]
  pauses?: Array<{ index: number; ms: number }>
}

export type SceneId = 'retail' | 'mall'

export type SimScene = {
  id: SceneId
  width: number
  height: number
  end: number
  lines: SimLine[]
  zones: SimZone[]
  agents: SimAgent[]
}

export type SimEvent = {
  t: number
  agent: number
  line: string
  kind: LineKind
  dir: 'in' | 'out'
  x: number
  y: number
}

type Leg = {
  t0: number
  t1: number
  from: Point
  to: Point
  d0: number
  len: number
}

export type PreparedAgent = {
  start: number
  legs: Leg[]
  end: number
  total: number
  last: Point
  exits: boolean
  enteredAt: number | null
}

export type PreparedScene = SimScene & {
  prepared: PreparedAgent[]
  events: SimEvent[]
}

export type AgentFrame = {
  x: number
  y: number
  visible: boolean
  progress: number
  moving: boolean
}

const distance = (a: Point, b: Point) => Math.hypot(b[0] - a[0], b[1] - a[1])

function side(a: Point, b: Point, p: Point) {
  return Math.sign((b[0] - a[0]) * (p[1] - a[1]) - (b[1] - a[1]) * (p[0] - a[0]))
}

// Returns where segment p→q crosses segment a→b as fractions along each.
export function intersect(p: Point, q: Point, a: Point, b: Point) {
  const rx = q[0] - p[0]
  const ry = q[1] - p[1]
  const sx = b[0] - a[0]
  const sy = b[1] - a[1]
  const denom = rx * sy - ry * sx
  if (Math.abs(denom) < 1e-9) return null
  const qx = a[0] - p[0]
  const qy = a[1] - p[1]
  const u = (qx * sy - qy * sx) / denom
  const v = (qx * ry - qy * rx) / denom
  if (u < 0 || u > 1 || v < 0 || v > 1) return null
  return { u, v }
}

function buildLegs(agent: SimAgent) {
  const legs: Leg[] = []
  let t = agent.start
  let d = 0
  for (let index = 0; index < agent.points.length - 1; index += 1) {
    t += agent.pauses?.find((pause) => pause.index === index)?.ms ?? 0
    const from = agent.points[index]
    const to = agent.points[index + 1]
    const len = distance(from, to)
    const duration = (len / agent.speed) * 1000
    legs.push({ t0: t, t1: t + duration, from, to, d0: d, len })
    t += duration
    d += len
  }
  return { legs, end: t, total: d }
}

function outside(scene: SimScene, point: Point) {
  return point[0] < 0 || point[0] > scene.width || point[1] < 0 || point[1] > scene.height
}

export function prepareScene(scene: SimScene): PreparedScene {
  const events: SimEvent[] = []
  const prepared = scene.agents.map((agent, index) => {
    const { legs, end, total } = buildLegs(agent)
    for (const leg of legs) {
      for (const line of scene.lines) {
        const hit = intersect(leg.from, leg.to, line.a, line.b)
        if (!hit) continue
        const inward = side(line.a, line.b, leg.to) === side(line.a, line.b, line.inside)
        events.push({
          t: leg.t0 + hit.u * (leg.t1 - leg.t0),
          agent: index,
          line: line.id,
          kind: line.kind,
          dir: inward ? 'in' : 'out',
          x: leg.from[0] + hit.u * (leg.to[0] - leg.from[0]),
          y: leg.from[1] + hit.u * (leg.to[1] - leg.from[1]),
        })
      }
    }
    const last = agent.points[agent.points.length - 1]
    return { start: agent.start, legs, end, total, last, exits: outside(scene, last), enteredAt: null as number | null }
  })
  events.sort((a, b) => a.t - b.t)
  for (const event of events) {
    const agent = prepared[event.agent]
    const counted = (event.kind === 'entry' || event.kind === 'outer') && event.dir === 'in'
    if (counted && agent.enteredAt === null) agent.enteredAt = event.t
  }
  return { ...scene, prepared, events }
}

export function agentFrame(agent: PreparedAgent, t: number): AgentFrame {
  if (t < agent.start || agent.legs.length === 0) {
    const origin = agent.legs[0]?.from ?? agent.last
    return { x: origin[0], y: origin[1], visible: false, progress: 0, moving: false }
  }
  for (const leg of agent.legs) {
    if (t < leg.t0) {
      return { x: leg.from[0], y: leg.from[1], visible: true, progress: leg.d0 / agent.total, moving: false }
    }
    if (t <= leg.t1) {
      const f = leg.t1 === leg.t0 ? 1 : (t - leg.t0) / (leg.t1 - leg.t0)
      return {
        x: leg.from[0] + f * (leg.to[0] - leg.from[0]),
        y: leg.from[1] + f * (leg.to[1] - leg.from[1]),
        visible: true,
        progress: (leg.d0 + f * leg.len) / agent.total,
        moving: true,
      }
    }
  }
  return { x: agent.last[0], y: agent.last[1], visible: !agent.exits, progress: 1, moving: false }
}

export function inZone(zone: SimZone, x: number, y: number) {
  return x >= zone.x && x <= zone.x + zone.w && y >= zone.y && y <= zone.y + zone.h
}

export function occupancyAt(scene: PreparedScene, t: number) {
  const counts: Record<string, number> = {}
  for (const zone of scene.zones) counts[zone.id] = 0
  for (const agent of scene.prepared) {
    const frame = agentFrame(agent, t)
    if (!frame.visible) continue
    for (const zone of scene.zones) {
      if (inZone(zone, frame.x, frame.y)) counts[zone.id] += 1
    }
  }
  return counts
}

export type RetailCounters = { entries: number; passersBy: number; rate: number }
export type MallCounters = { visits: number; internal: number; occupancy: number }

export function retailCounters(scene: PreparedScene, t: number): RetailCounters {
  let entries = 0
  let passersBy = 0
  for (const event of scene.events) {
    if (event.t > t) break
    if (event.kind === 'entry' && event.dir === 'in') entries += 1
    if (event.kind === 'approach' && event.dir === 'in') passersBy += 1
  }
  return { entries, passersBy, rate: passersBy > 0 ? Math.round((entries / passersBy) * 100) : 0 }
}

export function mallCounters(scene: PreparedScene, t: number): MallCounters {
  let visits = 0
  let internal = 0
  for (const event of scene.events) {
    if (event.t > t) break
    if (event.kind === 'outer' && event.dir === 'in') visits += 1
    if (event.kind === 'internal') internal += 1
  }
  return { visits, internal, occupancy: occupancyAt(scene, t).atrium ?? 0 }
}

// The simulated window is 10:00–10:15, compressed into the scene duration.
export function clockAt(scene: SimScene, t: number) {
  const minutes = Math.min(15, Math.max(0, Math.floor((t / scene.end) * 15)))
  return `10:${String(minutes).padStart(2, '0')}`
}

const lane = (start: number, speed: number, y0: number, y1: number, leftToRight: boolean): SimAgent => ({
  start,
  speed,
  points: leftToRight ? [[-14, y0], [654, y1]] : [[654, y0], [-14, y1]],
})

export const retailScene: SimScene = {
  id: 'retail',
  width: 640,
  height: 400,
  end: 16000,
  lines: [
    { id: 'entry', kind: 'entry', a: [278, 296], b: [362, 296], inside: [320, 240] },
    { id: 'approach-west', kind: 'approach', a: [150, 308], b: [150, 396], inside: [320, 352] },
    { id: 'approach-east', kind: 'approach', a: [490, 308], b: [490, 396], inside: [320, 352] },
  ],
  zones: [
    { id: 'zone-a', x: 64, y: 150, w: 168, h: 112 },
    { id: 'zone-b', x: 396, y: 56, w: 180, h: 120 },
  ],
  agents: [
    lane(0, 104, 340, 344, true),
    lane(900, 96, 372, 366, false),
    lane(2200, 112, 360, 356, true),
    lane(2380, 112, 372, 368, true),
    lane(3400, 92, 332, 338, false),
    lane(4700, 108, 378, 380, true),
    lane(5500, 90, 344, 348, false),
    lane(6200, 100, 350, 352, false),
    lane(7600, 118, 334, 330, true),
    lane(8300, 96, 380, 376, true),
    lane(8900, 94, 364, 370, false),
    lane(9900, 104, 336, 332, false),
    lane(10400, 110, 346, 342, true),
    lane(11800, 102, 378, 374, false),
    lane(12400, 108, 356, 352, true),
    lane(13200, 115, 358, 362, true),
    lane(13900, 100, 344, 348, false),
    lane(14300, 98, 340, 336, false),
    {
      start: 0,
      speed: 80,
      points: [[540, 100], [500, 160], [380, 250], [338, 280], [330, 306], [310, 334], [-14, 344]],
      pauses: [{ index: 0, ms: 1200 }],
    },
    {
      start: 0,
      speed: 76,
      points: [[140, 200], [240, 258], [326, 284], [338, 310], [372, 336], [654, 338]],
      pauses: [{ index: 0, ms: 2600 }],
    },
    {
      start: 300,
      speed: 88,
      points: [[-14, 352], [236, 352], [292, 322], [304, 284], [206, 236], [250, 262], [318, 302], [352, 334], [654, 346]],
      pauses: [{ index: 4, ms: 3200 }],
    },
    {
      start: 1500,
      speed: 84,
      points: [[654, 344], [380, 344], [336, 318], [330, 284], [470, 150], [486, 120], [520, 96]],
      pauses: [{ index: 4, ms: 4200 }],
    },
    {
      start: 3000,
      speed: 92,
      points: [[-14, 366], [262, 360], [300, 326], [312, 286], [150, 208], [118, 176], [96, 168]],
      pauses: [{ index: 4, ms: 2600 }],
    },
    {
      start: 4200,
      speed: 86,
      points: [[654, 368], [396, 362], [346, 330], [340, 288], [300, 200], [266, 120], [430, 110], [380, 190], [338, 262], [330, 302], [300, 334], [-14, 346]],
      pauses: [{ index: 5, ms: 1600 }, { index: 6, ms: 2400 }],
    },
    {
      start: 6000,
      speed: 90,
      points: [[-14, 338], [244, 340], [290, 316], [298, 280], [178, 190], [210, 168]],
      pauses: [{ index: 4, ms: 3000 }],
    },
    {
      start: 7400,
      speed: 95,
      points: [[654, 356], [372, 352], [340, 322], [334, 282], [500, 112], [546, 142]],
      pauses: [{ index: 4, ms: 2400 }],
    },
    {
      start: 9300,
      speed: 88,
      points: [[-14, 372], [270, 366], [306, 330], [314, 288], [118, 238], [96, 212]],
      pauses: [{ index: 4, ms: 2400 }],
    },
    {
      start: 10800,
      speed: 92,
      points: [[654, 334], [362, 338], [330, 312], [326, 280], [448, 72]],
    },
    {
      start: 11800,
      speed: 96,
      points: [[-14, 350], [258, 350], [296, 320], [304, 284], [224, 246]],
    },
  ],
}

export const mallScene: SimScene = {
  id: 'mall',
  width: 640,
  height: 400,
  end: 16000,
  lines: [
    { id: 'gate-west', kind: 'outer', a: [24, 172], b: [24, 228], inside: [90, 200] },
    { id: 'gate-south', kind: 'outer', a: [406, 376], b: [466, 376], inside: [436, 320] },
    { id: 'internal-east', kind: 'internal', a: [484, 150], b: [484, 250], inside: [560, 200] },
  ],
  zones: [{ id: 'atrium', x: 262, y: 118, w: 156, h: 164 }],
  agents: [
    {
      start: 0,
      speed: 90,
      points: [[-14, 196], [70, 198], [200, 206], [318, 184], [430, 200], [540, 190], [572, 160]],
      pauses: [{ index: 3, ms: 2600 }],
    },
    {
      start: 600,
      speed: 84,
      points: [[436, 414], [436, 350], [410, 300], [360, 236], [250, 214], [120, 204], [40, 200], [-14, 200]],
      pauses: [{ index: 3, ms: 3000 }],
    },
    {
      start: 1800,
      speed: 96,
      points: [[-14, 214], [90, 212], [230, 190], [330, 160], [470, 176], [530, 210], [590, 214]],
    },
    {
      start: 2600,
      speed: 80,
      points: [[436, 414], [440, 340], [380, 260], [300, 230], [200, 200], [120, 168]],
      pauses: [{ index: 3, ms: 2200 }],
    },
    {
      start: 3600,
      speed: 92,
      points: [[-14, 184], [100, 186], [250, 200], [340, 212], [346, 240]],
      pauses: [{ index: 3, ms: 2800 }],
    },
    {
      start: 0,
      speed: 88,
      points: [[560, 180], [520, 196], [440, 204], [360, 190], [300, 170]],
      pauses: [{ index: 0, ms: 4000 }, { index: 3, ms: 2000 }],
    },
    {
      start: 5200,
      speed: 94,
      points: [[436, 414], [432, 330], [460, 250], [520, 210], [570, 236]],
    },
    {
      start: 6400,
      speed: 86,
      points: [[-14, 206], [80, 204], [210, 194], [296, 176], [380, 168]],
      pauses: [{ index: 3, ms: 3200 }],
    },
    {
      start: 7400,
      speed: 90,
      points: [[436, 414], [438, 344], [400, 286], [352, 254], [330, 262]],
      pauses: [{ index: 3, ms: 2400 }],
    },
    {
      start: 8600,
      speed: 98,
      points: [[-14, 190], [110, 192], [260, 210], [400, 196], [500, 176], [586, 152]],
    },
    {
      start: 0,
      speed: 84,
      points: [[590, 240], [540, 222], [470, 210], [380, 214], [300, 236]],
      pauses: [{ index: 0, ms: 9600 }, { index: 3, ms: 2000 }],
    },
    {
      start: 10600,
      speed: 92,
      points: [[436, 414], [436, 338], [392, 270], [330, 226], [250, 196], [140, 190]],
      pauses: [{ index: 3, ms: 1800 }],
    },
    {
      start: 11800,
      speed: 96,
      points: [[-14, 200], [96, 202], [224, 210], [310, 236]],
    },
    {
      start: 13000,
      speed: 100,
      points: [[436, 414], [434, 336], [410, 282], [398, 248]],
    },
    {
      start: 14000,
      speed: 104,
      points: [[-14, 192], [120, 194], [220, 198]],
    },
  ],
}

let cache: Record<SceneId, PreparedScene> | null = null

export function preparedScenes(): Record<SceneId, PreparedScene> {
  if (!cache) cache = { retail: prepareScene(retailScene), mall: prepareScene(mallScene) }
  return cache
}
