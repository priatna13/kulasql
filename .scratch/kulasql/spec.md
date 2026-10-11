# PRD — kulaSQL (beta)

**Status:** ready-for-agent

**Produk:** kulaSQL — platform latihan SQL interaktif berbahasa Indonesia

**Lingkup rilis:** beta test, tanpa pembayaran

**Sumber:** `PRD-kulaSQL.md` v1.0 (4 September 2026), disintesis ulang untuk agent

**Seam pengujian yang dikunci:**

1. Loop Tantangan
2. Katalog Tantangan
3. Akun & jejak progres

Seam Paket (Xendit, paywall, langganan) **tidak dibangun** di PRD ini. Dirancang ulang saat go public.

---

## Problem Statement

Saya sudah nonton tutorial SQL, tapi freeze saat harus nulis query sendiri. Setup PostgreSQL/MySQL lokal, dataset, dan tool terasa ribet sebelum soal pertama selesai. Materi bagus mayoritas berbahasa Inggris dan memakai nama kolom/konteks luar negeri. Kalau query saya salah, tidak ada yang bilang di mana salahnya; akhirnya nyerah. Tidak ada jejak progres, jadi semangat habis di minggu kedua.

Yang sudah kerja butuh template query, bukan kurikulum dari nol. Fresh graduate butuh drill mirip interview, bukan hanya teori SELECT. Saya ingin bisa SQL yang dipakai data analyst: langsung menulis dan mengoreksi query di browser, supaya kebiasaan terbentuk tanpa setup dan tanpa menunggu mentor.

## Solution

kulaSQL adalah platform latihan SQL di browser. Janji intinya: “Bisa SQL dari nulis query.” Saya tidak menonton tutorial dulu. Saya menulis query pada 100+ tantangan bertingkat, menjalankannya di sandbox, dan mendapat validasi otomatis plus XP.

Tiga jalur belajar dipisah secara eksplisit: Latihan (drill 100+ soal), Kursus (SQL 101 sampai mahir + proyek nyata), dan Playbook (100 query siap pakai di kerjaan). Di sekitarnya ada Ensiklopedia 5 dialek, Leaderboard, dan tautan sibling spreadsheet plus Dataset.

Selama beta, seluruh konten SQL terbuka tanpa kartu kredit dan tanpa checkout. Flag premium di CMS boleh ada untuk persiapan go public, tetapi tidak mengunci workspace, hint, atau solusi. Pembayaran, paket harga, dan paywall ditunda sampai produk go public.

## User Stories

1. Sebagai calon pelajar, saya ingin memahami proposisi nilai kulaSQL dalam 10 detik di halaman landing, agar saya tahu apakah produk ini untuk saya.

2. Sebagai calon pelajar, saya ingin melihat headline “Bisa SQL dari nulis query” plus subhead soal dicek otomatis, hint, dan solusi di browser, agar janji produk kebaca tanpa scroll panjang.

3. Sebagai calon pelajar, saya ingin trust chip Tanpa instalasi · Gratis untuk mulai · Feedback instan, agar gesekan adopsi terasa rendah.

4. Sebagai calon pelajar, saya ingin CTA primer “Mulai Tantangan Gratis” dan CTA sekunder “Pilih Jalur Belajar”, agar saya bisa masuk lewat drill atau lewat jalur belajar.

5. Sebagai calon pelajar, saya ingin melihat perbandingan tutorial hell versus kulaSQL di landing, agar alasan pindah dari YouTube jelas.

6. Sebagai founder, saya ingin menampilkan social proof 15.000+ pelajar, 50.000+ latihan, 100+ tantangan, rating 4.9/5 di landing, agar keraguan awal turun. Angka ini klaim marketing, bukan metrik yang diuji kebenarannya di beta.

7. Sebagai founder, saya ingin testimonial (LeetCode versi lokal, serasa main game, persiapan interview) di landing, agar calon pelajar mendengar suara orang Indonesia.

8. Sebagai pelajar yang belum login, saya ingin mengintip landing dan daftar tantangan tanpa dipaksa daftar di detik pertama, agar saya bisa menilai produk dulu.

