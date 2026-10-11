# 07 — Set Tantangan Mudah (31) berfixture

**What to build:** Pelajar melihat dan mengerjakan 31 Tantangan tingkat Mudah berbahasa Indonesia, konteks bisnis lokal (TokoKulwon, kota, pelanggan, harga). Setiap soal punya fixture yang membuat grader objektif. Sidebar progres Mudah mencerminkan 31 item. Flag premium boleh ada di CMS tetapi tidak mengunci. Progres pelajar yang sudah ada tidak direset.

**Blocked by:** 04 — Katalog Tantangan

**Status:** done

- [x] Katalog berisi 31 Tantangan Mudah; sidebar bar Mudah mencerminkan 31
- [x] Setiap soal punya prompt ID tidak ambigu, skema, seed, expected deterministik, XP, dan satu ide utama
- [x] Setiap soal punya fixture tes: 1 query solusi yang PASS dan 1 query yang FAIL pada grader yang sudah ada
- [x] Peta skill Mudah tertutup: SELECT, FROM, WHERE, AND/OR/IN/BETWEEN/LIKE, ORDER BY, LIMIT, alias, agregasi dasar, JOIN dasar
- [x] Konteks memakai dataset fiktif Indonesia, bukan sakila/northwind generik semata; prompt utama tidak mencampur istilah Inggris yang tidak diterjemahkan
- [x] Flag premium boleh terpasang; workspace, hint, dan solusi tidak terkunci
- [x] Menambah set ini tidak merusak completion atau XP pelajar yang sudah ada
