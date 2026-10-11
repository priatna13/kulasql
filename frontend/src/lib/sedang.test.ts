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

const SEDANG_SLUGS = [
  'pelanggan-vip-dari-surabaya',
  'daftar-produk-termahal',
  'total-belanja-per-kota',
  'produk-tanpa-harga',
  'kota-minimal-dua-pelanggan',
  'omzet-kota-ambang',
  'kota-tepat-dua-pelanggan',
  'rata-rata-belanja-tiap-kota',
  'rentang-belanja-tiap-kota',
  'pesanan-tiap-pelanggan',
  'berapa-kota-tercatat',
  'nama-pelanggan-yang-berulang',
  'lebih-mahal-dari-yang-termurah',
  'produk-paling-mahal',
  'barang-tak-terjual',
  'pelanggan-yang-sudah-memesan',
  'pelanggan-yang-belum-memesan',
  'pelanggan-di-kota-gudang',
  'omzet-kota-lewat-ringkasan',
  'pelanggan-medan-lewat-daftar',
  'label-harga-barang',
  'vip-dan-biasa-sekaligus',
  'urutan-status-stok',
  'harga-kosong-dianggap-nol',
  'kota-belum-diisi',
  'email-tidak-bisa-dipakai',
  'kota-tanpa-duplikat',
  'nama-dari-dua-daftar',
  'kontak-dari-dua-meja',
  'harga-tertulis-sebagai-teks',
  'barang-dan-penjualan-kosong',
  'pasangan-pelanggan-sekota',
  'harga-di-toko-yang-tepat',
  'barang-laku-minimal-sepuluh',
  'belanja-di-atas-rata-kota',
  'gudang-yang-sunyi',
  'total-qty-per-nama',
  'pembeli-beras',
  'qty-kosong-jadi-nol',
  'urut-kode-sebagai-angka',
  'pasangan-nama-kota-unik',
] as const

type Slug = (typeof SEDANG_SLUGS)[number]

