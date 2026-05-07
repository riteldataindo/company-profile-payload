import sharp from 'sharp'
import { writeFileSync, mkdirSync } from 'fs'
import path from 'path'

const OUTPUT_DIR = path.join(process.cwd(), 'public', 'og', 'generated')
const MEDIA_DIR = path.join(process.cwd(), 'public', 'media')
mkdirSync(OUTPUT_DIR, { recursive: true })

interface OgConfig {
  filename: string
  title: string
  subtitle: string
  accent: string
  illustration?: string
}

function escapeXml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

function wrapLines(text: string, maxLen: number): string[] {
  const words = text.split(' ')
  const lines: string[] = []
  let cur = ''
  for (const w of words) {
    const test = cur ? `${cur} ${w}` : w
    if (test.length > maxLen) {
      if (cur) lines.push(cur)
      cur = w
    } else {
      cur = test
    }
  }
  if (cur) lines.push(cur)
  return lines
}

// --- Illustration SVG builders (right side, 700-1140 x range) ---

function illustrationPeopleCounting(): string {
  // Doorway with people silhouettes and counting arrows
  return `
    <g opacity="0.9">
      <!-- Door frame -->
      <rect x="780" y="140" width="280" height="360" rx="8" fill="none" stroke="#3f3f46" stroke-width="2"/>
      <rect x="780" y="140" width="280" height="30" rx="8" fill="#27272a"/>
      <text x="920" y="161" fill="#71717a" font-size="11" font-family="Arial" text-anchor="middle">ENTRANCE A</text>
      <!-- People silhouettes entering -->
      <circle cx="860" cy="260" r="14" fill="#DC2626" opacity="0.8"/>
      <rect x="850" y="278" width="20" height="34" rx="6" fill="#DC2626" opacity="0.6"/>
      <circle cx="920" cy="290" r="14" fill="#EF4444" opacity="0.7"/>
      <rect x="910" y="308" width="20" height="34" rx="6" fill="#EF4444" opacity="0.5"/>
      <circle cx="980" cy="250" r="14" fill="#F87171" opacity="0.6"/>
      <rect x="970" y="268" width="20" height="34" rx="6" fill="#F87171" opacity="0.4"/>
      <!-- Arrow IN -->
      <line x1="850" y1="420" x2="850" y2="460" stroke="#22c55e" stroke-width="2"/>
      <polygon points="843,455 850,470 857,455" fill="#22c55e"/>
      <text x="850" y="488" fill="#22c55e" font-size="13" font-family="Arial" font-weight="700" text-anchor="middle">IN: 847</text>
      <!-- Arrow OUT -->
      <line x1="990" y1="460" x2="990" y2="420" stroke="#f59e0b" stroke-width="2"/>
      <polygon points="983,425 990,410 997,425" fill="#f59e0b"/>
      <text x="990" y="488" fill="#f59e0b" font-size="13" font-family="Arial" font-weight="700" text-anchor="middle">OUT: 623</text>
      <!-- Counter badge -->
      <rect x="870" y="360" width="100" height="36" rx="18" fill="#DC2626" opacity="0.9"/>
      <text x="920" y="384" fill="white" font-size="16" font-family="Arial" font-weight="700" text-anchor="middle">99.9%</text>
    </g>`
}

