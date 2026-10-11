import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
import { dirname, join } from 'node:path'
import { test } from 'node:test'
import {
  CHALLENGES,
  seedStatements,
  type Challenge,
  type ResultTable,
  type SchemaTable,
} from './challenge.ts'
import { grade, type GradeResult } from './grade.ts'

const SULIT_SLUGS = [
  'top-5-produk-terlaris',
  'kelas-pelanggan-dari-belanja',
  'email-pelanggan-yang-kosong',
  'nomor-baris-tiap-gudang',
  'peringkat-qty-yang-seri',
  'peringkat-rapat-isi-rak',
  'tetangga-qty-harian',
  'jumlah-berjalan-tiap-toko',
  'bagian-qty-seluruh-barang',
  'kota-di-atas-rata-omzet',
  'qty-tanpa-lipat-harga',
  'pemenang-belanja-tiap-kota',
  'selisih-qty-hari-sebelum',
  'bagian-qty-di-dalam-kota',
  'kode-ganda-atau-nama-kosong',
  'barang-pada-urutan-kedua',
  'tiga-peringkat-tiap-kategori',
  'bagian-jumlah-berjalan',
  'jumlah-tiga-hari-terakhir',
  'email-sama-beda-tulisan',
  'harga-toko-yang-bertentangan',
  'ujung-qty-tiap-toko',
  'selisih-dari-puncak-kota',
  'nomor-urut-setelah-saringan',
  'pelanggan-dari-dua-meja',
  'stok-gudang-tak-wajar',
  'kode-nol-di-depan',
  'gerak-qty-antar-hari',
] as const

type Slug = (typeof SULIT_SLUGS)[number]