9. Sebagai pemula SQL, saya ingin mulai latihan tanpa instalasi database, agar saya tidak putus di tahap setup.

10. Sebagai pemula SQL, saya ingin soal pertama memakai konteks bisnis Indonesia (TokoKulwon, kota, pelanggan, rupiah), agar materi terasa dekat.

11. Sebagai pelajar, saya ingin mendaftar dengan Google atau email tanpa kartu kredit, agar gesekan onboarding rendah.

12. Sebagai user 13+, saya ingin syarat akun dan ToS jelas sebelum daftar, agar saya tahu aturan main.

13. Sebagai sistem, saya ingin menolak atau membatasi akun di bawah 13 tahun sesuai ToS, agar kelayakan usia terpenuhi.

14. Sebagai pelajar, saya ingin logout dan merasa password saya tidak dibagikan, agar sesi aman.

15. Sebagai pelajar, saya ingin progres (soal selesai, XP, level) tersimpan lintas sesi dan ganti perangkat setelah login, agar semangat tidak reset.

16. Sebagai pelajar tamu, saya ingin menekan Run Query pada soal Mudah tanpa akun, agar aha moment terjadi dalam lima menit.

17. Sebagai pelajar tamu, saya ingin Submit Answer yang akan memberi XP menuntut saya daftar/masuk dulu, lalu submit diulang, agar progres tidak hilang anonim.

18. Sebagai pelajar, saya ingin navigasi tetap Belajar · Tantangan · Playbook · Ensiklopedia · Leaderboard, plus Masuk di kanan, agar saya tidak tersesat.

19. Sebagai pelajar, saya ingin switcher produk “KULASQL ▾” ke sibling spreadsheet, agar saya bisa pindah latihan di ekosistem yang sama tanpa kehilangan akun.

20. Sebagai pelajar, saya ingin banner atas tidak menjanjikan grant premium berbayar selama beta, agar tidak ada CTA bayar yang menyesatkan.

21. Sebagai pelajar, saya ingin katalog menampilkan minimal 100 tantangan dengan nama, kategori, dan tingkat, agar saya melihat peta latihan.

22. Sebagai pelajar, saya ingin tingkat Mudah, Sedang, Sulit dengan distribusi 31 / 41 / 28, agar jenjang terasa seimbang.

23. Sebagai pelajar, saya ingin filter Tingkat Kesulitan, agar saya tidak lompat terlalu jauh.

24. Sebagai pelajar, saya ingin filter Kategori (contoh SQL Dasar), agar saya fokus satu topik.

25. Sebagai pelajar, saya ingin filter Status (belum dikerjakan / selesai), agar saya tahu apa yang tersisa. Status “terkunci premium” tidak dipakai di beta.

26. Sebagai pelajar, saya ingin filter Tag (SELECT, filtering, group_by, case_when, aggregation, data_quality, beginner, intermediate, advanced, dan tag lain yang ada), agar saya drill skill spesifik.

27. Sebagai pelajar, saya ingin menggabung beberapa filter sekaligus plus kotak “Cari tantangan...”, agar daftar yang muncul sesuai niat saya.

28. Sebagai pelajar, saya ingin hasil filter dan cari stabil urutannya saat saya ulangi kombinasi yang sama, agar saya tidak kehilangan soal.

29. Sebagai pelajar, saya ingin pencarian teks bebas menemukan judul atau potongan nama tantangan, agar saya cepat ke soal tertentu.

30. Sebagai pelajar, saya ingin pagination atau window (25 dari 100), agar daftar tidak overwhelm.

31. Sebagai pelajar, saya ingin sidebar progress: persen, X/100 selesai, bar Mudah/Sedang/Sulit, agar peta konten kebaca.

32. Sebagai pelajar, saya ingin tag cloud dengan count, agar saya melihat skill mana yang banyak soalnya.

33. Sebagai pelajar, saya ingin status visual per baris (circle kosong / selesai), agar progres terlihat di katalog.

