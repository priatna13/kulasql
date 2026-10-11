import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { SITE_FOOTER } from '../lib/legal.ts'

export function Terms() {
  useEffect(() => {
    document.title = 'Syarat akun · kulaSQL'
  }, [])

  return (
    <main className="prose-page">
      <h1 id="isi" tabIndex={-1}>
        Syarat akun
      </h1>
      <p>
        kulaSQL masih beta: latihan SQL di browser. Belum ada pembayaran, dan buat akun tidak
        memungut biaya.
      </p>
      <p>
        Akun hanya untuk yang sudah berusia 13 tahun ke atas. Tanggal lahir dicek saat daftar.
        Kalau belum 13 tahun, akun tidak dibuat.
      </p>
      <p>
        Kamu yang menjaga kata sandi. Jangan dipinjamkan. Keluar memutus sesi di perangkat ini.
        Soal yang sudah selesai tetap tersimpan di akun.
      </p>
      <p>{SITE_FOOTER.identity}</p>
      <p>
        Pertanyaan:{' '}
        <a href={`mailto:${SITE_FOOTER.supportEmail}`}>{SITE_FOOTER.supportEmail}</a>
      </p>
      <p>
        <Link to="/kulasql">Kembali ke kulaSQL</Link>
      </p>
    </main>
  )
}
