# PRD — kulaSQL

**Kuasai SQL yang Dipakai Data Analyst Pro**

Dokumen ini adalah PRD produk **kulaSQL**. Lingkup, fitur, dan model bisnis disusun dari analisis platform latihan SQL interaktif berbahasa Indonesia (observasi publik per 4 September 2026), lalu ditetapkan sebagai persyaratan kulaSQL.

|                               |                                                                              |
|-------------------------------|------------------------------------------------------------------------------|
| **Produk**                    | kulaSQL                                                                     |
| **Domain produk**             | kulaSQL — platform latihan SQL interaktif                                   |
| **Kontak**                    | Ditentukan saat implementasi (email support + kanal komunitas)               |
| **Versi dokumen**             | 1.0                                                                          |
| **Tanggal**                   | 4 September 2026                                                             |
| **Status**                    | Draft analitik — siap dipakai sebagai baseline produk / rebuild / kompetitor |
| **Bahasa produk**             | Bahasa Indonesia (copy, soal, hint, solusi, ensiklopedia)                    |
| **Analogi yang dipakai user** | DataLemur / LeetCode SQL, versi lokal Indonesia                              |

## 1. Ringkasan Eksekutif

kulaSQL adalah platform latihan SQL interaktif berbasis browser yang
menargetkan pelajar dan profesional data di Indonesia. Janji intinya:
“Bisa SQL dari nulis query.” Pengguna tidak menonton tutorial, melainkan
menulis query pada 100+ tantangan bertingkat, menjalankannya di sandbox,
dan mendapat validasi otomatis plus XP.

Produk ini menjawab “tutorial hell”: orang paham konsep setelah nonton
YouTube, tetapi bingung saat harus menulis query sendiri, capek setup
database lokal, dan tidak punya umpan balik. kulaSQL menghilangkan
instalasi, memakai kasus bisnis Indonesia (TokoKulwon, pelanggan
Jakarta/Surabaya, laporan marketing), dan menutup loop belajar dengan
hint bertingkat serta solusi.

Tiga jalur belajar dipisah secara eksplisit: Latihan (drill 100+ soal),
Kursus (SQL 101 sampai mahir + proyek nyata), dan Playbook (100 query
siap pakai di kerjaan). Di sekitarnya ada Ensiklopedia 5 dialek,
Leaderboard, Store (cheatsheet, e-course, e-book), dan produk sibling spreadsheet plus Dataset.

Model bisnis freemium. Free membuka tantangan dasar tanpa kartu kredit.
Premium (Rp 69.000/bulan, Rp 535.000/tahun, atau lifetime Rp 999.000)
membuka semua konten premium, solusi lengkap, dan komunitas WhatsApp.
Pembayaran Xendit; refund tidak tersedia — ToS menyarankan coba paket
gratis dulu.

Traction yang diklaim di situs: 15.000+ pelajar aktif dari berbagai kota
di Indonesia, 50.000+ latihan dikerjakan, 100+ tantangan SQL, 5 dialek
di ensiklopedia, rating 4.9/5. Breakdown tantangan teramati: 31 Mudah,
41 Sedang, 28 Sulit (total 100).

## 2. Pernyataan Masalah

### 2.1 Masalah dari sudut pengguna

- Paham konsep SQL dari tutorial, tetapi freeze saat diminta menulis
  query sendiri.

- Setup PostgreSQL/MySQL lokal, dataset, dan tool terasa ribet sebelum
  soal pertama selesai.

- Materi bagus mayoritas berbahasa Inggris dan memakai nama
  kolom/konteks luar negeri.

- Kalau query salah, tidak ada yang bilang di mana salahnya; akhirnya
  nyerah.

- Tidak ada jejak progres, sehingga semangat habis di minggu kedua.

- Yang sudah kerja butuh template query, bukan kurikulum dari nol lagi.

- Fresh grad butuh drill mirip interview, bukan hanya teori SELECT.

### 2.2 Masalah dari sudut pasar Indonesia

- Kebutuhan Data Analyst di job posting lokal hampir selalu mensyaratkan
  SQL sebagai skill \#1.

- Platform interaktif global (DataLemur, LeetCode SQL, HackerRank,
  DataCamp) kuat secara teknis tetapi lemah di bahasa, harga, metode
  bayar, dan konteks bisnis Indonesia.

- Kelas video lokal sering tetap passive learning: nonton dulu, praktek
  belakangan, koreksi manual.

### 2.3 Job-to-be-done

Ketika saya ingin bisa SQL yang dipakai data analyst, saya ingin
langsung menulis dan mengoreksi query di browser, supaya kebiasaan
terbentuk tanpa setup dan tanpa menunggu mentor.

## 3. Tujuan Produk & Metrik Sukses

### 3.1 Tujuan

1.  Mengubah pelajar dari “paham konsep” menjadi “bisa nulis query
    sendiri” lewat repetisi tersandbox.

2.  Menjadi platform latihan SQL berbahasa Indonesia \#1 yang terasa
    setara DataLemur/LeetCode untuk konteks lokal.

3.  Mengonversi pecahan meaningful dari pengguna free ke premium tanpa
    merusak nilai free yang sudah cukup untuk “aha moment”.

4.  Menyatukan SQL, spreadsheet, dan dataset portfolio dalam satu akun
    platform.

### 3.2 Metrik yang terlihat / layak dilacak

