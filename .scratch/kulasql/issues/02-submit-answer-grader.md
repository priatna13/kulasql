# 02 — Submit Answer + grader

**What to build:** Pelajar menekan Submit Answer pada Tantangan yang sudah bisa di-Run. Sistem menilai **result set**, bukan teks query. Jawaban ekuivalen yang benar lulus. Lulus menampilkan “Sempurna!” dan XP. Gagal menampilkan diff expected vs actual yang bisa ditindaklanjuti, tanpa membuka solusi. Submit lulus berulang pada soal yang sama tidak menambah XP dua kali.

**Blocked by:** 01 — Run Query pada Tantangan pertama

**Status:** done

- [x] Submit Answer (tombol dan Ctrl+Shift+Enter) membandingkan result set pelajar dengan expected result, bukan string query
- [x] Nama kolom dinilai case-insensitive; urutan baris hanya dipaksa jika soal meminta ORDER BY
- [x] Lulus menampilkan “Sempurna!” dan penambahan XP (nilai boleh bervariasi, contoh +50) serta menandai soal selesai di sesi
- [x] Submit lulus berulang pada soal yang sama tidak double-grant XP dan tidak mengubah status selesai
- [x] Gagal menampilkan diff kolom/baris expected vs actual yang actionable; solusi tidak terbuka; status soal tetap belum selesai; XP tidak berkurang
- [x] Error engine (syntax, kolom tidak ada) tampil ramah, bukan stack trace mentah, dengan penjelasan manusia berbahasa Indonesia bila perlu
