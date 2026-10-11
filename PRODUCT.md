# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Kode UI di `frontend/`, kode API dan data di `backend/`. Vite + React + React Router. API: Hono (pustaka MIT, bukan layanan berbayar). Data akun/progres: Neon Postgres. Sandbox SQL pelajar: DuckDB WASM di browser. Satu engine prediktabel di workspace; lima dialek Ensiklopedia bersifat dokumentatif. Bukan Next.js, bukan app native, bukan HTML statis.

**Belum tersimpan:** jalur bangun visual (comp-first vs code-first). Tidak ditulis ke config; ditanya lagi saat implementasi UI.

## Users

Utara: pelajar Indonesia (fresh graduate / career switcher) di kamar/kos, malam, laptop, mau nulis query pertama dalam lima menit.

Dilayani tanpa jadi utara visual: karyawan yang upgrade SQL (Playbook, drill singkat); marketing/finance/ops yang butuh SQL harian. Bukan target: DBA administrasi server, data engineer pipeline, peneliti SQL akademik.

## Product Purpose

kulaSQL adalah platform latihan SQL di browser. Mekanisme: pelajar menulis query pada Tantangan, menjalankan di sandbox, mendapat validasi otomatis plus XP. Janji: “Bisa SQL dari nulis query.” Mengganti tutorial pasif dan setup database lokal.

Sukses beta: user baru menyelesaikan 1 soal Mudah end-to-end di desktop dalam < 10 menit, tanpa kartu kredit, tanpa instalasi.

## Positioning

DataLemur / LeetCode SQL versi lokal Indonesia: bahasa dan kasus kerja (TokoKulwon, kota, rupiah), bukan video-first, bukan ujian recruiter. Berbeda dari kelas lokal karena grader otomatis di browser.

## Operating Context

Desktop (laptop di kos) adalah permukaan latihan. HP untuk baca soal, landing, dan CTA — bukan untuk nulis query. Tiga jalur: Latihan (katalog drill), Kursus (SQL 101 → mahir + capstone), Playbook (template kerja). Ritual: buka soal → tulis SQL → Run Query → lihat hasil → Submit Answer → cap “Sempurna!” + XP. Beta tanpa pembayaran, tanpa paywall.

## Capabilities and Constraints

- Katalog ~100 Tantangan, filter, search, progres; workspace editor; hint 1–3; solusi terbuka bagi pelajar login; XP/level/leaderboard; Ensiklopedia 5 dialek (docs); Kursus; Playbook.
- Tamu: Run Query soal Mudah. Submit yang grant XP menuntut login (Google atau email). Usia minimum 13.
- Tidak di beta: Xendit, paket harga, checkout, paywall, banner grant premium, store berbayar, komunitas WA sebagai benefit berbayar, runtime multi-engine di workspace.
- Flag premium boleh ada di CMS, tidak di-enforce.
- Copy dan soal 100% Bahasa Indonesia. Error engine boleh Inggris plus penjelasan manusia.

## Brand Commitments

- Nama: **kulaSQL**. Headline: “Bisa SQL dari nulis query.”
- Suara: bahasa manusia, bukan dokumentasi vendor. Lokal di **copy dan soal** (nama, kota, rupiah, TokoKulwon) — bukan ornamen batik, merah-putih sebagai merek, atau maskot.
- Trust chip: Tanpa instalasi · Gratis untuk mulai · Feedback instan.
- CTA primer: Mulai Tantangan Gratis. CTA sekunder: Pilih Jalur Belajar.
- Analogi yang dijaga: “LeetCode/DataLemur versi lokal” pada kualitas soal, bukan pada UI yang meniru mereka.

## Evidence on Hand

- Spec agent: `.scratch/kulasql/spec.md`
- PRD sumber: `PRD-kulaSQL.md` (observasi publik; angka 15.000+ pelajar / 50.000+ latihan / 4.9 adalah klaim marketing, **jangan diperlakukan sebagai fakta terverifikasi** di UI kecuali dilabeli)
- Belum ada logo, foto, atau aset merek. Jangan mengarang testimonial, pelanggan, atau benchmark baru.
- Testimonial di PRD sumber hanya boleh dipakai jika disalin apa adanya dan tetap dilabeli sebagai kutipan situs, bukan bukti independen.

## Product Principles

1. Practice-first: nulis query dari menit pertama, bukan nonton dulu.
2. Zero-install: sandbox hidup di soal; feedback dalam detik.
3. Satu instrumen: landing dan workspace memakai kerangka yang sama; desktop untuk latihan, HP untuk baca.
4. Beta terbuka: aha moment di free; tidak ada gesekan bayar.
5. Tiga job terpisah: drill, belajar dari nol, template kerja — jangan dicampur jadi satu halaman gaduh.

## Accessibility & Inclusion

Kontras teks hero memadai. Fokus keyboard di editor. Label tombol jelas. Shortcut Ctrl+Enter (Run) dan Ctrl+Shift+Enter (Submit) tidak merusak OS. Target sentuh 44px di HP untuk CTA/nav. Bahasa utama Indonesia.