const SULIT_SQL: Record<Slug, { pass: string; fail: string; weak: string[] }> = {
  'top-5-produk-terlaris': {
    pass: `SELECT p.nama, SUM(j.qty) AS qty
FROM penjualan AS j
JOIN produk AS p ON p.id = j.produk_id
GROUP BY p.nama
ORDER BY qty DESC, p.nama ASC
LIMIT 5;`,
    fail: `SELECT p.nama, SUM(j.qty) AS qty
FROM penjualan AS j
JOIN produk AS p ON p.id = j.produk_id
GROUP BY p.nama
ORDER BY qty ASC, p.nama ASC
LIMIT 5;`,
    weak: [
      `SELECT p.nama, SUM(j.qty) AS qty
FROM penjualan AS j
JOIN produk AS p ON p.id = j.produk_id
GROUP BY p.nama
ORDER BY qty DESC
LIMIT 5;`,
      `SELECT p.nama, SUM(j.qty) AS qty
FROM penjualan AS j
JOIN produk AS p ON p.id = j.produk_id
GROUP BY p.nama
ORDER BY qty DESC, p.nama ASC;`,
    ],
  },
  'kelas-pelanggan-dari-belanja': {
    pass: `SELECT nama,
  CASE WHEN total_belanja >= 300000 THEN 'VIP' ELSE 'Biasa' END AS kelas,
  ROW_NUMBER() OVER (
    PARTITION BY CASE WHEN total_belanja >= 300000 THEN 'VIP' ELSE 'Biasa' END
    ORDER BY total_belanja DESC
  ) AS nomor_urut
FROM pelanggan
ORDER BY kelas, nomor_urut;`,
    fail: `SELECT nama,
  CASE WHEN total_belanja > 300000 THEN 'VIP' ELSE 'Biasa' END AS kelas,
  ROW_NUMBER() OVER (
    PARTITION BY CASE WHEN total_belanja > 300000 THEN 'VIP' ELSE 'Biasa' END
    ORDER BY total_belanja DESC
  ) AS nomor_urut
FROM pelanggan
ORDER BY kelas, nomor_urut;`,
    weak: [
      `SELECT nama,
  CASE WHEN total_belanja >= 300000 THEN 'VIP' ELSE 'Biasa' END AS kelas,
  ROW_NUMBER() OVER (ORDER BY total_belanja DESC) AS nomor_urut
FROM pelanggan
ORDER BY kelas, nomor_urut;`,
    ],
  },
  'email-pelanggan-yang-kosong': {
    pass: `SELECT nama, email, kota
FROM pelanggan
WHERE email IS NULL OR TRIM(email) = ''
ORDER BY nama;`,
    fail: `SELECT nama, email, kota
FROM pelanggan
WHERE email IS NULL
ORDER BY nama;`,
    weak: [
      `SELECT nama, email, kota
FROM pelanggan
WHERE email IS NULL OR email = ''
ORDER BY nama;`,
    ],
  },
  'nomor-baris-tiap-gudang': {
    pass: `SELECT gudang, hari, tujuan,
  ROW_NUMBER() OVER (PARTITION BY gudang ORDER BY hari) AS nomor_baris
FROM kiriman
ORDER BY gudang, nomor_baris;`,
    fail: `SELECT gudang, hari, tujuan,
  ROW_NUMBER() OVER (ORDER BY hari, gudang) AS nomor_baris
FROM kiriman
ORDER BY gudang, nomor_baris;`,
    weak: [
      `SELECT gudang, hari, tujuan,
  ROW_NUMBER() OVER (PARTITION BY gudang ORDER BY tujuan) AS nomor_baris
FROM kiriman
ORDER BY gudang, nomor_baris;`,
    ],
  },
  'peringkat-qty-yang-seri': {
    pass: `SELECT barang, qty,
  RANK() OVER (ORDER BY qty DESC) AS peringkat
FROM penjualan
ORDER BY peringkat, barang;`,
    fail: `SELECT barang, qty,
  DENSE_RANK() OVER (ORDER BY qty DESC) AS peringkat
FROM penjualan
ORDER BY peringkat, barang;`,
    weak: [
      `SELECT barang, qty,
  ROW_NUMBER() OVER (ORDER BY qty DESC, barang ASC) AS peringkat
FROM penjualan
ORDER BY peringkat, barang;`,
    ],
  },
  'peringkat-rapat-isi-rak': {
    pass: `SELECT nama, dus,
  DENSE_RANK() OVER (ORDER BY dus DESC) AS peringkat_rapat
FROM rak
ORDER BY peringkat_rapat, nama;`,
    fail: `SELECT nama, dus,
  RANK() OVER (ORDER BY dus DESC) AS peringkat_rapat
FROM rak
ORDER BY peringkat_rapat, nama;`,
    weak: [
      `SELECT nama, dus,
  ROW_NUMBER() OVER (ORDER BY dus DESC, nama ASC) AS peringkat_rapat
FROM rak
ORDER BY peringkat_rapat, nama;`,
    ],
  },
  'tetangga-qty-harian': {
    pass: `SELECT hari, qty,
  LAG(qty) OVER (ORDER BY hari) AS sebelumnya,
  LEAD(qty) OVER (ORDER BY hari) AS sesudahnya
FROM harian
ORDER BY hari;`,
    fail: `SELECT hari, qty,
  LEAD(qty) OVER (ORDER BY hari) AS sebelumnya,
  LAG(qty) OVER (ORDER BY hari) AS sesudahnya
FROM harian
ORDER BY hari;`,
    weak: [
      `SELECT hari, qty,
  LAG(qty) OVER (ORDER BY hari DESC) AS sebelumnya,
  LEAD(qty) OVER (ORDER BY hari DESC) AS sesudahnya
FROM harian
ORDER BY hari;`,
    ],
  },
  'jumlah-berjalan-tiap-toko': {
    pass: `SELECT toko, hari, qty,
  SUM(qty) OVER (PARTITION BY toko ORDER BY hari) AS jumlah_berjalan
FROM harian
ORDER BY toko, hari;`,
    fail: `SELECT toko, hari, qty, qty AS jumlah_berjalan
FROM harian
ORDER BY toko, hari;`,
    weak: [
      `SELECT toko, hari, qty,
  SUM(qty) OVER (ORDER BY hari, toko) AS jumlah_berjalan
FROM harian
ORDER BY toko, hari;`,
    ],
  },
  'bagian-qty-seluruh-barang': {
    pass: `SELECT nama, qty,
  FLOOR(qty * 100 / SUM(qty) OVER ()) AS bagian
FROM barang
ORDER BY bagian DESC, nama ASC;`,
    fail: `SELECT nama, qty, qty AS bagian
FROM barang
ORDER BY bagian DESC, nama ASC;`,
    weak: [
      `SELECT nama, qty,
  qty * 100 / SUM(qty) OVER () AS bagian
FROM barang
ORDER BY bagian DESC, nama ASC;`,
      `SELECT nama, qty,
  CAST(qty * 100 / SUM(qty) OVER () AS INTEGER) AS bagian
FROM barang
ORDER BY bagian DESC, nama ASC;`,
    ],
  },
  'kota-di-atas-rata-omzet': {
    pass: `WITH omzet_kota AS (
  SELECT kota, SUM(total_belanja) AS omzet
  FROM pelanggan
  GROUP BY kota
),
batas AS (
  SELECT AVG(omzet) AS rata_omzet
  FROM omzet_kota
)
SELECT o.kota, o.omzet
FROM omzet_kota AS o
CROSS JOIN batas AS b
WHERE o.omzet > b.rata_omzet
ORDER BY o.kota;`,
    fail: `WITH omzet_kota AS (
  SELECT kota, SUM(total_belanja) AS omzet
  FROM pelanggan
  GROUP BY kota
),
batas AS (
  SELECT AVG(omzet) AS rata_omzet
  FROM omzet_kota
)
SELECT o.kota, o.omzet
FROM omzet_kota AS o
CROSS JOIN batas AS b
WHERE o.omzet >= b.rata_omzet
ORDER BY o.kota;`,
    weak: [
      `SELECT kota, SUM(total_belanja) AS omzet
FROM pelanggan
GROUP BY kota
ORDER BY kota;`,
    ],
  },
  'qty-tanpa-lipat-harga': {
    pass: `SELECT p.nama, SUM(j.qty) AS qty
FROM penjualan AS j
JOIN produk AS p ON p.id = j.produk_id
GROUP BY p.nama
ORDER BY p.nama;`,
    fail: `SELECT p.nama, SUM(j.qty) AS qty
FROM penjualan AS j
JOIN produk AS p ON p.id = j.produk_id
JOIN harga_toko AS h ON h.produk_id = p.id
GROUP BY p.nama
ORDER BY p.nama;`,
    weak: [
      `SELECT p.nama, SUM(j.qty) AS qty
FROM penjualan AS j
JOIN produk AS p ON p.id = j.produk_id
GROUP BY p.nama
HAVING SUM(j.qty) > 5
ORDER BY p.nama;`,
    ],
  },
  'pemenang-belanja-tiap-kota': {
    pass: `SELECT kota, nama, total_belanja
FROM (
  SELECT kota, nama, total_belanja,
    ROW_NUMBER() OVER (PARTITION BY kota ORDER BY total_belanja DESC, nama ASC) AS nomor
  FROM pelanggan
) AS urut
WHERE nomor = 1
ORDER BY kota;`,
    fail: `SELECT kota, nama, total_belanja
FROM (
  SELECT kota, nama, total_belanja,
    ROW_NUMBER() OVER (PARTITION BY kota ORDER BY total_belanja DESC, nama DESC) AS nomor
  FROM pelanggan
) AS urut
WHERE nomor = 1
ORDER BY kota;`,
    weak: [
      `SELECT kota, nama, total_belanja
FROM (
  SELECT kota, nama, total_belanja,
    RANK() OVER (PARTITION BY kota ORDER BY total_belanja DESC) AS nomor
  FROM pelanggan
) AS urut
WHERE nomor = 1
ORDER BY kota, nama;`,
    ],
  },
  'selisih-qty-hari-sebelum': {
    pass: `SELECT hari, qty,
  qty - LAG(qty) OVER (ORDER BY hari) AS selisih
FROM harian
ORDER BY hari;`,
    fail: `SELECT hari, qty,
  qty - LEAD(qty) OVER (ORDER BY hari) AS selisih
FROM harian
ORDER BY hari;`,
    weak: [
      `SELECT hari, qty,
  COALESCE(qty - LAG(qty) OVER (ORDER BY hari), 0) AS selisih
FROM harian
ORDER BY hari;`,
    ],
  },
  'bagian-qty-di-dalam-kota': {
    pass: `SELECT kota, nama, qty,
  FLOOR(qty * 100 / SUM(qty) OVER (PARTITION BY kota)) AS bagian
FROM penjualan
ORDER BY kota, nama;`,
    fail: `SELECT kota, nama, qty,
  FLOOR(qty * 100 / SUM(qty) OVER ()) AS bagian
FROM penjualan
ORDER BY kota, nama;`,
    weak: [
      `SELECT kota, nama, qty,
  qty * 100 / SUM(qty) OVER (PARTITION BY kota) AS bagian
FROM penjualan
ORDER BY kota, nama;`,
    ],
  },
  'kode-ganda-atau-nama-kosong': {
    pass: `SELECT kode, nama
FROM barang
WHERE kode IN (
  SELECT kode FROM barang GROUP BY kode HAVING COUNT(*) > 1
)
OR nama IS NULL
OR nama = ''
ORDER BY kode, nama;`,
    fail: `SELECT kode, nama
FROM barang
WHERE nama IS NULL
ORDER BY kode, nama;`,
    weak: [
      `SELECT CAST(kode AS INTEGER) AS kode, nama
FROM barang
WHERE kode IN (
  SELECT kode FROM barang GROUP BY kode HAVING COUNT(*) > 1
)
OR nama IS NULL
OR nama = ''
ORDER BY kode, nama;`,
      `SELECT kode, nama
FROM barang
WHERE kode IN (
  SELECT kode FROM barang GROUP BY kode HAVING COUNT(*) > 1
)
ORDER BY kode, nama;`,
    ],
  },
  'barang-pada-urutan-kedua': {
    pass: `SELECT rak, nama, harga
FROM (
  SELECT rak, nama, harga,
    ROW_NUMBER() OVER (PARTITION BY rak ORDER BY harga DESC) AS nomor
  FROM isi_rak
) AS urut
WHERE nomor = 2
ORDER BY rak;`,
    fail: `SELECT rak, nama, harga
FROM (
  SELECT rak, nama, harga,
    ROW_NUMBER() OVER (PARTITION BY rak ORDER BY harga ASC) AS nomor
  FROM isi_rak
) AS urut
WHERE nomor = 2
ORDER BY rak;`,
    weak: [
      `SELECT rak, nama, harga
FROM (
  SELECT rak, nama, harga,
    ROW_NUMBER() OVER (PARTITION BY rak ORDER BY harga DESC) AS nomor
  FROM isi_rak
) AS urut
WHERE nomor <= 2
ORDER BY rak, nomor;`,
    ],
  },
  'tiga-peringkat-tiap-kategori': {
    pass: `SELECT kategori, nama, skor, peringkat
FROM (
  SELECT kategori, nama, skor,
    RANK() OVER (PARTITION BY kategori ORDER BY skor DESC) AS peringkat
  FROM skor_barang
) AS urut
WHERE peringkat <= 3
ORDER BY kategori, peringkat, nama;`,
    fail: `SELECT kategori, nama, skor, peringkat
FROM (
  SELECT kategori, nama, skor,
    DENSE_RANK() OVER (PARTITION BY kategori ORDER BY skor DESC) AS peringkat
  FROM skor_barang
) AS urut
WHERE peringkat <= 3
ORDER BY kategori, peringkat, nama;`,
    weak: [
      `SELECT kategori, nama, skor, peringkat
FROM (
  SELECT kategori, nama, skor,
    ROW_NUMBER() OVER (PARTITION BY kategori ORDER BY skor DESC, nama ASC) AS peringkat
  FROM skor_barang
) AS urut
WHERE peringkat <= 3
ORDER BY kategori, peringkat, nama;`,
    ],
  },
  'bagian-jumlah-berjalan': {
    pass: `SELECT urutan, nama, qty,
  SUM(qty) OVER (ORDER BY urutan) AS jumlah_berjalan,
  FLOOR(SUM(qty) OVER (ORDER BY urutan) * 100 / SUM(qty) OVER ()) AS bagian
FROM penjualan
ORDER BY urutan;`,
    fail: `SELECT urutan, nama, qty,
  SUM(qty) OVER (ORDER BY urutan) AS jumlah_berjalan,
  FLOOR(qty * 100 / SUM(qty) OVER ()) AS bagian
FROM penjualan
ORDER BY urutan;`,
    weak: [
      `SELECT urutan, nama, qty,
  SUM(qty) OVER (ORDER BY urutan) AS jumlah_berjalan,
  SUM(qty) OVER (ORDER BY urutan) * 100 / SUM(qty) OVER () AS bagian
FROM penjualan
ORDER BY urutan;`,
    ],
  },
  'jumlah-tiga-hari-terakhir': {
    pass: `SELECT hari, qty,
  SUM(qty) OVER (
    ORDER BY hari
    ROWS BETWEEN 2 PRECEDING AND CURRENT ROW
  ) AS jumlah_tiga
FROM harian
ORDER BY hari;`,
    fail: `SELECT hari, qty,
  SUM(qty) OVER (ORDER BY hari) AS jumlah_tiga
FROM harian
ORDER BY hari;`,
    weak: [
      `SELECT hari, qty,
  SUM(qty) OVER (
    ORDER BY hari
    ROWS BETWEEN 1 PRECEDING AND CURRENT ROW
  ) AS jumlah_tiga
FROM harian
ORDER BY hari;`,
    ],
  },
  'email-sama-beda-tulisan': {
    pass: `SELECT nama, email
FROM pelanggan
WHERE LOWER(TRIM(email)) IN (
  SELECT LOWER(TRIM(email))
  FROM pelanggan
  WHERE email IS NOT NULL
  GROUP BY LOWER(TRIM(email))
  HAVING COUNT(*) > 1
)
ORDER BY nama;`,
    fail: `SELECT nama, email
FROM pelanggan
WHERE email IS NULL
ORDER BY nama;`,
    weak: [
      `SELECT nama, email
FROM pelanggan
WHERE LOWER(email) IN (
  SELECT LOWER(email)
  FROM pelanggan
  WHERE email IS NOT NULL
  GROUP BY LOWER(email)
  HAVING COUNT(*) > 1
)
ORDER BY nama;`,
    ],
  },
  'harga-toko-yang-bertentangan': {
    pass: `SELECT nama, toko, harga
FROM harga_toko
WHERE nama IN (
  SELECT nama
  FROM harga_toko
  GROUP BY nama
  HAVING COUNT(DISTINCT harga) > 1
)
ORDER BY nama, toko;`,
    fail: `SELECT nama, toko, harga
FROM harga_toko
WHERE nama IN (
  SELECT nama
  FROM harga_toko
  GROUP BY nama
  HAVING COUNT(*) > 1
)
ORDER BY nama, toko;`,
    weak: [
      `SELECT nama, toko, harga
FROM harga_toko
WHERE nama IN (
  SELECT nama
  FROM harga_toko
  GROUP BY nama
  HAVING COUNT(DISTINCT harga) >= 1
)
ORDER BY nama, toko;`,
    ],
  },
  'ujung-qty-tiap-toko': {
    pass: `SELECT toko, hari, qty,
  FIRST_VALUE(qty) OVER (PARTITION BY toko ORDER BY hari) AS qty_awal,
  LAST_VALUE(qty) OVER (
    PARTITION BY toko ORDER BY hari
    ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING
  ) AS qty_akhir
FROM harian
ORDER BY toko, hari;`,
    fail: `SELECT toko, hari, qty,
  FIRST_VALUE(qty) OVER (PARTITION BY toko ORDER BY hari) AS qty_awal,
  LAST_VALUE(qty) OVER (PARTITION BY toko ORDER BY hari) AS qty_akhir
FROM harian
ORDER BY toko, hari;`,
    weak: [
      `SELECT toko, hari, qty,
  FIRST_VALUE(qty) OVER (ORDER BY hari) AS qty_awal,
  LAST_VALUE(qty) OVER (
    ORDER BY hari
    ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING
  ) AS qty_akhir
FROM harian
ORDER BY toko, hari;`,
    ],
  },
  'selisih-dari-puncak-kota': {
    pass: `SELECT kota, nama, total_belanja,
  MAX(total_belanja) OVER (PARTITION BY kota) - total_belanja AS selisih
FROM pelanggan
ORDER BY kota, nama;`,
    fail: `SELECT kota, nama, total_belanja,
  MAX(total_belanja) OVER () - total_belanja AS selisih
FROM pelanggan
ORDER BY kota, nama;`,
    weak: [
      `SELECT kota, nama, total_belanja, selisih
FROM (
  SELECT kota, nama, total_belanja,
    MAX(total_belanja) OVER (PARTITION BY kota) - total_belanja AS selisih
  FROM pelanggan
) AS hitung
WHERE selisih > 0
ORDER BY kota, nama;`,
    ],
  },
  'nomor-urut-setelah-saringan': {
    pass: `SELECT nama, kota, total_belanja,
  ROW_NUMBER() OVER (ORDER BY total_belanja DESC, nama ASC) AS nomor_urut
FROM pelanggan
WHERE kota IN ('Bandung', 'Medan')
ORDER BY nomor_urut;`,
    fail: `SELECT nama, kota, total_belanja, nomor_urut
FROM (
  SELECT nama, kota, total_belanja,
    ROW_NUMBER() OVER (ORDER BY total_belanja DESC, nama ASC) AS nomor_urut
  FROM pelanggan
) AS semua
WHERE kota IN ('Bandung', 'Medan')
ORDER BY nomor_urut;`,
    weak: [
      `SELECT nama, kota, total_belanja,
  ROW_NUMBER() OVER (ORDER BY total_belanja DESC, nama DESC) AS nomor_urut
FROM pelanggan
WHERE kota IN ('Bandung', 'Medan')
ORDER BY nomor_urut;`,
    ],
  },
  'pelanggan-dari-dua-meja': {
    pass: `WITH kunjungan_pelanggan AS (
  SELECT pelanggan_id, COUNT(*) AS jumlah_kunjungan
  FROM kunjungan
  GROUP BY pelanggan_id
),
nota_pelanggan AS (
  SELECT pelanggan_id, SUM(nilai) AS total_nota
  FROM nota
  GROUP BY pelanggan_id
)
SELECT p.nama, k.jumlah_kunjungan, n.total_nota
FROM pelanggan AS p
JOIN kunjungan_pelanggan AS k ON k.pelanggan_id = p.id
JOIN nota_pelanggan AS n ON n.pelanggan_id = p.id
WHERE k.jumlah_kunjungan >= 2
  AND n.total_nota >= 100
ORDER BY p.nama;`,
    fail: `SELECT p.nama,
  COUNT(*) AS jumlah_kunjungan,
  SUM(n.nilai) AS total_nota
FROM pelanggan AS p
JOIN kunjungan AS k ON k.pelanggan_id = p.id
JOIN nota AS n ON n.pelanggan_id = p.id
GROUP BY p.nama
HAVING COUNT(*) >= 2 AND SUM(n.nilai) >= 100
ORDER BY p.nama;`,
    weak: [
      `WITH kunjungan_pelanggan AS (
  SELECT pelanggan_id, COUNT(*) AS jumlah_kunjungan
  FROM kunjungan
  GROUP BY pelanggan_id
),
nota_pelanggan AS (
  SELECT pelanggan_id, SUM(nilai) AS total_nota
  FROM nota
  GROUP BY pelanggan_id
)
SELECT p.nama, k.jumlah_kunjungan, n.total_nota
FROM pelanggan AS p
JOIN kunjungan_pelanggan AS k ON k.pelanggan_id = p.id
JOIN nota_pelanggan AS n ON n.pelanggan_id = p.id
WHERE k.jumlah_kunjungan >= 2
  AND n.total_nota > 100
ORDER BY p.nama;`,
    ],
  },
  'stok-gudang-tak-wajar': {
    pass: `SELECT barang, gudang, qty
FROM stok
WHERE qty IS NULL
  OR qty < 0
  OR (barang, gudang) IN (
    SELECT barang, gudang
    FROM stok
    GROUP BY barang, gudang
    HAVING COUNT(*) > 1
  )
ORDER BY barang, gudang, qty;`,
    fail: `SELECT barang, gudang, qty
FROM stok
WHERE qty IS NULL OR qty <= 0
ORDER BY barang, gudang, qty;`,
    weak: [
      `SELECT barang, gudang, qty
FROM stok
WHERE qty IS NULL OR qty < 0
ORDER BY barang, gudang, qty;`,
    ],
  },
  'kode-nol-di-depan': {
    pass: `SELECT kode, nama
FROM produk
ORDER BY CAST(kode AS INTEGER), kode;`,
    fail: `SELECT kode, nama
FROM produk
ORDER BY kode;`,
    weak: [
      `SELECT CAST(kode AS INTEGER) AS kode, nama
FROM produk
ORDER BY CAST(kode AS INTEGER), kode;`,
    ],
  },
  'gerak-qty-antar-hari': {
    pass: `SELECT toko, hari, qty,
  CASE
    WHEN LAG(qty) OVER (PARTITION BY toko ORDER BY hari) IS NULL THEN 'awal'
    WHEN qty > LAG(qty) OVER (PARTITION BY toko ORDER BY hari) THEN 'naik'
    WHEN qty < LAG(qty) OVER (PARTITION BY toko ORDER BY hari) THEN 'turun'
    ELSE 'tetap'
  END AS gerak
FROM harian
ORDER BY toko, hari;`,
    fail: `SELECT toko, hari, qty,
  CASE
    WHEN LAG(qty) OVER (PARTITION BY toko ORDER BY hari) IS NULL THEN 'awal'
    WHEN qty >= LAG(qty) OVER (PARTITION BY toko ORDER BY hari) THEN 'naik'
    WHEN qty < LAG(qty) OVER (PARTITION BY toko ORDER BY hari) THEN 'turun'
    ELSE 'tetap'
  END AS gerak
FROM harian
ORDER BY toko, hari;`,
    weak: [
      `SELECT toko, hari, qty,
  CASE
    WHEN LAG(qty) OVER (ORDER BY hari, toko) IS NULL THEN 'awal'
    WHEN qty > LAG(qty) OVER (ORDER BY hari, toko) THEN 'naik'
    WHEN qty < LAG(qty) OVER (ORDER BY hari, toko) THEN 'turun'
    ELSE 'tetap'
  END AS gerak
FROM harian
ORDER BY toko, hari;`,
    ],
  },
}

