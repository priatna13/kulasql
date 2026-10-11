import { useEffect, useMemo } from 'react'
import { Link, useLocation, useSearchParams } from 'react-router-dom'
import { useAuth } from '../lib/session.tsx'
import {
  CATALOG_PATH,
  catalogQuery,
  CHALLENGES,
  LEVELS,
  listChallenges,
  PAGE_SIZE,
  pageOf,
  type CatalogQuery,
} from '../lib/challenge.ts'

type CatalogView = CatalogQuery & { page: number }

const CATEGORIES = [...new Set(CHALLENGES.map((item) => item.category))]

const TAGS = (() => {
  const counts = new Map<string, number>()
  for (const item of CHALLENGES) {
    for (const tag of item.tags) counts.set(tag, (counts.get(tag) ?? 0) + 1)
  }
  return [...counts.entries()].sort(
    (a, b) => b[1] - a[1] || a[0].localeCompare(b[0], 'id'),
  )
})()

function readView(params: URLSearchParams): CatalogView {
  const pageRaw = Number(params.get('halaman'))
  return {
    ...catalogQuery({
      tingkat: params.get('tingkat'),
      kategori: params.get('kategori'),
      status: params.get('status'),
      tag: params.get('tag'),
      q: params.get('q'),
    }),
    page: Number.isInteger(pageRaw) && pageRaw > 0 ? pageRaw : 1,
  }
}

function toParams(view: CatalogView): URLSearchParams {
  const params = new URLSearchParams()
  if (view.level) params.set('tingkat', view.level)
  if (view.category) params.set('kategori', view.category)
  if (view.status) params.set('status', view.status)
  if (view.tag) params.set('tag', view.tag)
  if (view.q) params.set('q', view.q)
  if (view.page > 1) params.set('halaman', String(view.page))
  return params
}