function illustrationCctvAi(): string {
  // CCTV camera → AI processing → data output pipeline
  return `
    <g opacity="0.9">
      <!-- Camera body -->
      <rect x="760" y="160" width="70" height="45" rx="6" fill="#3f3f46"/>
      <rect x="830" y="170" width="30" height="25" rx="3" fill="#52525b"/>
      <circle cx="795" cy="182" r="12" fill="#27272a" stroke="#DC2626" stroke-width="2"/>
      <circle cx="795" cy="182" r="5" fill="#DC2626" opacity="0.8"/>
      <text x="795" y="228" fill="#71717a" font-size="11" font-family="Arial" text-anchor="middle">CCTV</text>
      <!-- Arrow 1 -->
      <line x1="795" y1="240" x2="795" y2="270" stroke="#DC2626" stroke-width="2" stroke-dasharray="4,3"/>
      <polygon points="789,266 795,278 801,266" fill="#DC2626"/>
      <!-- AI Processing box -->
      <rect x="750" y="285" width="90" height="60" rx="8" fill="#27272a" stroke="#DC2626" stroke-width="1.5"/>
      <text x="795" y="310" fill="#DC2626" font-size="13" font-family="Arial" font-weight="700" text-anchor="middle">AI Engine</text>
      <text x="795" y="328" fill="#71717a" font-size="10" font-family="Arial" text-anchor="middle">Deep Learning</text>
      <!-- Arrow 2 -->
      <line x1="840" y1="315" x2="890" y2="315" stroke="#22c55e" stroke-width="2" stroke-dasharray="4,3"/>
      <polygon points="886,309 898,315 886,321" fill="#22c55e"/>
      <!-- Data outputs -->
      <rect x="905" y="175" width="160" height="40" rx="6" fill="#27272a" stroke="#3f3f46" stroke-width="1"/>
      <text x="920" y="200" fill="#22c55e" font-size="12" font-family="Arial" font-weight="600">Detect</text>
      <text x="1000" y="200" fill="#a1a1aa" font-size="11" font-family="Arial">YOLO v8</text>
      <rect x="905" y="225" width="160" height="40" rx="6" fill="#27272a" stroke="#3f3f46" stroke-width="1"/>
      <text x="920" y="250" fill="#3b82f6" font-size="12" font-family="Arial" font-weight="600">Track</text>
      <text x="1000" y="250" fill="#a1a1aa" font-size="11" font-family="Arial">DeepSORT</text>
      <rect x="905" y="275" width="160" height="40" rx="6" fill="#27272a" stroke="#3f3f46" stroke-width="1"/>
      <text x="920" y="300" fill="#f59e0b" font-size="12" font-family="Arial" font-weight="600">Count</text>
      <text x="1000" y="300" fill="#a1a1aa" font-size="11" font-family="Arial">Virtual Line</text>
      <rect x="905" y="325" width="160" height="40" rx="6" fill="#27272a" stroke="#3f3f46" stroke-width="1"/>
      <text x="920" y="350" fill="#a855f7" font-size="12" font-family="Arial" font-weight="600">Analyze</text>
      <text x="1000" y="350" fill="#a1a1aa" font-size="11" font-family="Arial">Demographics</text>
      <!-- Accuracy badge -->
      <rect x="920" y="400" width="120" height="36" rx="18" fill="#DC2626" opacity="0.9"/>
      <text x="980" y="424" fill="white" font-size="15" font-family="Arial" font-weight="700" text-anchor="middle">99.9% Akurat</text>
    </g>`
}

function illustrationRetailBenefits(): string {
  // Dashboard with conversion rate, staffing, charts
  return `
    <g opacity="0.9">
      <!-- Dashboard frame -->
      <rect x="740" y="150" width="340" height="340" rx="12" fill="#1a1a1e" stroke="#3f3f46" stroke-width="1.5"/>
      <!-- Title bar -->
      <rect x="740" y="150" width="340" height="32" rx="12" fill="#27272a"/>
      <circle cx="760" cy="166" r="5" fill="#ef4444"/>
      <circle cx="776" cy="166" r="5" fill="#f59e0b"/>
      <circle cx="792" cy="166" r="5" fill="#22c55e"/>
      <text x="910" y="170" fill="#71717a" font-size="10" font-family="Arial" text-anchor="middle">SmartCounter Dashboard</text>
      <!-- Conversion Rate card -->
      <rect x="756" y="195" width="150" height="65" rx="6" fill="#27272a"/>
      <text x="770" y="215" fill="#71717a" font-size="10" font-family="Arial">Conversion Rate</text>
      <text x="770" y="245" fill="#22c55e" font-size="26" font-family="Arial" font-weight="700">12.4%</text>
      <!-- Visitors card -->
      <rect x="916" y="195" width="150" height="65" rx="6" fill="#27272a"/>
      <text x="930" y="215" fill="#71717a" font-size="10" font-family="Arial">Pengunjung Hari Ini</text>
      <text x="930" y="245" fill="#3b82f6" font-size="26" font-family="Arial" font-weight="700">1,247</text>
      <!-- Bar chart -->
      <rect x="756" y="275" width="310" height="100" rx="6" fill="#27272a"/>
      <text x="770" y="295" fill="#71717a" font-size="10" font-family="Arial">Traffic per Jam</text>
      ${[45,62,78,95,110,130,125,100,85,70,55,40].map((h, i) =>
        `<rect x="${775 + i * 24}" y="${365 - h * 0.6}" width="16" height="${h * 0.6}" rx="2" fill="${i >= 3 && i <= 6 ? '#DC2626' : '#3f3f46'}"/>`
      ).join('\n      ')}
      <!-- ROI badge -->
      <rect x="756" y="390" width="150" height="38" rx="6" fill="#27272a"/>
      <text x="770" y="410" fill="#71717a" font-size="10" font-family="Arial">ROI Promosi</text>
      <text x="770" y="425" fill="#22c55e" font-size="13" font-family="Arial" font-weight="700">+25% Penjualan</text>
      <!-- Staff badge -->
      <rect x="916" y="390" width="150" height="38" rx="6" fill="#27272a"/>
      <text x="930" y="410" fill="#71717a" font-size="10" font-family="Arial">Hemat Staf</text>
      <text x="930" y="425" fill="#f59e0b" font-size="13" font-family="Arial" font-weight="700">-18% Biaya</text>
    </g>`
}

