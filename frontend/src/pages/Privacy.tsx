import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { SITE_FOOTER } from '../lib/legal.ts'

export function Privacy() {
  useEffect(() => {
    document.title = 'Privasi · kulaSQL'
  }, [])

  return (
    <main className="prose-page">
      <h1 id="isi" tabIndex={-1}>
        Privasi
      </h1>
      <p>{SITE_FOOTER.identity}</p>
      <p>
        Akun menyimpan email, tanggal lahir, dan jejak latihan: soal selesai, XP, dan draf.
        Daftar tunggu Kelas Data menyimpan email yang kamu kirim, terpisah dari soal.
      </p>
      <p>
        Beta ini tidak membagikan email itu. Mengisi daftar tunggu tidak mengubah Tantangan.
      </p>
      <p>
        Pertanyaan:{' '}
        <a href={`mailto:${SITE_FOOTER.supportEmail}`}>{SITE_FOOTER.supportEmail}</a>
      </p>
      <p>
        <Link to="/">Kembali ke beranda</Link>
      </p>
    </main>
  )
}