export function Catalog() {
  const { progress, ready } = useAuth()
  const { search } = useLocation()
  const [params, setParams] = useSearchParams()
  const view = readView(params)
  const completed = useMemo(
    () => new Set(progress.completions.map((row) => row.slug)),
    [progress.completions],
  )
  const matches = listChallenges(view, completed)
  const pages = Math.max(1, Math.ceil(matches.length / PAGE_SIZE))
  const page = Math.min(view.page, pages)
  const rows = pageOf(matches, page)
  const done = CHALLENGES.filter((item) => completed.has(item.slug)).length
  const total = CHALLENGES.length
  const percent = total === 0 ? 0 : Math.round((done / total) * 100)
  const from = rows.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1
  const to = from === 0 ? 0 : from + rows.length - 1
  const filtered = Boolean(view.level || view.category || view.status || view.tag || view.q.trim())
  const statusPending = !ready && view.status != null

  useEffect(() => {
    document.title = 'Tantangan · kulaSQL'
  }, [])

  useEffect(() => {
    if (view.page === page) return
    const next = new URLSearchParams(params)
    if (page <= 1) next.delete('halaman')
    else next.set('halaman', String(page))
    setParams(next, { replace: true })
  }, [view.page, page, params, setParams])

  function patch(partial: Partial<CatalogView>, resetPage = true) {
    setParams(() => {
      // The updater argument is the last render, so a second change in the same turn would drop a param already written to the URL.
      const current = readView(new URLSearchParams(window.location.search))
      return toParams({
        ...current,
        ...partial,
        page: resetPage ? 1 : (partial.page ?? current.page),
      })
    }, { replace: true })
  }

  return (
    <main className="catalog-page">
      <h1>Tantangan</h1>
      <div className="catalog-layout">
        <aside className="rail catalog-rail" aria-label="Filter dan progres">
          <p className="catalog-score">
            {ready ? `${done}/${total} selesai · ${percent}%` : 'Memeriksa progres…'}
          </p>
          {LEVELS.map((level) => {
            const levelTotal = CHALLENGES.filter((item) => item.level === level).length
            const levelDone = CHALLENGES.filter(
              (item) => item.level === level && completed.has(item.slug),
            ).length
            const width = levelTotal === 0 ? 0 : (levelDone / levelTotal) * 100
            return (
              <div className="level-row" key={level}>
                <div className="level-row-text">
                  <span>{level}</span>
                  <span>{ready ? `${levelDone}/${levelTotal}` : '…'}</span>
                </div>
                <div className="level-track" aria-hidden="true">
                  <span style={{ width: `${width}%` }} />
                </div>
              </div>
            )
          })}

          <label className="catalog-field">
            <span className="catalog-label">Tingkat</span>
            <select
              value={view.level ?? ''}
              onChange={(event) => {
                patch({ level: LEVELS.find((item) => item === event.target.value) ?? null })
              }}
            >
              <option value="">Semua tingkat</option>
              {LEVELS.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
          </label>

          <label className="catalog-field">
            <span className="catalog-label">Kategori</span>
            <select
              value={view.category ?? ''}
              onChange={(event) => patch({ category: event.target.value || null })}
            >
              <option value="">Semua kategori</option>
              {CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </label>

          <label className="catalog-field">
            <span className="catalog-label">Status</span>
            <select
              value={view.status ?? ''}
              onChange={(event) => {
                const value = event.target.value
                const status = value === 'belum' || value === 'selesai' ? value : null
                patch({ status })
              }}
            >
              <option value="">Semua status</option>
              <option value="belum">belum dikerjakan</option>
              <option value="selesai">selesai</option>
            </select>
          </label>

          <label className="catalog-field">
            <span className="catalog-label">Cari tantangan...</span>
            <input
              type="text"
              value={view.q}
              placeholder="Cari tantangan..."
              onChange={(event) => patch({ q: event.target.value })}
              autoComplete="off"
            />
          </label>

          <p className="catalog-label" id="tag-label">
            Tag
          </p>
          <div className="tag-cloud" role="group" aria-labelledby="tag-label">
            {TAGS.map(([tag, count]) => (
              <button
                key={tag}
                type="button"
                aria-pressed={view.tag === tag}
                onClick={() => patch({ tag: view.tag === tag ? null : tag })}
              >
                {tag} {count}
              </button>
            ))}
          </div>
        </aside>

        <div className="catalog-main" id="daftar" tabIndex={-1}>
          {statusPending ? (
            <p className="catalog-count">Memeriksa progres…</p>
          ) : rows.length === 0 ? (
            <div className="catalog-empty">
              <p>Tidak ada tantangan untuk filter ini.</p>
              {filtered ? (
                <button type="button" className="btn-secondary" onClick={() => setParams({}, { replace: true })}>
                  Hapus filter
                </button>
              ) : null}
            </div>
          ) : (
            <>
              <p className="catalog-count" aria-live="polite">
                {from}–{to} dari {matches.length}
              </p>
              <ul className="catalog-list">
                {rows.map((item) => {
                  const finished = completed.has(item.slug)
                  return (
                    <li key={item.slug}>
                      <Link to={{ pathname: `${CATALOG_PATH}/${item.slug}`, search }}>
                        <span
                          className="done-mark"
                          data-done={finished ? 'true' : 'false'}
                          aria-hidden="true"
                        />
                        <h2 className="catalog-title">
                          <span className="visually-hidden">
                            {finished ? 'Selesai. ' : 'Belum dikerjakan. '}
                          </span>
                          {item.title}
                        </h2>
                        <p className="catalog-meta">
                          {item.category} · {item.level} · {item.tags.join(', ')}
                        </p>
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </>
          )}

          {pages > 1 ? (
            <nav className="catalog-pager" aria-label="Halaman">
              <button
                type="button"
                className="btn-secondary"
                disabled={page <= 1}
                onClick={() => patch({ page: page - 1 }, false)}
              >
                Sebelumnya
              </button>
              <span>
                Halaman {page} dari {pages}
              </span>
              <button
                type="button"
                className="btn-secondary"
                disabled={page >= pages}
                onClick={() => patch({ page: page + 1 }, false)}
              >
                Berikutnya
              </button>
            </nav>
          ) : null}
        </div>
      </div>
    </main>
  )
}
