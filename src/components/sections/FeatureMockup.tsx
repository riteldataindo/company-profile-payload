'use client'

function DashboardFrame({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-border-subtle bg-bg-card shadow-[0_0_40px_rgba(239,68,68,0.2)]">
      <div className="flex items-center justify-between border-b border-border-subtle bg-bg-base/80 px-4 py-2.5">
        <div className="flex items-center gap-2">
          <div className="h-2.5 w-2.5 rounded-full bg-primary-500" />
          <span className="text-xs font-semibold text-text-secondary">{title}</span>
        </div>
        <div className="flex items-center gap-3 text-[10px] text-text-muted">
          <span className="rounded bg-bg-card px-2 py-0.5">Today</span>
          <span>08:00 — 22:00</span>
        </div>
      </div>
      <div className="relative aspect-[3/2] bg-[#1a1a1f] p-4">{children}</div>
    </div>
  )
}

function Stat({ value, label, color = 'text-primary-400' }: { value: string; label: string; color?: string }) {
  return (
    <div className="rounded-md bg-bg-base/80 px-2.5 py-1.5 backdrop-blur-sm">
      <div className={`font-mono text-sm font-bold ${color}`}>{value}</div>
      <div className="text-[9px] text-text-muted">{label}</div>
    </div>
  )
}

function TrafficChartMockup() {
  const hours = ['08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21']
  const values = [20, 45, 72, 85, 95, 60, 55, 78, 92, 88, 70, 50, 35, 15]
  const max = 100
  return (
    <DashboardFrame title="Visitor Traffic — Fashion Store Bandung">
      <svg viewBox="0 0 560 340" className="h-full w-full">
        {values.map((v, i) => {
          const x = 30 + i * 38
          const h = (v / max) * 240
          return (
            <g key={i}>
              <rect x={x} y={280 - h} width={24} height={h} rx={4} fill={v > 80 ? '#DC2626' : v > 50 ? '#EF4444' : '#F87171'} opacity={0.85} />
              <text x={x + 12} y={300} fill="#71717A" fontSize="8" textAnchor="middle" fontFamily="Fira Sans">{hours[i]}</text>
              <text x={x + 12} y={275 - h} fill="#A1A1AA" fontSize="7" textAnchor="middle" fontFamily="Fira Code">{v}</text>
            </g>
          )
        })}
        <line x1="25" y1="280" x2="560" y2="280" stroke="#3F3F46" strokeWidth="1" />
      </svg>
      <div className="absolute bottom-3 left-3 flex gap-2">
        <Stat value="960" label="Total Visitors" />
        <Stat value="12:00" label="Peak Hour" color="text-amber-400" />
      </div>
    </DashboardFrame>
  )
}

function InOutChartMockup() {
  const hours = ['08', '10', '12', '14', '16', '18', '20']
  const enters = [25, 72, 95, 55, 92, 70, 35]
  const exits = [10, 50, 80, 60, 75, 68, 45]
  const max = 100
  return (
    <DashboardFrame title="In-Out Traffic — Grand Indonesia">
      <svg viewBox="0 0 560 340" className="h-full w-full">
        {enters.map((v, i) => {
          const x = 30 + i * 75
          const hIn = (v / max) * 220
          const hOut = (exits[i] / max) * 220
          return (
            <g key={i}>
              <rect x={x} y={260 - hIn} width={20} height={hIn} rx={3} fill="#EF4444" opacity={0.85} />
              <rect x={x + 24} y={260 - hOut} width={20} height={hOut} rx={3} fill="#3B82F6" opacity={0.7} />
              <text x={x + 22} y={280} fill="#71717A" fontSize="9" textAnchor="middle" fontFamily="Fira Sans">{hours[i]}</text>
            </g>
          )
        })}
        <line x1="25" y1="260" x2="560" y2="260" stroke="#3F3F46" strokeWidth="1" />
      </svg>
      <div className="absolute bottom-3 left-3 flex gap-2">
        <Stat value="444" label="Entries" />
        <Stat value="388" label="Exits" color="text-blue-400" />
      </div>
    </DashboardFrame>
  )
}

