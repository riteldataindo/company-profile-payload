const claimReplacements: Array<[RegExp, string]> = [
  [/\bdengan\s+akurasi\s+99[.,]9%/gi, 'dengan performa yang divalidasi untuk setiap implementasi'],
  [/99[.,]9%\s*정확도의?/g, '배포 환경별로 검증되는'],
  [/99[.,]9%の精度で?/g, '導入環境ごとに検証された性能で'],
  [/99[.,]9%准确率的?/g, '按部署环境验证的'],
  [/\bSLA\s+99\.9%\s+Uptime\s+Guarantee\b/gi, 'Service levels defined by agreement'],
  [/\bwith\s+99\.9%\s+accuracy\b/gi, 'with performance validated for each deployment'],
  [/\b99\.9%\s+accurate\b/gi, 'deployment-calibrated'],
  [/\b99\.9%\s+counting\s+accuracy\b/gi, 'deployment-calibrated counting performance'],
  [/\b99\.9%\s+accuracy\b/gi, 'deployment-specific performance'],
  [/99[.,]9%/g, 'deployment-validated'],
  [/\b100%\s+(?:privacy\s+)?regulation\s+compliant\b/gi, 'designed for privacy-conscious deployments'],
  [/\b100%\s+privacy\s+compliance\b/gi, 'privacy-conscious operation'],
  [/\b300\+\s+stores\b/gi, 'retail locations'],
  [/\bIndonesia(?:'s|’s)\s+#1\b/gi, 'Indonesia-focused'],
  [/\bincrease\s+revenue\s+up\s+to\s+40%\b/gi, 'support data-driven operational decisions'],
  [/\bwasting\s+up\s+to\s+30%\s+of\s+labor\s+costs\b/gi, 'creating avoidable labor inefficiency'],
]

export function sanitizePublicClaim(value: string): string {
  return claimReplacements.reduce(
    (output, [pattern, replacement]) => output.replace(pattern, replacement),
    value,
  )
}

export function sanitizePublicContent<T>(value: T): T {
  if (typeof value === 'string') return sanitizePublicClaim(value) as T
  if (Array.isArray(value)) return value.map(sanitizePublicContent) as T
  if (!value || typeof value !== 'object') return value

  return Object.fromEntries(
    Object.entries(value).map(([key, item]) => [key, sanitizePublicContent(item)]),
  ) as T
}
