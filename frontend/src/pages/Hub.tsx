import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { HUB_ENTRIES } from '../lib/surfaces.ts'

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function Hub() {
  const [address, setAddress] = useState('')
  const [phase, setPhase] = useState<'idle' | 'saving' | 'done' | 'error'>('idle')
  const [notice, setNotice] = useState<string | null>(null)
  const attempt = useRef(0)

  useEffect(() => {
    document.title = 'kulaSQL'
  }, [])

  async function onWaitlist(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const current = attempt.current + 1
    attempt.current = current
    const email = address.trim().toLowerCase()
    if (email.length > 254 || !EMAIL.test(email)) {
      setPhase('error')
      setNotice('Email tidak valid.')
      return
    }

    setPhase('saving')
    setNotice(null)
    try {
      const response = await fetch('/api/kelas-data', {
        method: 'POST',
        credentials: 'include',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      let payload: unknown = null
      try {
        payload = await response.json()
      } catch {
        payload = null
      }
      if (attempt.current !== current) return
      const saved =
        response.ok &&
        typeof payload === 'object' &&
        payload !== null &&
        'ok' in payload &&
        payload.ok === true
      if (!saved) {
        setPhase('error')
        setNotice('Daftar tunggu belum tersimpan. Coba lagi.')
        return
      }
      setPhase('done')
      setNotice('Kamu masuk daftar tunggu Kelas Data.')
    } catch {
      if (attempt.current !== current) return
      setPhase('error')
      setNotice('Daftar tunggu belum tersimpan. Coba lagi.')
    }
  }

  return (
    <main className="prose-page">
      <h1 id="isi" tabIndex={-1}>
        Pilih pintu yang kamu butuhkan
      </h1>
      <p>
        SQL, spreadsheet, dataset, atau jawaban singkat. Halaman ini bisa dibaca tanpa membuat
        akun.
      </p>
      <ul>
        {HUB_ENTRIES.map((entry) => (
          <li key={entry.name}>
            {entry.href.startsWith('#') ? (
              <a href={entry.href}>{entry.name}</a>
            ) : (
              <Link to={entry.href}>{entry.name}</Link>
            )}
            {' — '}
            {entry.note}
          </li>
        ))}
      </ul>

      <section id="faq" aria-labelledby="faq-judul">
        <h2 id="faq-judul">FAQ</h2>
        <h3>Harus daftar dulu?</h3>
        <p>Tidak. Soal Mudah tetap bisa dijalankan tanpa akun. Akun hanya menyimpan progres.</p>
        <h3>Spreadsheet minta akun lain?</h3>
        <p>Tidak. Pintunya ada di sini, satu ekosistem dengan latihan SQL.</p>
        <h3>Warmindo Lite di mana?</h3>
        <p>
          Di <Link to="/dataset">Dataset</Link>. Filenya gratis.
        </p>
        <h3>Cheatsheet di mana?</h3>
        <p>
          <Link to="/store">Store</Link> menyimpan SQL Fundamental Cheatsheet, gratis.
        </p>
      </section>

      <section id="kelas-data" aria-labelledby="kelas-judul">
        <h2 id="kelas-judul">Kelas Data</h2>
        <p>
          Segera hadir. Video praktisi belum dibuka. Mengisi daftar tunggu tidak mengubah
          Tantangan yang sudah bisa dikerjakan.
        </p>
        <form onSubmit={(event) => void onWaitlist(event)} noValidate>
          <div className="auth-field">
            <label htmlFor="kelas-email">Email</label>
            <input
              id="kelas-email"
              name="email"
              type="email"
              autoComplete="email"
              value={address}
              onChange={(event) => setAddress(event.target.value)}
              disabled={phase === 'saving'}
            />
          </div>
          <button type="submit" className="btn-secondary" disabled={phase === 'saving'}>
            {phase === 'saving' ? 'Menyimpan…' : 'Masuk daftar tunggu'}
          </button>
          {notice ? (
            <p className="form-status" data-state={phase === 'error' ? 'error' : 'ok'} role={phase === 'error' ? 'alert' : 'status'}>
              {notice}
            </p>
          ) : null}
        </form>
      </section>
    </main>
  )
}
