import { Fragment, useEffect, useRef, useState } from 'react'
import type { Challenge } from '../lib/challenge.ts'
import type { QueryResult, QuerySuccess } from '../lib/duckdb-engine.ts'
import { grade, type GradeFail } from '../lib/grade.ts'
import { useAuth } from '../lib/session.tsx'
import { SqlEditor } from './SqlEditor.tsx'

type EngineStatus = 'loading' | 'ready' | 'error'
type Pending = 'run' | 'submit' | null
type Verdict =
  | { status: 'pass'; awarded: number }
  | { status: 'fail'; grade: GradeFail }

type SqlPlaygroundProps = {
  challenge: Challenge
  density: 'landing' | 'workspace'
}

function formatCount(n: number): string {
  return n.toLocaleString('id-ID')
}

function resultSummary(result: QuerySuccess): string {
  if (result.truncated) {
    return `Menampilkan ${formatCount(result.rowCount)} baris. Sisanya dipotong. · ${result.elapsedMs} ms`
  }
  return `${formatCount(result.rowCount)} baris · ${result.elapsedMs} ms`
}

type LessonRead = {
  opened: number
  hints: { level: number; body?: string }[]
  draft: { sql: string; revision: number } | null
  revision: number
}

type DraftWrite = {
  stored: boolean
  draft: { sql: string; revision: number } | null
  revision: number
}

type SolutionRead = {
  sql: string
  why: string
}

function nextRevision(current: number): number {
  return Math.max(Date.now(), current + 1)
}

function bodiesFrom(hints: { level: number; body?: string }[]): Record<number, string> {
  const bodies: Record<number, string> = {}
  for (const hint of hints) {
    if (typeof hint.body === 'string') bodies[hint.level] = hint.body
  }
  return bodies
}

