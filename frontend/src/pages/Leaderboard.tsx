import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { CATALOG_PATH } from '../lib/challenge.ts'
import { useAuth } from '../lib/session.tsx'

type BoardRow = {
  rank: number
  name: string
  xp: number
  level: number
  you: boolean
}

export function Leaderboard() {
  const { user, progress, ready } = useAuth()
  const [rows, setRows] = useState<BoardRow[] | null>(null)
  const [forUser, setForUser] = useState<string | null>(null)
  const [error, setError] = useState(false)
  const [reload, setReload] = useState(0)
  const [shareNote, setShareNote] = useState<string | null>(null)
  const [sharing, setSharing] = useState(false)
  const userId = user?.id ?? null

  useEffect(() => {
    document.title = 'Papan peringkat · kulaSQL'
  }, [])

  useEffect(() => {
    setShareNote(null)
    setSharing(false)
  }, [userId])

  useEffect(() => {
    if (!ready) return
    let cancelled = false
    const requestedFor = userId
    void (async () => {
      try {
        const response = await fetch('/api/leaderboard', {
          credentials: 'include',
          cache: 'no-store',
        })
        const body: unknown = await response.json().catch(() => null)
        if (cancelled) return
        const next =
          response.ok &&
          typeof body === 'object' &&
          body !== null &&
          'rows' in body &&
          Array.isArray(body.rows)
            ? (body.rows as BoardRow[])
            : null
        if (!next) {
          setError(true)
          return
        }
        setError(false)
        setForUser(requestedFor)
        setRows(next)
      } catch {
        if (cancelled) return
        setError(true)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [ready, userId, reload])

  async function onShare() {
    if (sharing) return
    const text = `Saya di Level ${progress.level} dengan ${progress.xp} XP di kulaSQL.`
    setSharing(true)
    try {
      if (typeof navigator.share === 'function') {
        try {
          await navigator.share({ text })
          return
        } catch (caught) {
          if (caught instanceof DOMException && caught.name === 'AbortError') return
        }
      }
      try {
        await navigator.clipboard.writeText(text)
        setShareNote('Tersalin.')
      } catch {
        setShareNote('Belum tersalin. Coba lagi.')
      }
    } finally {
      setSharing(false)
    }
  }

  return (
    <main className="board-page">
      <h1>Papan peringkat</h1>
      <p className="board-lede">
        Diurutkan dari XP. Kalau XP-nya sama, yang lebih dulu selesai di atas.
        {ready && !user ? ' Bisa dibaca tanpa masuk.' : ''}
      </p>
      {ready && user ? (
        <div className="board-self">
          <p>
            Kamu di Level {progress.level} dengan <span className="board-xp">{progress.xp} XP</span>.
          </p>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => void onShare()}
            disabled={sharing}
          >
            Bagikan pencapaian
          </button>
          {shareNote ? (
            <p className="board-status" role="status">
              {shareNote}
            </p>
          ) : null}
        </div>
      ) : null}
      <div id="papan" tabIndex={-1}>
        {rows === null && !error ? (
          <p className="board-status" role="status">
            Memuat papan…
          </p>
        ) : null}
        {error ? (
          <>
            <p className="board-error" role="alert">
              Papan belum terbaca.
            </p>
            <button type="button" className="btn-secondary" onClick={() => setReload((n) => n + 1)}>
              Coba lagi
            </button>
          </>
        ) : null}
        {rows && rows.length === 0 && !error ? (
          <p className="board-empty">
            Belum ada yang masuk papan. <Link to={CATALOG_PATH}>Selesaikan satu soal</Link> dulu.
          </p>
        ) : null}
        {rows && rows.length > 0 ? (
          <ol className="board-list" aria-label="Peringkat">
            {rows.map((row) => {
              const mine = Boolean(user && forUser === user.id && row.you)
              return (
                <li
                  className="board-row"
                  data-you={mine ? 'true' : undefined}
                  key={`${row.rank}-${row.name}-${row.xp}`}
                >
                  <span className="board-rank">{row.rank}</span>
                  <span className="board-name">
                    {row.name}
                    {mine ? <span className="board-you-mark">kamu</span> : null}
                  </span>
                  <span className="board-meta">
                    <span>Level {row.level}</span>
                    <span className="board-xp">{row.xp} XP</span>
                  </span>
                </li>
              )
            })}
          </ol>
        ) : null}
      </div>
    </main>
  )
}
