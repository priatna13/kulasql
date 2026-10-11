import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { SqlPlayground } from '../components/SqlPlayground.tsx'
import { CATALOG_PATH, CHALLENGE_PATH, FIRST_CHALLENGE } from '../lib/challenge.ts'
import { COURSE_PATH } from '../lib/course.ts'
import { POSTGRES_PATH } from '../lib/encyclopedia.ts'
import { PLAYBOOK_PATH } from '../lib/playbook.ts'

const DESKTOP_QUERY = '(min-width: 840px)'

const CONTRASTS = [
  {
    topic: 'Cara belajar',
    watch: 'Nonton dulu, nulis belakangan.',
    type: 'Nulis query dari soal pertama.',
  },
  {
    topic: 'Kasusnya',
    watch: 'Skema fiktif bahasa Inggris.',
    type: 'Studi kasus toko kelontong di Jogja, bukan skema fiktif bahasa Inggris.',
  },
  {
    topic: 'Kalau salah',
    watch: 'Salah pun tidak ketahuan.',
    type: 'Salah itu langsung ketahuan. Kirim jawaban, biarkan mesin yang koreksi.',
  },
] as const

const QUESTIONS = [
  {
    q: 'Apa itu kulaSQL?',
    a: 'Latihan SQL di browser. Kamu nulis query, hasilnya dicek, lalu ada hint dan solusi. Soalnya berbahasa Indonesia, kasusnya TokoKulwon.',
  },
  {
    q: 'Gratis atau bayar?',
    a: 'Gratis untuk mulai. Beta ini tidak memungut kartu dan tidak menampilkan paket harga.',
  },
  {
    q: 'Siapa yang cocok?',
    a: 'Yang baru mau bisa SQL, yang mau drill, dan yang butuh template query buat kerja.',
  },
  {
    q: 'Bagaimana mulainya?',
    a: 'Jalankan query di soal yang sudah terbuka. Buka di layar penuh kalau mau ruang editor yang utuh. Supaya selesai tersimpan dan dapat XP, masuk dengan email.',
  },
  {
    q: 'Ada hint dan solusi?',
    a: 'Ada. Tiga hint dibuka berurutan. Solusi beserta penjelasannya terbuka setelah masuk, tanpa kunci bayar.',
  },
  {
    q: 'Ada komunitas?',
    a: 'Ada papan peringkat. Belum ada grup. Pertanyaan lewat email di footer.',
  },
] as const

function Check() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.2 8.2 6.4 11.4 12.8 4.6"
      />
    </svg>
  )
}

function QueryMark() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.3 4.5 5.6 8 2.3 11.5"
      />
      <path
        fill="currentColor"
        d="M7.2 10.15h6.2v1.7H7.2z"
      />
    </svg>
  )
}

function Traffic() {
  return (
    <span className="traffic" aria-hidden="true">
      <i className="dot-close" />
      <i className="dot-min" />
      <i className="dot-zoom" />
    </span>
  )
}