const SEDANG_SQL: Record<Slug, { pass: string; fail: string; weak: string[] }> = {
  'pelanggan-vip-dari-surabaya': {
    pass: `SELECT nama, kota, total_belanja
FROM pelanggan
WHERE kota = 'Surabaya'
  AND total_belanja > (SELECT AVG(total_belanja) FROM pelanggan);`,
    fail: `SELECT nama, kota, total_belanja
FROM pelanggan
WHERE kota = 'Surabaya'
  AND total_belanja >= (SELECT AVG(total_belanja) FROM pelanggan);`,
    weak: [
      `SELECT nama, kota, total_belanja
FROM pelanggan
WHERE total_belanja > (SELECT AVG(total_belanja) FROM pelanggan);`,
    ],
  },
  'daftar-produk-termahal': {
    pass: `SELECT nama, harga
FROM produk
ORDER BY harga DESC NULLS LAST, nama ASC;`,
    fail: `SELECT nama, harga
FROM produk
ORDER BY nama ASC;`,
    weak: [
      `SELECT nama, harga
FROM produk
ORDER BY harga DESC NULLS LAST;`,
      `SELECT nama, harga
FROM produk
ORDER BY harga DESC NULLS FIRST, nama ASC;`,
      `SELECT nama, harga
FROM produk;`,
    ],
  },
  'total-belanja-per-kota': {
    pass: `SELECT kota, SUM(total_belanja) AS total
FROM pelanggan
GROUP BY kota
ORDER BY kota;`,
    fail: `SELECT kota, total_belanja AS total
FROM pelanggan;`,
    weak: [
      `SELECT kota, SUM(total_belanja) AS total
FROM pelanggan
GROUP BY kota;`,
    ],
  },
  'produk-tanpa-harga': {
    pass: `SELECT nama
FROM produk
WHERE harga IS NULL;`,
    fail: `SELECT nama
FROM produk
WHERE harga = 0;`,
    weak: [
      `SELECT nama
FROM produk
WHERE harga IS NULL OR harga = 0;`,
    ],
  },
  'kota-minimal-dua-pelanggan': {
    pass: `SELECT kota, COUNT(*) AS jumlah
FROM pelanggan
GROUP BY kota
HAVING COUNT(*) >= 2
ORDER BY kota;`,
    fail: `SELECT kota, COUNT(*) AS jumlah
FROM pelanggan
GROUP BY kota
HAVING COUNT(*) > 2
ORDER BY kota;`,
    weak: [
      `SELECT kota, COUNT(*) AS jumlah
FROM pelanggan
GROUP BY kota
HAVING COUNT(*) >= 2;`,
    ],
  },
  'omzet-kota-ambang': {
    pass: `SELECT kota, SUM(total_belanja) AS omzet
FROM pelanggan
GROUP BY kota
HAVING SUM(total_belanja) >= 300000
ORDER BY kota;`,
    fail: `SELECT kota, SUM(total_belanja) AS omzet
FROM pelanggan
GROUP BY kota
HAVING SUM(total_belanja) > 300000
ORDER BY kota;`,
    weak: [
      `SELECT kota, SUM(total_belanja) AS omzet
FROM pelanggan
GROUP BY kota
HAVING SUM(total_belanja) >= 300000;`,
    ],
  },
  'kota-tepat-dua-pelanggan': {
    pass: `SELECT kota, COUNT(*) AS jumlah
FROM pelanggan
GROUP BY kota
HAVING COUNT(*) = 2
ORDER BY kota;`,
    fail: `SELECT kota, COUNT(*) AS jumlah
FROM pelanggan
GROUP BY kota
HAVING COUNT(*) >= 2
ORDER BY kota;`,
    weak: [
      `SELECT kota, COUNT(*) AS jumlah
FROM pelanggan
GROUP BY kota
HAVING COUNT(*) = 2;`,
    ],
  },
  'rata-rata-belanja-tiap-kota': {
    pass: `SELECT kota, AVG(total_belanja) AS rata_rata
FROM pelanggan
GROUP BY kota
ORDER BY kota;`,
    fail: `SELECT kota, SUM(total_belanja) AS rata_rata
FROM pelanggan
GROUP BY kota
ORDER BY kota;`,
    weak: [
      `SELECT kota, AVG(total_belanja) AS rata_rata
FROM pelanggan
GROUP BY kota;`,
    ],
  },
  'rentang-belanja-tiap-kota': {
    pass: `SELECT kota, MIN(total_belanja) AS terkecil, MAX(total_belanja) AS terbesar
FROM pelanggan
GROUP BY kota
ORDER BY kota;`,
    fail: `SELECT kota, MAX(total_belanja) AS terkecil, MIN(total_belanja) AS terbesar
FROM pelanggan
GROUP BY kota
ORDER BY kota;`,
    weak: [
      `SELECT kota, MIN(total_belanja) AS terkecil, MAX(total_belanja) AS terbesar
FROM pelanggan
GROUP BY kota;`,
    ],
  },
  'pesanan-tiap-pelanggan': {
    pass: `SELECT pelanggan.nama, COUNT(*) AS jumlah_pesanan
FROM pelanggan
JOIN pesanan ON pesanan.pelanggan_id = pelanggan.id
GROUP BY pelanggan.nama
ORDER BY pelanggan.nama;`,
    fail: `SELECT pelanggan.nama, pesanan.id AS jumlah_pesanan
FROM pelanggan
JOIN pesanan ON pesanan.pelanggan_id = pelanggan.id
ORDER BY pelanggan.nama;`,
    weak: [
      `SELECT pelanggan.nama, COUNT(*) AS jumlah_pesanan
FROM pelanggan
JOIN pesanan ON pesanan.pelanggan_id = pelanggan.id
GROUP BY pelanggan.nama;`,
    ],
  },
  'berapa-kota-tercatat': {
    pass: `SELECT COUNT(DISTINCT kota) AS jumlah_kota
FROM pelanggan;`,
    fail: `SELECT COUNT(kota) AS jumlah_kota
FROM pelanggan;`,
    weak: [
      `SELECT COUNT(*) AS jumlah_kota
FROM pelanggan;`,
    ],
  },
  'nama-pelanggan-yang-berulang': {
    pass: `SELECT nama, COUNT(*) AS jumlah
FROM pelanggan
GROUP BY nama
HAVING COUNT(*) > 1
ORDER BY nama;`,
    fail: `SELECT nama, COUNT(*) AS jumlah
FROM pelanggan
GROUP BY nama
HAVING COUNT(*) > 2
ORDER BY nama;`,
    weak: [
      `SELECT nama, COUNT(*) AS jumlah
FROM pelanggan
GROUP BY nama
HAVING COUNT(*) > 1;`,
    ],
  },
  'lebih-mahal-dari-yang-termurah': {
    pass: `SELECT nama, harga
FROM produk
WHERE harga > (SELECT MIN(harga) FROM produk);`,
    fail: `SELECT nama, harga
FROM produk
WHERE harga >= (SELECT MIN(harga) FROM produk);`,
    weak: [
      `SELECT nama, harga
FROM produk
WHERE harga > 8000;`,
    ],
  },
  'produk-paling-mahal': {
    pass: `SELECT nama, harga
FROM produk
WHERE harga = (SELECT MAX(harga) FROM produk)
ORDER BY nama;`,
    fail: `SELECT nama, harga
FROM produk
WHERE harga = (SELECT MAX(harga) FROM produk)
ORDER BY nama
LIMIT 1;`,
    weak: [
      `SELECT nama, harga
FROM produk
WHERE harga = (SELECT MAX(harga) FROM produk);`,
    ],
  },
  'barang-tak-terjual': {
    pass: `SELECT nama
FROM produk
WHERE NOT EXISTS (
  SELECT 1
  FROM penjualan
  WHERE penjualan.produk_id = produk.id
);`,
    fail: `SELECT nama
FROM produk
WHERE id NOT IN (SELECT produk_id FROM penjualan);`,
    weak: [
      `SELECT produk.nama
FROM produk
JOIN penjualan ON penjualan.produk_id = produk.id;`,
    ],
  },
  'pelanggan-yang-sudah-memesan': {
    pass: `SELECT pelanggan.nama
FROM pelanggan
JOIN pesanan ON pesanan.pelanggan_id = pelanggan.id
GROUP BY pelanggan.nama
ORDER BY pelanggan.nama;`,
    fail: `SELECT pelanggan.nama
FROM pelanggan
JOIN pesanan ON pesanan.pelanggan_id = pelanggan.id
ORDER BY pelanggan.nama;`,
    weak: [
      `SELECT pelanggan.nama
FROM pelanggan
JOIN pesanan ON pesanan.pelanggan_id = pelanggan.id
GROUP BY pelanggan.nama;`,
    ],
  },
  'pelanggan-yang-belum-memesan': {
    pass: `SELECT nama
FROM pelanggan
WHERE NOT EXISTS (
  SELECT 1 FROM pesanan WHERE pesanan.pelanggan_id = pelanggan.id
)
ORDER BY nama;`,
    fail: `SELECT nama
FROM pelanggan
WHERE id NOT IN (SELECT pelanggan_id FROM pesanan)
ORDER BY nama;`,
    weak: [
      `SELECT nama
FROM pelanggan
WHERE NOT EXISTS (
  SELECT 1 FROM pesanan WHERE pesanan.pelanggan_id = pelanggan.id
);`,
    ],
  },
  'pelanggan-di-kota-gudang': {
    pass: `SELECT nama, kota
FROM pelanggan
WHERE kota IN (SELECT kota FROM gudang)
ORDER BY nama;`,
    fail: `SELECT nama, kota
FROM pelanggan
ORDER BY nama;`,
    weak: [
      `SELECT nama, kota
FROM pelanggan
WHERE kota IN (SELECT kota FROM gudang);`,
    ],
  },
  'omzet-kota-lewat-ringkasan': {
    pass: `WITH ringkasan AS (
  SELECT kota, SUM(total_belanja) AS omzet
  FROM pelanggan
  GROUP BY kota
)
SELECT kota, omzet
FROM ringkasan
WHERE omzet >= 300000
ORDER BY kota;`,
    fail: `WITH ringkasan AS (
  SELECT kota, SUM(total_belanja) AS omzet
  FROM pelanggan
  GROUP BY kota
)
SELECT kota, omzet
FROM ringkasan
WHERE omzet > 300000
ORDER BY kota;`,
    weak: [
      `WITH ringkasan AS (
  SELECT kota, SUM(total_belanja) AS omzet
  FROM pelanggan
  GROUP BY kota
)
SELECT kota, omzet
FROM ringkasan
WHERE omzet >= 300000;`,
    ],
  },
  'pelanggan-medan-lewat-daftar': {
    pass: `WITH daftar AS (
  SELECT nama
  FROM pelanggan
  WHERE kota = 'Medan'
)
SELECT nama
FROM daftar
ORDER BY nama;`,
    fail: `SELECT nama
FROM pelanggan
ORDER BY nama;`,
    weak: [
      `WITH daftar AS (
  SELECT nama
  FROM pelanggan
  WHERE kota = 'Medan'
)
SELECT nama
FROM daftar;`,
    ],
  },
  'label-harga-barang': {
    pass: `SELECT nama,
  CASE
    WHEN harga IS NULL THEN 'belum diisi'
    WHEN harga >= 5000 AND harga <= 15000 THEN 'hemat'
    WHEN harga >= 15001 AND harga <= 30000 THEN 'biasa'
    WHEN harga >= 30001 AND harga <= 80000 THEN 'mahal'
    ELSE 'lainnya'
  END AS label
FROM produk
ORDER BY nama;`,
    fail: `SELECT nama,
  CASE
    WHEN harga IS NULL THEN 'belum diisi'
    WHEN harga > 5000 AND harga < 15000 THEN 'hemat'
    WHEN harga > 15001 AND harga < 30000 THEN 'biasa'
    WHEN harga > 30001 AND harga < 80000 THEN 'mahal'
    ELSE 'lainnya'
  END AS label
FROM produk
ORDER BY nama;`,
    weak: [
      `SELECT nama,
  CASE
    WHEN harga IS NULL THEN 'belum diisi'
    WHEN harga >= 5000 AND harga <= 15000 THEN 'hemat'
    WHEN harga >= 15001 AND harga <= 30000 THEN 'biasa'
    WHEN harga >= 30001 AND harga <= 80000 THEN 'mahal'
    ELSE 'lainnya'
  END AS label
FROM produk;`,
    ],
  },
  'vip-dan-biasa-sekaligus': {
    pass: `SELECT
  SUM(CASE WHEN total_belanja >= 300000 THEN 1 ELSE 0 END) AS jumlah_vip,
  SUM(CASE WHEN total_belanja < 300000 THEN 1 ELSE 0 END) AS jumlah_biasa
FROM pelanggan;`,
    fail: `SELECT
  SUM(CASE WHEN total_belanja > 300000 THEN 1 ELSE 0 END) AS jumlah_vip,
  SUM(CASE WHEN total_belanja < 300000 THEN 1 ELSE 0 END) AS jumlah_biasa
FROM pelanggan;`,
    weak: [
      `SELECT
  SUM(CASE WHEN total_belanja >= 300000 THEN 1 ELSE 0 END) AS jumlah_vip,
  SUM(CASE WHEN total_belanja IS NULL OR total_belanja < 300000 THEN 1 ELSE 0 END) AS jumlah_biasa
FROM pelanggan;`,
    ],
  },
  'urutan-status-stok': {
    pass: `SELECT nama, status
FROM produk
ORDER BY CASE status
  WHEN 'habis' THEN 1
  WHEN 'tipis' THEN 2
  WHEN 'aman' THEN 3
  ELSE 4
END, nama;`,
    fail: `SELECT nama, status
FROM produk
ORDER BY nama;`,
    weak: [
      `SELECT nama, status
FROM produk;`,
    ],
  },
  'harga-kosong-dianggap-nol': {
    pass: `SELECT nama, COALESCE(harga, 0) AS harga_tampil
FROM produk
ORDER BY nama;`,
    fail: `SELECT nama, harga AS harga_tampil
FROM produk
ORDER BY nama;`,
    weak: [
      `SELECT nama, COALESCE(harga, 0) AS harga_tampil
FROM produk;`,
    ],
  },
  'kota-belum-diisi': {
    pass: `SELECT nama, COALESCE(kota, 'belum diisi') AS kota
FROM pelanggan
ORDER BY nama;`,
    fail: `SELECT nama, kota
FROM pelanggan
ORDER BY nama;`,
    weak: [
      `SELECT nama, COALESCE(kota, 'belum diisi') AS kota
FROM pelanggan;`,
    ],
  },
  'email-tidak-bisa-dipakai': {
    pass: `SELECT nama, email
FROM pelanggan
WHERE email IS NULL OR email = '';`,
    fail: `SELECT nama, email
FROM pelanggan
WHERE email IS NULL;`,
    weak: [
      `SELECT nama, email
FROM pelanggan
WHERE email IS NULL OR email = '' OR email = ' ';`,
    ],
  },
  'kota-tanpa-duplikat': {
    pass: `SELECT DISTINCT kota
FROM pelanggan
ORDER BY kota;`,
    fail: `SELECT kota
FROM pelanggan
ORDER BY kota;`,
    weak: [
      `SELECT DISTINCT kota
FROM pelanggan;`,
    ],
  },
  'nama-dari-dua-daftar': {
    pass: `SELECT nama FROM pelanggan
UNION
SELECT nama FROM pemasok
ORDER BY nama;`,
    fail: `SELECT nama FROM pelanggan
UNION ALL
SELECT nama FROM pemasok
ORDER BY nama;`,
    weak: [
      `SELECT nama FROM pelanggan
UNION
SELECT nama FROM pemasok;`,
    ],
  },
  'kontak-dari-dua-meja': {
    pass: `SELECT nama FROM kasir
UNION ALL
SELECT nama FROM kurir;`,
    fail: `SELECT nama FROM kasir
UNION
SELECT nama FROM kurir;`,
    weak: [
      `SELECT nama FROM kasir;`,
    ],
  },
  'harga-tertulis-sebagai-teks': {
    pass: `SELECT nama, CAST(harga AS INTEGER) AS harga
FROM produk
WHERE CAST(harga AS INTEGER) <= 20000;`,
    fail: `SELECT nama, CAST(harga AS INTEGER) AS harga
FROM produk
WHERE harga <= '20000';`,
    weak: [
      `SELECT nama, CAST(harga AS INTEGER) AS harga
FROM produk
WHERE CAST(harga AS INTEGER) < 20000;`,
    ],
  },
  'barang-dan-penjualan-kosong': {
    pass: `SELECT produk.nama, penjualan.qty
FROM produk
LEFT JOIN penjualan ON penjualan.produk_id = produk.id
ORDER BY produk.nama;`,
    fail: `SELECT produk.nama, penjualan.qty
FROM produk
JOIN penjualan ON penjualan.produk_id = produk.id
ORDER BY produk.nama;`,
    weak: [
      `SELECT produk.nama, penjualan.qty
FROM produk
LEFT JOIN penjualan ON penjualan.produk_id = produk.id;`,
    ],
  },
  'pasangan-pelanggan-sekota': {
    pass: `SELECT a.id AS id_a, a.nama AS nama_a, b.id AS id_b, b.nama AS nama_b
FROM pelanggan AS a
JOIN pelanggan AS b
  ON a.kota = b.kota AND a.id < b.id
ORDER BY id_a, id_b;`,
    fail: `SELECT a.id AS id_a, a.nama AS nama_a, b.id AS id_b, b.nama AS nama_b
FROM pelanggan AS a
JOIN pelanggan AS b
  ON a.kota = b.kota AND a.id <> b.id
ORDER BY id_a, id_b;`,
    weak: [
      `SELECT a.id AS id_a, a.nama AS nama_a, b.id AS id_b, b.nama AS nama_b
FROM pelanggan AS a
JOIN pelanggan AS b
  ON a.kota = b.kota AND a.id < b.id;`,
    ],
  },
  'harga-di-toko-yang-tepat': {
    pass: `SELECT baris.id, harga_toko.harga
FROM baris
JOIN harga_toko
  ON harga_toko.toko_id = baris.toko_id
 AND harga_toko.produk_id = baris.produk_id
ORDER BY baris.id;`,
    fail: `SELECT baris.id, harga_toko.harga
FROM baris
JOIN harga_toko
  ON harga_toko.produk_id = baris.produk_id
ORDER BY baris.id, harga_toko.harga;`,
    weak: [
      `SELECT baris.id, harga_toko.harga
FROM baris
JOIN harga_toko
  ON harga_toko.toko_id = baris.toko_id
 AND harga_toko.produk_id = baris.produk_id;`,
    ],
  },
  'barang-laku-minimal-sepuluh': {
    pass: `SELECT produk.nama, SUM(penjualan.qty) AS total_qty
FROM produk
JOIN penjualan ON penjualan.produk_id = produk.id
GROUP BY produk.nama
HAVING SUM(penjualan.qty) >= 10
ORDER BY produk.nama;`,
    fail: `SELECT produk.nama, SUM(penjualan.qty) AS total_qty
FROM produk
JOIN penjualan ON penjualan.produk_id = produk.id
GROUP BY produk.nama
HAVING SUM(penjualan.qty) > 10
ORDER BY produk.nama;`,
    weak: [
      `SELECT produk.nama, SUM(penjualan.qty) AS total_qty
FROM produk
JOIN penjualan ON penjualan.produk_id = produk.id
GROUP BY produk.nama
HAVING SUM(penjualan.qty) >= 10;`,
    ],
  },
  'belanja-di-atas-rata-kota': {
    pass: `SELECT nama, kota, total_belanja
FROM pelanggan AS p
WHERE total_belanja > (
  SELECT AVG(p2.total_belanja)
  FROM pelanggan AS p2
  WHERE p2.kota = p.kota
)
ORDER BY nama;`,
    fail: `SELECT nama, kota, total_belanja
FROM pelanggan AS p
WHERE total_belanja >= (
  SELECT AVG(p2.total_belanja)
  FROM pelanggan AS p2
  WHERE p2.kota = p.kota
)
ORDER BY nama;`,
    weak: [
      `SELECT nama, kota, total_belanja
FROM pelanggan AS p
WHERE total_belanja > (
  SELECT AVG(p2.total_belanja)
  FROM pelanggan AS p2
  WHERE p2.kota = p.kota
);`,
    ],
  },
  'gudang-yang-sunyi': {
    pass: `SELECT kota
FROM gudang
WHERE NOT EXISTS (
  SELECT 1 FROM pelanggan WHERE pelanggan.kota = gudang.kota
)
ORDER BY kota;`,
    fail: `SELECT kota
FROM gudang
WHERE kota NOT IN (SELECT kota FROM pelanggan)
ORDER BY kota;`,
    weak: [
      `SELECT kota
FROM gudang
WHERE NOT EXISTS (
  SELECT 1 FROM pelanggan WHERE pelanggan.kota = gudang.kota
);`,
    ],
  },
  'total-qty-per-nama': {
    pass: `SELECT produk.nama, SUM(penjualan.qty) AS total_qty
FROM produk
JOIN penjualan ON penjualan.produk_id = produk.id
GROUP BY produk.nama
ORDER BY produk.nama;`,
    fail: `SELECT produk.nama, penjualan.qty AS total_qty
FROM produk
JOIN penjualan ON penjualan.produk_id = produk.id
ORDER BY produk.nama;`,
    weak: [
      `SELECT produk.nama, SUM(penjualan.qty) AS total_qty
FROM produk
JOIN penjualan ON penjualan.produk_id = produk.id
GROUP BY produk.nama;`,
    ],
  },
  'pembeli-beras': {
    pass: `SELECT nama
FROM pelanggan
WHERE id IN (
  SELECT pelanggan_id
  FROM pesanan
  WHERE produk_id = (SELECT id FROM produk WHERE nama = 'Beras 5kg')
)
ORDER BY nama;`,
    fail: `SELECT pelanggan.nama
FROM pelanggan
JOIN pesanan ON pesanan.pelanggan_id = pelanggan.id
JOIN produk ON produk.id = pesanan.produk_id
WHERE produk.nama = 'Beras 5kg'
ORDER BY pelanggan.nama;`,
    weak: [
      `SELECT nama
FROM pelanggan
WHERE id IN (
  SELECT pelanggan_id
  FROM pesanan
  WHERE produk_id = (SELECT id FROM produk WHERE nama = 'Beras 5kg')
);`,
    ],
  },
  'qty-kosong-jadi-nol': {
    pass: `SELECT produk.nama, COALESCE(penjualan.qty, 0) AS qty_tampil
FROM produk
LEFT JOIN penjualan ON penjualan.produk_id = produk.id
ORDER BY produk.nama;`,
    fail: `SELECT produk.nama, penjualan.qty AS qty_tampil
FROM produk
LEFT JOIN penjualan ON penjualan.produk_id = produk.id
ORDER BY produk.nama;`,
    weak: [
      `SELECT produk.nama, COALESCE(penjualan.qty, 0) AS qty_tampil
FROM produk
JOIN penjualan ON penjualan.produk_id = produk.id
ORDER BY produk.nama;`,
    ],
  },
  'urut-kode-sebagai-angka': {
    pass: `SELECT kode, nama
FROM produk
ORDER BY CAST(kode AS INTEGER);`,
    fail: `SELECT kode, nama
FROM produk
ORDER BY kode;`,
    weak: [
      `SELECT kode, nama
FROM produk;`,
    ],
  },
  'pasangan-nama-kota-unik': {
    pass: `SELECT DISTINCT nama, kota
FROM pelanggan
ORDER BY nama, kota;`,
    fail: `SELECT nama, MIN(kota) AS kota
FROM pelanggan
GROUP BY nama
ORDER BY nama, kota;`,
    weak: [
      `SELECT DISTINCT nama, kota
FROM pelanggan;`,
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

// Same strings the browser grader stores.
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

test('41 sedang challenges are graded at 50 XP', async () => {
  const sedang = CHALLENGES.filter((item) => item.level === 'Sedang')
  assert.equal(sedang.length, 41)
  assert.deepEqual(
    sedang.map((item) => item.slug),
    [...SEDANG_SLUGS],
  )
  assert.equal(new Set(SEDANG_SLUGS).size, 41)

  const graded = CHALLENGES.filter((item) => item.expected)
  for (let i = 0; i < graded.length; i++) {
    for (let j = i + 1; j < graded.length; j++) {
      const left = graded[i]
      const right = graded[j]
      if (!left?.expected || !right?.expected) continue
      if (left.level !== 'Sedang' && right.level !== 'Sedang') continue
      assert.equal(sameGrid(left.expected, right.expected), false, `${left.slug} vs ${right.slug}`)
    }
  }

  const conn = await openConn()
  try {
    for (const item of sedang) {
      assert.match(item.slug, /^[a-z0-9-]{1,80}$/)
      assert.equal(item.premium, false)
      assert.equal(item.xpReward, 50)
      assert.equal(item.level, 'Sedang')
      const expected = item.expected
      assert.ok(expected)
      assert.ok(expected.rows.length > 0)
      const sql = SEDANG_SQL[item.slug as Slug]
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
