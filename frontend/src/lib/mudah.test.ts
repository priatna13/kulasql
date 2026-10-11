import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
import { dirname, join } from 'node:path'
import { test } from 'node:test'
import { CHALLENGES, FIRST_CHALLENGE, PAGE_SIZE, seedStatements, type ResultTable } from './challenge.ts'
import { grade, type GradeResult } from './grade.ts'

const MUDAH_SLUGS = [
  'hari-pertama-di-tokokulwon',
  'laporan-untuk-tim-marketing',
  'mencari-pelanggan-dari-jakarta',
  'produk-dengan-harga-terjangkau',
  'pelanggan-dari-jakarta-atau-bandung',
  'pelanggan-jakarta-belanja-besar',
  'pelanggan-di-tiga-kota',
  'belanja-di-antara',
  'nama-berawalan-de',
  'belanja-dari-yang-terbesar',
  'dua-pelanggan-pertama',
  'nama-sebagai-pelanggan',
  'jumlah-pelanggan-tercatat',
  'jumlah-seluruh-belanja',
  'belanja-paling-kecil',
  'belanja-paling-besar',
  'pesanan-dan-nama-pelanggan',
  'produk-yang-ikut-terjual',
  'harga-di-bawah-dua-puluh-ribu',
  'pelanggan-bukan-dari-medan',
  'urut-berdasarkan-kota',
  'nama-berakhiran-wati',
  'tiga-produk-termurah',
  'daftar-pesanan',
  'nama-dan-harga-produk',
  'pelanggan-bandung-atau-surabaya',
  'harga-antara-dua-batas',
  'urut-id-dari-belakang',
  'alias-tabel-pelanggan',
  'hitung-produk-berharga',
  'gabung-pelanggan-satu-kota',
] as const

