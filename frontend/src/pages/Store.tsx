import { useEffect } from 'react'
import { CHEATSHEET } from '../lib/store.ts'

export function Store() {
  useEffect(() => {
    document.title = 'Store · kulaSQL'
  }, [])

  return (
    <main className="prose-page">
      <h1 id="isi" tabIndex={-1}>
        {CHEATSHEET.title}
      </h1>
      <p>
        {CHEATSHEET.mark}. {CHEATSHEET.intro}
      </p>
      {CHEATSHEET.sections.map((section) => (
        <section key={section.title}>
          <h2>{section.title}</h2>
          <p>{section.note}</p>
          <pre className="sheet-sql">
            <code>{section.sql}</code>
          </pre>
        </section>
      ))}
    </main>
  )
}
