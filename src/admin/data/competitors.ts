export interface CompetitorDef {
  id: string
  name: string
  domain: string
  urls: { topic: string; url: string }[]
}

export const COMPETITORS: CompetitorDef[] = [
  {
    id: 'footfallcam',
    name: 'FootfallCam',
    domain: 'footfallcam.com',
    urls: [
      { topic: 'people-counting', url: 'https://www.footfallcam.com/people-counting' },
      { topic: 'retail', url: 'https://www.footfallcam.com/retail' },
    ],
  },
  {
    id: 'v-count',
    name: 'V-Count',
    domain: 'v-count.com',
    urls: [
      { topic: 'people-counting', url: 'https://v-count.com/people-counting/' },
      { topic: 'retail', url: 'https://v-count.com/retail-analytics/' },
    ],
  },
  {
    id: 'sensource',
    name: 'SenSource',
    domain: 'sensourceinc.com',
    urls: [
      { topic: 'people-counting', url: 'https://www.sensourceinc.com/people-counting/' },
    ],
  },
]

export const TOPIC_MAP: Record<string, string> = {
  'people-counting': 'People Counting',
  'retail': 'Retail Analytics',
  'visitor-analytics': 'Visitor Analytics',
  'queue': 'Queue Management',
  'heatmap': 'Heatmap',
  'occupancy': 'Occupancy',
}