34. Sebagai admin konten, saya ingin flag premium tetap bisa dipasang per tantangan di CMS, agar go public nanti tidak migrasi data. Di beta flag itu tidak mengunci apa pun.

35. Sebagai pelajar beta, saya ingin semua tantangan — termasuk yang ditandai premium di CMS — bisa dibuka workspacenya, agar beta terasa penuh.

36. Sebagai pelajar, saya ingin setiap tantangan punya prompt berbahasa Indonesia dengan konteks bisnis, agar saya tahu tugasnya.

37. Sebagai pelajar, saya ingin melihat skema tabel (nama kolom, tipe, sample) di panel soal, agar saya tahu dari mana menulis SELECT.

38. Sebagai pelajar, saya ingin editor SQL berbaris nomor, tema gelap, font mono, agar menulis query nyaman.

39. Sebagai pelajar, saya ingin shortcut Ctrl+Enter untuk Run dan Ctrl+Shift+Enter untuk Submit, agar alur cepat dan tidak bentrok dengan OS.

40. Sebagai pelajar, saya ingin aksi Run Query menjalankan SQL ke sandbox dan menampilkan result set, agar saya bisa debug sendiri sebelum dinilai.

41. Sebagai pelajar, saya ingin aksi Submit Answer memvalidasi result set saya terhadap expected result, agar penilaian objektif.

42. Sebagai pelajar, saya ingin meta hasil: jumlah baris dan waktu eksekusi, agar saya belajar berpikir tentang output.

43. Sebagai pelajar, saya ingin sukses menampilkan “Sempurna!” dan penambahan XP (nilai boleh bervariasi, contoh +50), agar progres terasa seperti game.

44. Sebagai pelajar, saya ingin grant XP dan tanda selesai bersifat idempotent: submit benar berulang pada soal yang sama tidak menambah XP dua kali, agar leaderboard adil.

45. Sebagai pelajar yang salah, saya ingin umpan balik actionable, bukan hanya “salah”, agar saya tahu apa yang diperbaiki.

46. Sebagai pelajar yang salah, saya ingin tahu expected vs actual (kolom/baris yang beda) tanpa langsung dibuka solusinya, agar saya masih bisa berpikir.

47. Sebagai pelajar, saya ingin error engine SQL ditampilkan ramah (syntax error, column not found) plus terjemahan jika perlu, agar saya tidak membaca stack trace mentah.

48. Sebagai pelajar, saya ingin query berbahaya atau berat dihentikan (timeout / limit baris), agar platform tetap hidup.

49. Sebagai pelajar, saya ingin sandbox terisolasi per eksekusi, tanpa side effect ke user lain dan tanpa DROP production, agar saya berani bereksperimen.

50. Sebagai pelajar, saya ingin satu tantangan memakai satu dialek runtime yang konsisten, jangan campur MySQL dan Postgres di expected result, agar saya tidak dihukum karena beda dialect.

51. Sebagai pelajar, saya ingin grader membandingkan result set, bukan string query, agar solusi alternatif yang ekuivalen tetap lulus.

52. Sebagai pelajar, saya ingin nama kolom dinilai case-insensitive, dan urutan baris hanya dipaksa jika soal meminta ORDER BY, agar logika benar tidak gagal karena alias.

53. Sebagai pelajar, saya ingin menyimpan draf query per tantangan, agar saya bisa lanjut besok.

54. Sebagai pelajar, saya ingin reset percobaan soal tanpa kehilangan progress soal lain, agar saya bisa mengulang satu soal dengan tenang.

55. Sebagai pelajar yang stuck, saya ingin membuka Hint 1, Hint 2, lalu Hint 3 secara sadar dan bertingkat, agar saya tidak langsung melihat jawaban.

56. Sebagai pelajar, saya ingin Hint 1 mengarah ke konsep, Hint 2 ke pola query, Hint 3 mendekati solusi tanpa full copy bila memungkinkan, agar bantuan pedagogis bertahap.

57. Sebagai pelajar beta, saya ingin solusi utuh plus penjelasan Bahasa Indonesia tersedia tanpa paywall, agar saya paham kenapa query itu benar saat mentok.