function DwellTimeMockup() {
  const zones = [
    { name: 'New Arrivals', time: '6.8m', pct: 85, color: '#DC2626' },
    { name: 'Women\'s', time: '5.2m', pct: 65, color: '#EF4444' },
    { name: 'Fitting Room', time: '4.5m', pct: 56, color: '#F59E0B' },
    { name: 'Accessories', time: '3.1m', pct: 39, color: '#F59E0B' },
    { name: 'Men\'s', time: '2.4m', pct: 30, color: '#3B82F6' },
    { name: 'Checkout', time: '1.8m', pct: 22, color: '#3B82F6' },
  ]
  return (
    <DashboardFrame title="Dwell Time — Pondok Indah Mall">
      <svg viewBox="0 0 560 340" className="h-full w-full">
        <text x="280" y="25" fill="#A1A1AA" fontSize="10" textAnchor="middle" fontFamily="Fira Sans">Average Dwell Time by Zone</text>
        {zones.map((z, i) => {
          const y = 50 + i * 46
          const barW = (z.pct / 100) * 300
          return (
            <g key={i}>
              <text x="30" y={y + 14} fill="#A1A1AA" fontSize="10" fontFamily="Fira Sans">{z.name}</text>
              <rect x="160" y={y} width={300} height={22} rx={4} fill="#27272A" />
              <rect x="160" y={y} width={barW} height={22} rx={4} fill={z.color} opacity={0.7} />
              <text x={165 + barW} y={y + 15} fill="#FAFAFA" fontSize="10" fontWeight="600" fontFamily="Fira Code">{z.time}</text>
            </g>
          )
        })}
      </svg>
      <div className="absolute bottom-3 left-3 flex gap-2">
        <Stat value="4.0m" label="Avg Dwell Time" />
        <Stat value="6.8m" label="Longest Zone" color="text-amber-400" />
      </div>
    </DashboardFrame>
  )
}

function PassersByMockup() {
  return (
    <DashboardFrame title="Passers-by — Store Front View">
      <svg viewBox="0 0 560 340" className="h-full w-full">
        <text x="280" y="30" fill="#A1A1AA" fontSize="11" textAnchor="middle" fontFamily="Fira Sans">Capture Funnel</text>
        {/* Funnel shape */}
        <polygon points="100,60 460,60 400,130 160,130" fill="#EF4444" opacity={0.15} stroke="#EF4444" strokeWidth="1" />
        <polygon points="160,135 400,135 370,200 190,200" fill="#F59E0B" opacity={0.15} stroke="#F59E0B" strokeWidth="1" />
        <polygon points="190,205 370,205 340,270 220,270" fill="#22C55E" opacity={0.15} stroke="#22C55E" strokeWidth="1" />
        {/* Labels */}
        <text x="280" y="102" fill="#FAFAFA" fontSize="18" fontWeight="700" textAnchor="middle" fontFamily="Fira Code">2,340</text>
        <text x="280" y="118" fill="#A1A1AA" fontSize="9" textAnchor="middle" fontFamily="Fira Sans">Passers-by</text>
        <text x="280" y="172" fill="#FAFAFA" fontSize="18" fontWeight="700" textAnchor="middle" fontFamily="Fira Code">890</text>
        <text x="280" y="188" fill="#A1A1AA" fontSize="9" textAnchor="middle" fontFamily="Fira Sans">Looked at Store</text>
        <text x="280" y="248" fill="#FAFAFA" fontSize="18" fontWeight="700" textAnchor="middle" fontFamily="Fira Code">412</text>
        <text x="280" y="264" fill="#A1A1AA" fontSize="9" textAnchor="middle" fontFamily="Fira Sans">Entered Store</text>
        {/* Percentages */}
        <text x="470" y="102" fill="#F59E0B" fontSize="12" fontWeight="600" fontFamily="Fira Code">38%</text>
        <text x="470" y="118" fill="#71717A" fontSize="8" fontFamily="Fira Sans">looked</text>
        <text x="470" y="172" fill="#22C55E" fontSize="12" fontWeight="600" fontFamily="Fira Code">17.6%</text>
        <text x="470" y="188" fill="#71717A" fontSize="8" fontFamily="Fira Sans">entered</text>
      </svg>
      <div className="absolute bottom-3 left-3 flex gap-2">
        <Stat value="2,340" label="Passers-by" />
        <Stat value="17.6%" label="Capture Rate" color="text-green-400" />
      </div>
    </DashboardFrame>
  )
}

