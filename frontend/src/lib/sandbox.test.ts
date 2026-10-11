import assert from 'node:assert/strict'
import { existsSync, unlinkSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { after, describe, test } from 'node:test'
import { CHALLENGES, FIRST_CHALLENGE } from './challenge.ts'
import {
  QUERY_TIMEOUT_MS,
  RESULT_ROW_CAP,
  ensureChallengeData,
  runQuery,
  stopEngine,
  type QueryResult,
} from './duckdb-engine.ts'

after(() => stopEngine())

const seededSql = 'SELECT id, nama, kota, total_belanja FROM pelanggan ORDER BY id'
const expected = FIRST_CHALLENGE.expected
if (!expected) throw new Error('Soal pertama kehilangan kunci jawaban.')

function assertSeed(result: QueryResult) {
  assert.equal(result.ok, true, result.ok ? '' : result.message)
  if (!result.ok) return
  assert.deepEqual(result.rows, expected?.rows)
}

describe('sandbox', { concurrency: false }, () => {
  test('a fast query is not rejected when the timeout window passes', { timeout: 60_000 }, async () => {
    const unhandled: unknown[] = []
    const onUnhandled = (error: unknown) => {
      unhandled.push(error)
    }
    process.on('unhandledRejection', onUnhandled)
    try {
      await ensureChallengeData(FIRST_CHALLENGE)
      const fast = await runQuery('SELECT 1 AS n')
      assert.equal(fast.ok, true)
      if (!fast.ok) return
      assert.deepEqual(fast.rows, [['1']])
      await new Promise((resolve) => setTimeout(resolve, QUERY_TIMEOUT_MS + 400))
      assert.deepEqual(unhandled, [])
      assertSeed(await runQuery(seededSql))
    } finally {
      process.off('unhandledRejection', onUnhandled)
    }
  })

  test('a long query stops with a friendly error and the next query still returns rows', { timeout: 60_000 }, async () => {
    const unhandled: unknown[] = []
    const onUnhandled = (error: unknown) => {
      unhandled.push(error)
    }
    process.on('unhandledRejection', onUnhandled)
    try {
      await ensureChallengeData(FIRST_CHALLENGE)
      const slow = await runQuery(
        'WITH RECURSIVE t(n) AS (SELECT 0 UNION ALL SELECT n + 1 FROM t WHERE n < 1000000) SELECT max(n) AS n FROM t',
      )
      assert.equal(slow.ok, false)
      if (slow.ok) return
      assert.match(slow.message, /terlalu lama/)
      assert.equal(slow.detail, undefined)
      assert.doesNotMatch(slow.message, /at \w+\./)
      assertSeed(await runQuery(seededSql))
      assert.deepEqual(unhandled, [])
    } finally {
      process.off('unhandledRejection', onUnhandled)
    }
  })

  test('the row cap stops the result and says it was cut', { timeout: 60_000 }, async () => {
    await ensureChallengeData(FIRST_CHALLENGE)
    const started = Date.now()
    const result = await runQuery('SELECT range AS n FROM range(2000000)')
    const elapsed = Date.now() - started
    assert.equal(result.ok, true, result.ok ? '' : result.message)
    if (!result.ok) return
    assert.equal(result.rows.length, RESULT_ROW_CAP)
    assert.equal(result.rowCount, RESULT_ROW_CAP)
    assert.equal(result.truncated, true)
    assert.equal(result.rows[0]?.[0], '0')
    assert.ok(elapsed < QUERY_TIMEOUT_MS, `capped query took ${elapsed}ms`)
    assertSeed(await runQuery(seededSql))
  })

  test('DROP and ALTER do not leave the seeded challenge unloadable', { timeout: 60_000 }, async () => {
    await ensureChallengeData(FIRST_CHALLENGE)
    const dropped = await runQuery('DROP TABLE pelanggan')
    assert.equal(dropped.ok, true, dropped.ok ? '' : dropped.message)
    assertSeed(await runQuery(seededSql))

    const altered = await runQuery('ALTER TABLE pelanggan DROP COLUMN nama')
    assert.equal(altered.ok, true, altered.ok ? '' : altered.message)
    const names = await runQuery('SELECT nama FROM pelanggan ORDER BY id')
    assert.equal(names.ok, true, names.ok ? '' : names.message)
    if (!names.ok) return
    assert.deepEqual(
      names.rows,
      expected?.rows.map((row) => [row[1] ?? '']),
    )

    const committed = await runQuery('COMMIT; DROP TABLE pelanggan')
    assertSeed(await runQuery(seededSql))
    assert.equal(committed.ok, true, committed.ok ? '' : `${committed.message} ${committed.detail ?? ''}`)
  })

  test('a later run does not see temp tables, macros, or replacements', { timeout: 60_000 }, async () => {
    await ensureChallengeData(FIRST_CHALLENGE)
    const temp = await runQuery('CREATE TEMP TABLE bayangan AS SELECT 1 AS n')
    assert.equal(temp.ok, true, temp.ok ? '' : temp.message)
    const hiddenTemp = await runQuery('SELECT * FROM bayangan')
    assert.equal(hiddenTemp.ok, false)
    if (hiddenTemp.ok) return
    assert.match(hiddenTemp.message, /tidak ditemukan|tidak cocok/i)

    const macro = await runQuery('CREATE MACRO dobel(x) AS x * 2')
    assert.equal(macro.ok, true, macro.ok ? '' : macro.message)
    const hiddenMacro = await runQuery('SELECT dobel(2) AS n')
    assert.equal(hiddenMacro.ok, false)
    if (hiddenMacro.ok) return
    assert.match(hiddenMacro.message, /tidak ditemukan|tidak cocok/i)

    const replaced = await runQuery(
      "CREATE OR REPLACE TABLE pelanggan AS SELECT 99 AS id, 'x' AS nama, 'y' AS kota, 1 AS total_belanja",
    )
    assert.equal(replaced.ok, true, replaced.ok ? '' : replaced.message)
    assertSeed(await runQuery(seededSql))
  })

  test('file and network reads fail without touching the machine', { timeout: 60_000 }, async () => {
    await ensureChallengeData(FIRST_CHALLENGE)
    const target = join(tmpdir(), `kula-escape-${process.pid}.txt`).replaceAll('\\', '/')
    if (existsSync(target)) unlinkSync(target)
    const copy = await runQuery(`COPY (SELECT 1 AS n) TO '${target.replaceAll("'", "''")}'`)
    assert.equal(copy.ok, false)
    if (copy.ok) return
    assert.match(copy.message, /file atau jaringan/)
    assert.equal(existsSync(target), false)
    assert.doesNotMatch(copy.detail ?? '', /\n\s+at /)

    const local = await runQuery("SELECT * FROM read_csv_auto('D:/KulaSQL/package.json')")
    assert.equal(local.ok, false)
    if (local.ok) return
    assert.match(local.message, /file atau jaringan/)

    const remote = await runQuery("SELECT * FROM read_csv('https://example.com/kula.csv')")
    assert.equal(remote.ok, false)
    if (remote.ok) return
    assert.match(remote.message, /file atau jaringan/)
    assert.ok(remote.elapsedMs < QUERY_TIMEOUT_MS)

    assertSeed(await runQuery(seededSql))
  })

  test('the next challenge seed still works after a run creates a table', { timeout: 60_000 }, async () => {
    const produk = CHALLENGES.find((item) => item.slug === 'produk-dengan-harga-terjangkau')
    assert.ok(produk)
    await ensureChallengeData(FIRST_CHALLENGE)
    const created = await runQuery('CREATE TABLE rahasia AS SELECT 1 AS n')
    assert.equal(created.ok, true, created.ok ? '' : created.message)

    await ensureChallengeData(produk)
    const pelanggan = await runQuery('SELECT * FROM pelanggan')
    assert.equal(pelanggan.ok, false)
    const secret = await runQuery('SELECT * FROM rahasia')
    assert.equal(secret.ok, false)
    const goods = await runQuery('SELECT nama FROM produk')
    assert.equal(goods.ok, true, goods.ok ? '' : goods.message)
    if (!goods.ok) return
    assert.ok(goods.rows.length > 0)

    await ensureChallengeData(FIRST_CHALLENGE)
    const produkGone = await runQuery('SELECT * FROM produk')
    assert.equal(produkGone.ok, false)
    assertSeed(await runQuery(seededSql))
  })

  test('a committed object in another schema does not survive the next run', { timeout: 60_000 }, async () => {
    const produk = CHALLENGES.find((item) => item.slug === 'produk-dengan-harga-terjangkau')
    assert.ok(produk)
    await ensureChallengeData(FIRST_CHALLENGE)
    const leaked = await runQuery(`
      COMMIT;
      CREATE SCHEMA leak;
      CREATE TABLE leak.rahasia AS SELECT 7 AS n;
      CREATE SCHEMA leak3;
      CREATE VIEW leak3.samaran AS SELECT 1 AS n;
      CREATE SCHEMA leakm;
      CREATE MACRO leakm.dobel(x) AS x * 2;
      CREATE MACRO tampil2() AS TABLE SELECT 4 AS n;
      CREATE SCHEMA leak2;
      SET schema = 'leak2';
      SET search_path = 'leak2,main'
    `)
    assert.equal(leaked.ok, true, leaked.ok ? '' : `${leaked.message} ${leaked.detail ?? ''}`)

    const secret = await runQuery('SELECT * FROM leak.rahasia')
    assert.equal(secret.ok, false)
    const view = await runQuery('SELECT * FROM leak3.samaran')
    assert.equal(view.ok, false)
    const macro = await runQuery('SELECT leakm.dobel(2) AS n')
    assert.equal(macro.ok, false)
    const tableMacro = await runQuery('SELECT * FROM tampil2()')
    assert.equal(tableMacro.ok, false)
    const where = await runQuery(`
      SELECT schema_name, object_name FROM (
        SELECT schema_name, table_name AS object_name FROM duckdb_tables() WHERE NOT internal
        UNION ALL
        SELECT schema_name, view_name FROM duckdb_views() WHERE NOT internal
        UNION ALL
        SELECT schema_name, function_name FROM duckdb_functions()
        WHERE NOT internal AND function_type IN ('macro', 'table_macro')
      )
      WHERE object_name IN ('rahasia', 'samaran', 'dobel', 'tampil2')
    `)
    assert.equal(where.ok, true, where.ok ? '' : where.message)
    if (!where.ok) return
    assert.deepEqual(where.rows, [])
    const schema = await runQuery("SELECT current_schema() AS s, current_setting('search_path') AS p")
    assert.equal(schema.ok, true, schema.ok ? '' : schema.message)
    if (!schema.ok) return
    assert.deepEqual(schema.rows, [['main', 'main']])
    assertSeed(await runQuery(seededSql))

    await ensureChallengeData(produk)
    const placed = await runQuery(
      "SELECT schema_name FROM duckdb_tables() WHERE table_name = 'produk' AND NOT internal",
    )
    assert.equal(placed.ok, true, placed.ok ? '' : placed.message)
    if (!placed.ok) return
    assert.deepEqual(placed.rows, [['main']])
    const goods = await runQuery('SELECT nama FROM produk')
    assert.equal(goods.ok, true, goods.ok ? '' : goods.message)
    if (!goods.ok) return
    assert.ok(goods.rows.length > 0)
    const stillHidden = await runQuery('SELECT * FROM leak.rahasia')
    assert.equal(stillHidden.ok, false)

    await ensureChallengeData(FIRST_CHALLENGE)
    assertSeed(await runQuery(seededSql))
  })
})
