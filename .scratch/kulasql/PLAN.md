# Plan lanjutan — kulaSQL

**Berhenti:** 9 Oktober 2026, setelah tiket 16, landing, header, dan logo Caret K. Antrean 01–16 `done`. Laporan: `.scratch/kulasql/REPORT-2026-10-09.md`.  
**Lanjut dari:** tidak ada tiket beta yang terbuka. Jangan ulang ensiklopedia, hub, Playbook, kursus, sandbox, rumus level pelajar, katalog, atau tiket 16. Google untuk 03 tidak dipasang (kredensial kosong). `bantuan@kulasql.test` bukan inbox sungguhan.

Sesi 22 September 2026 (selesai): `.scratch/kulasql/PLAN-2026-09-22.md`.  
Sesi 24 September 2026 (selesai, tiket 04): `.scratch/kulasql/REPORT-2026-09-24.md`.  
Sesi 25 September 2026 (plan tiket 07, dikerjakan 27 Sep): `.scratch/kulasql/PLAN-2026-09-25.md`.  
Sesi 27 September 2026 (selesai, tiket 07 + 08): `.scratch/kulasql/REPORT-2026-09-27.md`.  
Sesi 28 September 2026 (selesai, tiket 09 + 06): `.scratch/kulasql/REPORT-2026-09-28.md`.  
Sesi 29 September 2026 (kode tiket 10, demo belum): `.scratch/kulasql/REPORT-2026-09-29.md`.  
Sesi 30 September 2026 (selesai, tiket 10): `.scratch/kulasql/REPORT-2026-09-30.md`.  
Sesi 1 Oktober 2026 (plan tiket 11, dikerjakan 2 Okt): `.scratch/kulasql/PLAN-2026-10-01.md`.  
Sesi 2 Oktober 2026 (selesai, tiket 11 + 05): `.scratch/kulasql/REPORT-2026-10-02.md`.  
Sesi 3 Oktober 2026 (plan tiket 12, dikerjakan 6 Okt): `.scratch/kulasql/PLAN-2026-10-03.md`.  
Sesi 6 Oktober 2026 (selesai, tiket 12 + 13): `.scratch/kulasql/REPORT-2026-10-06.md`.  
Sesi 7 Oktober 2026 (selesai, tiket 14 + 15): `.scratch/kulasql/REPORT-2026-10-07.md`.  
Sesi 8 Oktober 2026 (plan tiket 16, dikerjakan 9 Okt): `.scratch/kulasql/PLAN-2026-10-08.md`.  
Sesi 9 Oktober 2026 (selesai, tiket 16, lalu landing, header, dan logo): `.scratch/kulasql/REPORT-2026-10-09.md`.

Jangan buka pembayaran, jangan ganti tumpukan, jangan pecah dunia visual.

---

## Sudah selesai (jangan dikerjakan ulang)

| Artefak | Fungsi |
|---------|--------|
| `PRD-kulaSQL.md` | PRD produk sumber (observasi + lingkup penuh, termasuk bayar — **bayar ditunda**) |
| `.scratch/kulasql/spec.md` | PRD agent, status `ready-for-agent`, beta tanpa bayar |
| `.scratch/kulasql/issues/01` … `16` | 16 tiket vertikal; 01–16 **done** |
| `PRODUCT.md` | Produk, tumpukan, persona, batasan beta |
| `DESIGN.md` | Seed visual “Kos malam, satu layar” |
| `.impeccable/surfaces/landing-workspace.md` | Kontrak landing + workspace (tiket 01) |
| Tiket 01 | Run Query soal pertama TokoKulwon — **done** |
| Tiket 02 | Submit + grader result-set, Sempurna + XP sesi — **done** |
| Tiket 03 | Daftar/masuk email + jejak progres Neon — **done** (Google tidak dipasang) |
| Tiket 04 | Katalog Tantangan — **done** (24 Sep 2026) |
| Tiket 06 | Hint 1–3, solusi login, draf, reset — **done** (28 Sep 2026) |
| Tiket 07 | 31 Mudah berfixture — **done** (27 Sep 2026) |
| Tiket 08 | 41 Sedang berfixture — **done** (27 Sep 2026) |
| Tiket 09 | 28 Sulit berfixture, katalog 100 — **done** (28 Sep 2026) |
| Tiket 10 | Level dari XP + papan peringkat — **done** (30 Sep 2026) |
| Tiket 11 | Jalur Kursus + capstone — **done** (2 Okt 2026) |
| Tiket 05 | Sandbox aman — **done** (2 Okt 2026) |
| Tiket 12 | Playbook 100 template — **done** (6 Okt 2026) |
| Tiket 13 | Ensiklopedia PostgreSQL — **done** (6 Okt 2026) |
| Tiket 14 | Ensiklopedia empat dialek — **done** (7 Okt 2026) |
| Tiket 15 | Hub ekosistem + legal — **done** (7 Okt 2026) |
| Tiket 16 | Baca di HP + keyboard di editor — **done** (9 Okt 2026) |