export function SqlPlayground({ challenge, density }: SqlPlaygroundProps) {
  const { user, ready, progress, openAuth, recordPass, authorized } = useAuth()
  const earned = progress.completions.find((row) => row.slug === challenge.slug)
  const [engine, setEngine] = useState<EngineStatus>('loading')
  const [engineError, setEngineError] = useState<string | null>(null)
  const [pending, setPending] = useState<Pending>(null)
  const [result, setResult] = useState<QueryResult | null>(null)
  const [verdict, setVerdict] = useState<Verdict | null>(null)
  const [askSignIn, setAskSignIn] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [unscored, setUnscored] = useState(false)
  const [boot, setBoot] = useState(0)
  const runningRef = useRef(false)
  const sqlRef = useRef(challenge.starterSql)
  const [seed, setSeed] = useState(challenge.starterSql)
  const [seedKey, setSeedKey] = useState(0)
  const [openedLevel, setOpenedLevel] = useState(0)
  const [hintBodies, setHintBodies] = useState<Record<number, string>>({})
  const [solution, setSolution] = useState<SolutionRead | null>(null)
  const [assistError, setAssistError] = useState<string | null>(null)
  const [draftNote, setDraftNote] = useState<string | null>(null)
  const [confirmReset, setConfirmReset] = useState(false)
  const [hintPending, setHintPending] = useState<number | null>(null)
  const [solutionPending, setSolutionPending] = useState(false)
  const [lessonLoad, setLessonLoad] = useState(0)
  const editGen = useRef(0)
  const revisionRef = useRef(0)
  const pristineSql = useRef(challenge.starterSql)
  const openedRef = useRef(0)
  const ownerRef = useRef<string | null>(null)
  const saveTimer = useRef<number | null>(null)
  const pendingSave = useRef<{ sql: string; gen: number } | null>(null)
  const alive = useRef(true)
  const userRef = useRef(user)
  const slugRef = useRef(challenge.slug)
  const authorizedRef = useRef(authorized)
  userRef.current = user
  slugRef.current = challenge.slug
  authorizedRef.current = authorized

  async function flushSave() {
    const pending = pendingSave.current
    const userId = userRef.current?.id
    if (!pending || !userId) return
    pendingSave.current = null
    const revision = nextRevision(revisionRef.current)
    revisionRef.current = revision
    if (alive.current) setDraftNote('Menyimpan draf…')
    try {
      const saved = await authorizedRef.current<DraftWrite>(`/api/lesson/${slugRef.current}/draft`, {
        method: 'POST',
        body: JSON.stringify({ sql: pending.sql, revision }),
      })
      if (!alive.current || userRef.current?.id !== userId || editGen.current !== pending.gen) return
      if (!saved.stored) revisionRef.current = Math.max(revisionRef.current, saved.revision)
      else pristineSql.current = pending.sql
      setDraftNote(saved.stored ? 'Draf tersimpan' : 'Draf yang lebih baru tetap tersimpan.')
    } catch (error: unknown) {
      if (!alive.current || userRef.current?.id !== userId || editGen.current !== pending.gen) return
      setDraftNote(error instanceof Error ? error.message : 'Draf belum tersimpan.')
    }
  }

  const flushRef = useRef(flushSave)
  flushRef.current = flushSave

  useEffect(() => {
    if (user) setAskSignIn(false)
  }, [user])

  useEffect(() => {
    alive.current = true
    return () => {
      alive.current = false
      if (saveTimer.current != null) window.clearTimeout(saveTimer.current)
      const pending = pendingSave.current
      pendingSave.current = null
      if (!pending || !userRef.current || density !== 'workspace') return
      const revision = nextRevision(revisionRef.current)
      revisionRef.current = revision
      void fetch(`/api/lesson/${slugRef.current}/draft`, {
        method: 'POST',
        credentials: 'include',
        keepalive: true,
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ sql: pending.sql, revision }),
      })
    }
  }, [density])

  useEffect(() => {
    if (density !== 'workspace') return
    if (!user) {
      openedRef.current = 0
      setHintBodies({})
      setOpenedLevel(0)
      setSolution(null)
      setHintPending(null)
      setSolutionPending(false)
      return
    }
    const userId = user.id
    const switching = ownerRef.current != null && ownerRef.current !== userId
    if (switching) {
      if (saveTimer.current != null) window.clearTimeout(saveTimer.current)
      pendingSave.current = null
      editGen.current = 0
      revisionRef.current = 0
      openedRef.current = 0
      sqlRef.current = challenge.starterSql
      pristineSql.current = challenge.starterSql
      setSeed(challenge.starterSql)
      setSeedKey((key) => key + 1)
      setHintBodies({})
      setOpenedLevel(0)
      setSolution(null)
    }
    ownerRef.current = userId
    const genAtFetch = editGen.current
    const sqlAtFetch = sqlRef.current
    const dirtyAtStart = pendingSave.current != null || sqlRef.current !== pristineSql.current
    if (pendingSave.current) {
      if (saveTimer.current != null) window.clearTimeout(saveTimer.current)
      saveTimer.current = window.setTimeout(() => {
        void flushRef.current()
      }, 450)
    }
    let cancelled = false
    void authorized<LessonRead>(`/api/lesson/${challenge.slug}`)
      .then((data) => {
        if (cancelled || userRef.current?.id !== userId || !Array.isArray(data.hints)) return
        if (data.opened >= openedRef.current) {
          openedRef.current = data.opened
          setOpenedLevel(data.opened)
          setHintBodies(bodiesFrom(data.hints))
        }
        const dirty =
          dirtyAtStart || editGen.current !== genAtFetch || sqlRef.current !== sqlAtFetch
        if (dirty) {
          revisionRef.current = Math.max(revisionRef.current, data.revision)
          if (pendingSave.current) void flushRef.current()
          return
        }
        const nextSql = data.draft ? data.draft.sql : challenge.starterSql
        revisionRef.current = data.draft ? data.draft.revision : data.revision
        sqlRef.current = nextSql
        pristineSql.current = nextSql
        setSeed(nextSql)
        setSeedKey((key) => key + 1)
      })
      .catch((error: unknown) => {
        if (cancelled) return
        setAssistError(error instanceof Error ? error.message : 'Bantuan belum terbaca.')
      })
    return () => {
      cancelled = true
    }
  }, [authorized, challenge.slug, density, lessonLoad, user])

  useEffect(() => {
    let cancelled = false

    const start = () => {
      void import('../lib/duckdb-engine.ts')
        .then(async (mod) => {
          await mod.ensureChallengeData(challenge)
          if (!cancelled) {
            setEngine('ready')
            setEngineError(null)
          }
        })
        .catch((error: unknown) => {
          if (cancelled) return
          const detail = error instanceof Error ? error.message : String(error)
          setEngine('error')
          setEngineError(detail)
          setVerdict(null)
          setResult({
            ok: false,
            message: 'Mesin SQL gagal hidup. Tekan Hidupkan lagi, atau muat ulang halaman.',
            detail,
            elapsedMs: 0,
          })
        })
    }

    const idle = window.requestIdleCallback?.(start, { timeout: 400 })
    if (idle == null) {
      const timeoutId = window.setTimeout(start, 0)
      return () => {
        cancelled = true
        window.clearTimeout(timeoutId)
      }
    }
    return () => {
      cancelled = true
      window.cancelIdleCallback?.(idle)
    }
  }, [challenge, boot])

  function onSqlChange(value: string) {
    sqlRef.current = value
    if (density !== 'workspace') return
    editGen.current += 1
    pendingSave.current = { sql: value, gen: editGen.current }
    if (!userRef.current) return
    if (saveTimer.current != null) window.clearTimeout(saveTimer.current)
    saveTimer.current = window.setTimeout(() => {
      void flushRef.current()
    }, 450)
  }

  function askForAccount(message: string) {
    setAssistError(message)
    openAuth()
  }

  async function openHint(level: number) {
    if (!user) {
      askForAccount('Masuk dulu untuk membuka hint.')
      return
    }
    if (level > openedLevel + 1) return
    const userId = user.id
    setHintPending(level)
    setAssistError(null)
    try {
      const data = await authorized<LessonRead>(`/api/lesson/${challenge.slug}/hint`, {
        method: 'POST',
        body: JSON.stringify({ level }),
      })
      if (userRef.current?.id !== userId) return
      if (data.opened < openedRef.current) return
      openedRef.current = data.opened
      setHintBodies(bodiesFrom(data.hints))
      setOpenedLevel(data.opened)
    } catch (error: unknown) {
      if (userRef.current?.id !== userId) return
      setAssistError(error instanceof Error ? error.message : 'Hint belum terbuka.')
    } finally {
      setHintPending((current) => (current === level ? null : current))
    }
  }

  async function openSolution() {
    if (!user) {
      askForAccount('Masuk dulu untuk melihat solusi.')
      return
    }
    const userId = user.id
    setSolutionPending(true)
    setAssistError(null)
    try {
      const data = await authorized<SolutionRead>(`/api/lesson/${challenge.slug}/solution`, {
        method: 'POST',
        body: '{}',
      })
      if (userRef.current?.id !== userId) return
      if (typeof data.sql !== 'string' || typeof data.why !== 'string') {
        throw new Error('Jawaban server tidak lengkap.')
      }
      setSolution({ sql: data.sql, why: data.why })
    } catch (error: unknown) {
      if (userRef.current?.id !== userId) return
      setAssistError(error instanceof Error ? error.message : 'Solusi belum terbuka.')
    } finally {
      setSolutionPending(false)
    }
  }

  async function resetAttempt() {
    if (!user) {
      askForAccount('Masuk dulu untuk mereset percobaan.')
      return
    }
    const userId = user.id
    const previousSql = sqlRef.current
    const previousRevision = revisionRef.current
    const genBefore = editGen.current
    if (saveTimer.current != null) window.clearTimeout(saveTimer.current)
    pendingSave.current = null
    editGen.current += 1
    const gen = editGen.current
    const revision = nextRevision(revisionRef.current)
    revisionRef.current = revision
    sqlRef.current = challenge.starterSql
    setSeed(challenge.starterSql)
    setSeedKey((key) => key + 1)
    setConfirmReset(false)
    setDraftNote('Mereset percobaan…')
    try {
      const saved = await authorized<DraftWrite>(`/api/lesson/${challenge.slug}/reset`, {
        method: 'POST',
        body: JSON.stringify({ revision }),
      })
      if (userRef.current?.id !== userId || editGen.current !== gen) return
      if (!saved.stored) {
        revisionRef.current = Math.max(revisionRef.current, saved.revision)
        setDraftNote('Draf yang lebih baru tetap tersimpan.')
        return
      }
      pristineSql.current = challenge.starterSql
      setDraftNote('Percobaan kembali ke starter.')
    } catch (error: unknown) {
      if (userRef.current?.id !== userId) return
      if (editGen.current === gen) {
        editGen.current = genBefore
        sqlRef.current = previousSql
        revisionRef.current = previousRevision
        setSeed(previousSql)
        setSeedKey((key) => key + 1)
        setLessonLoad((load) => load + 1)
      }
      const message = error instanceof Error ? error.message : 'Reset belum tersimpan.'
      setDraftNote(message)
      setAssistError(message)
    }
  }

  async function execute(intent: 'run' | 'submit') {
    if (engine !== 'ready' || runningRef.current) return
    if (intent === 'submit') {
      if (!ready) return
      if (!user) {
        setAskSignIn(true)
        setVerdict(null)
        setSaveError(null)
        setUnscored(false)
        openAuth()
        return
      }
    }
    runningRef.current = true
    setPending(intent)
    setAskSignIn(false)
    setSaveError(null)
    setUnscored(false)
    setResult(null)
    setVerdict(null)
    try {
      const mod = await import('../lib/duckdb-engine.ts')
      const next = await mod.runQuery(sqlRef.current)
      if (!next.ok || intent === 'run') {
        setResult(next)
        return
      }
      if (!challenge.expected) {
        setResult(next)
        setUnscored(true)
        return
      }
      const graded = grade(next, challenge.expected, {
        requireOrder: challenge.requiresOrder,
      })
      if (!graded.ok) {
        setVerdict({ status: 'fail', grade: graded })
        setResult(next)
        return
      }
      try {
        const awarded = await recordPass(challenge.slug)
        setVerdict({ status: 'pass', awarded })
        setResult(next)
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : 'Jawaban lulus, tetapi progres belum tersimpan. Coba kirim lagi.'
        setSaveError(message)
        setResult(next)
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      setResult({
        ok: false,
        message:
          'Query gagal dijalankan. Muat ulang halaman kalau mesin SQL macet, lalu coba lagi.',
        detail: message,
        elapsedMs: 0,
      })
    } finally {
      runningRef.current = false
      setPending(null)
    }
  }

  function retryEngine() {
    setEngine('loading')
    setEngineError(null)
    setResult(null)
    setVerdict(null)
    setUnscored(false)
    setBoot((n) => n + 1)
  }

  const busy = pending !== null
  const controlsDisabled = engine !== 'ready' || busy
  let runLabel = 'Jalankan query'
  if (engine === 'loading') runLabel = 'Mesin SQL sedang hidup'
  if (engine === 'error') runLabel = 'Mesin SQL gagal hidup'
  if (pending === 'run') runLabel = 'Menjalankan…'
  if (pending === 'submit') runLabel = 'Jalankan query'

  let submitLabel = 'Kirim jawaban'
  if (!ready) submitLabel = 'Sedang memeriksa sesi…'
  if (pending === 'submit') submitLabel = 'Menilai…'

  return (
    <div className={`playground density-${density}`} id="kerja" tabIndex={-1}>
      <aside className="rail" aria-label="Soal dan skema">
        <p className="rail-level">
          {challenge.level}
          {earned ? (
            <span className="rail-done">
              {' '}
              · Selesai · {earned.xpGranted} XP
            </span>
          ) : null}
        </p>
        <h2 className="rail-title">{challenge.title}</h2>
        {challenge.prompt.split('\n\n').map((para) => (
          <p key={para.slice(0, 24)} className="rail-prompt">
            {para}
          </p>
        ))}
        {density === 'workspace' ? (
          <section className="assist" aria-label="Bantuan soal">
            <h3 className="rail-sub">Bantuan</h3>
            {[1, 2, 3].map((level) => {
              const body = user ? hintBodies[level] : undefined
              const open = typeof body === 'string'
              const waiting = Boolean(user) && level > openedLevel + 1
              let label = `Buka hint ${level}`
              if (hintPending === level) label = 'Membuka…'
              else if (waiting) label = 'Buka hint sebelumnya dulu'
              return (
                <div key={level} className="hint" data-open={open ? 'true' : 'false'}>
                  <div className="hint-row">
                    <p className="hint-label">Hint {level}</p>
                    {open ? null : (
                      <button
                        type="button"
                        className="btn-secondary"
                        disabled={!ready || hintPending !== null || waiting}
                        onClick={() => void openHint(level)}
                      >
                        {label}
                      </button>
                    )}
                  </div>
                  {open ? <p className="hint-body">{body}</p> : <p className="hint-closed">Belum dibuka.</p>}
                </div>
              )
            })}
            <div className="hint" data-solution={user && solution ? 'open' : 'closed'}>
              <div className="hint-row">
                <p className="hint-label">Solusi</p>
                {user && solution ? null : (
                  <button
                    type="button"
                    className="btn-secondary"
                    disabled={!ready || solutionPending}
                    onClick={() => void openSolution()}
                  >
                    {solutionPending ? 'Membuka…' : 'Lihat solusi'}
                  </button>
                )}
              </div>
              {user && solution ? (
                <>
                  <pre className="assist-sql">{solution.sql}</pre>
                  <p className="rail-sub">Kenapa</p>
                  <p className="hint-body">{solution.why}</p>
                </>
              ) : (
                <p className="hint-closed">Belum dibuka.</p>
              )}
            </div>
            {assistError ? (
              <p className="assist-note" role="status">
                {assistError}
              </p>
            ) : null}
            {confirmReset ? (
              <div className="reset-confirm">
                <p className="hint-body">Draf soal ini kembali ke starter. Progres tidak hilang.</p>
                <div className="hint-row">
                  <button type="button" className="btn-secondary" onClick={() => void resetAttempt()}>
                    Ya, reset
                  </button>
                  <button type="button" className="btn-secondary" onClick={() => setConfirmReset(false)}>
                    Batal
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                className="btn-secondary"
                disabled={!ready}
                onClick={() => {
                  if (!user) {
                    askForAccount('Masuk dulu untuk mereset percobaan.')
                    return
                  }
                  setConfirmReset(true)
                }}
              >
                Reset percobaan
              </button>
            )}
            <p className="hint-closed">
              Reset hanya mengembalikan editor soal ini. Selesai dan hint tidak dihapus.
            </p>
          </section>
        ) : null}
        {challenge.tables.map((table) => (
          <Fragment key={table.name}>
            <h3 className="rail-sub">Skema · {table.name}</h3>
            <table className="schema-table">
              <thead>
                <tr>
                  <th>Kolom</th>
                  <th>Tipe</th>
                  <th>Contoh</th>
                </tr>
              </thead>
              <tbody>
                {table.columns.map((col) => (
                  <tr key={col.name}>
                    <td>
                      <code>{col.name}</code>
                    </td>
                    <td>
                      <code>{col.type}</code>
                    </td>
                    <td>{col.sample}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <h3 className="rail-sub">Cuplikan baris · {table.name}</h3>
            <div className="sample-wrap">
              <table className="sample-table">
                <thead>
                  <tr>
                    {table.columns.map((col) => (
                      <th key={col.name}>
                        <code>{col.name}</code>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {table.sampleRows.map((row, rowIndex) => (
                    <tr key={`${rowIndex}:${row.join('\0')}`}>
                      {row.map((cell, i) => (
                        <td key={table.columns[i]?.name ?? i}>{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Fragment>
        ))}
      </aside>

      <div className="stage">
        <section className="editor-panel" aria-label="Editor SQL">
          <div className="editor-toolbar">
            <div className="toolbar-group">
              <button
                type="button"
                className="btn-run"
                aria-keyshortcuts="Control+Enter"
                onClick={() => void execute('run')}
                disabled={controlsDisabled}
              >
                {runLabel}
              </button>
              <span className="shortcut">Ctrl+Enter</span>
            </div>
            <div className="toolbar-group">
              <button
                type="button"
                className="btn-secondary"
                aria-keyshortcuts="Control+Shift+Enter"
                onClick={() => void execute('submit')}
                disabled={controlsDisabled || !ready}
              >
                {submitLabel}
              </button>
              <span className="shortcut">Ctrl+Shift+Enter</span>
            </div>
            {engine === 'error' ? (
              <button type="button" className="btn-secondary" onClick={retryEngine}>
                Hidupkan lagi
              </button>
            ) : null}
            {density === 'workspace' && draftNote ? (
              <span className="draft-note" role="status">
                {draftNote}
              </span>
            ) : null}
          </div>
          <SqlEditor
            key={`${challenge.slug}:${seedKey}`}
            initialDoc={seed}
            onChange={onSqlChange}
            onRun={() => void execute('run')}
            onSubmit={() => void execute('submit')}
          />
        </section>

        <ResultsZone
          result={result}
          pending={pending}
          engineError={engineError}
          verdict={verdict}
          askSignIn={askSignIn}
          saveError={saveError}
          unscored={unscored}
          onSignIn={openAuth}
          density={density}
        />
      </div>
    </div>
  )
}

function ResultsZone({
  result,
  pending,
  engineError,
  verdict,
  askSignIn,
  saveError,
  unscored,
  onSignIn,
  density,
}: {
  result: QueryResult | null
  pending: Pending
  engineError: string | null
  verdict: Verdict | null
  askSignIn: boolean
  saveError: string | null
  unscored: boolean
  onSignIn: () => void
  density: 'landing' | 'workspace'
}) {
  if (pending) {
    return (
      <div className="results-quiet" aria-live="polite" aria-busy="true">
        {pending === 'submit' ? 'Menilai jawaban…' : 'Menjalankan query…'}
      </div>
    )
  }

  if (askSignIn) {
    return (
      <div className="results-panel" role="status">
        <p className="results-message">
          Masuk dulu untuk menyimpan jawaban dan XP. Query di editor tetap di sini.
        </p>
        <button type="button" className="btn-secondary results-follow" onClick={onSignIn}>
          Masuk
        </button>
      </div>
    )
  }

  if (saveError) {
    return (
      <div className="results-panel is-error" role="alert">
        <p className="results-message">{saveError}</p>
        {result?.ok ? <ResultTable result={result} /> : null}
      </div>
    )
  }

  if (!result) {
    return (
      <div className="results-quiet" aria-live="polite">
        Belum ada hasil. Tulis query, lalu tekan Jalankan query atau Kirim jawaban.
      </div>
    )
  }

  if (!result.ok) {
    return (
      <div className="results-panel is-error" role="alert">
        <p className="results-message">{result.message}</p>
        {result.detail ?? engineError ? (
          <pre className="results-detail">{result.detail ?? engineError}</pre>
        ) : null}
        {result.elapsedMs > 0 ? (
          <p className="results-meta">{result.elapsedMs} ms</p>
        ) : null}
      </div>
    )
  }

  if (unscored) {
    return (
      <div className="results-panel" aria-live="polite">
        <p className="results-message">
          Soal ini belum punya kunci jawaban, jadi belum ditandai selesai.
        </p>
        <ResultTable result={result} />
      </div>
    )
  }

  if (verdict?.status === 'fail') {
    const showActual = !verdict.grade.diffs?.length
    return (
      <div className="results-panel is-error" role="alert">
        <GradeFailView grade={verdict.grade} />
        {showActual ? (
          <ResultTable result={result} />
        ) : (
          <p className="results-meta">{resultSummary(result)}</p>
        )}
      </div>
    )
  }

  const passAward = verdict?.status === 'pass' ? verdict.awarded : null
  return (
    <div className={`results-panel${passAward !== null ? ' is-pass' : ''}`} aria-live="polite">
      {passAward !== null && density === 'landing' ? (
        <p className="pass-badge">
          Lulus · {passAward > 0 ? `+${passAward} XP` : '+0 XP'}
        </p>
      ) : null}
      {passAward !== null && density === 'workspace' ? (
        <>
          <p className="grade-cap">Sempurna!</p>
          <p className="grade-xp">
            {passAward > 0 ? `+${passAward} XP` : 'Sudah selesai · +0 XP'}
          </p>
        </>
      ) : null}
      <ResultTable result={result} />
    </div>
  )
}

function GradeFailView({ grade }: { grade: GradeFail }) {
  return (
    <>
      <p className="results-message">{grade.message}</p>
      {grade.missingColumns?.length ? (
        <p className="results-meta">
          Kurang:{' '}
          {grade.missingColumns.map((name, i) => (
            <span key={name}>
              {i > 0 ? ', ' : ''}
              <code>{name}</code>
            </span>
          ))}
        </p>
      ) : null}
      {grade.extraColumns?.length ? (
        <p className="results-meta">
          Kelebihan:{' '}
          {grade.extraColumns.map((name, i) => (
            <span key={name}>
              {i > 0 ? ', ' : ''}
              <code>{name}</code>
            </span>
          ))}
        </p>
      ) : null}
      {grade.diffs && grade.diffs.length > 0 ? (
        <div className="result-table-wrap">
          <table className="diff-table">
            <thead>
              <tr>
                <th>Baris</th>
                <th>Kolom</th>
                <th>Diharapkan</th>
                <th>Hasilmu</th>
              </tr>
            </thead>
            <tbody>
              {grade.diffs.map((diff, i) => (
                <tr key={`${diff.row}-${diff.column}-${i}`}>
                  <td>{diff.row}</td>
                  <td>
                    <code>{diff.column}</code>
                  </td>
                  <td>{diff.expected}</td>
                  <td>{diff.actual}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
      {grade.truncated ? (
        <p className="results-meta">Menampilkan 5 perbedaan pertama.</p>
      ) : null}
    </>
  )
}

function ResultTable({ result }: { result: QuerySuccess }) {
  return (
    <>
      <p className="results-meta">{resultSummary(result)}</p>
      {result.columns.length === 0 ? (
        <p className="results-message">Query selesai tanpa kolom hasil.</p>
      ) : (
        <div className="result-table-wrap">
          <table className="result-table">
            <thead>
              <tr>
                {result.columns.map((col) => (
                  <th key={col} scope="col">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {result.rows.length === 0 ? (
                <tr>
                  <td colSpan={result.columns.length}>Tidak ada baris.</td>
                </tr>
              ) : (
                result.rows.map((row, i) => (
                  <tr key={i}>
                    {row.map((cell, j) => (
                      <td key={result.columns[j] ?? j}>{cell}</td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}