function illustrationVisitorAnalytics(): string {
  // Full analytics dashboard with heatmap, demographics, queue
  return `
    <g opacity="0.9">
      <!-- Dashboard frame -->
      <rect x="730" y="140" width="360" height="360" rx="12" fill="#1a1a1e" stroke="#3f3f46" stroke-width="1.5"/>
      <rect x="730" y="140" width="360" height="32" rx="12" fill="#27272a"/>
      <circle cx="750" cy="156" r="5" fill="#ef4444"/>
      <circle cx="766" cy="156" r="5" fill="#f59e0b"/>
      <circle cx="782" cy="156" r="5" fill="#22c55e"/>
      <text x="910" y="160" fill="#71717a" font-size="10" font-family="Arial" text-anchor="middle">CCTV AI Analytics</text>
      <!-- Heatmap mini -->
      <rect x="746" y="185" width="165" height="105" rx="6" fill="#27272a"/>
      <text x="760" y="202" fill="#71717a" font-size="9" font-family="Arial">Heatmap</text>
      ${[
        [0,0,'#22c55e'],[1,0,'#f59e0b'],[2,0,'#DC2626'],[3,0,'#f59e0b'],[4,0,'#22c55e'],
        [0,1,'#3b82f6'],[1,1,'#f59e0b'],[2,1,'#DC2626'],[3,1,'#DC2626'],[4,1,'#f59e0b'],
        [0,2,'#3b82f6'],[1,2,'#22c55e'],[2,2,'#f59e0b'],[3,2,'#22c55e'],[4,2,'#3b82f6'],
      ].map(([x,y,c]) =>
        `<rect x="${760 + (x as number) * 28}" y="${210 + (y as number) * 24}" width="24" height="20" rx="3" fill="${c}" opacity="0.5"/>`
      ).join('\n      ')}
      <!-- Demographics mini -->
      <rect x="921" y="185" width="155" height="105" rx="6" fill="#27272a"/>
      <text x="935" y="202" fill="#71717a" font-size="9" font-family="Arial">Demografi</text>
      <circle cx="975" cy="252" r="30" fill="none" stroke="#DC2626" stroke-width="8" stroke-dasharray="55 133" transform="rotate(-90 975 252)"/>
      <circle cx="975" cy="252" r="30" fill="none" stroke="#3b82f6" stroke-width="8" stroke-dasharray="40 148" stroke-dashoffset="-55" transform="rotate(-90 975 252)"/>
      <circle cx="975" cy="252" r="30" fill="none" stroke="#22c55e" stroke-width="8" stroke-dasharray="35 153" stroke-dashoffset="-95" transform="rotate(-90 975 252)"/>
      <text x="1030" y="238" fill="#DC2626" font-size="9" font-family="Arial">18-30: 42%</text>
      <text x="1030" y="254" fill="#3b82f6" font-size="9" font-family="Arial">31-45: 35%</text>
      <text x="1030" y="270" fill="#22c55e" font-size="9" font-family="Arial">46+: 23%</text>
      <!-- Queue monitor -->
      <rect x="746" y="300" width="165" height="85" rx="6" fill="#27272a"/>
      <text x="760" y="317" fill="#71717a" font-size="9" font-family="Arial">Antrian Kasir</text>
      <text x="760" y="345" fill="#22c55e" font-size="22" font-family="Arial" font-weight="700">3</text>
      <text x="785" y="345" fill="#71717a" font-size="11" font-family="Arial">orang</text>
      <text x="760" y="368" fill="#a1a1aa" font-size="10" font-family="Arial">Est. wait: 2m 30s</text>
      <!-- Occupancy -->
      <rect x="921" y="300" width="155" height="85" rx="6" fill="#27272a"/>
      <text x="935" y="317" fill="#71717a" font-size="9" font-family="Arial">Okupansi</text>
      <rect x="935" y="330" width="120" height="10" rx="5" fill="#3f3f46"/>
      <rect x="935" y="330" width="84" height="10" rx="5" fill="#f59e0b"/>
      <text x="935" y="360" fill="#f59e0b" font-size="14" font-family="Arial" font-weight="700">70%</text>
      <text x="970" y="360" fill="#71717a" font-size="10" font-family="Arial">/ 150 max</text>
      <!-- Live badge -->
      <circle cx="754" y="420" r="4" fill="#22c55e"/>
      <text x="766" y="424" fill="#22c55e" font-size="10" font-family="Arial" font-weight="600">LIVE</text>
      <text x="800" y="424" fill="#71717a" font-size="10" font-family="Arial">Real-time Analytics</text>
      <!-- Stat row -->
      <rect x="746" y="435" width="330" height="50" rx="6" fill="#27272a"/>
      <text x="790" y="465" fill="white" font-size="18" font-family="Arial" font-weight="700" text-anchor="middle">1,247</text>
      <text x="790" y="478" fill="#71717a" font-size="9" font-family="Arial" text-anchor="middle">Hari ini</text>
      <text x="910" y="465" fill="#22c55e" font-size="18" font-family="Arial" font-weight="700" text-anchor="middle">+12%</text>
      <text x="910" y="478" fill="#71717a" font-size="9" font-family="Arial" text-anchor="middle">vs kemarin</text>
      <text x="1030" y="465" fill="#3b82f6" font-size="18" font-family="Arial" font-weight="700" text-anchor="middle">8.2%</text>
      <text x="1030" y="478" fill="#71717a" font-size="9" font-family="Arial" text-anchor="middle">Konversi</text>
    </g>`
}

