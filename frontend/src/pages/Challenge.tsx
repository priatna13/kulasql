import { useEffect } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { SqlPlayground } from '../components/SqlPlayground.tsx'
import { CATALOG_PATH, challengeBySlug } from '../lib/challenge.ts'

export function Challenge() {
  const { slug = '' } = useParams()
  const { search } = useLocation()
  const challenge = challengeBySlug(slug)
  const back = { pathname: CATALOG_PATH, search }

  useEffect(() => {
    document.title = challenge
      ? `${challenge.title} · kulaSQL`
      : 'Tantangan · kulaSQL'
  }, [challenge])

  if (!challenge) {
    return (
      <main className="workspace-page">
        <p className="missing">
          Tantangan itu belum ada. <Link to={back}>Kembali ke katalog</Link>
        </p>
      </main>
    )
  }

  return (
    <main className="workspace-page">
      <p className="back-row">
        <Link to={back}>Kembali ke katalog</Link>
      </p>
      <h1 className="visually-hidden">{challenge.title}</h1>
      <SqlPlayground key={challenge.slug} challenge={challenge} density="workspace" />
    </main>
  )
}
