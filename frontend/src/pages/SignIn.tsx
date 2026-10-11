import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../lib/session.tsx'
import { CATALOG_PATH } from '../lib/challenge.ts'

export function SignIn() {
  const { user, openAuth } = useAuth()

  useEffect(() => {
    document.title = 'Masuk · kulaSQL'
  }, [])

  return (
    <main className="prose-page">
      <h1 id="isi" tabIndex={-1}>
        Masuk
      </h1>
      {user ? (
        <p>
          Kamu sudah masuk. Latihan tetap di <Link to={CATALOG_PATH}>Tantangan</Link>.
        </p>
      ) : (
        <>
          <p>
            Masuk dengan email atau Google kalau progres ingin tersimpan. Melihat halaman
            ini tidak mengharuskan akun.
          </p>
          <button type="button" className="btn-secondary" onClick={openAuth}>
            Buka formulir masuk
          </button>
        </>
      )}
    </main>
  )
}