type SqlConn = {
  query: (text: string) => {
    schema: { fields: Array<{ name: string }> }
    toArray: () => unknown[]
  }
  close: () => void
}

function formatCell(value: unknown): string {
  if (value == null) return 'NULL'
  return String(value)
}

function toResult(table: ReturnType<SqlConn['query']>): ResultTable {
  const columns = table.schema.fields.map((field) => field.name)
  const rows = table.toArray().map((row) => {
    const record =
      row && typeof row === 'object' && 'toJSON' in row && typeof row.toJSON === 'function'
        ? (row.toJSON() as Record<string, unknown>)
        : (row as Record<string, unknown>)
    return columns.map((column) => formatCell(record[column]))
  })
  return { columns, rows }
}

function run(conn: SqlConn, sql: string): ResultTable {
  const statements = seedStatements([], sql)
  const last = statements[statements.length - 1]
  assert.ok(last)
  for (const statement of statements.slice(0, -1)) conn.query(statement)
  return toResult(conn.query(last))
}

async function openConn(): Promise<SqlConn> {
  const require = createRequire(import.meta.url)
  const entry = require.resolve('@duckdb/duckdb-wasm/dist/duckdb-node-blocking.cjs') as string
  const duckdb = require(entry) as {
    createDuckDB: (
      bundles: {
        mvp: { mainModule: string; mainWorker: string }
        eh: { mainModule: string; mainWorker: string }
      },
      logger: { log: () => void },
      runtime: unknown,
    ) => Promise<{ instantiate: () => Promise<void>; connect: () => SqlConn }>
    VoidLogger: new () => { log: () => void }
    NODE_RUNTIME: unknown
  }
  const dist = dirname(entry)
  const db = await duckdb.createDuckDB(
    {
      mvp: {
        mainModule: join(dist, 'duckdb-mvp.wasm'),
        mainWorker: join(dist, 'duckdb-node-mvp.worker.cjs'),
      },
      eh: {
        mainModule: join(dist, 'duckdb-eh.wasm'),
        mainWorker: join(dist, 'duckdb-node-eh.worker.cjs'),
      },
    },
    new duckdb.VoidLogger(),
    duckdb.NODE_RUNTIME,
  )
  await db.instantiate()
  return db.connect()
}

