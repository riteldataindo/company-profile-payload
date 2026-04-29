'use client'

interface ClientLogo {
  id: string
  companyName: string
  logo?: { url: string }
}

interface ClientLogosProps {
  logos?: ClientLogo[]
}

const placeholders = Array.from({ length: 12 }, (_, i) => ({
  id: `placeholder-${i}`,
  companyName: `Client ${i + 1}`,
}))

export function ClientLogos({ logos }: ClientLogosProps) {
  const items = logos && logos.length > 0 ? logos : placeholders

  return (
    <div className="mt-12">
      <div
        className="flex gap-12 overflow-hidden"
        style={{
          maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
          WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
        }}
      >
        {[0, 1].map((set) => (
          <div
            key={set}
            className="flex shrink-0 gap-12"
            style={{ animation: 'scroll-logos 30s linear infinite' }}
            aria-hidden={set === 1}
          >
            {items.map((item, i) => (
              <div
                key={`${set}-${item.id}`}
                className="flex h-12 w-[120px] shrink-0 items-center justify-center rounded-lg bg-bg-card opacity-50 transition-opacity hover:opacity-100"
              >
                {item.logo?.url ? (
                  <img
                    src={item.logo.url}
                    alt={item.companyName}
                    className="h-8 w-auto max-w-[100px] object-contain grayscale transition-all hover:grayscale-0"
                  />
                ) : (
                  <span className="text-xs font-semibold uppercase tracking-wider text-text-muted">
                    {item.companyName}
                  </span>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
      <style>{`@keyframes scroll-logos { to { transform: translateX(-50%); } }`}</style>
    </div>
  )
}
