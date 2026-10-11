# 05 — Sandbox aman

**What to build:** Pelajar boleh bereksperimen di Run Query tanpa merusak platform atau pelajar lain. Query berat atau tak berhingga berhenti dengan timeout. Hasil dibatasi jumlah baris. DDL berbahaya ditolak atau di-rollback. Eksekusi terisolasi, tanpa akses filesystem atau jaringan keluar. Pesan kegagalan tetap ramah, bukan crash.

**Blocked by:** 01 — Run Query pada Tantangan pertama

**Status:** done

- [x] Query yang berjalan terlalu lama dihentikan timeout dan menampilkan error ramah di workspace
- [x] Result set dipotong pada batas baris yang jelas bagi pelajar
- [x] DDL berbahaya (DROP/ALTER yang merusak soal) ditolak atau di-rollback; soal orang lain tidak terpengaruh
- [x] Eksekusi terisolasi per Run; tidak ada side effect antar pelajar
- [x] Tidak ada filesystem escape dan tidak ada network keluar dari sandbox
- [x] Platform tidak down karena satu query abusif; pelajar lain tetap bisa Run