function gradeNote(slug: string, kind: string, result: GradeResult, actual: ResultTable): string {
  const head = result.ok ? `${slug} ${kind} passed` : `${slug} ${kind}: ${result.message}`
  return `${head} ${JSON.stringify(actual)}`
}

function quoteIdent(name: string): string {
  return `"${name.replaceAll('"', '""')}"`
}

function sameGrid(left: ResultTable, right: ResultTable): boolean {
  return grade(left, right, { requireOrder: false }).ok && grade(right, left, { requireOrder: false }).ok
}

function existingNames(conn: SqlConn): string[] {
  const listed = toResult(conn.query('SHOW TABLES'))
  const nameAt = listed.columns.findIndex((name) => name.toLowerCase() === 'name')
  return listed.rows.flatMap((row) => {
    const name = row[nameAt >= 0 ? nameAt : 0]
    return name && name !== 'NULL' ? [name] : []
  })
}

function assertSamples(conn: SqlConn, item: Challenge): void {
  for (const table of item.tables) assertSample(conn, item.slug, table)
}

function assertSample(conn: SqlConn, slug: string, table: SchemaTable): void {
  assert.ok(table.columns.length > 0, `${slug} ${table.name} has no columns`)
  assert.ok(table.sampleRows.length > 0, `${slug} ${table.name} has no sample`)
  const cols = table.columns.map((column) => quoteIdent(column.name)).join(', ')
  const actual = run(conn, `SELECT ${cols} FROM ${quoteIdent(table.name)}`)
  assert.deepEqual(
    actual.columns.map((name) => name.toLowerCase()),
    table.columns.map((column) => column.name.toLowerCase()),
    `${slug} ${table.name} columns`,
  )
  for (let index = 0; index < table.columns.length; index++) {
    const column = table.columns[index]
    assert.ok(column)
    const values = actual.rows.map((row) => row[index])
    assert.ok(
      values.includes(column.sample),
      `${slug} ${table.name}.${column.name} contoh ${JSON.stringify(column.sample)} not in ${JSON.stringify(values)}`,
    )
  }
  const pool = actual.rows.map((row) => row.join('\0'))
  for (const sample of table.sampleRows) {
    assert.equal(sample.length, table.columns.length, `${slug} ${table.name} sample width`)
    const at = pool.indexOf(sample.join('\0'))
    assert.notEqual(at, -1, `${slug} ${table.name} sample missing ${JSON.stringify(sample)} from ${JSON.stringify(actual.rows)}`)
    pool.splice(at, 1)
  }
}

