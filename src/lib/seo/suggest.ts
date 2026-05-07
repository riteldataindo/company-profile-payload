// Fuzzy logic SEO suggestion engine
// Used by: Payload seoPlugin (generateTitle/generateDescription) + /api/seo-items/suggest

// ── Stopwords (EN + ID) ──

const STOPWORDS = new Set([
  'the','a','an','is','are','was','were','be','been','being','have','has','had',
  'do','does','did','will','would','shall','should','may','might','must','can',
  'could','to','of','in','for','on','with','at','by','from','as','into','through',
  'during','before','after','above','below','between','out','off','over','under',
  'again','further','then','once','here','there','when','where','why','how','all',
  'both','each','few','more','most','other','some','such','no','nor','not','only',
  'own','same','so','than','too','very','just','also','and','but','or','if','its',
  'it','this','that','these','those','i','me','my','we','our','you','your','he',
  'him','his','she','her','they','them','their','what','which','who','whom',
  'yang','dan','di','ke','dari','untuk','dengan','pada','adalah','ini','itu',
  'atau','juga','sudah','telah','akan','bisa','dapat','ada','tidak','lebih',
  'oleh','serta','dalam','secara','seperti','namun','tetapi','bahwa','sebuah',
  'kami','kita','anda','mereka','saya','sangat','hanya','masih','karena','setiap',
])

const DOMAIN_TERMS = new Map([
  ['people counting', 2.0], ['visitor analytics', 2.0], ['cctv ai', 2.0],
  ['foot traffic', 1.8], ['retail analytics', 1.8], ['visitor counter', 1.8],
  ['smart cctv', 1.7], ['ai camera', 1.7], ['real-time', 1.5],
  ['heatmap', 1.6], ['occupancy', 1.5], ['dwell time', 1.5],
  ['conversion rate', 1.5], ['queue management', 1.5], ['demographic', 1.4],
  ['people counter', 1.8], ['analitik pengunjung', 2.0], ['penghitung pengunjung', 1.8],
  ['kamera ai', 1.7], ['lalu lintas pengunjung', 1.8],
])

const UPPER_WORDS = new Set(['ai', 'cctv', 'roi', 'kpi', 'b2b', 'b2c', 'iot'])

// ── Tokenizer ──

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9À-ɏ\s-]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 2 && !STOPWORDS.has(w))
}

// ── Term Frequency with position weighting ──

export interface TermScore {
  term: string
  tf: number
  positionBoost: number
  score: number
}

export function computeTermScores(text: string): TermScore[] {
  const tokens = tokenize(text)
  if (tokens.length === 0) return []

  const freq = new Map<string, { count: number; firstPos: number }>()
  tokens.forEach((t, i) => {
    const existing = freq.get(t)
    if (existing) existing.count++
    else freq.set(t, { count: 1, firstPos: i })
  })

  // Bigrams
  for (let i = 0; i < tokens.length - 1; i++) {
    const bg = `${tokens[i]} ${tokens[i + 1]}`
    const existing = freq.get(bg)
    if (existing) existing.count++
    else freq.set(bg, { count: 1, firstPos: i })
  }

  const maxFreq = Math.max(...Array.from(freq.values()).map(v => v.count))
  const totalTokens = tokens.length

  return Array.from(freq.entries()).map(([term, { count, firstPos }]) => {
    const tf = count / maxFreq
    const positionBoost = 1 - (firstPos / totalTokens) * 0.5
    const phraseBonus = term.includes(' ') ? 1.3 : 1.0
    const score = tf * positionBoost * phraseBonus
    return { term, tf, positionBoost, score }
  }).sort((a, b) => b.score - a.score)
}

export function boostDomainTerms(scores: TermScore[]): TermScore[] {
  return scores.map(s => {
    const boost = DOMAIN_TERMS.get(s.term) || 1.0
    return { ...s, score: s.score * boost }
  }).sort((a, b) => b.score - a.score)
}

// ── Fuzzy sentence scoring ──

export interface ScoredSentence {
  text: string
  score: number
}

