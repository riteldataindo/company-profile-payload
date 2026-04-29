export interface BlogPost {
  id: number
  slug: string
  title: string
  excerpt: string
  category: string
  author: string
  date: string
  readTime: number
  featured: boolean
  content: string[]
  sections?: { id: string; title: string }[]
}

export const blogPosts: BlogPost[] = [
  {
    id: 1,
    slug: 'people-counting-retail-sales',
    title: 'How People Counting Drives Retail Sales by 25%+',
    excerpt:
      'Real-time visitor analytics help retailers optimize layout, staffing, and marketing ROI. See the data-driven results.',
    category: 'Analytics',
    author: 'Sarah Chen',
    date: '2026-04-15',
    featured: true,
    readTime: 8,
    content: [
      'Most retail managers check sales numbers daily but miss the traffic metrics that explain why sales are up or down.',
      'Sales numbers tell you what happened. People counting tells you why. When you know how many visitors walked through your doors, you can calculate conversion rates, identify peak hours, and spot seasonal trends that drive revenue.',
      '1. Baseline Metrics: Establish your current visitor count, average transaction value, and conversion rate. This becomes your benchmark for measuring improvement.',
      '2. Layout Optimization: Use heatmap data to identify high-traffic zones and dead zones. Retailers who moved bestsellers to high-traffic areas saw 15-20% uplift in those categories.',
      '3. Staffing Alignment: Match floor staff to visitor traffic patterns. The data shows exactly when you need more people, not when you think you do.',
      '4. Marketing ROI: Track the impact of promotions by comparing traffic and sales before and after campaigns. AI-powered counting removes guesswork.',
      '5. Competitive Benchmarking: In shopping malls, compare your tenant performance to neighboring stores. Data-driven insights spark zone-level improvements.',
      'The retailers seeing 25%+ gains are those who treat people counting as a continuous feedback loop: measure → analyze → optimize → repeat. Without the numbers, you\'re flying blind.',
    ],
    sections: [
      { id: 'baseline-metrics', title: 'Baseline Metrics' },
      { id: 'layout-optimization', title: 'Layout Optimization' },
      { id: 'staffing-alignment', title: 'Staffing Alignment' },
      { id: 'marketing-roi', title: 'Marketing ROI' },
      { id: 'competitive-benchmarking', title: 'Competitive Benchmarking' },
    ],
  },
  {
    id: 2,
    slug: 'mall-tenant-benchmarking',
    title: 'Mall Tenant Benchmarking: Using CCTV AI for Fair Traffic Allocation',
    excerpt:
      'How shopping malls use SmartCounter to objectively measure tenant traffic and settle occupancy disputes.',
    category: 'Use Cases',
    author: 'Marcus Lee',
    date: '2026-04-10',
    featured: false,
    readTime: 6,
    content: [
      'Shopping mall disputes over foot traffic are common. Anchor stores claim they drive the traffic. Mid-level tenants disagree. Without data, these arguments are based on gut feel, not reality.',
      'CCTV-based people counting removes subjectivity. Every visitor is counted, every pass-through is logged, and every zone has metrics.',
      '1. Objective Traffic Measurement: Deploy SmartCounter across entry points, hallways, and tenant zones. Get hourly, daily, and weekly traffic reports for each area.',
      '2. Fair Revenue Sharing: Instead of arguing over occupancy rates, use actual foot traffic. A tenant in a low-traffic zone pays less than one in a prime location.',
      '3. Tenant Performance Benchmarking: Show tenants exactly how their store compares to neighbors. Data drives business decisions.',
      '4. Dispute Resolution: When a tenant claims low traffic is hurting sales, the numbers don\'t lie. Proven data prevents extended negotiations.',
      'Malls using SmartCounter report faster occupancy agreements, reduced tenant conflicts, and more stable revenue models. Data-driven fairness builds trust.',
    ],
    sections: [
      { id: 'objective-traffic', title: 'Objective Traffic Measurement' },
      { id: 'fair-revenue', title: 'Fair Revenue Sharing' },
      { id: 'benchmarking', title: 'Tenant Performance Benchmarking' },
      { id: 'dispute-resolution', title: 'Dispute Resolution' },
    ],
  },
  {
    id: 3,
    slug: 'fashion-fitting-room-conversion',
    title: 'Fashion Retail: Fitting Room Conversion Tracking with AI',
    excerpt:
      'Measure which collections drive fitting room visits and understand the path from browsing to trial to purchase.',
    category: 'Analytics',
    author: 'Elena Rodriguez',
    date: '2026-04-05',
    featured: false,
    readTime: 7,
    content: [
      'In fashion retail, the fitting room is where browsers become buyers. Track fitting room visits and you track purchase intent.',
      'SmartCounter monitors entrance traffic, fitting room visits, and zone dwell time. The data reveals which collections drive conversions.',
      '1. Collection Performance: See exactly how many visitors stop at each display, how many enter the fitting room, and how many convert to sale.',
      '2. Fitting Room Bottlenecks: Long queues at fitting rooms? The data shows wait times and peak hours, so you can staff accordingly.',
      '3. Browsing-to-Try Rate: Divide fitting room visits by store traffic. A high number means strong merchandising. A low number signals poor placement.',
      '4. Repeat Visitor Patterns: Identify which customers revisit the fitting room multiple times before buying. These are your most engaged shoppers.',
      'Fashion brands using SmartCounter optimize collection displays based on data, not trends. The result: faster inventory turns and happier customers.',
    ],
    sections: [
      { id: 'collection-performance', title: 'Collection Performance' },
      { id: 'fitting-room-bottlenecks', title: 'Fitting Room Bottlenecks' },
      { id: 'browsing-to-try', title: 'Browsing-to-Try Rate' },
      { id: 'repeat-visitor', title: 'Repeat Visitor Patterns' },
    ],
  },
  {
    id: 4,
    slug: 'privacy-compliant-demographics',
    title: 'Privacy-First Demographic Insights: What CCTV AI Can Tell About Customers',
    excerpt:
      'Understand your customer base without collecting personal data. How SmartCounter estimates demographics responsibly.',
    category: 'Technical',
    author: 'Rahul Patel',
    date: '2026-03-30',
    featured: false,
    readTime: 9,
    content: [
      'Retailers want to know: Who is walking into my store? Without CCTV AI, you\'re stuck with market research surveys, which are expensive and outdated.',
      'SmartCounter uses computer vision to estimate demographics—age range, gender, group composition—without storing faces or identities. Zero personal data. 100% privacy compliant.',
      '1. Age Demographics: Understand if your visitors skew young, middle-aged, or older. Adjust marketing and merchandising accordingly.',
      '2. Family Composition: Track solo shoppers, couples, families, and groups. Different groups have different shopping behaviors.',
      '3. Time-Based Patterns: Does your afternoon crowd look different from morning? Weekday versus weekend? The data reveals seasonal and temporal patterns.',
      '4. Zone Affinity: Which demographics spend time in which zones? A premium fashion corner might attract older, wealthier shoppers. Children\'s section attracts families.',
      '5. Privacy Assurance: All demographic insights are aggregated. No individual is tracked or identified. GDPR and local privacy laws are fully respected.',
      'This is the future of customer understanding: insights without surveillance, data without privacy concerns. SmartCounter makes it possible today.',
    ],
    sections: [
      { id: 'age-demographics', title: 'Age Demographics' },
      { id: 'family-composition', title: 'Family Composition' },
      { id: 'time-based', title: 'Time-Based Patterns' },
      { id: 'zone-affinity', title: 'Zone Affinity' },
      { id: 'privacy-assurance', title: 'Privacy Assurance' },
    ],
  },
  {
    id: 5,
    slug: 'queue-management-checkout',
    title: 'Reduce Checkout Wait Times: Real-Time Queue Management',
    excerpt:
      'AI-powered queue detection helps retailers prevent abandonments and improve customer satisfaction in real-time.',
    category: 'Features',
    author: 'Jennifer Park',
    date: '2026-03-25',
    featured: false,
    readTime: 5,
    content: [
      'Long lines at checkout are abandoned carts waiting to happen. Retailers who monitor queue length in real-time can staff proactively.',
      'SmartCounter detects checkout queues, measures wait times, and alerts managers when queues exceed thresholds.',
      '1. Queue Length Detection: AI monitors checkout area foot traffic. When queues form, the system alerts floor staff instantly.',
      '2. Wait Time Estimation: Predict queue wait time based on current queue length and processing speed.',
      '3. Peak Hour Staffing: Historical data shows exactly when queues form. Staff your checkout lanes accordingly.',
      '4. Abandoned Cart Prevention: A customer won\'t wait 10 minutes in line. Real-time alerts let you open additional lanes before they leave.',
      'Retailers using SmartCounter queue management report 30% reduction in checkout wait times and measurable improvements in customer satisfaction scores.',
    ],
    sections: [
      { id: 'queue-detection', title: 'Queue Length Detection' },
      { id: 'wait-time', title: 'Wait Time Estimation' },
      { id: 'peak-hour', title: 'Peak Hour Staffing' },
      { id: 'abandoned-cart', title: 'Abandoned Cart Prevention' },
    ],
  },
  {
    id: 6,
    slug: 'occupancy-safety-compliance',
    title: 'Occupancy Monitoring for Safety & Compliance: Beyond Manual Counts',
    excerpt:
      'CCTV-based real-time occupancy tracking for COVID safety, fire code compliance, and event capacity management.',
    category: 'Compliance',
    author: 'Dr. Ahmad Hassan',
    date: '2026-03-20',
    featured: false,
    readTime: 6,
    content: [
      'Building codes set maximum occupancy limits for safety. Fire marshals want proof of compliance. Event venues need real-time capacity tracking.',
      'Manual head counts are inaccurate and inconsistent. SmartCounter provides continuous, automated occupancy monitoring.',
      '1. Real-Time Occupancy Dashboard: See current occupancy vs. capacity limits across all zones. Instant alerts when capacity approaches limits.',
      '2. Fire Code Compliance: Generate occupancy reports for fire inspections. Proof that you\'ve monitored and maintained safe levels.',
      '3. Event Capacity Management: For events, venues, and gatherings, manage entrance flow to prevent overcrowding.',
      '4. Historical Compliance Reports: Export occupancy logs for audits. Every entry and exit is logged.',
      '5. Emergency Evacuation Support: In emergencies, accurate occupancy counts speed up evacuation procedures and accountability.',
      'SmartCounter occupancy monitoring is trusted by malls, venues, and retailers for safety and compliance across Indonesia.',
    ],
    sections: [
      { id: 'real-time-dashboard', title: 'Real-Time Occupancy Dashboard' },
      { id: 'fire-code', title: 'Fire Code Compliance' },
      { id: 'event-capacity', title: 'Event Capacity Management' },
      { id: 'compliance-reports', title: 'Historical Compliance Reports' },
      { id: 'emergency-evacuation', title: 'Emergency Evacuation Support' },
    ],
  },
  // Original detail page posts (merged)
  {
    id: 7,
    slug: '5-metrics-every-retail-manager-should-track',
    title: '5 Metrics Every Retail Manager Should Track Daily',
    excerpt:
      'Most retail managers check sales numbers daily but miss the traffic metrics that explain why sales are up or down.',
    category: 'Retail Analytics',
    author: 'Ritel Data Team',
    date: '2026-04-20',
    featured: false,
    readTime: 5,
    content: [
      'If your sales dropped 15% this week, what happened? Was it fewer visitors, or the same traffic with worse conversion? Without traffic data, you can\'t tell.',
      'Sales numbers tell you what happened. Traffic metrics tell you why. Here are the five numbers that separate data-driven retail managers from gut-driven ones.',
      '1. Total Visitor Traffic — The most fundamental metric: how many people walked into your store today? Track it hourly, daily, and weekly.',
      '2. Conversion Rate — Divide POS transactions by visitor count. Most retailers are shocked when they first see this number.',
      '3. Peak Hour Distribution — When are your busiest hours? Not when you think — when the data says.',
      '4. Dwell Time by Zone — How long do visitors spend in different areas of your store?',
      '5. Traffic-to-Staff Ratio — Divide visitor count by staff on floor for each hour.',
    ],
    sections: [
      { id: 'visitor-traffic', title: 'Total Visitor Traffic' },
      { id: 'conversion-rate', title: 'Conversion Rate' },
      { id: 'peak-hours', title: 'Peak Hour Distribution' },
      { id: 'dwell-time', title: 'Dwell Time by Zone' },
      { id: 'staff-ratio', title: 'Traffic-to-Staff Ratio' },
    ],
  },
  {
    id: 8,
    slug: 'heatmap-optimization-guide',
    title: 'How to Use Heatmap Data to Redesign Your Store Layout',
    excerpt:
      'A practical step-by-step guide to reading heatmap data and translating it into layout changes.',
    category: 'Tips & Tricks',
    author: 'Ayu R.',
    date: '2026-04-18',
    featured: false,
    readTime: 7,
    content: [
      'Heatmap data shows you where customers go and where they don\'t. Use this data to optimize product placement, identify dead zones, and improve customer flow.',
      'Step 1: Read the Heatmap — Red zones are high-traffic areas. Yellow zones are moderate. Blue zones get less attention. Your entrance and main aisles are typically red.',
      'Step 2: Identify Dead Zones — Look for blue areas. These could be back corners, side aisles, or overlooked sections. These zones lose sales.',
      'Step 3: Move Bestsellers to Hot Spots — Take your best-selling products and move them to red zones. Let foot traffic drive impulse purchases.',
      'Step 4: Create Destination Zones — Stock the blue zones with products that bring customers in intentionally. Bargains, seasonal items, or popular brands.',
      'Step 5: Optimize Checkout Proximity — Reduce path length by moving high-margin items closer to checkout. Easier checkout = higher conversion.',
      'Retailers who use heatmaps systematically see 10-15% revenue gains within 3 months of layout changes.',
    ],
    sections: [
      { id: 'read-heatmap', title: 'Read the Heatmap' },
      { id: 'dead-zones', title: 'Identify Dead Zones' },
      { id: 'bestsellers', title: 'Move Bestsellers to Hot Spots' },
      { id: 'destination', title: 'Create Destination Zones' },
      { id: 'checkout', title: 'Optimize Checkout Proximity' },
    ],
  },
  {
    id: 9,
    slug: 'conversion-rate-retail',
    title: 'Understanding Conversion Rate in Physical Retail',
    excerpt:
      'Online stores track conversion obsessively. Why don\'t physical stores?',
    category: 'Retail Analytics',
    author: 'Ritel Data Team',
    date: '2026-04-15',
    featured: false,
    readTime: 4,
    content: [
      'Conversion rate in physical retail is simply: transactions divided by foot traffic. Most stores don\'t measure this because they lack accurate people counting.',
      'Online stores obsess over conversion rate. A 2% conversion is standard; 3% is great; 5% is exceptional. Physical stores have no equivalent baseline.',
      'Without people counting, you have no idea. You might have a 1% conversion rate and not know it. You might improve to 1.2% and think nothing changed.',
      'SmartCounter gives you the baseline. Then you can A/B test layout changes, merchandising tweaks, and staffing patterns. Measure. Improve. Repeat.',
      'Start tracking your physical retail conversion rate today. You might be surprised what the numbers show—and delighted by the improvements you can drive.',
    ],
    sections: [
      { id: 'what-is-conversion', title: 'What is Conversion Rate?' },
      { id: 'why-measure', title: 'Why Measure It?' },
      { id: 'baseline', title: 'Getting Your Baseline' },
      { id: 'improvement', title: 'Continuous Improvement' },
    ],
  },
]

export function getBlogPost(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug)
}

export function getBlogPostsByCategory(category: string): BlogPost[] {
  return blogPosts.filter((post) => post.category === category)
}

export function getCategories(): string[] {
  const uniqueCategories = new Set(blogPosts.map((post) => post.category))
  return Array.from(uniqueCategories).sort()
}

export function getRelatedPosts(currentSlug: string, limit: number = 3): BlogPost[] {
  const currentPost = getBlogPost(currentSlug)
  if (!currentPost) return []

  // First, get posts from the same category
  const sameCategoryPosts = blogPosts.filter(
    (post) => post.category === currentPost.category && post.slug !== currentSlug
  )

  // If not enough, fill with other posts
  const otherPosts = blogPosts.filter(
    (post) => post.category !== currentPost.category && post.slug !== currentSlug
  )

  return [...sameCategoryPosts, ...otherPosts].slice(0, limit)
}