function EnteringRateMockup() {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  const rates = [32, 35, 29, 38, 42, 55, 48]
  const max = 60
  return (
    <DashboardFrame title="Entering Rate — Weekly Trend">
      <svg viewBox="0 0 560 340" className="h-full w-full">
        <text x="280" y="25" fill="#A1A1AA" fontSize="10" textAnchor="middle" fontFamily="Fira Sans">Entering Rate % (Passers-by → Visitors)</text>
        {/* Grid lines */}
        {[20, 30, 40, 50].map(v => {
          const y = 280 - ((v / max) * 220)
          return (
            <g key={v}>
              <line x1="50" y1={y} x2="530" y2={y} stroke="#27272A" strokeWidth="0.5" strokeDasharray="4" />
              <text x="40" y={y + 4} fill="#52525B" fontSize="8" textAnchor="end" fontFamily="Fira Code">{v}%</text>
            </g>
          )
        })}
        {/* Area fill */}
        <polygon
          points={rates.map((v, i) => `${80 + i * 70},${280 - (v / max) * 220}`).join(' ') + ` 500,280 80,280`}
          fill="#EF4444" opacity={0.1}
        />
        {/* Line */}
        <polyline
          points={rates.map((v, i) => `${80 + i * 70},${280 - (v / max) * 220}`).join(' ')}
          fill="none" stroke="#EF4444" strokeWidth="2.5" strokeLinejoin="round"
        />
        {/* Dots + labels */}
        {rates.map((v, i) => {
          const x = 80 + i * 70
          const y = 280 - (v / max) * 220
          return (
            <g key={i}>
              <circle cx={x} cy={y} r={v === 55 ? 6 : 4} fill={v === 55 ? '#DC2626' : '#EF4444'} stroke="#1a1a1f" strokeWidth="2" />
              <text x={x} y={y - 12} fill="#FAFAFA" fontSize="10" fontWeight="600" textAnchor="middle" fontFamily="Fira Code">{v}%</text>
              <text x={x} y={300} fill="#71717A" fontSize="9" textAnchor="middle" fontFamily="Fira Sans">{days[i]}</text>
            </g>
          )
        })}
        <line x1="50" y1="280" x2="530" y2="280" stroke="#3F3F46" strokeWidth="1" />
      </svg>
      <div className="absolute bottom-3 left-3 flex gap-2">
        <Stat value="38.2%" label="Avg This Week" />
        <Stat value="55%" label="Best (Saturday)" color="text-green-400" />
      </div>
    </DashboardFrame>
  )
}