| **Metrik**                         | **Baseline teramati / target kerja**                               |
|------------------------------------|--------------------------------------------------------------------|
| Aktivasi (time-to-first-query)     | Dijanjikan “lima menit dari sekarang”; query pertama tanpa install |
| Completion tantangan first-session | User menyelesaikan ≥1 soal Mudah di sesi pertama                   |
| Soal dikerjakan (platform)         | 50.000+ (klaim landing)                                            |
| Pelajar aktif                      | 15.000+ (klaim landing)                                            |
| Katalog tantangan SQL              | 100 (31 mudah / 41 sedang / 28 sulit)                              |
| Rating pelajar                     | 4.9/5 (klaim platform)                                             |
| Konversi free → premium            | Tidak dipublikasikan; gated: solusi + soal premium + WA community  |
| Retensi 7 hari                     | Tidak dipublikasikan; proxy: XP, level, leaderboard, banner promo  |
| Dialek ensiklopedia                | 5: PostgreSQL, MySQL, BigQuery, Snowflake, DuckDB                  |

## 4. Pengguna Sasaran & Persona

FAQ resmi: “Siapa aja yang pengen lebih data-driven.” Empat segmen yang
ditulis eksplisit:

### P1 — Fresh graduate persiapan interview data

- Butuh soal beragam, gambaran hasil, dan rasa “sudah pernah ngerjain
  yang mirip interview”.

- Sensitif harga; mulai dari free, upgrade saat butuh solusi / soal
  sulit.

### P2 — Karyawan yang upgrade skill SQL

- Waktu terbatas; butuh drill singkat dan Playbook yang langsung dipakai
  di kerjaan.

- Dialek kerja bisa PostgreSQL, MySQL, BigQuery, atau Snowflake.

### P3 — Career switcher masuk dunia data

- Butuh jalur Kursus dari SQL 101 + proyek nyata untuk portfolio.

- Takut setup tool; “langsung di browser” adalah syarat adopsi.

### P4 — Marketing / finance / ops yang butuh SQL harian

- Konteks bisnis (penjualan, pelanggan, harga, laporan) lebih penting
  daripada leetcode murni.

- Playbook dan soal bertema TokoKulwon/marketing lebih relevan
  daripada puzzle abstrak.

*Bukan target primer: DBA yang butuh administrasi server, data engineer
yang butuh pipeline/orchestration, atau peneliti yang butuh SQL akademik
murni.*

## 5. Positioning & Prinsip Produk

### 5.1 Positioning statement

Untuk orang Indonesia yang ingin bisa SQL seperti data analyst, kulaSQL
adalah platform latihan interaktif di browser yang mengoreksi query
secara otomatis — berbeda dari YouTube/kelas video karena kamu menulis
query dari menit pertama, dan berbeda dari LeetCode/DataLemur karena
bahasanya Indonesia dan kasusnya dekat dengan kerjaan lokal.

### 5.2 Tagline & pesan hero yang harus dipertahankan

- Headline: “Bisa SQL dari nulis query.”

- Subhead: 100+ soal dicek otomatis tiap submit; stuck ada hints; mentok
  ada solusi; semua di browser.

- Trust chips: Tanpa instalasi · Gratis untuk mulai · Feedback instan.

- CTA primer: Mulai Tantangan Gratis. CTA sekunder: Pilih Jalur Belajar.

### 5.3 Prinsip desain pengalaman

- Practice-first, bukan video-first.

- Zero-install. Sandbox database sudah hidup di soal.

- Feedback dalam detik, bukan dalam hari.

- Hint bertingkat sebelum spoiler solusi.

- Konteks Indonesia default (nama, kota, mata uang, skenario
  UMKM/retail).

- Gamifikasi yang kebaca: XP, level, leaderboard — “serasa main game”.

- Bahasa manusia, bukan dokumentasi vendor.

## 6. Ruang Lingkup Produk

### 6.1 Dalam lingkup kulaSQL (harus ada)

| **Modul**         | **Fungsi yang terlihat di produk live**                                                     |
|-------------------|---------------------------------------------------------------------------------------------|
| Landing kulaSQL  | Hero, social proof, perbandingan tutorial hell vs produk, 3 jalur, testimonial, CTA penutup |
| Auth              | Masuk; daftar Google atau email; usia minimum 13                                            |
| Tantangan         | Katalog 100 soal, filter 4 dimensi + search, progress, free/premium                         |
| Workspace soal    | Editor SQL, Run Query, Submit Answer, hasil tabel, waktu eksekusi, XP                       |
| Bantuan belajar   | Hint 1–3, solusi utuh (premium), penjelasan                                                 |
| Kursus            | Jalur SQL 101 → mahir + proyek nyata                                                        |
| Playbook          | 100 query template data analyst pro                                                         |
| Ensiklopedia      | Referensi fungsi per dialek, kategori, contoh, ekuivalen                                    |
| Leaderboard       | Kompetisi sehat antar pelajar                                                               |
| Gamifikasi        | XP, level, badge visual “Sempurna!”                                                         |
| Billing           | Free / monthly / yearly / lifetime via Xendit                                               |
| Komunitas premium | WhatsApp eksklusif                                                                          |
| Store terkait     | Cheatsheet gratis, e-course SQL, e-book 50 problem                                          |

### 6.2 Ekosistem di luar modul SQL tetapi terkait

- modul spreadsheet: 187+ latihan Excel & Google Sheets, validasi per cell,
  skenario payroll/pricing/laporan.

- Dataset: 10 dataset simulasi bisnis Indonesia (CSV), ide analisis,
  contoh Warmindo Lite gratis.

- Kelas Data (coming soon): kursus video praktisi, waitlist.

- Blog/roadmap: konten SEO “Roadmap Belajar SQL untuk Data Analyst”,
  panduan pemula.

