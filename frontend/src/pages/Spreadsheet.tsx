import { useEffect } from 'react'
import { Link } from 'react-router-dom'

export function Spreadsheet() {
  useEffect(() => {
    document.title = 'Spreadsheet · kulaSQL'
  }, [])

  return (
    <main className="prose-page">
      <h1 id="isi" tabIndex={-1}>
        Spreadsheet
      </h1>
      <p>
        Ini pintu latihan spreadsheet. Soal-soalnya tidak disimpan di kulaSQL, dan halaman ini
        bukan katalog latihan.
      </p>
      <p>Akun yang dipakai tetap akun kulaSQL. Tidak ada pendaftaran baru di pintu ini.</p>
      <p>
        <Link to="/kulasql">Buka latihan SQL</Link>
      </p>
    </main>
  )
}
