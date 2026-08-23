import Image from 'next/image'

export interface ClientLogoItem {
  alt: string
  darkUrl?: string
  height: number
  id: number | string
  url: string
  width: number
}

interface ClientLogoRailProps {
  locale: string
  logos: ClientLogoItem[]
}

function LogoList({ logos }: { logos: ClientLogoItem[] }) {
  return (
    <ul className="client-logo-rail__group">
      {logos.map((logo) => (
        <li className="client-logo-rail__item" key={logo.id}>
          <Image
            alt={logo.alt}
            className={logo.darkUrl ? 'client-logo-rail__image client-logo-rail__image--light' : 'client-logo-rail__image'}
            height={logo.height}
            sizes="160px"
            src={logo.url}
            width={logo.width}
          />
          {logo.darkUrl && (
            <Image
              alt=""
              aria-hidden="true"
              className="client-logo-rail__image client-logo-rail__image--dark"
              height={logo.height}
              sizes="160px"
              src={logo.darkUrl}
              width={logo.width}
            />
          )}
        </li>
      ))}
    </ul>
  )
}

export function ClientLogoRail({ locale, logos }: ClientLogoRailProps) {
  const isId = locale === 'id'

  if (logos.length < 2) return null

  return (
    <section className="client-logo-rail" aria-labelledby="client-logo-rail-title">
      <div className="client-logo-rail__header">
        <div>
          <p className="home-data-label">{isId ? 'REKAM JEJAK TERVERIFIKASI' : 'VERIFIED CLIENT RECORDS'}</p>
          <h3 id="client-logo-rail-title">{isId ? 'Brand yang sudah disetujui untuk ditampilkan.' : 'Brands approved for public display.'}</h3>
        </div>
      </div>

      <div className="client-logo-rail__viewport">
        <LogoList logos={logos} />
      </div>
    </section>
  )
}