---

## Kunci yang mengikat (bila ragu, ini yang menang)

**Produk / beta**

- Latihan SQL di browser, copy Indonesia, tanpa checkout.
- Tamu boleh Run soal Mudah; Submit+XP butuh login.
- Flag premium boleh di CMS, tidak mengunci.
- Satu engine sandbox: **DuckDB WASM**. Ensiklopedia 5 dialek = dokumentasi.

**Tumpukan**

- UI: Vite + React + React Router → `frontend/`
- API: Hono (gratis, bukan SaaS) → `backend/`
- Data: Neon Postgres → `backend/`
- Sandbox DuckDB WASM → `frontend/`
- Bukan Next.js, bukan native, bukan HTML statis

**Visual**

- Adegan: malam di kos, laptop
- Satu dunia, dua densitas (landing longgar, workspace rapat)
- Desktop: editor hidup di viewport pertama
- HP: baca + CTA; latihan di laptop
- Rel kiri + editor tengah + hasil bawah
- Chrome satu strip tipis
- Aksen hanya Run / Sempurna / XP
- Katalog = daftar baris
- Lokal di copy/soal, bukan ornamen
- Huruf: headline manusia, body kerja, mono hanya SQL
- Satu gerak yang diingat: Run → hasil

**Terbuka (bukan blocker 01)**

- Comp-first vs code-first: belum disimpan. Rekomendasi semalam: **code-first**. Tanyakan sekali sebelum generate gambar/hero, jangan diam-diam pilih.

---

## Urutan kerja (frontier)

Kerjakan **satu tiket per sesi**, lalu kosongkan context. Spec: `/implement` pada tiket yang tidak terblokir.

```text
01 Run Query Tantangan pertama     ✓
 ├─ 02 Submit + grader             ✓
 │   └─ 03 Daftar/masuk + progres  ✓ (22 Sep 2026; Google tidak dipasang)
 │       ├─ 04 Katalog             ✓ (24 Sep 2026)
 │       │   ├─ 07 Mudah 31        ✓ (27 Sep 2026)
 │       │   ├─ 08 Sedang 41       ✓ (27 Sep 2026)
 │       │   ├─ 09 Sulit 28        ✓ (28 Sep 2026)
 │       │   ├─ 12 Playbook            ✓ (6 Okt 2026)
 │       │   ├─ 13 Ensiklopedia PG     ✓ (6 Okt 2026)
 │       │   ├─ 14 Empat dialek        ✓ (7 Okt 2026)
 │       │   └─ 16 HP + keyboard       ✓ (9 Okt 2026)
 │       ├─ 06 Hint, solusi, draf  ✓ (28 Sep 2026)
 │       └─ 10 Level + Leaderboard ✓ (30 Sep 2026)
 │           11 Kursus             ✓ (2 Okt 2026)
 ├─ 05 Sandbox aman                ✓ (2 Okt 2026)
 └─ 15 Hub ekosistem + legal       ✓ (7 Okt 2026)
```

Setelah **01** selesai dan bisa didemo: 02, 05, dan 15 boleh paralel. Jangan loncat ke 07 (100 soal) sebelum katalog (04) hidup.

---

## Sesi berikutnya

Antrean 16 tiket beta sudah tutup. Jangan buka tiket 16 lagi, dan jangan mengarang tiket 17 sebelum ada pilihan.

Yang masih di luar antrean, belum dikerjakan:

- Masuk Google (kredensial kosong). Email sudah hidup.
- `$impeccable document`.
- Commit/GitHub tidak wajib.
- Pembayaran tetap off sampai go public.
- `bantuan@kulasql.test` bukan inbox sungguhan. Badan hukum terdaftar belum dipublikasikan.
- Spec beta masih menyebut perbandingan tutorial di landing, testimoni, dan indeks PostgreSQL sekitar 183 fungsi. Tiga hal itu tidak punya tiket, dan tiket 13–14 sudah ditutup pada jumlah fungsi yang ada.
