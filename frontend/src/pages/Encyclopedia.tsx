import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useParams, useSearchParams } from 'react-router-dom'
import {
  DIALECTS,
  equivalentsFor,
  listFunctions,
  functionBySlug,
  PG_CATEGORIES,
  pgCategory,
  POSTGRES_PATH,
  resolveDialect,
  type Dialect,
} from '../lib/encyclopedia.ts'

export function Encyclopedia() {
  const { dialect: dialectParam, fn } = useParams()
  const dialect = resolveDialect(dialectParam)
  const slug = fn?.replace(/\/+$/, '')
  if (!dialect) return <DialectMissing fn={slug} />
  if (!slug) return <FunctionIndex dialect={dialect} />
  return <FunctionArticle key={`${dialect.id}/${slug}`} dialect={dialect} slug={slug} />
}

function DialectMissing({ fn }: { fn: string | undefined }) {
  useEffect(() => {
    document.title = 'Ensiklopedia · kulaSQL'
    window.scrollTo(0, 0)
  }, [fn])

  return (
    <main className="fn-page">
      <p className="missing" id={fn ? 'fungsi' : 'daftar'} tabIndex={-1}>
        Dialek itu belum ada.{' '}
        <Link to={POSTGRES_PATH}>Kembali ke indeks</Link>
      </p>
    </main>
  )
}

