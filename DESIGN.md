<!-- SEED: established with the user before implementation; re-run $impeccable document once there's code to capture the actual tokens and components. -->

---
name: kulaSQL
description: Layar laptop di kos malam — nulis query, bukan brochure SQL.
---

# Design System: kulaSQL

## Overview

**Creative North Star: "Kos malam, satu layar"**

Ini bukan dashboard SaaS siang hari dan bukan terminal hacker neon. Ini **layar laptop di kamar kos pukul sebelas malam**: lampu kamar hangat di pinggir mata, yang ditatap adalah query. Permukaan gelap karena adegannya malam, bukan karena “dark mode adalah default tools”.

Satu dunia visual, dua densitas. Landing (Persuade) dan workspace (Operate) memakai bahasa yang sama. Landing lebih longgar hanya supaya janji kebaca; workspace lebih rapat supaya soal, skema, dan editor scanable. Bukan dua merek. Bukan landing cream yang menjatuhkan ke editor gelap.

Aksen **tertahan**: netral malam memegang hampir semua permukaan. Satu aksen tajam hanya di momen kerja (Run, Sempurna, XP). Umpan balik tajam, permukaan tetap tenang. Keindonesiaan hidup di copy dan soal, bukan di ornamen.

**Key Characteristics:**

- Malam, tenang, satu layar sebagai pusat
- Editor hidup sebagai bukti, bukan mockup laptop
- Aksen langka; game di timing dan copy, bukan confetti
- Katalog = daftar kerja, bukan etalase kartu
- HP = baca + CTA; latihan di desktop

## Colors

Strategi: **Restrained** — netral malam + satu aksen kerja. Nilai hex `[to be resolved during implementation]`. Jangan jatuh ke cluster cream + terakota, atau hitam + neon glow.

### Night ground
- **Kos ink** `[to be resolved]`: kanvas halaman, chrome, katalog. Gelap, bukan hitam murni yang “gamer”.
- **Screen well** `[to be resolved]`: cekungan editor — sedikit terpisah dari kanvas, seperti panel laptop, bukan kartu mengambang.

### Atmosphere (bukan merek)
- **Lamp warmth** `[to be resolved]`: sisa lampu kamar di chrome — sangat tipis (border, kursor diam, state fokus lembut). Bukan CTA, bukan fill hero, bukan 30% permukaan.

### Work accent
- **Run/Sempurna** `[to be resolved]`: satu aksen tajam untuk tombol Run, cap “Sempurna!”, XP yang baru ter-grant. Di workspace <10% layar. Di landing, editor adalah “warna”; CTA primer adalah satu objek keras.

### Semantic
- **Fail ink** `[to be resolved]`: pesan gagal/diff/error — terbaca, bukan brand kedua, bukan modal merah penuh layar.
- **Pass memakai aksen kerja**, bukan hijau terpisah yang meramaikan palet.

**The Work-Light Rule.** Yang boleh berteriak hanya momen kerja. Kalau aksen muncul di nav, kartu, ikon tingkat, atau latar, aturan pecah.

**The Lamp-Is-Not-Brand Rule.** Kehangatan lampu kamar adalah atmosfer. Menjadikannya fill, gradient hero, atau warna paket = edtech emas.

## Typography

Tiga register. Nama famili `[to be resolved during implementation]`. Dilarang tanpa alasan unik yang tidak bisa dipenuhi wajah lain: Inter-as-display, Space Grotesk, Syne, Plus Jakarta Sans, DM Sans, Playfair, Fraunces, Cormorant, Newsreader.

**Display / headline:** suara orang ngomong di kos. Besar di landing (“Bisa SQL dari nulis query”). Bukan slogan vendor, bukan all-caps tracking fintech, bukan serif majalah.

**Body / chrome:** huruf kerja tenang, scanable. Nav, rel soal, katalog, FAQ.

**Mono:** hanya SQL — editor, result header, cuplikan query, syntax Ensiklopedia. Bukan label nav, bukan XP, bukan tombol.

**The SQL-Only Mono Rule.** Mono di luar query adalah kostum terminal.