58. Sebagai pelajar, saya ingin solusi menjelaskan “kenapa”, bukan hanya dump SQL, agar saya belajar pola, bukan menyalin.

59. Sebagai pelajar jalur Kursus, saya ingin jalur linier SQL 101 hingga mahir, agar saya tidak bingung urutan belajar.

60. Sebagai pelajar jalur Kursus, saya ingin Level 1 SELECT/WHERE/JOIN/agregasi, Level 2 GROUP BY/subquery/CASE, Level 3 window/CTE/optimasi, agar jenjang selaras dengan blog publik.

61. Sebagai career switcher, saya ingin proyek nyata sebagai capstone yang bisa masuk portfolio, agar saya punya bukti kerja, bukan cuma badge.

62. Sebagai tim produk, saya ingin Kursus tidak menggantikan katalog drill, agar tiga job-to-be-done (drill, belajar dari nol, template kerja) tetap terpisah.

63. Sebagai analis yang sudah kerja, saya ingin Playbook berisi sekitar 100 query siap pakai skenario kerja, agar saya bisa copy-adaptasi ke pekerjaan.

64. Sebagai analis, saya ingin setiap item Playbook bisa dicopy, agar saya tidak hanya membaca.

65. Sebagai pelajar, saya ingin Ensiklopedia fungsi SQL untuk lima dialek: PostgreSQL, MySQL, BigQuery, Snowflake, DuckDB, agar saya cek syntax saat latihan.

66. Sebagai pelajar, saya ingin indeks fungsi per dialek (contoh PostgreSQL ~183 fungsi) dengan filter kategori, agar saya menemukan fungsi cepat.

67. Sebagai pelajar PostgreSQL, saya ingin halaman fungsi berisi deskripsi ID, tipe hasil, syntax copyable, parameter, contoh hasil tabel, ekuivalen dialek lain, dan FAQ pendek.

68. Sebagai pelajar yang pindah stack, saya ingin membandingkan fungsi antar dialek (contoh DATEDIFF vs AGE vs DATE_DIFF), agar saya tidak hafal salah dialect.

69. Sebagai pelajar BigQuery-minded, saya ingin contoh fungsi khas (APPROX_QUANTILES) di ensiklopedia, agar referensi tidak hanya ANSI minimum.

70. Sebagai pelajar Snowflake-minded, saya ingin contoh fungsi khas (BOOLOR_AGG, Cortex embedding) di ensiklopedia, agar halaman terasa modern.

71. Sebagai pelajar, saya ingin naik level berdasarkan XP, agar saya punya tujuan jangka menengah.

72. Sebagai pelajar kompetitif, saya ingin leaderboard publik atau semipublik antar pelajar berdasarkan XP, agar saya punya alasan kembali setiap hari.

73. Sebagai pelajar, saya ingin share pencapaian (level/XP) ke sosial, agar motivasi sosial muncul.

74. Sebagai pelajar interview, saya ingin soal menyerupai studi kasus data analyst (laporan marketing, pelanggan VIP, produk terlaris), agar saya siap screening teknis.

75. Sebagai pelajar mahir, saya ingin soal advanced (window function, CTE, optimasi, data quality), agar tidak cepat bosan.

76. Sebagai pelajar, saya ingin peta skill katalog menutup SELECT sampai window/CTE plus perbedaan dialek di dokumentasi, agar jenjang lengkap.

77. Sebagai pelajar, saya ingin prompt tidak ambigu: output kolom dan aturan urutan tersirat atau tersurat, agar expected result deterministik.

78. Sebagai pelajar, saya ingin satu tantangan = satu ide utama (boleh gabung dua ide di Sulit, tidak lebih), agar soal tidak campur aduk.

79. Sebagai pelajar mobile, saya ingin bisa baca soal di HP meskipun editor nyaman di desktop, agar saya review di perjalanan.

80. Sebagai pelajar, saya ingin dataset bisnis Indonesia (contoh Warmindo Lite) untuk portfolio di luar tantangan SQL, agar saya punya bahan analisis.

