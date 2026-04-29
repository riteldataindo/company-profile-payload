import translate from 'google-translate-api-x'

const cache = new Map<string, Record<string, any>>()

function flattenStrings(obj: any, prefix = ''): { path: string; value: string }[] {
  const results: { path: string; value: string }[] = []
  for (const [key, val] of Object.entries(obj)) {
    const path = prefix ? `${prefix}.${key}` : key
    if (typeof val === 'string') {
      results.push({ path, value: val })
    } else if (Array.isArray(val)) {
      val.forEach((item, i) => {
        if (typeof item === 'string') {
          results.push({ path: `${path}[${i}]`, value: item })
        } else if (typeof item === 'object' && item !== null) {
          results.push(...flattenStrings(item, `${path}[${i}]`))
        }
      })
    } else if (typeof val === 'object' && val !== null) {
      results.push(...flattenStrings(val, path))
    }
  }
  return results
}

function setNestedValue(obj: any, path: string, value: string) {
  const parts = path.replace(/\[(\d+)\]/g, '.$1').split('.')
  let current = obj
  for (let i = 0; i < parts.length - 1; i++) {
    const key = parts[i]
    const nextKey = parts[i + 1]
    const isNextArray = /^\d+$/.test(nextKey)
    if (!(key in current)) {
      current[key] = isNextArray ? [] : {}
    }
    current = current[key]
  }
  current[parts[parts.length - 1]] = value
}

function deepCloneStructure(obj: any): any {
  if (Array.isArray(obj)) return obj.map(deepCloneStructure)
  if (typeof obj === 'object' && obj !== null) {
    const result: any = {}
    for (const [k, v] of Object.entries(obj)) result[k] = deepCloneStructure(v)
    return result
  }
  return obj
}

export async function translateDict(
  dict: Record<string, any>,
  to: string,
): Promise<Record<string, any>> {
  if (to === 'en') return dict

  const cached = cache.get(to)
  if (cached) return cached

  const flat = flattenStrings(dict)
  if (flat.length === 0) return dict

  try {
    const texts = flat.map((f) => f.value)
    const results = await translate(texts, { from: 'en', to })

    const translated = deepCloneStructure(dict)
    const resArray = Array.isArray(results) ? results : [results]

    resArray.forEach((res, i) => {
      if (flat[i]) {
        setNestedValue(translated, flat[i].path, res.text)
      }
    })

    cache.set(to, translated)
    return translated
  } catch (e) {
    console.error('Translation failed:', e)
    return dict
  }
}