function GroupRateMockup() {
  return (
    <DashboardFrame title="Group Rate — Visitor Composition">
      <svg viewBox="0 0 560 340" className="h-full w-full">
        {/* Individual section */}
        <rect x="40" y="40" width="230" height="260" rx="8" fill="#3B82F6" opacity={0.08} stroke="#3B82F6" strokeWidth="1" />
        <text x="155" y="70" fill="#A1A1AA" fontSize="11" textAnchor="middle" fontFamily="Fira Sans">Individual</text>
        <text x="155" y="150" fill="#3B82F6" fontSize="48" fontWeight="700" textAnchor="middle" fontFamily="Fira Code">64%</text>
        <text x="155" y="180" fill="#71717A" fontSize="10" textAnchor="middle" fontFamily="Fira Sans">542 visitors</text>
        {/* People icons - singles */}
        {[0,1,2,3,4].map(i => (
          <circle key={i} cx={95 + i * 30} cy={220} r={8} fill="#3B82F6" opacity={0.5} />
        ))}
        {/* Group section */}
        <rect x="290" y="40" width="230" height="260" rx="8" fill="#EF4444" opacity={0.08} stroke="#EF4444" strokeWidth="1" />
        <text x="405" y="70" fill="#A1A1AA" fontSize="11" textAnchor="middle" fontFamily="Fira Sans">Groups (2+)</text>
        <text x="405" y="150" fill="#EF4444" fontSize="48" fontWeight="700" textAnchor="middle" fontFamily="Fira Code">36%</text>
        <text x="405" y="180" fill="#71717A" fontSize="10" textAnchor="middle" fontFamily="Fira Sans">305 visitors</text>
        {/* People icons - groups */}
        {[0,1,2].map(i => (
          <g key={i}>
            <circle cx={355 + i * 45} cy={216} r={8} fill="#EF4444" opacity={0.5} />
            <circle cx={365 + i * 45} cy={224} r={8} fill="#EF4444" opacity={0.35} />
          </g>
        ))}
        {/* Avg group size */}
        <text x="405" y="270" fill="#A1A1AA" fontSize="9" textAnchor="middle" fontFamily="Fira Sans">Avg Group Size: 2.4</text>
      </svg>
      <div className="absolute bottom-3 left-3 flex gap-2">
        <Stat value="847" label="Total Visitors" />
        <Stat value="2.4" label="Avg Group Size" color="text-amber-400" />
      </div>
    </DashboardFrame>
  )
}

function DemographicMockup() {
  return (
    <DashboardFrame title="Demographic — Pondok Indah Mall">
      <svg viewBox="0 0 560 340" className="h-full w-full">
        <circle cx="180" cy="160" r="100" fill="none" stroke="#3F3F46" strokeWidth="30" />
        <circle cx="180" cy="160" r="100" fill="none" stroke="#EF4444" strokeWidth="30" strokeDasharray="377 628" strokeDashoffset="0" transform="rotate(-90 180 160)" />
        <circle cx="180" cy="160" r="100" fill="none" stroke="#3B82F6" strokeWidth="30" strokeDasharray="251 628" strokeDashoffset="-377" transform="rotate(-90 180 160)" />
        <text x="180" y="155" fill="#FAFAFA" fontSize="24" fontWeight="700" textAnchor="middle" fontFamily="Fira Code">847</text>
        <text x="180" y="175" fill="#71717A" fontSize="10" textAnchor="middle" fontFamily="Fira Sans">Total Visitors</text>
        {[
          { label: '18-24', pct: '22%', w: 88 },
          { label: '25-34', pct: '35%', w: 140 },
          { label: '35-44', pct: '25%', w: 100 },
          { label: '45-54', pct: '12%', w: 48 },
          { label: '55+', pct: '6%', w: 24 },
        ].map((age, i) => {
          const y = 60 + i * 50
          return (
            <g key={i}>
              <text x="340" y={y} fill="#A1A1AA" fontSize="10" fontFamily="Fira Sans">{age.label}</text>
              <rect x="390" y={y - 10} width={age.w} height={14} rx={3} fill="#EF4444" opacity={0.6 + i * 0.05} />
              <text x={395 + age.w} y={y} fill="#71717A" fontSize="9" fontFamily="Fira Code">{age.pct}</text>
            </g>
          )
        })}
      </svg>
      <div className="absolute bottom-3 left-3 flex gap-2">
        <Stat value="60%" label="Female" />
        <Stat value="40%" label="Male" color="text-blue-400" />
      </div>
    </DashboardFrame>
  )
}