function illustrationRetailSales(): string {
  // Sales uplift chart with before/after
  return `
    <g opacity="0.9">
      <rect x="760" y="170" width="300" height="300" rx="10" fill="#1a1a1e" stroke="#3f3f46" stroke-width="1.5"/>
      <text x="910" y="200" fill="#a1a1aa" font-size="12" font-family="Arial" text-anchor="middle" font-weight="600">Sales Impact — 6 Months</text>
      <!-- Before bars -->
      ${[60,55,65,58,50,62].map((h, i) =>
        `<rect x="${785 + i * 42}" y="${430 - h * 2}" width="16" height="${h * 2}" rx="2" fill="#3f3f46"/>`
      ).join('\n      ')}
      <!-- After bars -->
      ${[75,80,90,85,78,95].map((h, i) =>
        `<rect x="${803 + i * 42}" y="${430 - h * 2}" width="16" height="${h * 2}" rx="2" fill="#DC2626"/>`
      ).join('\n      ')}
      <!-- Labels -->
      <text x="800" y="450" fill="#71717a" font-size="9" font-family="Arial" text-anchor="middle">Jan</text>
      <text x="842" y="450" fill="#71717a" font-size="9" font-family="Arial" text-anchor="middle">Feb</text>
      <text x="884" y="450" fill="#71717a" font-size="9" font-family="Arial" text-anchor="middle">Mar</text>
      <text x="926" y="450" fill="#71717a" font-size="9" font-family="Arial" text-anchor="middle">Apr</text>
      <text x="968" y="450" fill="#71717a" font-size="9" font-family="Arial" text-anchor="middle">May</text>
      <text x="1010" y="450" fill="#71717a" font-size="9" font-family="Arial" text-anchor="middle">Jun</text>
      <!-- Legend -->
      <rect x="830" y="218" width="10" height="10" rx="2" fill="#3f3f46"/>
      <text x="846" y="228" fill="#71717a" font-size="10" font-family="Arial">Before</text>
      <rect x="900" y="218" width="10" height="10" rx="2" fill="#DC2626"/>
      <text x="916" y="228" fill="#DC2626" font-size="10" font-family="Arial">After +25%</text>
    </g>`
}

function illustrationMallBenchmark(): string {
  // Mall floor plan with zone metrics
  return `
    <g opacity="0.9">
      <rect x="760" y="160" width="300" height="320" rx="10" fill="#1a1a1e" stroke="#3f3f46" stroke-width="1.5"/>
      <text x="910" y="190" fill="#a1a1aa" font-size="11" font-family="Arial" text-anchor="middle" font-weight="600">Mall Zone Traffic</text>
      <!-- Zone A -->
      <rect x="780" y="210" width="120" height="70" rx="6" fill="#DC2626" opacity="0.2" stroke="#DC2626" stroke-width="1"/>
      <text x="840" y="240" fill="#DC2626" font-size="14" font-family="Arial" font-weight="700" text-anchor="middle">Zone A</text>
      <text x="840" y="260" fill="#a1a1aa" font-size="11" font-family="Arial" text-anchor="middle">12,450/day</text>
      <!-- Zone B -->
      <rect x="920" y="210" width="120" height="70" rx="6" fill="#f59e0b" opacity="0.2" stroke="#f59e0b" stroke-width="1"/>
      <text x="980" y="240" fill="#f59e0b" font-size="14" font-family="Arial" font-weight="700" text-anchor="middle">Zone B</text>
      <text x="980" y="260" fill="#a1a1aa" font-size="11" font-family="Arial" text-anchor="middle">8,320/day</text>
      <!-- Zone C -->
      <rect x="780" y="300" width="120" height="70" rx="6" fill="#3b82f6" opacity="0.2" stroke="#3b82f6" stroke-width="1"/>
      <text x="840" y="330" fill="#3b82f6" font-size="14" font-family="Arial" font-weight="700" text-anchor="middle">Zone C</text>
      <text x="840" y="350" fill="#a1a1aa" font-size="11" font-family="Arial" text-anchor="middle">5,180/day</text>
      <!-- Zone D -->
      <rect x="920" y="300" width="120" height="70" rx="6" fill="#22c55e" opacity="0.2" stroke="#22c55e" stroke-width="1"/>
      <text x="980" y="330" fill="#22c55e" font-size="14" font-family="Arial" font-weight="700" text-anchor="middle">Zone D</text>
      <text x="980" y="350" fill="#a1a1aa" font-size="11" font-family="Arial" text-anchor="middle">3,750/day</text>
      <!-- Fair share bar -->
      <text x="910" y="410" fill="#71717a" font-size="10" font-family="Arial" text-anchor="middle">Revenue Share by Traffic</text>
      <rect x="790" y="420" width="240" height="12" rx="6" fill="#3f3f46"/>
      <rect x="790" y="420" width="100" height="12" rx="6" fill="#DC2626"/>
      <rect x="890" y="420" width="70" height="12" fill="#f59e0b"/>
      <rect x="960" y="420" width="45" height="12" fill="#3b82f6"/>
      <rect x="1005" y="420" width="25" height="12" rx="0 6 6 0" fill="#22c55e"/>
    </g>`
}

