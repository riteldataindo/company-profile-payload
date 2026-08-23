import type { TrustDiagramStep } from '@/lib/i18n/trust-copy'

interface TrustDiagramProps {
  title: string
  caption: string
  steps: TrustDiagramStep[]
}

export function TrustDiagram({ title, caption, steps }: TrustDiagramProps) {
  const titleId = `trust-diagram-${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`

  return (
    <figure
      className="border-y border-border-default py-8"
      aria-labelledby={titleId}
    >
      <h2 id={titleId} className="mb-6 text-xl font-bold tracking-tight md:text-2xl">
        {title}
      </h2>
      <ol className="grid md:grid-cols-4">
        {steps.map((step, index) => (
          <li key={step.title} className="relative flex min-h-full flex-col border-t border-border-subtle py-5 md:border-t-0 md:border-l md:px-5 md:first:border-l-0 md:first:pl-0 md:last:pr-0">
            <div className="mb-4 flex items-center justify-between gap-3">
              <span className="font-mono text-xs font-semibold tracking-[0.18em] text-primary-600" aria-hidden="true">
                {String(index + 1).padStart(2, '0')}
              </span>
              {index < steps.length - 1 && (
                <span className="hidden text-lg text-text-muted md:block" aria-hidden="true">
                  →
                </span>
              )}
            </div>
            <h3 className="mb-2 text-base font-semibold">{step.title}</h3>
            <p className="text-sm leading-relaxed text-text-secondary">{step.body}</p>
          </li>
        ))}
      </ol>
      <figcaption className="mt-2 border-t border-border-subtle pt-4 text-sm leading-relaxed text-text-muted">
        {caption}
      </figcaption>
    </figure>
  )
}