function FunctionIndex({ dialect }: { dialect: Dialect }) {
  const { search } = useLocation()
  const [params, setParams] = useSearchParams()
  const raw = params.get('kategori')
  const category = pgCategory(raw)
  const rows = listFunctions(dialect.id, raw)

  useEffect(() => {
    document.title = `Ensiklopedia ${dialect.label} · kulaSQL`
    window.scrollTo(0, 0)
  }, [dialect.label])

  function patch(next: string | null) {
    setParams(() => {
      // The updater argument is the last render, so a second change in the same turn would drop a param already written to the URL.
      const current = new URLSearchParams(window.location.search)
      if (next) current.set('kategori', next)
      else current.delete('kategori')
      return current
    }, { replace: true })
  }

  return (
    <main className="fn-page">
      <h1 id="daftar" tabIndex={-1}>
        Ensiklopedia
      </h1>
      <p className="fn-lede">
        Fungsi {dialect.label} untuk dicek saat nulis query. Workspace tantangan tetap satu mesin.
      </p>
      <nav className="fn-dialects" aria-label="Dialek">
        {DIALECTS.map((item) => (
          <Link
            key={item.id}
            to={{ pathname: item.path, search }}
            aria-current={item.id === dialect.id ? 'page' : undefined}
          >
            {item.label}
          </Link>
        ))}
      </nav>
      <label className="catalog-field fn-filter">
        <span className="catalog-label">Kategori</span>
        <select
          value={category ?? ''}
          onChange={(event) => {
            patch(PG_CATEGORIES.find((item) => item === event.target.value) ?? null)
          }}
        >
          <option value="">Semua kategori</option>
          {PG_CATEGORIES.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </label>
      <p className="fn-count">{rows.length} fungsi</p>
      {rows.length === 0 ? (
        <p className="fn-empty">Tidak ada fungsi di kategori itu.</p>
      ) : (
        PG_CATEGORIES.map((group) => {
          const items = rows.filter((item) => item.category === group)
          if (items.length === 0) return null
          return (
            <section className="fn-group" key={group} aria-labelledby={`kategori-${group.replaceAll(' ', '-')}`}>
              <h2 id={`kategori-${group.replaceAll(' ', '-')}`}>{group}</h2>
              <ul className="fn-list">
                {items.map((item) => (
                  <li key={item.slug}>
                    <Link to={{ pathname: `${dialect.path}/${item.slug}`, search }}>
                      <p className="fn-title">{item.name}</p>
                      <p className="fn-meta">{item.resultType}</p>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )
        })
      )}
    </main>
  )
}

function FunctionArticle({ dialect, slug }: { dialect: Dialect; slug: string }) {
  const entry = functionBySlug(dialect.id, slug)
  const { search } = useLocation()
  const [copied, setCopied] = useState(false)
  const [copyFailed, setCopyFailed] = useState(false)
  const copySeq = useRef(0)
  const others = entry ? equivalentsFor(dialect.id, entry.slug) : []

  useEffect(() => {
    document.title = entry
      ? `${entry.name} · ${dialect.label} · kulaSQL`
      : `Ensiklopedia ${dialect.label} · kulaSQL`
    window.scrollTo(0, 0)
  }, [entry, dialect.label])

  async function onCopy(syntax: string) {
    const seq = ++copySeq.current
    try {
      await navigator.clipboard.writeText(syntax)
      if (seq !== copySeq.current) return
      setCopied(true)
      setCopyFailed(false)
    } catch {
      if (seq !== copySeq.current) return
      setCopied(true)
      setCopyFailed(true)
    }
  }

  if (!entry) {
    return (
      <main className="fn-page">
        <p className="missing" id="fungsi" tabIndex={-1}>
          Fungsi itu belum ada.{' '}
          <Link to={{ pathname: dialect.path, search }}>Kembali ke indeks</Link>
        </p>
      </main>
    )
  }

  return (
    <main className="fn-page">
      <p className="back-row">
        <Link to={{ pathname: dialect.path, search }}>Kembali ke indeks</Link>
      </p>
      <h1 id="fungsi" tabIndex={-1}>
        {entry.name}
      </h1>
      <p className="fn-meta">
        {dialect.label} · {entry.category} · {entry.resultType}
      </p>
      <p className="fn-copy">{entry.description}</p>

      {others.length > 0 ? (
        <section className="fn-section" aria-labelledby="padanan">
          <h2 id="padanan">Di dialek lain</h2>
          <p className="fn-copy">
            Fungsi untuk pekerjaan yang sama. Tipe hasil dan urutan argumen bisa beda.
          </p>
          <ul className="fn-list">
            {others.map((item) => (
              <li key={`${item.dialect}-${item.slug}`}>
                <Link to={{ pathname: item.path, search }}>
                  <p className="fn-title">{item.name}</p>
                  <p className="fn-meta">{item.label}</p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="fn-section" aria-labelledby="sintaks">
        <div className="fn-syntax-head">
          <h2 id="sintaks">Sintaks</h2>
          <button
            type="button"
            className="btn-secondary"
            aria-label={`Salin sintaks ${entry.name}`}
            onClick={() => void onCopy(entry.syntax)}
          >
            Salin
          </button>
          {copied ? (
            <p className="fn-status" role="status">
              {copyFailed ? 'Belum tersalin. Coba lagi.' : 'Tersalin.'}
            </p>
          ) : null}
        </div>
        <pre className="fn-syntax">
          <code>{entry.syntax}</code>
        </pre>
      </section>

      <section className="fn-section" aria-labelledby="parameter">
        <h2 id="parameter">Parameter</h2>
        <ul className="fn-params">
          {entry.parameters.map((param) => (
            <li key={param.name}>
              <p className="fn-param-name">
                <code>{param.name}</code>
                <span> · {param.type}</span>
              </p>
              <p className="fn-param-note">{param.note}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="fn-section" aria-labelledby="contoh">
        <h2 id="contoh">Contoh hasil</h2>
        <div className="result-table-wrap">
          <table className="result-table">
            <caption className="visually-hidden">Hasil dari sintaks di atas</caption>
            <thead>
              <tr>
                {entry.example.columns.map((column) => (
                  <th key={column} scope="col">
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {entry.example.rows.map((row) => (
                <tr key={row.join('\u0000')}>
                  {row.map((cell, index) => (
                    <td key={`${cell}-${index}`}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="fn-section" aria-labelledby="pertanyaan">
        <h2 id="pertanyaan">Pertanyaan singkat</h2>
        {entry.faq.map((item) => (
          <div key={item.q} className="fn-faq">
            <h3>{item.q}</h3>
            <p>{item.a}</p>
          </div>
        ))}
      </section>
    </main>
  )
}