function illustrationFashionFitting(): string {
  return `
    <g opacity="0.9">
      <rect x="780" y="170" width="280" height="300" rx="10" fill="#1a1a1e" stroke="#3f3f46" stroke-width="1.5"/>
      <text x="920" y="200" fill="#a1a1aa" font-size="11" font-family="Arial" text-anchor="middle" font-weight="600">Fitting Room Funnel</text>
      <!-- Funnel -->
      <polygon points="840,230 1000,230 970,290 870,290" fill="#DC2626" opacity="0.3"/>
      <text x="920" y="268" fill="white" font-size="14" font-family="Arial" font-weight="700" text-anchor="middle">1,000 Browse</text>
      <polygon points="870,295 970,295 955,345 885,345" fill="#f59e0b" opacity="0.3"/>
      <text x="920" y="328" fill="white" font-size="13" font-family="Arial" font-weight="600" text-anchor="middle">320 Try On</text>
      <polygon points="885,350 955,350 945,395 895,395" fill="#22c55e" opacity="0.3"/>
      <text x="920" y="380" fill="white" font-size="13" font-family="Arial" font-weight="600" text-anchor="middle">128 Buy</text>
      <!-- Conversion -->
      <text x="920" y="435" fill="#22c55e" font-size="18" font-family="Arial" font-weight="700" text-anchor="middle">12.8% Conv.</text>
      <text x="920" y="455" fill="#71717a" font-size="10" font-family="Arial" text-anchor="middle">Try-on rate: 32% | Buy rate: 40%</text>
    </g>`
}

function illustrationPrivacy(): string {
  return `
    <g opacity="0.9">
      <rect x="780" y="170" width="280" height="300" rx="10" fill="#1a1a1e" stroke="#3f3f46" stroke-width="1.5"/>
      <text x="920" y="200" fill="#a1a1aa" font-size="11" font-family="Arial" text-anchor="middle" font-weight="600">Privacy-First Demographics</text>
      <!-- Shield icon -->
      <path d="M920,230 L945,240 L945,270 C945,290 920,305 920,305 C920,305 895,290 895,270 L895,240 Z" fill="none" stroke="#22c55e" stroke-width="2"/>
      <text x="920" y="275" fill="#22c55e" font-size="16" font-family="Arial" font-weight="700" text-anchor="middle">OK</text>
      <!-- Data boxes -->
      <rect x="800" y="320" width="75" height="50" rx="6" fill="#27272a"/>
      <text x="837" y="342" fill="#3b82f6" font-size="16" font-family="Arial" font-weight="700" text-anchor="middle">42%</text>
      <text x="837" y="360" fill="#71717a" font-size="9" font-family="Arial" text-anchor="middle">18-30</text>
      <rect x="883" y="320" width="75" height="50" rx="6" fill="#27272a"/>
      <text x="920" y="342" fill="#f59e0b" font-size="16" font-family="Arial" font-weight="700" text-anchor="middle">35%</text>
      <text x="920" y="360" fill="#71717a" font-size="9" font-family="Arial" text-anchor="middle">31-45</text>
      <rect x="966" y="320" width="75" height="50" rx="6" fill="#27272a"/>
      <text x="1003" y="342" fill="#22c55e" font-size="16" font-family="Arial" font-weight="700" text-anchor="middle">23%</text>
      <text x="1003" y="360" fill="#71717a" font-size="9" font-family="Arial" text-anchor="middle">46+</text>
      <!-- No face data -->
      <text x="920" y="410" fill="#71717a" font-size="10" font-family="Arial" text-anchor="middle">No face data stored</text>
      <text x="920" y="430" fill="#22c55e" font-size="11" font-family="Arial" text-anchor="middle" font-weight="600">GDPR Compliant</text>
    </g>`
}

