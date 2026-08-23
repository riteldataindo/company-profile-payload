import { getScopeCompareCopy } from '@/lib/i18n/scope-compare'

export function ScopeCompareTable({ locale }: { locale: string }) {
  const copy = getScopeCompareCopy(locale)

  return (
    <section className="scope-compare" aria-labelledby="scope-compare-title">
      <div className="scope-compare__intro">
        <p className="home-data-label">{copy.eyebrow}</p>
        <h2 id="scope-compare-title" className="scope-compare__title">{copy.title}</h2>
        <p className="scope-compare__lead">{copy.description}</p>
      </div>

      <div className="scope-compare__frame">
        <table className="scope-compare__table">
          <caption className="sr-only">{copy.title}</caption>
          <thead>
            <tr>
              <th scope="col">{locale === 'id' ? 'Lingkup' : 'Scope'}</th>
              <th scope="col">{copy.columns.coverage}</th>
              <th scope="col">{copy.columns.prerequisite}</th>
              <th scope="col">{copy.columns.output}</th>
              <th scope="col">{copy.columns.limitation}</th>
            </tr>
          </thead>
          <tbody>
            {copy.rows.map((row) => (
              <tr key={row.id}>
                <th scope="row">{row.label}</th>
                <td>{row.coverage}</td>
                <td>{row.prerequisite}</td>
                <td>{row.output}</td>
                <td>{row.limitation}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="scope-compare__caption">{copy.caption}</p>
    </section>
  )
}