export function scoreSentences(text: string, topTerms: string[]): ScoredSentence[] {
  const sentences = text
    .replace(/\n+/g, '. ')
    .split(/(?<=[.!?])\s+/)
    .map(s => s.trim())
    .filter(s => s.length > 20 && s.length < 200)
    .filter(s => {
      const clean = s.replace(/[^a-zA-Z\s]/g, '').trim().toLowerCase()
      const nameClean = text.split('.')[0]?.replace(/[^a-zA-Z\s]/g, '').trim().toLowerCase() || ''
      return clean !== nameClean && s.length > nameClean.length * 0.5
    })

  if (sentences.length === 0) return []

  const topSet = new Set(topTerms.slice(0, 15))

  return sentences.map((sent, idx) => {
    const sentTokens = tokenize(sent)
    const sentTokenSet = new Set(sentTokens)

    const position = Math.exp(-idx * 0.3)

    let overlap = 0
    for (const t of topSet) {
      if (sent.toLowerCase().includes(t)) overlap++
    }
    const keywordOverlap = topSet.size > 0 ? Math.min(overlap / 3, 1.0) : 0

    const len = sent.length
    let length: number
    if (len >= 80 && len <= 150) length = 1.0
    else if (len >= 50 && len <= 180) length = 0.7
    else if (len >= 30) length = 0.4
    else length = 0.2

    const hasVerb = /\b(is|are|was|were|helps?|tracks?|uses?|provides?|enables?|measures?|counts?|detects?|monitors?|reduces?|increases?|improves?|transforms?|delivers?|ensures?|supports?|offers?|allows?|makes?|gives?|shows?|creates?|builds?|manages?|analyzes?|optimizes?|membantu|menyediakan|menggunakan|mendeteksi|menghitung|meningkatkan|mengukur|memantau)\b/i.test(sent)
    const endsWell = /[.!]$/.test(sent)
    const readability = (hasVerb ? 0.6 : 0.2) + (endsWell ? 0.4 : 0.1)

    const informativeness = sentTokens.length > 0
      ? Math.min(sentTokenSet.size / sentTokens.length, 1.0)
      : 0

    const score =
      position * 0.20 +
      keywordOverlap * 0.30 +
      length * 0.15 +
      readability * 0.20 +
      informativeness * 0.15

    return { text: sent, score }
  }).sort((a, b) => b.score - a.score)
}

// ── Smart title builder ──

