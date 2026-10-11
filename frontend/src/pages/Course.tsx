import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { CATALOG_PATH, challengeBySlug } from '../lib/challenge.ts'
import { CAPSTONE, JENJANG } from '../lib/course.ts'
import { PLAYBOOK_PATH } from '../lib/playbook.ts'

export function Course() {
  useEffect(() => {
    document.title = 'Kursus · kulaSQL'
  }, [])

  return (
    <main className="course-page">
      <h1 id="materi" tabIndex={-1}>
        Kursus
      </h1>
      <div className="course-copy">
        <p>
          Urutan dari menulis SELECT sampai query yang tidak menggandakan angka. Kerjakan dari
          atas ke bawah. Tiap baris membuka Tantangan yang sudah ada — kamu nulis query di sana,
          bukan membaca teori.
        </p>
        <p>
          Jenjang di halaman ini urutan materi. Level di pojok akun dihitung dari XP, dan angkanya
          tidak mengikuti jenjang ini.
        </p>
        <p>
          <Link to={CATALOG_PATH}>Latihan</Link> tetap katalog Tantangan.{' '}
          <Link to={PLAYBOOK_PATH}>Playbook</Link> adalah template kerja, terpisah dari urutan ini.
        </p>
      </div>

      {JENJANG.map((jenjang) => (
        <section className="course-jenjang" key={jenjang.materi} aria-labelledby={`jenjang-${jenjang.materi}`}>
          <h2 id={`jenjang-${jenjang.materi}`}>Jenjang materi {jenjang.materi}</h2>
          <p className="course-topics">{jenjang.topics.join(' / ')}</p>
          {jenjang.materi === 3 ? (
            <p className="course-topics">
              Optimasi di jalur ini artinya angka tidak berlipat. Bukan rencana indeks.
            </p>
          ) : null}
          <ol className="course-list">
            {jenjang.lessons.map((lesson) => {
              const challenge = challengeBySlug(lesson.slug)
              if (!challenge) return null
              return (
                <li key={lesson.slug}>
                  <Link to={`${CATALOG_PATH}/${challenge.slug}`}>
                    <p className="course-lesson-title">{challenge.title}</p>
                    <p className="course-lesson-meta">
                      {lesson.topic} · {lesson.lead}
                    </p>
                  </Link>
                </li>
              )
            })}
          </ol>
        </section>
      ))}

      <section className="course-capstone" aria-labelledby="capstone-title">
        <h2 id="capstone-title">Proyek penutup: {CAPSTONE.title}</h2>
        <div className="course-copy">
          <p>
            Satu laporan untuk portofolio, bukan soal baru dan tidak masuk katalog. Lima Tantangan
            di bawah ini yang menyusunnya: siapa yang tercatat, berapa omzetnya, nota mana yang
            ketemu nama, kota mana yang dijumlahkan, dan qty yang tidak terlipat harga.
          </p>
          <p>
            Tiap Tantangan membawa tabel latihannya sendiri. Laporanmu menyambungkan
            pertanyaannya, bukan menyatukan angkanya jadi satu gudang.
          </p>
          <p>
            Yang kamu bawa: judul laporan, lima query yang lolos, dan satu paragraf buatanmu untuk
            pemilik toko — apa yang dikerjakan minggu depan. Mesin tidak menilai paragraf itu.
            Tamu bisa membuka proyek ini. Dikerjakan setelah jenjang materi 3, dan tetap bisa
            dibuka kapan saja.
          </p>
        </div>
        <ol className="course-list">
          {CAPSTONE.steps.map((step) => {
            const challenge = challengeBySlug(step.slug)
            if (!challenge) return null
            return (
              <li key={step.bagian}>
                <Link to={`${CATALOG_PATH}/${challenge.slug}`}>
                  <p className="course-lesson-title">{step.bagian}</p>
                  <p className="course-lesson-meta">
                    {challenge.title} · {step.lead}
                  </p>
                </Link>
              </li>
            )
          })}
        </ol>
      </section>
    </main>
  )
}
