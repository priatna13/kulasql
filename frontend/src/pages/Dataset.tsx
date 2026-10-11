import { useEffect } from 'react'
import { Link } from 'react-router-dom'

export function Dataset() {
  useEffect(() => {
    document.title = 'Dataset · kulaSQL'
  }, [])

  return (
    <main className="prose-page">
      <h1 id="isi" tabIndex={-1}>
        Dataset
      </h1>
      <p>
        Simulasi bisnis Indonesia untuk dianalisis di luar Tantangan. Yang bisa diunduh sekarang
        Warmindo Lite, gratis.
      </p>
      <ul>
        <li>
          <Link to="/dataset/warmindo-lite">Warmindo Lite</Link>
          {' — '}
          penjualan warung mi instan. Satu baris untuk satu menu pada satu shift.
        </li>
      </ul>
    </main>
  )
}
