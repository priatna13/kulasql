import { useEffect, useRef, useState } from 'react'
import { PLAYBOOK, PLAYBOOK_JOBS, PLAYBOOK_STORE } from '../lib/playbook.ts'

export function Playbook() {
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [copyFailed, setCopyFailed] = useState(false)
  const copySeq = useRef(0)

  useEffect(() => {
    document.title = 'Playbook · kulaSQL'
  }, [])

  async function onCopy(id: string, sql: string) {
    const seq = ++copySeq.current
    try {
      await navigator.clipboard.writeText(sql)
      if (seq !== copySeq.current) return
      setCopiedId(id)
      setCopyFailed(false)
    } catch {
      if (seq !== copySeq.current) return
      setCopiedId(id)
      setCopyFailed(true)
    }
  }

  return (
    <main className="playbook-page">
      <h1 id="daftar" tabIndex={-1}>
        Playbook
      </h1>
      <p className="playbook-lede">
        Query siap pakai untuk kerja di {PLAYBOOK_STORE}. Tabel contohnya pelanggan, produk,
        pesanan, dan baris_pesanan. Salin, lalu sesuaikan nama tabel di editor kamu.
      </p>
      <p className="playbook-count">{PLAYBOOK.length} template</p>
      {PLAYBOOK_JOBS.map((job) => (
        <section className="playbook-job" key={job} aria-labelledby={`playbook-${job}`}>
          <h2 id={`playbook-${job}`}>{job}</h2>
          <ul className="playbook-list">
            {PLAYBOOK.filter((item) => item.job === job).map((item) => (
              <li key={item.id}>
                <div className="playbook-head">
                  <h3 className="playbook-title">{item.title}</h3>
                  <button
                    type="button"
                    className="btn-secondary"
                    aria-label={`Salin ${item.title}`}
                    onClick={() => void onCopy(item.id, item.sql)}
                  >
                    Salin
                  </button>
                  {copiedId === item.id ? (
                    <p className="playbook-status" role="status">
                      {copyFailed ? 'Belum tersalin. Coba lagi.' : 'Tersalin.'}
                    </p>
                  ) : null}
                </div>
                <p className="playbook-scenario">{item.scenario}</p>
                <pre className="playbook-sql">
                  <code>{item.sql}</code>
                </pre>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </main>
  )
}