### 6.3 Di luar lingkup PRD ini

- Membangun ulang modul spreadsheet secara detail (hanya diingat sebagai
  sibling).

- Video LMS penuh (masih coming soon di situs).

- Python/pandas playground, dbt, atau BI authoring (Tableau/Looker
  disebut sebagai tool ekosistem, bukan editor di kulaSQL).

- Sertifikasi resmi industri atau penyaluran kerja.

- Multi-tenant enterprise LMS untuk HR perusahaan (tidak terlihat).

## 7. Arsitektur Informasi & Navigasi

### 7.1 Chrome global (teramati)

- Banner promo atas: konten premium kulaSQL (dan sibling spreadsheet)
  dapat di-grant gratis berjangka waktu.

- Logo platform + switcher produk “KULASQL ▾” (sibling: modul
  spreadsheet).

- Nav kapsul: Belajar · Tantangan · Playbook · Ensiklopedia ·
  Leaderboard.

- Kanan: tombol Masuk.

### 7.2 Peta halaman inti

| **Rute**                      | **Peran**                                            |
|-------------------------------|------------------------------------------------------|
| /                           | Platform hub: SQL + spreadsheet + Dataset + FAQ      |
| /kulasql                     | Marketing + on-ramp 3 jalur                          |
| /kulasql/challenges          | Katalog tantangan + progress + tag cloud             |
| /kulasql/challenges/:slug    | Workspace soal (editor + hasil + hint)               |
| Belajar / Kursus              | Kurikulum terstruktur + proyek                       |
| Playbook                      | Library query siap pakai                             |
| /functions/sql/{dialect}      | Ensiklopedia fungsi                                  |
| /functions/sql/{dialect}/{fn} | Detail fungsi: syntax, param, contoh, FAQ            |
| Leaderboard                   | Papan peringkat XP                                   |
| /store                        | Digital goods: cheatsheet, e-course, e-book, dataset |
| /tos                          | Paket harga, refund, kelayakan akun                  |
| /signin                       | Auth                                                 |

## 8. Persyaratan Fungsional

### 8.1 Onboarding & akun

- FR-01 User dapat melihat landing dan daftar tantangan tanpa login
  wajib di detik pertama.

- FR-02 User dapat daftar/masuk via Google atau email.

- FR-03 Sistem menolak atau membatasi akun di bawah 13 tahun sesuai ToS.

- FR-04 User bertanggung jawab atas keamanan password; sesi harus bisa
  logout.

- FR-05 Setelah login, progress (soal selesai, XP, level) tersimpan
  lintas sesi.

### 8.2 Katalog tantangan

- FR-10 Katalog menampilkan minimal 100 tantangan dengan nama, kategori,
  tingkat.

- FR-11 Tingkat: Mudah, Sedang, Sulit dengan distribusi teramati 31 / 41
  / 28.

- FR-12 Filter: Tingkat Kesulitan, Kategori, Status, Tag.

- FR-13 Pencarian teks bebas (“Cari tantangan...”).

- FR-14 Pagination atau window (teramati: 25 dari 100).

- FR-15 Sidebar progress: persen, X/100 selesai, bar Mudah/Sedang/Sulit.

- FR-16 Tag cloud dengan count (advanced 21, intermediate 20, case_when
  17, aggregation 11, SELECT 10, Dasar SQL 10, SQL 101 10, filtering 10,
  beginner 10, data_quality 10, group_by 9, …).

- FR-17 Status visual per baris (circle kosong / selesai).

- FR-18 Tantangan premium ditandai dan dapat dipreview tanpa workspace.

### 8.3 Workspace query

- FR-20 Setiap tantangan punya prompt berbahasa Indonesia dengan konteks
  bisnis.

- FR-21 Editor SQL berbaris nomor, dark theme, font mono.

- FR-22 Aksi Run Query menjalankan SQL ke sandbox dan menampilkan result
  set.

- FR-23 Aksi Submit Answer memvalidasi terhadap expected result.

- FR-24 Shortcut: Ctrl+Enter Run; Ctrl+Shift+Enter Submit.

- FR-25 Meta hasil: jumlah baris, waktu eksekusi.

- FR-26 Sukses menampilkan “Sempurna!” dan penambahan XP (contoh +50).

- FR-27 Gagal menampilkan umpan balik yang actionable (bukan hanya
  “salah”).

- FR-28 Error engine SQL ditampilkan ramah (syntax error, column not
  found).

- FR-29 Query berbahaya atau berat dihentikan (timeout / limit baris).

### 8.4 Bantuan belajar

- FR-30 Hint bertingkat 1–3, dibuka sadar (tidak semuanya terlihat di
  awal).

- FR-31 Solusi utuh + penjelasan tersedia; sesuai FAQ, solusi lengkap
  adalah benefit premium.

- FR-32 Hint tidak menggantikan kesempatan user mencoba dulu.

### 8.5 Kursus

- FR-40 Menyediakan jalur linier dari SQL 101 hingga mahir.

- FR-41 Menyertakan proyek nyata sebagai capstone.

- FR-42 Ditunjukkan sebagai opsi untuk yang belajar dari nol (bukan
  pengganti katalog drill).

*Kurikulum publik di blog sejalan dengan: Level 1
SELECT/WHERE/JOIN/agregasi; Level 2 GROUP BY/subquery/CASE; Level 3
window/CTE/optimasi.*

### 8.6 Playbook

- FR-50 Library berisi sekitar 100 query siap pakai yang “dipakai data
  analyst pro”.

- FR-51 Setiap item bisa dicopy dan diadaptasi, bukan hanya dibaca.