## Layout

**Tulang bersama (landing desktop + workspace):** rel kiri sempit (prompt + skema) · editor tengah menguasai lebar · hasil Run di **bawah editor**. Bukan tiga kolom sama lebar, bukan IDE plus file tree, bukan split 50/50 LeetCode.

**Chrome:** satu strip tipis — logo/wordmark kulaSQL + switcher · nav kapsul (Belajar · Tantangan · Playbook · Ensiklopedia · Leaderboard) · Masuk. Tidak ada banner, tidak ada bar kedua. Scroll pertama sudah menyentuh editor.

**Landing desktop, viewport pertama:** strip + headline + CTA primer di dekat editor hidup (soal Mudah TokoKulwon, tamu boleh ngetik). Social proof dan tiga jalur **di bawah lipatan**.

**Mobile:** bukan kerangka tiga zona. Landing = headline + CTA + prompt terbaca; jujur bahwa nulis query di laptop. Workspace HP = rel jadi lembar atas, editor + hasil di bawah, untuk baca soal/feedback, bukan latihan utama.

**Katalog:** daftar baris malam (judul, tingkat sebagai teks, tag, circle selesai). Filter di rel. Bukan kartu bergambar, bukan bento, bukan ikon 3D.

**Ensiklopedia / Playbook / Kursus:** dunia yang sama, densitas Read/Operate — daftar + isi, bukan tema docs terang terpisah.

**The Same-Instrument Rule.** Pindah landing → soal = alat yang sama, hanya lebih rapat. Mengganti kerangka = identitas pecah.

## Elevation & Depth

Datar-malam, bukan glassmorphism dan bukan stadion bayangan. Kedalaman dari **langkah nada**: kanvas → rel → cekungan editor. Hasil Run adalah panel yang **hadir** di bawah editor, bukan overlay mengambang.

Bayangan `[to be resolved]` — jika ada, hampir tidak kelihatan, hanya untuk memisahkan well editor dari kanvas. Tidak ada hover-lift pada kartu (kartu katalog tidak ada).

**The No-Float Rule.** Komponen tidak “mengambang di atas dashboard”. Ini layar, bukan deck of cards.

## Shapes

Segi tegas, radius kecil, siluet alat kerja. Bukan pill raksasa, bukan squircle SaaS, bukan bevel terminal retro. Nav kapsul boleh sedikit lebih bulat daripada tombol Run; Run tetap satu objek keras, bukan kapsul candy.

Wordmark teks, bukan maskot. `[radius exact: to be resolved]`

**The No-Costume Rule.** Tidak ada batik, bendera, ilustrasi kos, atau ikon makanan di chrome. TokoKulwon hidup di teks soal.

## Do's and Don'ts

### Do:
- **Do** buktikan mekanisme di viewport pertama desktop: editor hidup, tamu bisa Run.
- **Do** pakai satu kerangka rel-kiri / editor-tengah / hasil-bawah di landing dan soal.
- **Do** simpan aksen untuk Run, Sempurna, dan XP; kembalikan ketenangan ke editor segera setelah cap.
- **Do** tulis copy Indonesia manusia; soal memakai kota, nama, rupiah, TokoKulwon.
- **Do** katalog sebagai daftar baris; tingkat sebagai kata, bukan neon.
- **Do** HP sebagai baca + CTA; jangan berjanji latihan penuh di 390px.

### Don't:
- **Don't** landing terang + app gelap (dua identitas).
- **Don't** hero mockup laptop / ilustrasi 3D / screenshot dalam bezel.
- **Don't** confetti, mascot, streak fire, leaderboard stadion.
- **Don't** UI penuh monospace atau headline serif editorial cream.
- **Don't** drench halaman dengan aksen atau lampu kuning sebagai merek.
- **Don't** kartu tantangan bergambar, bento, atau file-tree IDE.
- **Don't** banner promo, checkout, atau CTA langganan di beta.
- **Don't** memakai klaim 15.000+ pelajar sebagai fakta terverifikasi tanpa label.