function illustrationQueue(): string {
  return `
    <g opacity="0.9">
      <rect x="780" y="170" width="280" height="300" rx="10" fill="#1a1a1e" stroke="#3f3f46" stroke-width="1.5"/>
      <text x="920" y="200" fill="#a1a1aa" font-size="11" font-family="Arial" text-anchor="middle" font-weight="600">Queue Monitor — Live</text>
      <!-- Queue visual -->
      ${[0,1,2,3,4].map(i =>
        `<circle cx="${830 + i * 35}" cy="250" r="14" fill="${i < 3 ? '#22c55e' : '#f59e0b'}" opacity="${0.8 - i * 0.1}"/>
        <rect x="${822 + i * 35}" y="268" width="16" height="22" rx="5" fill="${i < 3 ? '#22c55e' : '#f59e0b'}" opacity="${0.5 - i * 0.05}"/>`
      ).join('\n      ')}
      <!-- Cashier line -->
      <rect x="800" y="305" width="240" height="2" fill="#3f3f46"/>
      <rect x="800" y="310" width="60" height="30" rx="4" fill="#27272a" stroke="#3f3f46" stroke-width="1"/>
      <text x="830" y="330" fill="#71717a" font-size="9" font-family="Arial" text-anchor="middle">Kasir 1</text>
      <!-- Stats -->
      <rect x="800" y="360" width="110" height="50" rx="6" fill="#27272a"/>
      <text x="855" y="382" fill="#f59e0b" font-size="20" font-family="Arial" font-weight="700" text-anchor="middle">5</text>
      <text x="855" y="400" fill="#71717a" font-size="10" font-family="Arial" text-anchor="middle">In Queue</text>
      <rect x="920" y="360" width="120" height="50" rx="6" fill="#27272a"/>
      <text x="980" y="382" fill="#22c55e" font-size="20" font-family="Arial" font-weight="700" text-anchor="middle">2:30</text>
      <text x="980" y="400" fill="#71717a" font-size="10" font-family="Arial" text-anchor="middle">Est. Wait</text>
      <!-- Alert -->
      <rect x="800" y="425" width="240" height="30" rx="6" fill="#DC2626" opacity="0.15"/>
      <text x="920" y="445" fill="#DC2626" font-size="11" font-family="Arial" font-weight="600" text-anchor="middle">Open Kasir 2 — queue > 4</text>
    </g>`
}

function illustrationOccupancy(): string {
  return `
    <g opacity="0.9">
      <rect x="780" y="170" width="280" height="300" rx="10" fill="#1a1a1e" stroke="#3f3f46" stroke-width="1.5"/>
      <text x="920" y="200" fill="#a1a1aa" font-size="11" font-family="Arial" text-anchor="middle" font-weight="600">Occupancy Monitor</text>
      <!-- Gauge -->
      <path d="M 860 340 A 60 60 0 0 1 980 340" fill="none" stroke="#3f3f46" stroke-width="12" stroke-linecap="round"/>
      <path d="M 860 340 A 60 60 0 0 1 955 290" fill="none" stroke="#f59e0b" stroke-width="12" stroke-linecap="round"/>
      <text x="920" y="330" fill="white" font-size="28" font-family="Arial" font-weight="700" text-anchor="middle">72%</text>
      <text x="920" y="352" fill="#71717a" font-size="11" font-family="Arial" text-anchor="middle">108 / 150 max</text>
      <!-- Status bars -->
      <rect x="800" y="380" width="75" height="40" rx="6" fill="#22c55e" opacity="0.15"/>
      <text x="837" y="400" fill="#22c55e" font-size="10" font-family="Arial" text-anchor="middle" font-weight="600">SAFE</text>
      <text x="837" y="414" fill="#71717a" font-size="9" font-family="Arial" text-anchor="middle">&lt;80%</text>
      <rect x="883" y="380" width="75" height="40" rx="6" fill="#f59e0b" opacity="0.2" stroke="#f59e0b" stroke-width="1"/>
      <text x="920" y="400" fill="#f59e0b" font-size="10" font-family="Arial" text-anchor="middle" font-weight="600">WARNING</text>
      <text x="920" y="414" fill="#71717a" font-size="9" font-family="Arial" text-anchor="middle">80-95%</text>
      <rect x="966" y="380" width="75" height="40" rx="6" fill="#DC2626" opacity="0.15"/>
      <text x="1003" y="400" fill="#DC2626" font-size="10" font-family="Arial" text-anchor="middle" font-weight="600">FULL</text>
      <text x="1003" y="414" fill="#71717a" font-size="9" font-family="Arial" text-anchor="middle">&gt;95%</text>
      <!-- Compliance -->
      <text x="920" y="455" fill="#22c55e" font-size="11" font-family="Arial" text-anchor="middle" font-weight="600">Fire Code Compliant</text>
    </g>`
}