- FR-52 Playbook merujuk skenario kerja (bukan puzzle leetcode).

### 8.7 Ensiklopedia fungsi

- FR-60 Lima dialek: PostgreSQL, MySQL, BigQuery, Snowflake, DuckDB.

- FR-61 Indeks fungsi per dialek (contoh PostgreSQL 183 fungsi) dengan
  filter kategori.

- FR-62 Halaman fungsi: deskripsi ID, tipe hasil, syntax copyable,
  parameter, contoh hasil tabel, ekuivalen dialek lain, FAQ pendek.

- FR-63 Mencakup fungsi modern vendor (contoh Snowflake Cortex
  embedding, BigQuery APPROX_QUANTILES), bukan hanya ANSI minimum.

### 8.8 Gamifikasi & sosial

- FR-70 XP per tantangan selesai; nilai boleh bervariasi (15–50+
  terlihat di ekosistem).

- FR-71 Level diturunkan dari XP.

- FR-72 Leaderboard publik atau semipublik antar pelajar.

- FR-73 Komunitas WhatsApp hanya untuk premium.

### 8.9 Monetisasi di dalam produk

- FR-80 Paket Gratis: tantangan dasar, tanpa kartu kredit.

- FR-81 Paket Premium Bulanan Rp 69.000: semua konten premium.

- FR-82 Paket Premium Tahunan Rp 535.000 (hemat Rp 293.000 vs 12×
  bulanan).

- FR-83 Paket Lifetime Rp 999.000 sekali bayar.

- FR-84 Payment gateway: Xendit.

- FR-85 Preview premium: soal terbaca, workspace terkunci, CTA upgrade.

- FR-86 Benefit premium yang dikomunikasikan: semua tantangan premium,
  solusi, komunitas WA.

- FR-87 Banner promo waktu terbatas dapat men-grant akses premium
  sementara.

### 8.10 Store (adjacent revenue)

- FR-90 SQL Fundamental Cheatsheet — gratis.

- FR-91 E-course “kulaSQL untuk Data Analisis” Rp 197.000 —
  lifetime + review final project mentor.

- FR-92 E-book “50 Problem dan Solusi SQL” Rp 97.000.

- FR-93 Produk non-SQL di store tidak boleh merusak IA kulaSQL, tetapi
  boleh di-cross-sell.

## 9. Konten: Model Soal & Kurikulum

### 9.1 Anatomi sebuah tantangan

- Judul berbahasa Indonesia, sering berupa tugas kerja (“Mencari
  Pelanggan dari Jakarta”, “Top 5 Produk Terlaris”).

- Kategori (contoh SQL Dasar) + tingkat + tag multi.

- Narasi singkat konteks bisnis.

- Skema tabel sandbox (contoh pelanggan: PELANGGAN_ID, NAMA, EMAIL,
  KOTA, TOTAL_BELANJA).

- Expected result set untuk grader.

- XP reward dan flag free/premium.

- Hint 1–3 dan solusi + penjelasan.

### 9.2 Contoh soal yang terlihat di katalog

- Hari Pertama di TokoKulwon

- Laporan untuk Tim Marketing

- Mencari Pelanggan dari Jakarta

- Produk dengan Harga Terjangkau

- Pelanggan VIP dari Surabaya

- Pelanggan dari Jakarta atau Bandung

- Daftar Produk Termahal

- Top 5 Produk Terlaris

### 9.3 Peta skill yang harus tertutup katalog

| **Lapisan**     | **Topik wajib**                                                     |
|-----------------|---------------------------------------------------------------------|
| SQL 101 / Mudah | SELECT, FROM, WHERE, AND/OR/IN/BETWEEN/LIKE, ORDER BY, LIMIT, alias |
| Agregasi        | COUNT/SUM/AVG/MIN/MAX, GROUP BY, HAVING                             |
| Relasi          | INNER/LEFT JOIN, multi-key, self-join dasar                         |
| Kondisional     | CASE WHEN, COALESCE, NULL handling, data_quality                    |
| Menengah        | Subquery, CTE, UNION, DISTINCT, CAST                                |
| Mahir           | Window functions, query optimization, multi-CTE, pola analitik      |
| Dialek          | Perbedaan fungsi tanggal, string, approximate agg antar 5 engine    |

### 9.4 Standar kualitas konten

- Soal memakai dataset fiktif Indonesia, bukan sakila/northwind generik
  semata.

- Prompt tidak ambigu: output kolom dan aturan urutan harus tersirat
  atau tersurat.

- Expected result deterministik.

- Hint 1 mengarah ke konsep, Hint 2 ke pola query, Hint 3 mendekati
  solusi tanpa full copy bila memungkinkan.

- Solusi menjelaskan “kenapa”, bukan hanya dump SQL.

- Satu tantangan = satu ide utama (boleh gabung 2 ide di Sulit, tidak
  lebih).

## 10. Persyaratan Non-Fungsional

- NFR-01 Time-to-interactive workspace \< 3 detik pada koneksi Indonesia
  pada umumnya.

- NFR-02 Run Query p50 \< 500 ms untuk soal standar (UI memamerkan 3 ms
  pada contoh hero).

- NFR-03 Sandbox terisolasi per eksekusi; tidak ada side effect antar
  user.

- NFR-04 Batas waktu dan memori per query untuk mencegah abuse.

- NFR-05 Tersedia di browser modern desktop; mobile readable untuk baca
  soal.

- NFR-06 Copy dan UI 100% Bahasa Indonesia; error engine boleh ditambah
  terjemahan.

