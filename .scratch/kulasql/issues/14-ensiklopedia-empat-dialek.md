# 14 — Ensiklopedia 4 dialek + ekuivalen

**What to build:** Pelajar yang pindah stack membandingkan fungsi yang sama di MySQL, BigQuery, Snowflake, dan DuckDB, termasuk ekuivalen silang (contoh DATEDIFF vs AGE vs DATE_DIFF) dan fungsi khas vendor (contoh BigQuery APPROX_QUANTILES, Snowflake BOOLOR_AGG / Cortex embedding). Bukan runtime multi-engine di workspace.

**Blocked by:** 13 — Ensiklopedia PostgreSQL

**Status:** done

- [x] Indeks dan halaman detail hidup untuk MySQL, BigQuery, Snowflake, dan DuckDB, dengan pola yang sama seperti PostgreSQL
- [x] Halaman fungsi menampilkan ekuivalen di dialek lain bila ada
- [x] Contoh beda dialek tanggal/string kebaca (DATEDIFF vs AGE vs DATE_DIFF atau setara)
- [x] Ada contoh fungsi khas bukan ANSI minimum, termasuk APPROX_QUANTILES (BigQuery) dan BOOLOR_AGG / Cortex embedding (Snowflake)
- [x] Workspace Tantangan tidak tiba-tiba mengganti engine; lima dialek tetap dokumentatif