81. Sebagai pelajar, saya ingin cheatsheet SQL fundamental gratis dari Store sebagai artefak ringkas, agar saya punya ringkasan offline. Produk Store berbayar tidak dijual di beta.

82. Sebagai pelajar, saya ingin Kelas Data video (coming soon) masuk waitlist tanpa mengganggu produk latihan yang sudah jalan, agar minat tercatat.

83. Sebagai pelajar, saya ingin materi 100% Bahasa Indonesia (soal, hint, solusi, ensiklopedia, UI), agar tidak tersandung bahasa.

84. Sebagai pelajar, saya ingin error engine boleh tetap berbahasa Inggris asal ada terjemahan/penjelasan manusia, agar tetap bisa diperbaiki.

85. Sebagai admin konten, saya ingin menambah tantangan baru tiap bulan tanpa merusak progress user yang sudah ada, agar katalog tumbuh.

86. Sebagai admin konten, saya ingin tag dan kategori bisa diubah tanpa migrasi data user, agar taksonomi longgar.

87. Sebagai admin konten, saya ingin setiap tantangan baru wajib punya fixture: schema, seed, expected, minimal satu query solusi yang PASS dan satu yang FAIL, agar grader tidak buta.

88. Sebagai support, saya ingin kanal email support dan (jika ada) komunitas terlihat di footer, agar pelajar tahu ke mana bertanya. Komunitas WhatsApp eksklusif berbayar tidak diwajibkan di beta.

89. Sebagai pelajar, saya ingin footer legal (produk, ToS, privasi, identitas badan hukum) tampil, agar kepercayaan dasar ada.

90. Sebagai pelajar, saya ingin time-to-interactive workspace terasa cepat (target < 3 detik pada koneksi Indonesia pada umumnya), agar tidak menunggu blank screen.

91. Sebagai pelajar, saya ingin Run Query p50 < 500 ms untuk soal standar, agar feedback terasa instan.

92. Sebagai pelajar, saya ingin progres tidak hilang saat refresh setelah login, agar sesi belajar malam aman.

93. Sebagai pelajar, saya ingin fokus keyboard di editor dan label tombol jelas, agar aksesibilitas minimum terpenuhi.

94. Sebagai pelajar, saya ingin kontras teks hero memadai, agar landing terbaca.

95. Sebagai pelajar, saya ingin membuka tantangan dari katalog ke `/kulasql/challenges/:slug` dan kembali ke katalog dengan filter yang saya pakai tidak “lupa” secara mengejutkan, agar alur katalog → soal → katalog utuh.

96. Sebagai pelajar, saya ingin melihat contoh soal seperti “Hari Pertama di TokoKulwon”, “Laporan untuk Tim Marketing”, “Mencari Pelanggan dari Jakarta”, agar katalog terasa lokal, bukan sakila/northwind generik semata.

97. Sebagai pelajar yang belum pilih jalur, saya ingin halaman `/kulasql` menjelaskan tiga jalur (Latihan, Kursus, Playbook) lalu mengantar ke salah satunya, agar job-to-be-done tidak campur.

98. Sebagai pelajar, saya ingin platform hub `/` menampilkan SQL + spreadsheet + Dataset + FAQ, agar ekosistem kebaca tanpa memaksa saya bayar.

99. Sebagai pelajar, saya ingin hint yang sudah saya buka tetap terbuka di kunjungan berikutnya pada soal yang sama, agar saya tidak mengulang klik.

100. Sebagai tim pedagogi, saya ingin ada jejak hint keberapa yang dibuka per user per soal, agar nanti bisa dianalisis (berapa banyak yang butuh Hint 3) tanpa menampilkan paywall.

101. Sebagai pelajar, saya ingin leaderboard tidak telat jauh dari XP yang baru saya dapat, agar kompetisi terasa hidup. Cache boleh ada asal tetap terasa mutakhir.

102. Sebagai pelajar, saya ingin menandai tantangan selesai di daftar setelah grader PASS, agar circle katalog dan sidebar progress bergerak bersama.

103. Sebagai pelajar, saya ingin jika saya gagal Submit, status soal tetap “belum selesai” dan XP tidak berkurang, agar hukuman tidak berlebihan.