test('28 sulit challenges are graded at 50 XP', async () => {
  const sulit = CHALLENGES.filter((item) => item.level === 'Sulit')
  assert.equal(sulit.length, 28)
  assert.equal(CHALLENGES.length, 100)
  assert.deepEqual(
    sulit.map((item) => item.slug),
    [...SULIT_SLUGS],
  )
  assert.equal(new Set(SULIT_SLUGS).size, 28)

  const passes = SULIT_SLUGS.map((slug) => SULIT_SQL[slug].pass)
  assert.ok(passes.some((sql) => /\bROW_NUMBER\s*\(/i.test(sql)))
  assert.ok(passes.some((sql) => /\bRANK\s*\(/i.test(sql)))
  assert.ok(passes.some((sql) => /\bDENSE_RANK\s*\(/i.test(sql)))
  assert.ok(passes.some((sql) => /\bLAG\s*\(/i.test(sql)))
  assert.ok(passes.some((sql) => /\bLEAD\s*\(/i.test(sql)))
  assert.ok(passes.some((sql) => /\bSUM\s*\([\s\S]*\)\s*OVER\s*\(\s*PARTITION\b/i.test(sql)))
  assert.ok(passes.some((sql) => /\bFLOOR\s*\(/i.test(sql)))
  assert.ok(
    passes.some((sql) => /\bWITH\b/i.test(sql) && (sql.match(/\bAS\s*\(/gi) ?? []).length >= 2),
  )
  assert.ok(sulit.some((item) => item.tags.includes('data_quality')))
  assert.ok(sulit.some((item) => item.tags.includes('window')))

  const graded = CHALLENGES.filter((item) => item.expected)
  for (const item of sulit) {
    const expected = item.expected
    assert.ok(expected)
    for (const other of graded) {
      if (!other.expected || other.slug === item.slug) continue
      assert.equal(sameGrid(expected, other.expected), false, `${item.slug} vs ${other.slug}`)
    }
    assert.doesNotMatch(
      item.prompt,
      /\b(ROW_NUMBER|DENSE_RANK|LAG|LEAD|SELECT|JOIN|ORDER BY|LIMIT|CTE)\b/i,
    )
  }

  const conn = await openConn()
  try {
    for (const item of sulit) {
      assert.match(item.slug, /^[a-z0-9-]{1,80}$/)
      assert.equal(item.premium, item.slug === 'top-5-produk-terlaris')
      assert.equal(item.xpReward, 50)
      assert.equal(item.level, 'Sulit')
      const expected = item.expected
      assert.ok(expected)
      assert.ok(expected.rows.length > 0)
      const sql = SULIT_SQL[item.slug as Slug]
      assert.ok(sql.weak.length > 0)
      for (const statement of seedStatements(existingNames(conn), item.seedSql)) conn.query(statement)
      assertSamples(conn, item)

      const opts = { requireOrder: item.requiresOrder }
      const passed = run(conn, sql.pass)
      const passGrade = grade(passed, expected, opts)
      assert.equal(passGrade.ok, true, gradeNote(item.slug, 'solution', passGrade, passed))
      const failed = run(conn, sql.fail)
      const failGrade = grade(failed, expected, opts)
      assert.equal(failGrade.ok, false, gradeNote(item.slug, 'failing query', failGrade, failed))
      assert.ok(failed.columns.length > 0, `${item.slug} failing query returned no table`)
      const starter = run(conn, item.starterSql)
      const starterGrade = grade(starter, expected, opts)
      assert.equal(starterGrade.ok, false, gradeNote(item.slug, 'starter', starterGrade, starter))
      for (const [index, weakSql] of sql.weak.entries()) {
        const weakened = run(conn, weakSql)
        const weakGrade = grade(weakened, expected, opts)
        assert.equal(weakGrade.ok, false, gradeNote(item.slug, `weak ${index}`, weakGrade, weakened))
      }
    }
  } finally {
    conn.close()
  }
})