- NFR-07 Tidak wajib install extension, Docker, atau client SQL.

- NFR-08 Progress tidak boleh hilang saat refresh atau ganti device
  (setelah login).

- NFR-09 Pembayaran mematuhi alur Xendit; status langganan jadi source
  of truth gating.

- NFR-10 ToS, privasi, dan identitas badan hukum tampil di footer.

- NFR-11 Aksesibilitas minimum: kontras teks hero, fokus keyboard di
  editor, label tombol jelas.

- NFR-12 Uptime cukup untuk sesi belajar malam (prime time pelajar
  Indonesia).

## 11. User Stories

Daftar berikut memetakan perilaku yang harus didukung sistem. Format:
sebagai \<aktor\>, saya ingin \<kapabilitas\>, agar \<manfaat\>.

1.  Sebagai calon pelajar, saya ingin memahami proposisi nilai kulaSQL
    dalam 10 detik di halaman landing agar saya tahu apakah produk ini
    untuk saya.

2.  Sebagai pemula SQL, saya ingin mulai latihan tanpa instalasi
    database agar saya tidak putus di tahap setup.

3.  Sebagai pemula SQL, saya ingin soal pertama memakai konteks bisnis
    Indonesia (nama toko, kota, pelanggan) agar materi terasa dekat.

4.  Sebagai pelajar, saya ingin mendaftar dengan Google atau email tanpa
    kartu kredit agar gesekan onboarding rendah.

5.  Sebagai pelajar gratis, saya ingin mengerjakan tantangan dasar dan
    mendapat feedback instan agar saya tahu query saya benar atau salah.

6.  Sebagai pelajar, saya ingin menekan Run Query untuk melihat hasil
    dataset sebelum Submit Answer agar saya bisa debug sendiri.

7.  Sebagai pelajar yang stuck, saya ingin membuka Hint 1, Hint 2, lalu
    Hint 3 secara bertingkat agar saya tidak langsung melihat jawaban.

8.  Sebagai pelajar premium yang mentok, saya ingin melihat solusi utuh
    beserta penjelasan Bahasa Indonesia agar saya paham kenapa query itu
    benar.

9.  Sebagai pelajar, saya ingin mendapat XP (contoh +50 XP) saat jawaban
    sempurna agar progres terasa seperti game.

10. Sebagai pelajar, saya ingin naik level berdasarkan XP agar saya
    punya tujuan jangka menengah.

11. Sebagai pelajar kompetitif, saya ingin melihat leaderboard agar saya
    punya alasan kembali setiap hari.

12. Sebagai pelajar, saya ingin filter tantangan berdasarkan tingkat
    kesulitan (Mudah/Sedang/Sulit) agar saya tidak lompat terlalu jauh.

13. Sebagai pelajar, saya ingin filter berdasarkan kategori (contoh SQL
    Dasar) agar saya fokus satu topik.

14. Sebagai pelajar, saya ingin filter berdasarkan tag (SELECT,
    filtering, group_by, case_when, aggregation, data_quality, beginner,
    intermediate, advanced) agar saya drill skill spesifik.

15. Sebagai pelajar, saya ingin filter Status (belum dikerjakan /
    selesai / locked premium) agar saya tahu apa yang tersisa.

16. Sebagai pelajar, saya ingin mencari tantangan lewat kotak pencarian
    agar saya cepat menemukan soal tertentu.

17. Sebagai pelajar, saya ingin melihat progress ring 0/100 plus
    breakdown Mudah 31, Sedang 41, Sulit 28 agar saya tahu peta konten.

18. Sebagai pelajar, saya ingin halaman tantangan menampilkan 25 dari
    100 per halaman agar daftar tidak overwhelm.

19. Sebagai pelajar jalur Kursus, saya ingin jalur terstruktur SQL 101
    hingga mahir plus proyek nyata agar saya tidak bingung urutan
    belajar.

20. Sebagai career switcher, saya ingin proyek yang bisa masuk portfolio
    agar saya punya bukti kerja, bukan cuma badge.

21. Sebagai analis yang sudah kerja, saya ingin Playbook berisi 100
    query siap pakai agar saya bisa copy-adaptasi ke pekerjaan.

22. Sebagai pelajar, saya ingin Ensiklopedia fungsi SQL per dialek
    (PostgreSQL, MySQL, BigQuery, Snowflake, DuckDB) agar saya bisa cek
    syntax saat latihan.

23. Sebagai pelajar PostgreSQL, saya ingin halaman fungsi berisi
    deskripsi, tipe hasil, syntax, parameter, contoh, dan ekuivalen di
    database lain.

24. Sebagai pelajar yang pindah stack, saya ingin membandingkan fungsi
    antar dialek (contoh DATEDIFF vs AGE vs DATE_DIFF) agar saya tidak
    hafal salah dialect.

25. Sebagai pelajar interview, saya ingin soal menyerupai studi kasus
    data analyst (laporan marketing, pelanggan VIP, produk terlaris)
    agar saya siap screening teknis.

26. Sebagai pelajar, saya ingin editor SQL di browser dengan shortcut
    Run (Ctrl+Enter) dan Submit (Ctrl+Shift+Enter) agar alur cepat.

27. Sebagai pelajar, saya ingin hasil query tampil sebagai tabel dengan
    jumlah baris dan waktu eksekusi (contoh 3 ms) agar saya belajar
    berpikir tentang output.

28. Sebagai pelajar, saya ingin sandbox database siap pakai per soal
    agar saya tidak mengurus schema sendiri.

29. Sebagai pelajar, saya ingin melihat skema tabel (nama kolom, tipe,
    sample) di panel soal agar saya tahu dari mana menulis SELECT.