function illustrationConversion(): string {
  return `
    <g opacity="0.9">
      <rect x="780" y="170" width="280" height="300" rx="10" fill="#1a1a1e" stroke="#3f3f46" stroke-width="1.5"/>
      <text x="920" y="200" fill="#a1a1aa" font-size="11" font-family="Arial" text-anchor="middle" font-weight="600">Conversion Rate Tracking</text>
      <!-- Funnel simplified -->
      <rect x="830" y="220" width="180" height="35" rx="4" fill="#3b82f6" opacity="0.3"/>
      <text x="920" y="243" fill="white" font-size="12" font-family="Arial" font-weight="600" text-anchor="middle">1,000 Visitors</text>
      <rect x="855" y="265" width="130" height="35" rx="4" fill="#f59e0b" opacity="0.3"/>
      <text x="920" y="288" fill="white" font-size="12" font-family="Arial" font-weight="600" text-anchor="middle">200 Engaged</text>
      <rect x="880" y="310" width="80" height="35" rx="4" fill="#22c55e" opacity="0.3"/>
      <text x="920" y="333" fill="white" font-size="12" font-family="Arial" font-weight="600" text-anchor="middle">50 Buy</text>
      <!-- Rate -->
      <text x="920" y="385" fill="#22c55e" font-size="24" font-family="Arial" font-weight="700" text-anchor="middle">5.0%</text>
      <text x="920" y="405" fill="#71717a" font-size="11" font-family="Arial" text-anchor="middle">Conversion Rate</text>
      <!-- Trend -->
      <text x="920" y="445" fill="#22c55e" font-size="12" font-family="Arial" text-anchor="middle">+1.2% vs last month</text>
    </g>`
}

const ILLUSTRATIONS: Record<string, () => string> = {
  'blog-apa-itu-people-counting.png': illustrationPeopleCounting,
  'blog-cara-kerja-cctv-ai.png': illustrationCctvAi,
  'blog-manfaat-visitor-counter.png': illustrationRetailBenefits,
  'blog-cctv-ai-visitor-analytics.png': illustrationVisitorAnalytics,
  'blog-people-counting-retail.png': illustrationRetailSales,
  'blog-mall-benchmarking.png': illustrationMallBenchmark,
  'blog-fashion-fitting.png': illustrationFashionFitting,
  'blog-privacy-demographics.png': illustrationPrivacy,
  'blog-queue-management.png': illustrationQueue,
  'blog-occupancy-safety.png': illustrationOccupancy,
  'blog-conversion-rate.png': illustrationConversion,
}

async function generateOgImage(config: OgConfig) {
  const { filename, title, subtitle, accent } = config

  const maxTitleLen = ILLUSTRATIONS[filename] ? 22 : 28
  const lines = wrapLines(title, maxTitleLen)

  const titleY = 240
  const titleFontSize = ILLUSTRATIONS[filename] ? 38 : 44
  const titleSvg = lines
    .map((line, i) => `<text x="80" y="${titleY + i * (titleFontSize + 10)}" fill="white" font-size="${titleFontSize}" font-weight="700" font-family="Arial, sans-serif">${escapeXml(line)}</text>`)
    .join('\n')

  const subtitleWords = subtitle.split(' ').slice(0, 10).join(' ')
  const subtitleTrunc = subtitleWords.length < subtitle.length ? subtitleWords + '...' : subtitle

  const illustrationSvg = ILLUSTRATIONS[filename]?.() || ''

  const svg = `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#09090B"/>
      <stop offset="100%" style="stop-color:#18181B"/>
    </linearGradient>
    <radialGradient id="glow" cx="85%" cy="35%" r="45%">
      <stop offset="0%" style="stop-color:${accent};stop-opacity:0.12"/>
      <stop offset="100%" style="stop-color:${accent};stop-opacity:0"/>
    </radialGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect width="1200" height="630" fill="url(#glow)"/>
  <rect x="0" y="0" width="1200" height="4" fill="${accent}"/>
  <text x="80" y="100" fill="${accent}" font-size="14" font-weight="700" font-family="Arial, sans-serif" letter-spacing="3">SMARTCOUNTER</text>
  <line x1="80" y1="130" x2="180" y2="130" stroke="${accent}" stroke-width="3"/>
  ${titleSvg}
  <text x="80" y="${titleY + lines.length * (titleFontSize + 10) + 24}" fill="#a1a1aa" font-size="18" font-family="Arial, sans-serif">${escapeXml(subtitleTrunc)}</text>
  <text x="80" y="580" fill="#71717a" font-size="16" font-family="Arial, sans-serif">smartcounter.id</text>
  <text x="1120" y="580" fill="#71717a" font-size="16" font-family="Arial, sans-serif" text-anchor="end">People Counting &amp; Visitor Analytics</text>
  ${illustrationSvg}
</svg>`

  const buffer = await sharp(Buffer.from(svg)).png().toBuffer()

  // Save to og/generated
  const ogPath = path.join(OUTPUT_DIR, filename)
  writeFileSync(ogPath, buffer)

  // Save to media (same image, used as featured image)
  const mediaPath = path.join(MEDIA_DIR, filename)
  writeFileSync(mediaPath, buffer)

  // Generate responsive sizes for media
  const sizes = [
    { w: 1200, h: 630, suffix: '-1200x630' },
    { w: 800, h: 600, suffix: '-800x600' },
    { w: 400, h: 300, suffix: '-400x300' },
  ]
  const baseName = filename.replace('.png', '')
  for (const s of sizes) {
    const resized = await sharp(buffer).resize(s.w, s.h, { fit: 'cover' }).png().toBuffer()
    writeFileSync(path.join(MEDIA_DIR, `${baseName}${s.suffix}.png`), resized)
  }

  console.log(`Generated: ${filename} (og + media + 3 sizes)`)
}