104. Sebagai pelajar, saya ingin DDL berbahaya ditolak atau di-rollback di sandbox, agar saya tidak merusak soal orang lain.

105. Sebagai pelajar, saya ingin tidak wajib install extension, Docker, atau client SQL, agar janji zero-install ditepati.

106. Sebagai pelajar, saya ingin workspace siap pakai: schema dan seed sudah hidup di soal, agar saya langsung SELECT.

107. Sebagai pelajar, saya ingin copy sampel soal tidak mencampur istilah Inggris yang tidak diterjemahkan di prompt utama, agar standar bahasa terjaga.

108. Sebagai operator beta, saya ingin tidak ada checkout, harga paket, tombol upgrade, atau webhook pembayaran di UI maupun API, agar tes beta tidak tersandung billing.

109. Sebagai operator beta, saya ingin CTA tetap memakai bahasa “gratis / mulai latihan”, bukan “langganan / lifetime”, agar ekspektasi pelajar sesuai fase.

110. Sebagai founder, saya ingin catatan bahwa paket Rp 0 / 69.000 / 535.000 / 999.000, Xendit, refund, dan komunitas WA berbayar akan diramaikan saat go public, agar keputusan itu tidak hilang — tetapi tidak diimplementasi sekarang.

## Implementation Decisions

- Produk web-first, copy dan konten 100% Bahasa Indonesia. Analogi yang dijaga: DataLemur / LeetCode SQL versi lokal Indonesia, practice-first, bukan video-first.

- Modul yang dibangun di beta: landing + chrome global, auth, katalog tantangan, workspace soal (editor + Run + Submit), sandbox SQL, grader, hint bertingkat + solusi, XP/level/leaderboard, Kursus, Playbook, Ensiklopedia 5 dialek, store khusus cheatsheet gratis, waitlist Kelas Data, tautan sibling spreadsheet dan Dataset. Modul yang **tidak** dibangun: billing, paywall, Xendit, paket harga, grant premium berjangka, store berbayar, komunitas WhatsApp sebagai benefit berbayar.

- CMS konten soal dipisah dari runtime eksekusi SQL. Konten memuat: judul, slug, prompt, kategori, tingkat, tag, skema, seed, expected result, XP reward, hint 1–3, solusi + penjelasan, flag free/premium. Flag premium disimpan tetapi **tidak di-enforce** di beta.

- Runtime sandbox memakai **satu engine default yang prediktabel** untuk semua tantangan (PostgreSQL atau DuckDB/SQLite in-process — pilih satu dan konsisten). Ensiklopedia 5 dialek bersifat dokumentatif dulu. Runtime multi-engine di workspace adalah fase terpisah, bukan beta.

- Grader membandingkan result set, bukan string query. Normalisasi: nama kolom case-insensitive; urutan baris hanya dipaksa jika soal meminta ORDER BY; NULL dan tipe harus deterministik per fixture. Solusi alternatif yang ekuivalen harus lulus.

- XP dan completion ditulis atomically setelah grader PASS. Submit berulang yang sudah PASS tidak double-grant.

- Hint dibuka per user per soal, berurutan 1 kemudian 2 kemudian 3. Solusi di beta tersedia untuk pelajar yang sudah login; tidak digate paket. Jejak pembukaan hint disimpan untuk analisis pedagogi.

- Tamu boleh melihat landing, katalog, dan Run Query pada soal Mudah. Submit yang mengubah progres/XP menuntut sesi login; setelah daftar, submit bisa diulang tanpa kehilangan query di editor.

- Auth: Google atau email. Usia minimum 13 sesuai ToS. Sesi bisa logout. Progres terikat akun, bukan browser saja.

- Tag dan kategori adalah taksonomi longgar, bukan enum yang di-hardcode di banyak service.

- Leaderboard di-cache dari saldo XP; jangan full scan on every read. Ranking berubah sebagai akibat grant XP, bukan seam terpisah.

- Editor: Monaco atau CodeMirror, syntax SQL, keymap Run (Ctrl+Enter) dan Submit (Ctrl+Shift+Enter) tidak bentrok dengan OS.