30. Sebagai pelajar, saya ingin validasi otomatis membandingkan result
    set saya dengan expected result (urutan, kolom, nilai) agar
    penilaian objektif.

31. Sebagai pelajar, saya ingin pesan error SQL yang bisa dibaca
    manusia, bukan stack trace mentah, agar saya bisa memperbaiki query.

32. Sebagai pelajar, saya ingin menyimpan draf query per tantangan agar
    saya bisa lanjut besok.

33. Sebagai pelajar, saya ingin menandai tantangan selesai di daftar
    (checkbox/circle) agar progress visual.

34. Sebagai pelajar mobile, saya ingin bisa baca soal di HP meskipun
    editor nyaman di desktop agar saya review di perjalanan.

35. Sebagai pelajar, saya ingin ganti produk ke modul spreadsheet
    sibling dari dropdown KULASQL agar saya latihan spreadsheet di
    ekosistem yang sama.

36. Sebagai pelajar, saya ingin dataset bisnis Indonesia (contoh
    Warmindo) untuk portfolio di luar tantangan SQL.

37. Sebagai pelajar premium, saya ingin akses semua tantangan premium,
    solusi, dan komunitas WhatsApp eksklusif.

38. Sebagai pelajar free, saya ingin preview tantangan premium (baca
    soal, workspace terkunci) agar saya punya alasan upgrade.

39. Sebagai pelajar, saya ingin promo periode (contoh premium gratis
    sampai tanggal tertentu) tampil jelas di banner.

40. Sebagai pelajar, saya ingin paket Gratis / Bulanan Rp69.000 /
    Tahunan Rp535.000 / Lifetime Rp999.000 dijelaskan sebelum bayar.

41. Sebagai pelajar, saya ingin bayar lewat Xendit (metode lokal
    Indonesia) agar transaksi familiar.

42. Sebagai pelajar, saya ingin mencoba free dulu karena kebijakan
    refund final/non-refundable.

43. Sebagai pelajar, saya ingin cheatsheet SQL fundamental gratis dari
    Store sebagai artefak ringkas.

44. Sebagai pelajar yang ingin mentoring, saya ingin opsi e-course
    terpisah (kulaSQL untuk Data Analisis Rp197.000) dengan review
    final project.

45. Sebagai pelajar, saya ingin e-book 50 Problem dan Solusi SQL
    (Rp97.000) sebagai referensi offline.

46. Sebagai admin konten, saya ingin menambah tantangan baru tiap bulan
    tanpa merusak progress user yang sudah ada.

47. Sebagai admin konten, saya ingin menandai tantangan free vs premium
    per item.

48. Sebagai admin konten, saya ingin tag dan kategori bisa diubah tanpa
    migrasi data user.

49. Sebagai founder, saya ingin menampilkan social proof 15.000+
    pelajar, 50.000+ latihan, rating 4.9/5 di landing.

50. Sebagai founder, saya ingin testimonial (LeetCode versi lokal,
    serasa main game, persiapan interview) di landing untuk menurunkan
    keraguan.

51. Sebagai support, saya ingin kanal email support dan WhatsApp terlihat di footer.

52. Sebagai user 13+, saya ingin syarat akun dan ToS jelas sebelum
    daftar.

53. Sebagai pelajar, saya ingin materi 100% Bahasa Indonesia (soal,
    hint, solusi, ensiklopedia) agar tidak tersandung bahasa.

54. Sebagai pelajar, saya ingin keluar dari tutorial hell: langsung
    nulis query dari soal pertama, bukan nonton berjam-jam.

55. Sebagai pelajar, saya ingin jejak progres yang kebaca agar semangat
    tidak habis di minggu kedua.

56. Sebagai pelajar mahir, saya ingin soal advanced (window function,
    CTE, optimasi, data quality) agar tidak cepat bosan.

57. Sebagai pelajar, saya ingin CTA primer 'Mulai Tantangan Gratis' dan
    sekunder 'Pilih Jalur Belajar' di hero.

58. Sebagai pelajar, saya ingin navigasi tetap: Belajar, Tantangan,
    Playbook, Ensiklopedia, Leaderboard, Masuk.

59. Sebagai pelajar yang belum login, saya ingin mengintip daftar
    tantangan dan landing tanpa dipaksa daftar di detik pertama.

60. Sebagai pelajar, saya ingin konfirmasi visual 'Sempurna! +XP'
    setelah submit benar.

61. Sebagai pelajar yang salah, saya ingin tahu expected vs actual
    (kolom/baris yang beda) tanpa langsung dibuka solusinya.

62. Sebagai pelajar, saya ingin reset percobaan soal tanpa kehilangan
    progress soal lain.

63. Sebagai pelajar, saya ingin share pencapaian (level/XP) ke sosial
    untuk motivasi sosial.

64. Sebagai tim produk, saya ingin membedakan tiga job-to-be-done: drill
    soal, belajar dari nol, dan pakai template di kerjaan.

65. Sebagai pelajar, saya ingin sandbox aman (tidak bisa DROP
    production, timeout query, limit baris) agar platform stabil.

66. Sebagai pelajar, saya ingin konsistensi dialect di satu tantangan
    (jangan campur MySQL dan Postgres di expected result).

67. Sebagai pelajar BigQuery-minded, saya ingin contoh fungsi khas
    (APPROX_QUANTILES) di ensiklopedia.

68. Sebagai pelajar Snowflake-minded, saya ingin contoh fungsi khas
    (BOOLOR_AGG, Cortex embedding) di ensiklopedia.