function OccupancyMockup() {
  return (
    <DashboardFrame title="Occupancy — Store Level 2">
      <svg viewBox="0 0 560 340" className="h-full w-full">
        <rect x="40" y="40" width="480" height="260" fill="none" stroke="#3F3F46" strokeWidth="2" rx="4" />
        {[
          { x: 50, y: 50, w: 220, h: 120, label: 'Zone A — Entrance', count: '42/60', pct: 70, color: '#F59E0B' },
          { x: 280, y: 50, w: 230, h: 120, label: 'Zone B — Display', count: '18/40', pct: 45, color: '#22C55E' },
          { x: 50, y: 180, w: 150, h: 110, label: 'Zone C — Fitting', count: '8/10', pct: 80, color: '#EF4444' },
          { x: 210, y: 180, w: 150, h: 110, label: 'Zone D — Checkout', count: '12/20', pct: 60, color: '#F59E0B' },
          { x: 370, y: 180, w: 140, h: 110, label: 'Zone E — Storage', count: '3/15', pct: 20, color: '#3B82F6' },
        ].map((zone, i) => (
          <g key={i}>
            <rect x={zone.x} y={zone.y} width={zone.w} height={zone.h} fill={zone.color} opacity={0.12} stroke={zone.color} strokeWidth="1" rx="3" />
            <text x={zone.x + 8} y={zone.y + 18} fill="#A1A1AA" fontSize="9" fontFamily="Fira Sans">{zone.label}</text>
            <text x={zone.x + zone.w / 2} y={zone.y + zone.h / 2 + 5} fill="#FAFAFA" fontSize="18" fontWeight="700" textAnchor="middle" fontFamily="Fira Code">{zone.count}</text>
            <rect x={zone.x + 8} y={zone.y + zone.h - 14} width={zone.w - 16} height={6} rx={3} fill="#3F3F46" />
            <rect x={zone.x + 8} y={zone.y + zone.h - 14} width={(zone.w - 16) * zone.pct / 100} height={6} rx={3} fill={zone.color} />
          </g>
        ))}
      </svg>
      <div className="absolute bottom-3 left-3">
        <Stat value="83/145" label="Total Occupancy" />
      </div>
    </DashboardFrame>
  )
}

function ServiceEfficiencyMockup() {
  const hours = ['08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18']
  const visitors = [15, 40, 65, 80, 95, 55, 50, 72, 88, 60, 30]
  const staff = [3, 3, 4, 4, 5, 4, 3, 4, 5, 4, 3]
  const max = 100
  return (
    <DashboardFrame title="Service Efficiency — Staff vs Traffic">
      <svg viewBox="0 0 560 340" className="h-full w-full">
        <text x="280" y="25" fill="#A1A1AA" fontSize="10" textAnchor="middle" fontFamily="Fira Sans">Visitors (bars) vs Staff on Duty (line)</text>
        {visitors.map((v, i) => {
          const x = 35 + i * 48
          const h = (v / max) * 200
          return (
            <g key={i}>
              <rect x={x} y={260 - h} width={30} height={h} rx={3} fill="#EF4444" opacity={0.4} />
              <text x={x + 15} y={280} fill="#71717A" fontSize="8" textAnchor="middle" fontFamily="Fira Sans">{hours[i]}</text>
            </g>
          )
        })}
        {/* Staff line */}
        <polyline
          points={staff.map((s, i) => `${50 + i * 48},${260 - (s / 6) * 200}`).join(' ')}
          fill="none" stroke="#22C55E" strokeWidth="2.5" strokeLinejoin="round"
        />
        {staff.map((s, i) => (
          <g key={i}>
            <circle cx={50 + i * 48} cy={260 - (s / 6) * 200} r="4" fill="#22C55E" stroke="#1a1a1f" strokeWidth="2" />
            <text x={50 + i * 48} y={250 - (s / 6) * 200} fill="#22C55E" fontSize="8" fontWeight="600" textAnchor="middle" fontFamily="Fira Code">{s}</text>
          </g>
        ))}
        <line x1="30" y1="260" x2="560" y2="260" stroke="#3F3F46" strokeWidth="1" />
      </svg>
      <div className="absolute bottom-3 left-3 flex gap-2">
        <Stat value="1:18" label="Staff:Visitor Ratio" />
        <Stat value="94%" label="Efficiency Score" color="text-green-400" />
      </div>
      <div className="absolute bottom-3 right-3 flex gap-3 rounded-md bg-bg-base/80 px-2.5 py-1.5 backdrop-blur-sm">
        <div className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-red-500 opacity-60" /><span className="text-[9px] text-text-muted">Visitors</span></div>
        <div className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-green-500" /><span className="text-[9px] text-text-muted">Staff</span></div>
      </div>
    </DashboardFrame>
  )
}