- Query berbahaya: timeout, limit baris, isolasi per eksekusi, DDL berbahaya ditolak atau di-rollback, tidak ada filesystem escape, tidak ada network keluar.

- Gating premium di server **tidak diaktifkan** di beta. Jangan sembunyikan tombol di UI sambil tetap mengunci API — selama beta, API konten SQL terbuka untuk pelajar login.

- Banner promo grant premium berjangka **tidak dipasang** di beta. Feature flag boleh ada di CMS dalam keadaan mati.

- Store di luar app inti. Di beta hanya cheatsheet gratis sebagai magnet. E-course dan e-book berbayar ditunda.

- Rute yang harus hidup: `/` hub platform; `/kulasql` on-ramp 3 jalur; `/kulasql/challenges` katalog; `/kulasql/challenges/:slug` workspace; Kursus; Playbook; `/functions/sql/{dialect}` dan `/functions/sql/{dialect}/{fn}` ensiklopedia; Leaderboard; `/store` (cheatsheet); `/tos`; `/signin`.

- Katalog: filter 4 dimensi (tingkat, kategori, status, tag) + search + pagination ~25 per halaman + sidebar 31/41/28. Status beta: belum dikerjakan | selesai. Jangan tampilkan locked.

- Anatomi tantangan wajib: judul ID bertema kerja, narasi bisnis, skema sandbox, expected deterministik, XP, hint 1–3, solusi + penjelasan, satu ide utama.

- Kursus: jalur linier SQL 101 → mahir + capstone proyek nyata. Bukan pengganti katalog.

- Playbook: ~100 query template, copyable, skenario kerja.

- Ensiklopedia: PostgreSQL, MySQL, BigQuery, Snowflake, DuckDB; halaman fungsi dengan syntax, param, contoh, ekuivalen, FAQ.

- NFR yang mengikat implementasi: TTI workspace < 3 s; Run p50 < 500 ms soal standar; progres persist setelah login; browser modern desktop; mobile readable untuk baca soal; tanpa install client SQL.

- Identitas legal, ToS, privasi di footer. Kebijakan refund/harga tidak ditampilkan sebagai checkout karena checkout tidak ada; ToS boleh menyebut fase beta.

- Saat go public nanti, seam Paket akan dirancang terpisah: Xendit, paket Rp 0 / 69.000 / 535.000 / 999.000, gating server untuk solusi + soal premium + komunitas WA, preview workspace terkunci, banner promo. Jangan mengantisipasi kontrak API pembayaran di beta selain menyimpan flag premium di CMS.

## Testing Decisions

Tes yang baik hanya mengunci **perilaku eksternal**, bukan detail implementasi editor, cache, atau ORM. Tidak ada tes yang mengikat file path atau widget internal. Prior art tidak ada: repo greenfield, belum ada suite.

Tiga seam — dan hanya tiga — yang diuji sebagai kontrak beta:

1. **Loop Tantangan** — diberi Tantangan (skema, seed, expected result) dan query: Run mengembalikan result set (baris, waktu); Submit mengembalikan lulus/gagal plus diff result set; pada PASS, completion dan XP ter-grant sekali (idempotent); pada FAIL, progres soal tidak selesai dan XP tidak berubah. Hint 1–3 terbuka berurutan. Solusi bisa dibaca pelajar login. Query berat/berbahaya timeout atau ditolak. Leaderboard adalah bacaan turunan XP setelah grant, bukan seam keempat.

2. **Katalog Tantangan** — diberi kombinasi tingkat, kategori, status (belum/selesai), tag, search, pagination: mengembalikan daftar terurut yang **stabil** untuk input yang sama, lengkap progress X/100 dan bar 31/41/28, tanpa status terkunci. Tantangan berflag premium di CMS tetap muncul dan bisa dibuka.

3. **Akun & jejak progres** — tamu melihat landing + katalog + Run soal Mudah tanpa akun; Submit yang mengubah XP menuntut login; setelah Google/email, progres, XP, level, dan draf tersimpan lintas sesi; logout memutus sesi; akun <13 ditolak sesuai ToS.

