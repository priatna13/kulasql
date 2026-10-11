import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { parseWarmindoCsv, warmindoIdeas, type WarmindoTable } from '../lib/warmindo.ts'

export function Warmindo() {
  const [table, setTable] = useState<WarmindoTable | null>(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    document.title = 'Warmindo Lite · kulaSQL'
    let current = true
    fetch('/warmindo-lite.csv')
      .then((response) => {
        if (!response.ok) throw new Error('missing')
        return response.text()
      })
      .then((text) => {
        const parsed = parseWarmindoCsv(text)
        if (parsed.columns.length === 0 || parsed.rows.length === 0) throw new Error('empty')
        if (!current) return
        setTable(parsed)
      })
      .catch(() => {
        if (!current) return
        setFailed(true)
      })
    return () => {
      current = false
    }
  }, [])

  return (
    <main className="prose-page">
      <p className="back-row">
        <Link to="/dataset">Dataset</Link>
      </p>
      <h1 id="isi" tabIndex={-1}>
        Warmindo Lite
      </h1>
      <p>
        Penjualan fiktif sebuah warung mi instan. Gratis. Kolom dan baris di bawah dibaca dari
        file yang sama dengan unduhan.
      </p>
      <p>
        <a href="/warmindo-lite.csv" download>
          Unduh Warmindo Lite
        </a>
      </p>
      {failed ? (
        <p role="alert">File Warmindo Lite belum terbaca. Muat ulang halaman.</p>
      ) : table ? (
        <div className="sample-wrap">
          <table className="sample-table dataset-preview">
            <caption className="visually-hidden">Isi file Warmindo Lite</caption>
            <thead>
              <tr>
                {table.columns.map((column) => (
                  <th key={column} scope="col">
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {table.rows.map((row, index) => (
                <tr key={`${row.join('|')}-${index}`}>
                  {row.map((cell, cellIndex) => (
                    <td key={`${cell}-${cellIndex}`}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p role="status">Membaca file…</p>
      )}
      <h2>Ide analisis</h2>
      <ul>
        {warmindoIdeas.map((idea) => (
          <li key={idea.title}>
            <strong>{idea.title}.</strong> {idea.body}
          </li>
        ))}
      </ul>
    </main>
  )
}