69. Sebagai pelajar, saya ingin footer legal (produk, platform, ToS) dan
    identitas legal pemilik produk di footer.

70. Sebagai pelajar, saya ingin Kelas Data video (coming soon) masuk
    waitlist tanpa mengganggu produk latihan yang sudah jalan.

## 12. Keputusan Implementasi (rekomendasi teknis)

*Bagian ini bukan kode internal platform sumber (tidak dipublikasikan),
melainkan keputusan yang konsisten dengan perilaku yang terlihat agar
rebuild/kompetitor tidak salah arsitektur.*

- Pisahkan CMS konten soal (prompt, hint, expected result, tag, flag
  premium) dari runtime eksekusi SQL.

- Grader membandingkan result set, bukan string query — biarkan solusi
  alternatif yang ekuivalen lulus.

- Normalisasi grader: nama kolom case-insensitive, urutan baris hanya
  dipaksa jika soal meminta ORDER BY.

- Sandbox memakai satu engine default yang prediktabel untuk soal
  (banyak platform sejenis memakai PostgreSQL atau SQLite/DuckDB
  in-process). Dialek ensiklopedia boleh dokumentatif dulu; runtime
  multi-engine adalah fase terpisah.

- Jika multi-engine dijanjikan di workspace (bukan hanya ensiklopedia),
  isolasi container/WASM per dialect dan siapkan test fixture per
  engine.

- Editor: Monaco atau CodeMirror dengan syntax SQL, keymap Run/Submit
  tidak bentrok dengan OS.

- XP dan completion ditulis atomically setelah grader PASS untuk
  menghindari double-grant.

- Gating premium di server, bukan hanya sembunyi tombol di UI.

- Hint dibuka per user per soal; audit trail berguna untuk analisis
  pedagogi (berapa banyak user butuh Hint 3).

- Tag dan kategori adalah taksonomi longgar; jangan hardcode enum di
  banyak service.

- Leaderboard di-cache; jangan full scan XP on read.

- Banner promo adalah feature flag berjangka waktu, bukan hardcode di
  frontend saja.

- Store bisa tetap di luar app inti (funnel digital product) agar
  billing kursus one-time tidak bercampur subscription.

### 12.1 Seams pengujian yang disarankan

- Grader: input result set vs expected → pass/fail + diff.

- Policy premium: user plan × resource → allow/deny.

- XP grant: event completion → saldo baru, idempotent.

- Catalog query: filter combination → daftar stabil.

- Billing webhook Xendit → status subscription.

## 13. Keputusan Pengujian

- Uji perilaku eksternal, bukan implementasi editor.

- Setiap tantangan baru wajib punya tes fixture: schema + seed +
  expected + minimal 1 query solusi yang PASS dan 1 query yang FAIL.

- Tes hint tidak bocor ke user free jika kebijakan menahan solusi.

- Tes regresi grader: ubah tipe data / NULL / urutan tidak boleh
  mengubah status soal lama secara massal tanpa review.

- Tes pembayaran: aktivasi, kadaluarsa bulanan, upgrade yearly,
  lifetime, promo window.

- Tes keamanan sandbox: tidak ada file system escape, tidak ada network
  keluar, DDL berbahaya ditolak atau di-rollback.

- Tes copy: sampel soal tidak mengandung istilah Inggris yang tidak
  diterjemahkan di prompt utama.

## 14. Monetisasi & Paket

| **Paket**       | **Harga**          | **Akses**                                    |
|-----------------|--------------------|----------------------------------------------|
| Gratis          | Rp 0               | Tantangan dasar; tanpa kartu kredit          |
| Premium Bulanan | Rp 69.000 / bulan  | Semua konten premium + solusi + komunitas WA |
| Premium Tahunan | Rp 535.000 / tahun | Sama; hemat Rp 293.000 vs 12 bulan           |
| Lifetime        | Rp 999.000 sekali  | Akses selamanya                              |

Kebijakan refund (ToS 24 Juli 2026): semua pembayaran final dan
non-refundable, termasuk batal di tengah periode dan ketidakpuasan.
Rekomendasi produk: coba Free dulu.

Pendapatan samping: e-course SQL Rp 197.000 (lifetime + review project
mentor), e-book Rp 97.000, cheatsheet gratis sebagai magnet lead.

### 14.1 Paywall yang adil

- Aha moment harus terjadi di free: user berhasil submit soal Mudah dan
  dapat XP.

- Paywall menempel di: solusi lengkap, mayoritas soal Sedang/Sulit,
  komunitas, mungkin Playbook/Kursus lanjutan (perilaku exact Kursus
  tidak sepenuhnya terbuka tanpa akun).

- Preview premium wajib tetap menampilkan judul + narasi agar nilai
  terasa.

## 15. Analisis Kompetitif (dari sinyal publik)

| **Pemain**                 | **Kekuatan vs kulaSQL**               | **Kelemahan vs kulaSQL**                           |
|----------------------------|----------------------------------------|-----------------------------------------------------|
| DataLemur / LeetCode SQL   | Bank soal interview global, brand kuat | EN-first, konteks US, pembayaran/harga kurang lokal |
| HackerRank / StrataScratch | Dikenal recruiter                      | UX kurang “belajar”, lebih ujian                    |
| DataCamp / Udemy           | Video + track rapi                     | Passive, mahal, kurang sandbox instan ID            |
| SQLBolt / Mode             | Gratis bagus untuk konsep              | Kurang gamifikasi, kurang ID, kurang jenjang kerja  |
| Kelas video lokal          | Bahasa Indonesia, mentor               | Koreksi lambat, setup, tidak 100+ grader otomatis   |