Cakupan tes per seam:

- Loop: fixture tiap tantangan baru (schema + seed + expected + 1 query PASS + 1 query FAIL); regresi grader (NULL, urutan, alias kolom, tipe) tidak boleh mengubah status soal lama secara massal tanpa review; sandbox menolak escape/DDL berbahaya; copy prompt utama berbahasa Indonesia.

- Katalog: kombinasi filter tidak boleh menghasilkan urutan acak; search kosong vs ketemu vs tidak ketemu; pagination 25/100; sidebar mengikuti completion dari seam 1.

- Akun: grant XP sebelum login tidak terjadi; setelah login, replay submit berhasil dan idempotent; ganti perangkat (sesi baru) tetap melihat soal selesai.

Yang **tidak** ditest di PRD ini: webhook Xendit, aktivasi langganan, kadaluarsa bulanan, upgrade yearly, lifetime, promo window berbayar, paywall solusi, preview workspace terkunci.

## Out of Scope

- Semua pembayaran dan monetisasi in-app: Xendit, paket Gratis/Bulanan/Tahunan/Lifetime sebagai checkout, refund, paywall, preview premium terkunci, banner grant premium, komunitas WhatsApp sebagai benefit berbayar, e-course berbayar, e-book berbayar.

- Membangun ulang modul spreadsheet secara detail (hanya sibling di switcher).

- Video LMS penuh / Kelas Data besides waitlist.

- Python/pandas playground, dbt, BI authoring.

- Sertifikasi resmi industri atau penyaluran kerja.

- Multi-tenant enterprise LMS untuk HR.

- Native mobile app.

- Kolaborasi realtime multiplayer pada satu editor.

- Runtime multi-dialect sungguhan di workspace (lima dialek hanya di ensiklopedia).

- Engine di luar lima dialek dokumentatif.

- Mode interview timer, sertifikat track, company/kampus plan — backlog setelah beta.

- Menyalin teks soal atau solusi berhak cipta dari situs lain secara verbatim.

- Fitur otomatisasi curang untuk ujian pihak ketiga.

- Menjamin penempatan kerja atau gelar resmi.

## Further Notes

- Positioning yang dijaga: untuk orang Indonesia yang ingin bisa SQL seperti data analyst; berbeda dari YouTube karena nulis query dari menit pertama; berbeda dari LeetCode/DataLemur karena bahasa Indonesia dan kasus lokal.

- Persona primer: fresh graduate interview, karyawan upgrade SQL, career switcher, marketing/finance/ops yang butuh SQL harian. Bukan target: DBA administrasi server, data engineer pipeline, peneliti SQL akademik murni.

- Job-to-be-done yang harus tetap terpisah di IA: drill soal, belajar dari nol, pakai template di kerjaan.

- Traction di landing adalah klaim situs, tidak diaudit di dokumen ini.

- Definisi selesai beta (paritas belajar, tanpa billing): landing 3 jalur + CTA tanpa kartu kredit; user baru menyelesaikan 1 soal Mudah end-to-end di browser dalam < 10 menit; katalog 100 soal terfilter + search + progress 31/41/28; grader PASS memberi XP dan menandai selesai secara idempotent; hint 3 tingkat + solusi terbuka bagi pelajar login; ensiklopedia 5 dialek hidup; leaderboard berdasarkan XP; ToS/kontak/identitas PT di footer; copy utama Bahasa Indonesia; **tidak ada** checkout.

- Risiko yang tetap relevan tanpa pembayaran: grader terlalu ketat atau terlalu longgar; katalog 100 terasa kecil jika tidak diisi ulang; sandbox abuse menaikkan biaya compute; ensiklopedia 5 dialek mahal dirawat.

- Ketergantungan beta: provider auth Google, engine SQL sandbox dan kuota compute. Bukan ketergantungan beta: Xendit, WhatsApp berbayar.

- Saat go public, buka PRD terpisah khusus seam Paket. Jangan menempel desain pembayaran di implementasi beta “sekalian”.