function capitalize(s: string): string {
  return s.split(' ').map(w => UPPER_WORDS.has(w) ? w.toUpperCase() : w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
}

export function buildSmartTitle(name: string, topTerms: TermScore[], existingTitles: string[] = []): string {
  const nameLower = name.toLowerCase()
  const nameTokens = new Set(tokenize(name))
  const nameArr = Array.from(nameTokens)

  const complementary = topTerms
    .filter(t => {
      if (nameLower.includes(t.term)) return false
      if (nameTokens.has(t.term)) return false
      if (t.term.length < 5 && !t.term.includes(' ')) return false
      if (t.term.includes(' ')) {
        const bigramWords = t.term.split(' ')
        const allOverlap = bigramWords.every(bw =>
          nameTokens.has(bw) || nameArr.some(nw => nw.startsWith(bw) || bw.startsWith(nw))
        )
        if (allOverlap) return false
      }
      return true
    })
    .slice(0, 5)

  const candidates: string[] = []

  if (complementary.length >= 1) {
    candidates.push(`${name} — ${capitalize(complementary[0].term)}`)
  }
  if (complementary.length >= 2) {
    candidates.push(`${name}: ${capitalize(complementary[0].term)} & ${capitalize(complementary[1].term)}`)
  }
  if (name.length < 35) {
    candidates.push(`${name} | SmartCounter`)
  }

  const domainMatch = topTerms.find(t => DOMAIN_TERMS.has(t.term) && !nameLower.includes(t.term))
  if (domainMatch) {
    candidates.push(`${name} — ${capitalize(domainMatch.term)}`)
  }

  const closestDomain = Array.from(DOMAIN_TERMS.keys())
    .filter(dt => !nameLower.includes(dt))
    .sort((a, b) => {
      const aOverlap = a.split(' ').filter(t => nameLower.includes(t)).length
      const bOverlap = b.split(' ').filter(t => nameLower.includes(t)).length
      return bOverlap - aOverlap
    })[0]
  if (closestDomain) {
    candidates.push(`${name} — ${capitalize(closestDomain)}`)
  }
  if (name.length <= 40) {
    candidates.push(`${name} | SmartCounter`)
  }

  const existingSet = new Set(existingTitles.map(t => t.toLowerCase()))
  let best = name
  let bestScore = -1

  for (const c of candidates) {
    if (c.length > 65) continue
    let score = 0
    if (c.length >= 30 && c.length <= 60) score += 3
    else if (c.length >= 25 && c.length <= 65) score += 1
    if (!existingSet.has(c.toLowerCase())) score += 2
    const cl = c.toLowerCase()
    for (const [dt] of DOMAIN_TERMS) {
      if (cl.includes(dt)) { score += 1; break }
    }
    if (score > bestScore) {
      bestScore = score
      best = c
    }
  }

  if (best.length > 60) {
    const cut = best.substring(0, 57)
    const sp = cut.lastIndexOf(' ')
    best = sp > 30 ? cut.substring(0, sp) : cut
  }

  return best
}

// ── Smart description builder ──

export function buildSmartDescription(
  scoredSentences: ScoredSentence[],
  name: string,
  topTerms: TermScore[],
): string {
  if (scoredSentences.length === 0) {
    const topPhrase = topTerms[0]?.term || 'visitor analytics'
    return `${name} leverages ${topPhrase} to deliver actionable insights for retail operations. SmartCounter provides accurate real-time data.`
  }

  let desc = ''
  const used = new Set<number>()
  const cleanSentences = scoredSentences.map(s => s.text.replace(/\s+/g, ' ').replace(/\.{2,}/g, '.').replace(/\.\s*\./g, '.').trim())

  for (let i = 0; i < Math.min(cleanSentences.length, 8); i++) {
    const sent = cleanSentences[i]
    if (used.has(i) || sent.length < 10) continue

    if (!desc) {
      desc = sent
      used.add(i)
      if (desc.length >= 120 && desc.length <= 150) break
      continue
    }

    const base = desc.replace(/[.\s]+$/, '')
    const candidate = `${base}. ${sent}`

    if (candidate.length <= 150) {
      desc = candidate
      used.add(i)
      if (desc.length >= 120) break
    } else if (desc.length < 120) {
      // Sentence too long to append fully — find a shorter one
      let found = false
      for (let j = i + 1; j < Math.min(cleanSentences.length, 10); j++) {
        if (used.has(j)) continue
        const alt = `${base}. ${cleanSentences[j]}`
        if (alt.length >= 120 && alt.length <= 150) {
          desc = alt
          used.add(j)
          found = true
          break
        }
      }
      if (found) break
      // No short sentence found — trim the current one at clause boundary
      const remaining = 147 - base.length - 2
      if (remaining > 20) {
        const fragment = sent.substring(0, remaining)
        const clauseEnd = Math.max(fragment.lastIndexOf(','), fragment.lastIndexOf(' — '), fragment.lastIndexOf(' dan '), fragment.lastIndexOf(' yang '), fragment.lastIndexOf(' untuk '))
        const wordEnd = fragment.lastIndexOf(' ')
        const cutAt = clauseEnd > remaining * 0.4 ? clauseEnd : wordEnd > remaining * 0.5 ? wordEnd : remaining
        desc = `${base}. ${sent.substring(0, cutAt).trim()}.`
        used.add(i)
      }
      break
    } else {
      break
    }
  }

  desc = desc.replace(/[,;:\s]+$/, '').replace(/\.{2,}/g, '.')

  if (desc.length < 120) {
    const topPhrase = topTerms
      .filter(t => !desc.toLowerCase().includes(t.term))
      .slice(0, 2).map(t => t.term).join(' ')|| 'visitor analytics'
    const closers = [
      `Pelajari lebih lanjut tentang ${topPhrase} di SmartCounter.`,
      `SmartCounter menyediakan solusi ${topPhrase} untuk bisnis retail Indonesia.`,
      `Dapatkan data ${topPhrase} akurat dengan SmartCounter.`,
    ]
    for (const closer of closers) {
      const candidate = `${desc.replace(/[.\s]+$/, '')}. ${closer}`
      if (candidate.length >= 120 && candidate.length <= 150) {
        desc = candidate
        break
      }
    }
  }

  if (!/[.!?]$/.test(desc)) desc += '.'

  if (desc.length > 150) {
    const cut = desc.substring(0, 148)
    const dotPos = cut.lastIndexOf('. ')
    if (dotPos > 80) {
      desc = cut.substring(0, dotPos + 1)
    } else {
      const spPos = cut.lastIndexOf(' ')
      desc = (spPos > 100 ? cut.substring(0, spPos) : cut) + '.'
    }
  }

  return desc
}

// ── Richtext extractor ──

export function extractRichText(richText: any): string {
  if (!richText) return ''
  if (typeof richText === 'string') return richText
  if (richText.root?.children) {
    return richText.root.children
      .map((node: any) => {
        if (node.children) return node.children.map((c: any) => c.text || '').join('')
        return node.text || ''
      })
      .join(' ')
  }
  return ''
}

// ── High-level API: generate title + description from doc fields ──

export interface SuggestInput {
  name: string
  excerpt: string
  fullContent: string
  existingTitles?: string[]
}

export interface SuggestResult {
  title: string
  description: string
  topTerms: TermScore[]
  topSentences: ScoredSentence[]
}

export function generateSeoSuggestion(input: SuggestInput): SuggestResult {
  const allText = [input.name, input.excerpt, input.fullContent].filter(Boolean).join('. ')

  const rawScores = computeTermScores(allText)
  const termScores = boostDomainTerms(rawScores)
  const topTerms = termScores.slice(0, 20).map(t => t.term)
  const scoredSentences = scoreSentences(allText, topTerms)

  const title = buildSmartTitle(input.name, termScores, input.existingTitles || [])
  const description = buildSmartDescription(scoredSentences, input.name, termScores)

  return {
    title,
    description,
    topTerms: termScores.slice(0, 10),
    topSentences: scoredSentences.slice(0, 3),
  }
}