function HeatmapMockup() {
  return (
    <DashboardFrame title="Heatmap — Fashion Store Layout">
      <svg viewBox="0 0 560 340" className="h-full w-full">
        <rect x="20" y="20" width="520" height="300" fill="none" stroke="#3F3F46" strokeWidth="2" rx="4" />
        <rect x="30" y="30" width="150" height="140" fill="#3F3F46" stroke="#52525B" strokeWidth="0.5" rx="2" />
        <rect x="190" y="30" width="170" height="100" fill="#3F3F46" stroke="#52525B" strokeWidth="0.5" rx="2" />
        <rect x="370" y="30" width="160" height="140" fill="#3F3F46" stroke="#52525B" strokeWidth="0.5" rx="2" />
        <rect x="30" y="180" width="230" height="130" fill="#3F3F46" stroke="#52525B" strokeWidth="0.5" rx="2" />
        <rect x="270" y="180" width="130" height="130" fill="#3F3F46" stroke="#52525B" strokeWidth="0.5" rx="2" />
        <rect x="410" y="180" width="120" height="130" fill="#3F3F46" stroke="#52525B" strokeWidth="0.5" rx="2" />
        <defs>
          <radialGradient id="fh"><stop offset="0%" stopColor="#DC2626" stopOpacity="0.7"/><stop offset="60%" stopColor="#EF4444" stopOpacity="0.3"/><stop offset="100%" stopColor="#EF4444" stopOpacity="0"/></radialGradient>
          <radialGradient id="fw"><stop offset="0%" stopColor="#F59E0B" stopOpacity="0.5"/><stop offset="60%" stopColor="#F59E0B" stopOpacity="0.2"/><stop offset="100%" stopColor="#F59E0B" stopOpacity="0"/></radialGradient>
          <radialGradient id="fc"><stop offset="0%" stopColor="#3B82F6" stopOpacity="0.35"/><stop offset="60%" stopColor="#3B82F6" stopOpacity="0.12"/><stop offset="100%" stopColor="#3B82F6" stopOpacity="0"/></radialGradient>
        </defs>
        <ellipse cx="275" cy="310" rx="110" ry="40" fill="url(#fh)" />
        <ellipse cx="275" cy="80" rx="75" ry="45" fill="url(#fh)" />
        <ellipse cx="105" cy="100" rx="55" ry="50" fill="url(#fw)" />
        <ellipse cx="470" cy="250" rx="50" ry="55" fill="url(#fw)" />
        <ellipse cx="450" cy="80" rx="60" ry="45" fill="url(#fc)" />
        <ellipse cx="100" cy="250" rx="55" ry="45" fill="url(#fc)" />
        <text x="105" y="168" fill="#A1A1AA" fontSize="8" textAnchor="middle">MEN&apos;S</text>
        <text x="275" y="128" fill="#A1A1AA" fontSize="8" textAnchor="middle">NEW ARRIVALS</text>
        <text x="450" y="168" fill="#A1A1AA" fontSize="8" textAnchor="middle">WOMEN&apos;S</text>
        <text x="145" y="285" fill="#A1A1AA" fontSize="8" textAnchor="middle">ACCESSORIES</text>
        <text x="335" y="285" fill="#A1A1AA" fontSize="8" textAnchor="middle">FITTING</text>
        <text x="470" y="285" fill="#A1A1AA" fontSize="8" textAnchor="middle">CHECKOUT</text>
        <text x="275" y="330" fill="#71717A" fontSize="7" textAnchor="middle">ENTRANCE</text>
      </svg>
      <div className="absolute bottom-3 left-3 flex gap-2">
        <Stat value="847" label="Visitors Today" />
        <Stat value="6" label="Active Zones" color="text-amber-400" />
      </div>
      <div className="absolute bottom-3 right-3 flex items-center gap-3 rounded-md bg-bg-base/80 px-2.5 py-1.5 backdrop-blur-sm">
        <div className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-red-500" /><span className="text-[9px] text-text-muted">High</span></div>
        <div className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-amber-500" /><span className="text-[9px] text-text-muted">Medium</span></div>
        <div className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-blue-500" /><span className="text-[9px] text-text-muted">Low</span></div>
      </div>
    </DashboardFrame>
  )
}

