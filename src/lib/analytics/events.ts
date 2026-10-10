export const ANALYTICS_CONSENT_KEY = 'smartcounter-analytics-consent'

type EventName =
  | 'cta_click'
  | 'solution_select'
  | 'feature_explore'
  | 'demo_start'
  | 'demo_submit_success'
  | 'demo_submit_error'
  | 'contact_submit_success'
  | 'contact_submit_error'

type EventValue = string | number | boolean

const allowedKeys: Record<EventName, readonly string[]> = {
  cta_click: ['locale', 'page', 'placement', 'label', 'destination', 'solution'],
  solution_select: ['locale', 'solution', 'placement'],
  feature_explore: ['locale', 'solution', 'group_id'],
  demo_start: ['locale', 'solution', 'source'],
  demo_submit_success: ['locale', 'solution'],
  demo_submit_error: ['locale', 'solution', 'category'],
  contact_submit_success: ['locale', 'solution'],
  contact_submit_error: ['locale', 'solution', 'category'],
}

function hasConsent(): boolean {
  try {
    return window.localStorage.getItem(ANALYTICS_CONSENT_KEY) === 'accepted'
  } catch {
    return false
  }
}

function safeProperties(name: EventName, properties: Record<string, unknown>): Record<string, EventValue> {
  const allowed = allowedKeys[name]
  return Object.fromEntries(
    Object.entries(properties).filter((entry): entry is [string, EventValue] => {
      const [key, value] = entry
      return allowed.includes(key) && (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean')
    }),
  )
}

export function trackEvent(name: EventName, properties: Record<string, unknown> = {}): boolean {
  if (typeof window === 'undefined' || !hasConsent()) return false

  const eventProperties = safeProperties(name, properties)
  if (typeof window.gtag === 'function') {
    window.gtag('event', name, eventProperties)
    return true
  }

  return false
}

declare global {
  interface Window {
    gtag?: (command: string, eventName: string, parameters?: Record<string, EventValue>) => void
  }
}
