import Image from 'next/image'
import { getDemoWalkthroughCopy } from '@/lib/i18n/demo-walkthrough'

export function DemoWalkthrough({ locale }: { locale: string }) {
  const copy = getDemoWalkthroughCopy(locale)

  return (
    <aside className="demo-walkthrough" id="demo-walkthrough" aria-labelledby="demo-walkthrough-title">
      <p className="home-data-label">{copy.eyebrow}</p>
      <h2 id="demo-walkthrough-title" className="demo-walkthrough__title">{copy.title}</h2>
      <p className="demo-walkthrough__lead">{copy.description}</p>

      <figure className="demo-walkthrough__figure">
        <div className="demo-walkthrough__still editorial-media">
          <Image
            src={copy.stillSrc}
            alt={copy.stillAlt}
            width={1248}
            height={832}
            sizes="(min-width: 1024px) 28vw, 100vw"
          />
          <span className="demo-walkthrough__stamp">{locale === 'id' ? 'Sampel konseptual' : 'Conceptual sample'}</span>
        </div>
        <figcaption>{copy.stillCaption}</figcaption>
      </figure>

      <details className="demo-walkthrough__transcript">
        <summary>
          <span>{copy.transcriptLabel}</span>
          <span className="demo-walkthrough__hint">{copy.transcriptHint}</span>
        </summary>
        <ol>
          {copy.beats.map((beat) => (
            <li key={beat.time}>
              <span className="demo-walkthrough__time">{beat.time}</span>
              <div>
                <strong>{beat.title}</strong>
                <p>{beat.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </details>
    </aside>
  )
}
