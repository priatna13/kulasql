import { useEffect, useId, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../lib/session.tsx'

type Mode = 'masuk' | 'daftar'

export function AuthPanel() {
  const { authOpen, user, closeAuth, login, register } = useAuth()
  const [mode, setMode] = useState<Mode>('daftar')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [birthDate, setBirthDate] = useState('')
  const [tosAccepted, setTosAccepted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)
  const titleId = useId()

  useEffect(() => {
    if (!authOpen) return
    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') closeAuth()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [authOpen, closeAuth])

  if (!authOpen || user) return null

  function switchMode(next: Mode) {
    setMode(next)
    setError(null)
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (pending) return
    setPending(true)
    setError(null)
    try {
      if (mode === 'daftar') {
        await register({ email, password, birthDate, tosAccepted })
      } else {
        await login(email, password)
      }
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Ada yang macet. Coba lagi.')
    } finally {
      setPending(false)
    }
  }

  return (
    <div className="auth-panel" role="dialog" aria-labelledby={titleId}>
      <div className="auth-head">
        <h2 id={titleId}>{mode === 'daftar' ? 'Buat akun' : 'Masuk'}</h2>
        <button type="button" className="auth-close" onClick={closeAuth}>
          Tutup
        </button>
      </div>
      {mode === 'daftar' ? (
        <p className="auth-rule">
          Akun untuk yang sudah 13 tahun. Baca syarat akun sebelum daftar.
        </p>
      ) : (
        <p className="auth-rule">
          Progres dan XP nempel di akun. Jalankan query tetap bisa tanpa masuk.
        </p>
      )}
      <a
        className="auth-google"
        href={`/api/auth/google?next=${encodeURIComponent(`${window.location.pathname}${window.location.search}`)}`}
      >
        Masuk dengan Google
      </a>
      <p className="auth-rule">
        Google langsung masuk. Tanggal lahir hanya untuk daftar dengan kata sandi.
      </p>
      <form onSubmit={(event) => void onSubmit(event)}>
        <div className="auth-field">
          <label htmlFor="auth-email">Email</label>
          <input
            id="auth-email"
            name="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </div>
        <div className="auth-field">
          <label htmlFor="auth-password">Kata sandi</label>
          <input
            id="auth-password"
            name="password"
            type="password"
            autoComplete={mode === 'daftar' ? 'new-password' : 'current-password'}
            minLength={8}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </div>
        {mode === 'daftar' ? (
          <>
            <div className="auth-field">
              <label htmlFor="auth-birth">Tanggal lahir</label>
              <input
                id="auth-birth"
                name="bday"
                type="date"
                autoComplete="bday"
                value={birthDate}
                onChange={(event) => setBirthDate(event.target.value)}
                required
              />
            </div>
            <label className="auth-check">
              <input
                type="checkbox"
                name="tos"
                checked={tosAccepted}
                onChange={(event) => setTosAccepted(event.target.checked)}
                required
              />
              <span>Saya setuju dengan syarat akun.</span>
            </label>
            <p className="auth-rule">
              <Link to="/kulasql/syarat" target="_blank" rel="noreferrer">
                Baca syarat akun
              </Link>
            </p>
          </>
        ) : null}
        {error ? (
          <p className="auth-error" role="alert">
            {error}
          </p>
        ) : null}
        <button type="submit" className="btn-secondary auth-submit" disabled={pending}>
          {pending ? 'Sebentar…' : mode === 'daftar' ? 'Buat akun' : 'Masuk'}
        </button>
      </form>
      {mode === 'daftar' ? (
        <p className="auth-switch">
          Sudah punya akun?
          <button type="button" onClick={() => switchMode('masuk')}>
            Masuk
          </button>
        </p>
      ) : (
        <p className="auth-switch">
          Belum punya akun?
          <button type="button" onClick={() => switchMode('daftar')}>
            Daftar
          </button>
        </p>
      )}
    </div>
  )
}