export function Landing() {
  const [desktop, setDesktop] = useState(() => window.matchMedia(DESKTOP_QUERY).matches)
  const [pane, setPane] = useState<'sql' | 'schema'>('sql')

  useEffect(() => {
    document.title = 'kulaSQL'
    const media = window.matchMedia(DESKTOP_QUERY)
    const onChange = () => setDesktop(media.matches)
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [])

  return (
    <main>
      <section className="hero">
        <div className="hero-copy">
          <p className="hero-badge">
            <QueryMark />
            Latihan SQL Interaktif Berbahasa Indonesia
          </p>
          <h1>Bisa SQL langsung dari nulis query, bukan nonton video.</h1>
          <p className="subhead">
            Mesin DuckDB langsung di browser. Kamu ngetik query studi kasus nyata TokoKulwon,
            sistem mengecek otomatis dalam hitungan detik.
          </p>
          <div className="cta-row">
            <Link className="btn-run" id="mulai" to={CHALLENGE_PATH}>
              Mulai Soal Pertama →
            </Link>
            <a className="btn-secondary" href="#jalur">
              Lihat Jalur Belajar
            </a>
          </div>
          <ul className="trust-points">
            <li>
              <Check />
              Gratis tanpa kartu
            </li>
            <li>
              <Check />
              Tanpa instalasi
            </li>
            <li>
              <Check />
              Feedback instan
            </li>
          </ul>
        </div>

        {desktop ? (
          <div className="code-window" data-pane={pane}>
            <div className="code-window-bar">
              <Traffic />
              <div className="code-tabs" role="tablist" aria-label="Isi jendela soal">
                <button
                  type="button"
                  role="tab"
                  id="tab-soal"
                  aria-selected={pane === 'sql'}
                  aria-controls="pane-soal"
                  tabIndex={pane === 'sql' ? 0 : -1}
                  onClick={() => setPane('sql')}
                >
                  soal-01.sql
                </button>
                <button
                  type="button"
                  role="tab"
                  id="tab-skema"
                  aria-selected={pane === 'schema'}
                  aria-controls="pane-soal"
                  tabIndex={pane === 'schema' ? 0 : -1}
                  onClick={() => setPane('schema')}
                >
                  skema.db
                </button>
              </div>
            </div>
            <div
              className="code-window-body"
              id="pane-soal"
              role="tabpanel"
              aria-labelledby={pane === 'sql' ? 'tab-soal' : 'tab-skema'}
            >
              <SqlPlayground challenge={FIRST_CHALLENGE} density="landing" />
            </div>
          </div>
        ) : (
          <div className="code-window code-window-static">
            <div className="code-window-bar">
              <Traffic />
              <p className="code-file">soal-01.sql</p>
            </div>
            <div className="mobile-prompt">
              <p className="rail-level">{FIRST_CHALLENGE.level}</p>
              <h2 className="rail-title">{FIRST_CHALLENGE.title}</h2>
              {FIRST_CHALLENGE.prompt.split('\n\n').map((para) => (
                <p key={para.slice(0, 24)} className="rail-prompt">
                  {para}
                </p>
              ))}
              <p className="honest-note">
                Editor SQL hidup di laptop. Di layar ini baca soalnya dulu, lalu buka kulaSQL
                dari komputer untuk nulis query.
              </p>
            </div>
          </div>
        )}
      </section>

      <section className="stat-bar" aria-label="Yang sudah pasti">
        <ul>
          <li>
            <strong>100</strong> Soal
          </li>
          <li>
            <strong>0</strong> instal
          </li>
          <li>
            <strong>DuckDB</strong> di browser
          </li>
          <li>
            <strong>100%</strong> Bahasa Indonesia
          </li>
        </ul>
      </section>

      <section className="story story-wide" id="beda">
        <p className="story-index">Kenapa kulaSQL</p>
        <h2>Nonton itu yang lain. Di sini kamu ngetik.</h2>
        <div className="compare">
          {CONTRASTS.map((row) => (
            <article key={row.topic}>
              <h3>{row.topic}</h3>
              <p>
                <span>Nonton</span>
                {row.watch}
              </p>
              <p className="is-here">
                <span>Ngetik</span>
                {row.type}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="story story-wide" id="jalur">
        <p className="story-index">Jalur belajar</p>
        <h2>Pilih yang paling dekat dengan kerjamu.</h2>
        <div className="path-grid">
          <article>
            <div className="path-card-head">
              <p className="level-badge">100 Soal</p>
              <h3>Latihan Mandiri</h3>
            </div>
            <p>31 Mudah, 41 Sedang, 28 Sulit. Drill harian untuk mengasah logika SQL.</p>
            <Link to={CATALOG_PATH}>Buka Tantangan →</Link>
          </article>
          <article>
            <div className="path-card-head">
              <p className="level-badge">SQL 101 - Capstone</p>
              <h3>Kursus Terstruktur</h3>
            </div>
            <p>Dari dasar SELECT hingga aggregasi dan subquery secara berurutan.</p>
            <Link to={COURSE_PATH}>Buka Jalur Kursus →</Link>
          </article>
          <article>
            <div className="path-card-head">
              <p className="level-badge">100 Template</p>
              <h3>Playbook Kerja</h3>
            </div>
            <p>Kumpulan pola query siap salin untuk kebutuhan analisis data nyata.</p>
            <Link to={PLAYBOOK_PATH}>Buka Playbook →</Link>
          </article>
        </div>
        <p className="story-aside">
          <strong>Ensiklopedia</strong> — fungsi SQL untuk dicek saat nulis. Lima dialek
          untuk dibaca. Latihan tetap satu mesin.{' '}
          <Link to={POSTGRES_PATH}>Buka Ensiklopedia</Link>
        </p>
      </section>

      <section className="story" id="tanya">
        <p className="story-index">Pertanyaan</p>
        <h2>Kalau masih ragu, baca yang ini.</h2>
        <div className="faq">
          {QUESTIONS.map((item) => (
            <details key={item.q}>
              <summary>{item.q}</summary>
              <p>{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="story story-close">
        <div className="cta-banner">
          <h2>Soal pertama sudah kebuka.</h2>
          <p className="subhead">
            Lima menit dari sekarang kamu sudah menjalankan query. Tanpa install, tanpa kartu.
          </p>
          <div className="cta-row">
            <Link className="btn-run" to={CHALLENGE_PATH}>
              Mulai Soal Pertama →
            </Link>
          </div>
          <p className="trust">XP tersimpan setelah masuk. Melihat soal tidak mengharuskan akun.</p>
        </div>
      </section>
    </main>
  )
}