function QueuingMockup() {
  const counters = [
    { name: 'Counter 1', queue: 3, wait: '2.1m', status: 'normal' },
    { name: 'Counter 2', queue: 7, wait: '5.8m', status: 'alert' },
    { name: 'Counter 3', queue: 1, wait: '0.5m', status: 'low' },
    { name: 'Counter 4', queue: 5, wait: '3.4m', status: 'normal' },
  ]
  return (
    <DashboardFrame title="Queuing — Checkout Area">
      <svg viewBox="0 0 560 340" className="h-full w-full">
        <text x="280" y="30" fill="#A1A1AA" fontSize="11" textAnchor="middle" fontFamily="Fira Sans">Live Queue Status</text>
        {counters.map((c, i) => {
          const y = 55 + i * 70
          const color = c.status === 'alert' ? '#EF4444' : c.status === 'low' ? '#22C55E' : '#F59E0B'
          const dotColor = c.status === 'alert' ? '#EF4444' : c.status === 'low' ? '#22C55E' : '#F59E0B'
          return (
            <g key={i}>
              <rect x="30" y={y} width="500" height="55" rx="6" fill="#27272A" opacity={0.6} />
              <circle cx="55" cy={y + 28} r="6" fill={dotColor} />
              <text x="75" y={y + 22} fill="#FAFAFA" fontSize="12" fontWeight="600" fontFamily="Fira Sans">{c.name}</text>
              <text x="75" y={y + 40} fill="#71717A" fontSize="9" fontFamily="Fira Sans">Est. wait: {c.wait}</text>
              {/* Queue dots (people in line) */}
              {Array.from({ length: c.queue }).map((_, j) => (
                <circle key={j} cx={280 + j * 22} cy={y + 28} r="8" fill={color} opacity={0.4 + j * 0.05} />
              ))}
              <text x={280 + c.queue * 22 + 15} y={y + 32} fill={color} fontSize="12" fontWeight="700" fontFamily="Fira Code">{c.queue}</text>
              {c.status === 'alert' && (
                <text x="500" y={y + 32} fill="#EF4444" fontSize="9" fontWeight="600" textAnchor="end" fontFamily="Fira Sans">ALERT</text>
              )}
            </g>
          )
        })}
      </svg>
      <div className="absolute bottom-3 left-3 flex gap-2">
        <Stat value="16" label="Total in Queue" />
        <Stat value="2.9m" label="Avg Wait Time" color="text-amber-400" />
      </div>
    </DashboardFrame>
  )
}