Testimonial organik yang diangkat produk: “Mirip DataLemur dan LeetCode
tapi versi lokal.” Itu positioning yang harus dijaga di kualitas soal,
bukan hanya di copy marketing.

## 16. Risiko, Asumsi, Ketergantungan

### 16.1 Asumsi

- SQL tetap skill \#1 di lowongan Data Analyst Indonesia dalam 24 bulan
  ke depan.

- Pelajar menerima freemium dan metode bayar Xendit.

- Sandbox in-browser cukup untuk 90% use case belajar (bukan
  production-scale).

### 16.2 Risiko

- Katalog 100 soal bisa terasa kecil dibanding LeetCode jika tidak diisi
  ulang tiap bulan.

- Kalau grader terlalu ketat (order/column alias), user frustrasi meski
  logikanya benar.

- Kalau grader terlalu longgar, sertifikat/progres kehilangan
  kredibilitas.

- Promo premium gratis berkepanjangan menekan konversi.

- Ensiklopedia 5 dialek mahal dirawat; risiko halaman usang.

- Sandbox abuse (loop berat) menaikkan biaya compute.

### 16.3 Ketergantungan

- Xendit untuk pembayaran.

- Provider auth Google.

- Engine SQL sandbox (dan kuota compute).

- WhatsApp sebagai saluran komunitas (bukan in-app chat).

## 17. Roadmap yang Konsisten dengan Situs

### Sekarang (sudah live)

- 100 tantangan + grader + hint + XP + leaderboard + ensiklopedia 5
  dialek + freemium + store.

### Berikutnya (tersirat dari copy & coming soon)

- Isi tantangan baru rutin (“terus nambah tiap bulan”).

- Challenge “lebih seru” sesuai permintaan testimonial.

- Kelas Data video dari praktisi (waitlist).

- Perdalam proyek nyata di jalur Kursus untuk portfolio.

### Backlog yang masuk akal (tidak diklaim live)

- Mode interview timer.

- Penjelasan diff expected vs actual yang lebih visual.

- Export sertifikat penyelesaian track.

- Company plan / batch kampus.

- Runtime multi-dialect sungguhan di workspace, bukan hanya docs.

## 18. Out of Scope

- Menyalin teks soal atau solusi berhak cipta dari situs sumber secara
  verbatim ke produk lain.

- Membangun fitur senjata/otomatisasi curang untuk ujian pihak ketiga.

- Menjamin penempatan kerja atau gelar resmi.

- Mendukung engine selain 5 dialek yang sudah dipilih, pada versi 1.

- Native mobile app (produk web-first).

- Kolaborasi realtime multiplayer pada satu query editor.

## 19. Definisi Selesai (Definition of Done) untuk V1 paritas

1.  Landing menyampaikan 3 jalur dan CTA free tanpa kartu kredit.

2.  User baru menyelesaikan 1 soal Mudah end-to-end di browser dalam \<
    10 menit.

3.  Katalog 100 soal terfilter 4 dimensi + search + progress 31/41/28.

4.  Grader PASS memberikan XP dan menandai selesai secara idempotent.

5.  Hint 3 tingkat + solusi ter-gate sesuai paket.

6.  Ensiklopedia 5 dialek bisa dibuka dari nav dan punya halaman detail
    fungsi.

7.  Paket harga 0 / 69rb / 535rb / 999rb aktif lewat Xendit.

8.  Leaderboard menampilkan ranking berdasarkan XP.

9.  ToS, kontak, dan identitas PT tampil; refund policy konsisten dengan
    checkout.

10. Copy utama Bahasa Indonesia, konteks soal Indonesia.

## 20. Lampiran — Fakta Observasi

### 20.1 Kutipan kunci landing

“Di sini kamu langsung ngerjain 100+ soal yang dicek otomatis tiap
submit. Kalau stuck ada hints, mentok pun ada solusinya. Semua jalan di
browser, ga usah install apa-apa.”

Belajar sendirian: nonton pasif, setup ribet, salah tidak ketahuan,
stuck lalu nyerah, progres tidak kebaca. Di kulaSQL: tulis query dari
soal pertama, sandbox siap, feedback instan, hint sampai solusi,
XP/level/leaderboard.

### 20.2 Testimoni yang diangkat

- Faraj Hafidh — “Jarang ada website kayak gini di Indonesia. Mirip
  DataLemur dan LeetCode tapi versi lokal.”

- Bima Syahrul — praktis, murah, challenging, leaderboard.

- Shelyn — serasa main game, pemula friendly.

- Dara Mahardika — persiapan interview, pertanyaan beragam.

- Ridho Hafiz — syntax sampai kegunaan jelas.

- Riel — soal sesuai tingkat, ada solusi saat stuck.

### 20.3 Sumber yang dipakai

- Landing kulaSQL
- Katalog tantangan `/kulasql/challenges`
- Halaman ToS / paket harga
- Store (cheatsheet, e-course, e-book)
- Ensiklopedia fungsi per dialek
- FAQ homepage

### 20.4 Catatan ketelitian

Angka pelajar, latihan, dan rating adalah klaim marketing di situs,
tidak diaudit independen dalam dokumen ini. Detail silabus tiap modul
Kursus dan isi 100 item Playbook tidak sepenuhnya terekspos tanpa akun;
persyaratan tetap memaksa keberadaan modul tersebut sesuai janji
landing. Promo premium gratis sampai 5 September 2026 bersifat temporal.

*— Akhir dokumen PRD kulaSQL v1.0 —*