const items: OgConfig[] = [
  // Blog posts (EN)
  { filename: 'blog-people-counting-retail.png', title: 'How People Counting Drives Retail Sales by 25%+', subtitle: 'Real-time visitor analytics for layout, staffing, and marketing ROI', accent: '#DC2626' },
  { filename: 'blog-mall-benchmarking.png', title: 'Mall Tenant Benchmarking with CCTV AI', subtitle: 'Objectively measure tenant traffic and settle disputes', accent: '#DC2626' },
  { filename: 'blog-fashion-fitting.png', title: 'Fashion Retail: Fitting Room Conversion Tracking', subtitle: 'AI-powered conversion from browsing to purchase', accent: '#DC2626' },
  { filename: 'blog-privacy-demographics.png', title: 'Privacy-First Demographic Insights with CCTV AI', subtitle: 'Age, gender, group size — without personal data', accent: '#DC2626' },
  { filename: 'blog-queue-management.png', title: 'Reduce Checkout Wait Times: Real-Time Queue Management', subtitle: 'Cut wait times by 40-60% with smart staffing alerts', accent: '#DC2626' },
  { filename: 'blog-occupancy-safety.png', title: 'Occupancy Monitoring for Safety & Compliance', subtitle: 'Real-time monitoring for fire codes and crowd management', accent: '#DC2626' },
  { filename: 'blog-conversion-rate.png', title: 'Understanding Conversion Rate in Physical Retail', subtitle: 'What it means, how to measure, strategies to improve', accent: '#DC2626' },
  // Blog posts (ID)
  { filename: 'blog-apa-itu-people-counting.png', title: 'Apa Itu People Counting System?', subtitle: 'Panduan lengkap teknologi AI penghitung pengunjung', accent: '#DC2626' },
  { filename: 'blog-cara-kerja-cctv-ai.png', title: 'Cara Kerja People Counting dengan CCTV AI', subtitle: 'Teknologi di balik akurasi 99,9%', accent: '#DC2626' },
  { filename: 'blog-manfaat-visitor-counter.png', title: 'Manfaat Visitor Counter untuk Toko Retail', subtitle: 'Tingkatkan penjualan hingga 40%', accent: '#DC2626' },
  { filename: 'blog-cctv-ai-visitor-analytics.png', title: 'CCTV AI untuk People Counting dan Visitor Analytics', subtitle: 'Solusi lengkap untuk retail Indonesia', accent: '#DC2626' },
  // Use cases
  { filename: 'usecase-retail.png', title: 'People Counting for Retail Stores', subtitle: 'Optimize every location with visitor analytics', accent: '#059669' },
  { filename: 'usecase-mall.png', title: 'Shopping Mall Visitor Analytics', subtitle: 'Tenant benchmarking and zone optimization', accent: '#059669' },
  { filename: 'usecase-fashion.png', title: 'Fashion Retail Analytics', subtitle: 'Fitting room conversion and collection performance', accent: '#059669' },
  { filename: 'usecase-pharmacy.png', title: 'Pharmacy Queue & Traffic Analytics', subtitle: 'Counter queues and pharmacist scheduling', accent: '#059669' },
  { filename: 'usecase-supermarket.png', title: 'Supermarket Aisle & Checkout Analytics', subtitle: 'Aisle flow optimization and queue management', accent: '#059669' },
  { filename: 'usecase-luxury.png', title: 'Luxury Retail VIP Analytics', subtitle: 'Privacy-first insights for premium retail', accent: '#059669' },
]

async function main() {
  for (const item of items) {
    await generateOgImage(item)
  }
  console.log(`\nDone! Generated ${items.length} OG images in ${OUTPUT_DIR}`)
  console.log(`Media copies in ${MEDIA_DIR}`)
}

main().catch(console.error)