export const MUDAH_SQL: Record<(typeof MUDAH_SLUGS)[number], { pass: string; fail: string }> = {
  'hari-pertama-di-tokokulwon': {
    pass: `SELECT *
FROM pelanggan
ORDER BY id;`,
    fail: `SELECT *
FROM pelanggan
ORDER BY id DESC;`,
  },
  'laporan-untuk-tim-marketing': {
    pass: `SELECT nama, kota
FROM pelanggan;`,
    fail: `SELECT nama
FROM pelanggan;`,
  },
  'mencari-pelanggan-dari-jakarta': {
    pass: `SELECT *
FROM pelanggan
WHERE kota = 'Jakarta';`,
    fail: `SELECT *
FROM pelanggan;`,
  },
  'produk-dengan-harga-terjangkau': {
    pass: `SELECT nama, harga
FROM produk
WHERE harga <= 20000;`,
    fail: `SELECT nama, harga
FROM produk
WHERE harga < 20000;`,
  },
  'pelanggan-dari-jakarta-atau-bandung': {
    pass: `SELECT nama, kota
FROM pelanggan
WHERE kota = 'Jakarta' OR kota = 'Bandung';`,
    fail: `SELECT nama, kota
FROM pelanggan;`,
  },
  'pelanggan-jakarta-belanja-besar': {
    pass: `SELECT nama, total_belanja
FROM pelanggan
WHERE kota = 'Jakarta' AND total_belanja > 300000;`,
    fail: `SELECT nama, total_belanja
FROM pelanggan
WHERE kota = 'Jakarta';`,
  },
  'pelanggan-di-tiga-kota': {
    pass: `SELECT nama, kota
FROM pelanggan
WHERE kota IN ('Jakarta', 'Surabaya', 'Medan');`,
    fail: `SELECT nama, kota
FROM pelanggan;`,
  },
  'belanja-di-antara': {
    pass: `SELECT nama, total_belanja
FROM pelanggan
WHERE total_belanja BETWEEN 150000 AND 300000;`,
    fail: `SELECT nama, total_belanja
FROM pelanggan
WHERE total_belanja >= 150000 AND total_belanja < 300000;`,
  },
  'nama-berawalan-de': {
    pass: `SELECT nama
FROM pelanggan
WHERE nama LIKE 'De%';`,
    fail: `SELECT nama
FROM pelanggan;`,
  },
  'belanja-dari-yang-terbesar': {
    pass: `SELECT nama, total_belanja
FROM pelanggan
ORDER BY total_belanja DESC, nama ASC;`,
    fail: `SELECT nama, total_belanja
FROM pelanggan
ORDER BY total_belanja ASC, nama ASC;`,
  },
  'dua-pelanggan-pertama': {
    pass: `SELECT id, nama
FROM pelanggan
ORDER BY id ASC
LIMIT 2;`,
    fail: `SELECT id, nama
FROM pelanggan
LIMIT 2;`,
  },
  'nama-sebagai-pelanggan': {
    pass: `SELECT nama AS pelanggan
FROM pelanggan;`,
    fail: `SELECT nama
FROM pelanggan;`,
  },
  'jumlah-pelanggan-tercatat': {
    pass: `SELECT COUNT(*) AS jumlah
FROM pelanggan;`,
    fail: `SELECT COUNT(*) AS jumlah
FROM pelanggan
WHERE kota = 'Medan';`,
  },
  'jumlah-seluruh-belanja': {
    pass: `SELECT SUM(total_belanja) AS jumlah
FROM pelanggan;`,
    fail: `SELECT SUM(total_belanja) AS jumlah
FROM pelanggan
WHERE kota = 'Medan';`,
  },
  'belanja-paling-kecil': {
    pass: `SELECT MIN(total_belanja) AS terkecil
FROM pelanggan;`,
    fail: `SELECT MAX(total_belanja) AS terkecil
FROM pelanggan;`,
  },
  'belanja-paling-besar': {
    pass: `SELECT MAX(total_belanja) AS terbesar
FROM pelanggan;`,
    fail: `SELECT MIN(total_belanja) AS terbesar
FROM pelanggan;`,
  },
  'pesanan-dan-nama-pelanggan': {
    pass: `SELECT pesanan.id, pelanggan.nama
FROM pesanan
JOIN pelanggan ON pelanggan.id = pesanan.pelanggan_id;`,
    fail: `SELECT id, pelanggan_id
FROM pesanan;`,
  },
  'produk-yang-ikut-terjual': {
    pass: `SELECT produk.nama
FROM baris_pesanan
JOIN produk ON produk.id = baris_pesanan.produk_id;`,
    fail: `SELECT nama
FROM produk;`,
  },
  'harga-di-bawah-dua-puluh-ribu': {
    pass: `SELECT nama, harga
FROM produk
WHERE harga < 20000;`,
    fail: `SELECT nama, harga
FROM produk;`,
  },
  'pelanggan-bukan-dari-medan': {
    pass: `SELECT nama, kota
FROM pelanggan
WHERE kota <> 'Medan';`,
    fail: `SELECT nama, kota
FROM pelanggan;`,
  },
  'urut-berdasarkan-kota': {
    pass: `SELECT nama, kota
FROM pelanggan
ORDER BY kota ASC, nama ASC;`,
    fail: `SELECT nama, kota
FROM pelanggan
ORDER BY kota DESC, nama ASC;`,
  },
  'nama-berakhiran-wati': {
    pass: `SELECT nama
FROM pelanggan
WHERE nama LIKE '%Wati';`,
    fail: `SELECT nama
FROM pelanggan;`,
  },
  'tiga-produk-termurah': {
    pass: `SELECT nama, harga
FROM produk
WHERE harga > 0
ORDER BY harga ASC, nama ASC
LIMIT 3;`,
    fail: `SELECT nama, harga
FROM produk
WHERE harga > 0
ORDER BY harga ASC, nama ASC;`,
  },
  'daftar-pesanan': {
    pass: `SELECT id, total
FROM pesanan;`,
    fail: `SELECT id, kota_tujuan
FROM pesanan;`,
  },
  'nama-dan-harga-produk': {
    pass: `SELECT nama, harga
FROM produk;`,
    fail: `SELECT nama
FROM produk;`,
  },
  'pelanggan-bandung-atau-surabaya': {
    pass: `SELECT nama, kota
FROM pelanggan
WHERE kota = 'Bandung' OR kota = 'Surabaya';`,
    fail: `SELECT nama, kota
FROM pelanggan;`,
  },
  'harga-antara-dua-batas': {
    pass: `SELECT nama, harga
FROM produk
WHERE harga >= 15000 AND harga <= 25000;`,
    fail: `SELECT nama, harga
FROM produk
WHERE harga > 15000 AND harga < 25000;`,
  },
  'urut-id-dari-belakang': {
    pass: `SELECT id, nama
FROM pelanggan
ORDER BY id DESC;`,
    fail: `SELECT id, nama
FROM pelanggan
ORDER BY id ASC;`,
  },
  'alias-tabel-pelanggan': {
    pass: `SELECT p.id, p.nama, p.kota
FROM pelanggan AS p;`,
    fail: `SELECT nama, kota
FROM pelanggan;`,
  },
  'hitung-produk-berharga': {
    pass: `SELECT COUNT(harga) AS jumlah
FROM produk;`,
    fail: `SELECT COUNT(*) AS jumlah
FROM produk;`,
  },
  'gabung-pelanggan-satu-kota': {
    pass: `SELECT pesanan.id, pelanggan.nama, pesanan.total
FROM pesanan
JOIN pelanggan ON pelanggan.id = pesanan.pelanggan_id
WHERE pelanggan.kota = 'Yogyakarta'
ORDER BY pesanan.id ASC;`,
    fail: `SELECT pesanan.id, pelanggan.nama, pesanan.total
FROM pesanan
JOIN pelanggan ON pelanggan.id = pesanan.pelanggan_id
WHERE pelanggan.kota = 'Yogyakarta';`,
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
  if (result.ok) return `${slug} ${kind} passed`
  return `${slug} ${kind}: ${result.message} ${JSON.stringify(actual)}`
}

test('31 mudah challenges are graded at 50 XP', async () => {
  const mudah = CHALLENGES.filter((item) => item.level === 'Mudah')
  assert.equal(mudah.length, 31)
  assert.deepEqual(
    mudah.map((item) => item.slug),
    [...MUDAH_SLUGS],
  )
  assert.equal(PAGE_SIZE, 25)
  assert.ok(CHALLENGES.length > PAGE_SIZE)

  const hari = FIRST_CHALLENGE.expected
  assert.ok(hari)
  assert.deepEqual(hari.rows, [
    ['1', 'Sari Wulandari', 'Yogyakarta', '185000'],
    ['2', 'Budi Santoso', 'Jakarta', '420000'],
    ['3', 'Lina Kusuma', 'Surabaya', '95000'],
    ['4', 'Agus Pratama', 'Bandung', '310000'],
    ['5', 'Dewi Lestari', 'Semarang', '150000'],
    ['6', 'Raka Putra', 'Medan', '275000'],
  ])

  for (const item of CHALLENGES.filter((row) => row.level === 'Sulit')) {
    assert.notEqual(item.expected, null)
    assert.equal(item.xpReward, 50)
  }
  for (const item of CHALLENGES.filter((row) => row.level === 'Sedang')) {
    assert.notEqual(item.expected, null)
    assert.equal(item.xpReward, 50)
  }

  const conn = await openConn()
  try {
    for (const item of mudah) {
      assert.match(item.slug, /^[a-z0-9-]{1,80}$/)
      assert.equal(item.premium, false)
      assert.equal(item.xpReward, 50)
      const expected = item.expected
      assert.ok(expected)
      assert.ok(expected.rows.length > 0)
      const sql = MUDAH_SQL[item.slug as (typeof MUDAH_SLUGS)[number]]
      const listed = toResult(conn.query('SHOW TABLES'))
      const nameAt = listed.columns.findIndex((name) => name.toLowerCase() === 'name')
      const existing = listed.rows.flatMap((row) => {
        const name = row[nameAt >= 0 ? nameAt : 0]
        return name && name !== 'NULL' ? [name] : []
      })
      for (const statement of seedStatements(existing, item.seedSql)) conn.query(statement)

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
    }
  } finally {
    conn.close()
  }
})