function InStoreRoutesMockup() {
  return (
    <DashboardFrame title="In-Store Routes — Top Paths">
      <svg viewBox="0 0 560 340" className="h-full w-full">
        {/* Zones as nodes */}
        {[
          { x: 80, y: 60, label: 'ENTRANCE', count: '847' },
          { x: 280, y: 60, label: 'NEW ARRIVALS', count: '680' },
          { x: 480, y: 60, label: 'WOMEN\'S', count: '420' },
          { x: 140, y: 180, label: 'MEN\'S', count: '310' },
          { x: 340, y: 180, label: 'ACCESSORIES', count: '290' },
          { x: 280, y: 280, label: 'FITTING', count: '195' },
          { x: 480, y: 280, label: 'CHECKOUT', count: '340' },
        ].map((node, i) => (
          <g key={i}>
            <rect x={node.x - 50} y={node.y - 20} width={100} height={48} rx="8" fill="#27272A" stroke="#3F3F46" strokeWidth="1" />
            <text x={node.x} y={node.y} fill="#A1A1AA" fontSize="8" textAnchor="middle" fontFamily="Fira Sans">{node.label}</text>
            <text x={node.x} y={node.y + 16} fill="#FAFAFA" fontSize="13" fontWeight="700" textAnchor="middle" fontFamily="Fira Code">{node.count}</text>
          </g>
        ))}
        {/* Flow arrows - main path */}
        <line x1="130" y1="60" x2="230" y2="60" stroke="#EF4444" strokeWidth="3" opacity="0.6" markerEnd="url(#arrowRed)" />
        <line x1="330" y1="60" x2="430" y2="60" stroke="#EF4444" strokeWidth="2" opacity="0.4" />
        <line x1="130" y1="80" x2="140" y2="160" stroke="#F59E0B" strokeWidth="2" opacity="0.4" />
        <line x1="330" y1="80" x2="340" y2="160" stroke="#F59E0B" strokeWidth="2" opacity="0.4" />
        <line x1="340" y1="200" x2="300" y2="260" stroke="#F59E0B" strokeWidth="1.5" opacity="0.3" />
        <line x1="480" y1="108" x2="480" y2="260" stroke="#EF4444" strokeWidth="2.5" opacity="0.5" />
        <line x1="300" y1="80" x2="460" y2="260" stroke="#22C55E" strokeWidth="1.5" opacity="0.3" strokeDasharray="6" />
        {/* Flow percentages */}
        <text x="180" y="50" fill="#EF4444" fontSize="9" fontWeight="600" textAnchor="middle" fontFamily="Fira Code">80%</text>
        <text x="380" y="50" fill="#EF4444" fontSize="9" fontWeight="600" textAnchor="middle" fontFamily="Fira Code">50%</text>
        <text x="490" y="190" fill="#EF4444" fontSize="9" fontWeight="600" fontFamily="Fira Code">40%</text>
      </svg>
      <div className="absolute bottom-3 left-3 flex gap-2">
        <Stat value="3.2" label="Avg Zones Visited" />
        <Stat value="40%" label="Reach Checkout" color="text-green-400" />
      </div>
    </DashboardFrame>
  )
}

const mockupMap: Record<string, () => React.ReactNode> = {
  'visitor-traffic': () => <TrafficChartMockup />,
  'in-out-traffic': () => <InOutChartMockup />,
  'dwell-time': () => <DwellTimeMockup />,
  'passers-by': () => <PassersByMockup />,
  'entering-rate': () => <EnteringRateMockup />,
  'group-rate': () => <GroupRateMockup />,
  demographic: () => <DemographicMockup />,
  occupancy: () => <OccupancyMockup />,
  'service-efficiency': () => <ServiceEfficiencyMockup />,
  heatmap: () => <HeatmapMockup />,
  queuing: () => <QueuingMockup />,
  'in-store-routes': () => <InStoreRoutesMockup />,
}

export function FeatureMockup({ slug }: { slug: string }) {
  const render = mockupMap[slug]
  if (!render) return null
  return <>{render()}</>
}
