import * as duckdb from '@duckdb/duckdb-wasm'
import { seedStatements, type Challenge } from './challenge.ts'

export const QUERY_TIMEOUT_MS = 5_000
export const RESULT_ROW_CAP = 1_000

const TIMEOUT_MESSAGE =
  'Query terlalu lama dan sudah dihentikan. Persempit datanya, lalu jalankan lagi.'

export type QuerySuccess = {
  ok: true
  columns: string[]
  rows: string[][]
  rowCount: number
  elapsedMs: number
  truncated: boolean
}

export type QueryFailure = {
  ok: false
  message: string
  detail?: string
  elapsedMs: number
}

export type QueryResult = QuerySuccess | QueryFailure

type ReadOutcome =
  | { kind: 'rows'; columns: string[]; rows: string[][]; truncated: boolean }
  | { kind: 'error'; error: unknown }

let dbPromise: Promise<duckdb.AsyncDuckDB> | null = null
let connPromise: Promise<duckdb.AsyncDuckDBConnection> | null = null
let seedPromise: Promise<void> | null = null
let seedSlug: string | null = null
let seededFor: string | null = null
let seededSql: string | null = null
let seedDirty = false
let tail: Promise<void> = Promise.resolve()

function enqueue<T>(task: () => Promise<T>): Promise<T> {
  const run = tail.then(task, task)
  tail = run.then(
    () => undefined,
    () => undefined,
  )
  return run
}

function formatCell(value: unknown): string {
  if (value == null) return 'NULL'
  return String(value)
}

function recordOf(row: unknown): Record<string, unknown> {
  if (row && typeof row === 'object' && 'toJSON' in row && typeof row.toJSON === 'function') {
    return row.toJSON() as Record<string, unknown>
  }
  return row as Record<string, unknown>
}

function explainError(error: unknown): { message: string; detail?: string } {
  const raw = error instanceof Error ? error.message : String(error)
  if (/query was canceled|query was cancelled/i.test(raw)) {
    return { message: TIMEOUT_MESSAGE }
  }
  if (/permission error|file system operations are disabled|http error|could not fetch/i.test(raw)) {
    return {
      message: 'Sandbox tidak membuka file atau jaringan. Pakai tabel soal ini saja.',
      detail: raw,
    }
  }
  if (/cannot change configuration option/i.test(raw)) {
    return {
      message: 'Pengaturan sandbox dikunci, jadi query itu tidak dijalankan.',
      detail: raw,
    }
  }
  if (/does not exist|not found/i.test(raw)) {
    return {
      message:
        'Tabel atau kolom tidak ditemukan. Cek nama di skema kiri, lalu perbaiki query.',
      detail: raw,
    }
  }
  if (/Parser Error|syntax error/i.test(raw)) {
    return {
      message: 'SQL tidak bisa dibaca. Cek ejaan kata kunci, koma, dan tanda kutip.',
      detail: raw,
    }
  }
  if (/Binder Error|Catalog Error/i.test(raw)) {
    return {
      message: 'Query tidak cocok dengan skema. Cek nama tabel dan kolom di rel kiri.',
      detail: raw,
    }
  }
  return {
    message: 'Query gagal dijalankan. Baca pesan mesin di bawah, perbaiki, lalu jalankan lagi.',
    detail: raw,
  }
}

function failure(error: unknown, elapsedMs: number): QueryFailure {
  return { ok: false, ...explainError(error), elapsedMs }
}

function createWorker(url: string): Worker {
  return new Worker(new URL(url, window.location.href), { type: 'classic' })
}

async function createBrowserDb(): Promise<duckdb.AsyncDuckDB> {
  const [mvpWasm, mvpWorker, ehWasm, ehWorker] = await Promise.all([
    import('@duckdb/duckdb-wasm/dist/duckdb-mvp.wasm?url'),
    import('@duckdb/duckdb-wasm/dist/duckdb-browser-mvp.worker.js?url'),
    import('@duckdb/duckdb-wasm/dist/duckdb-eh.wasm?url'),
    import('@duckdb/duckdb-wasm/dist/duckdb-browser-eh.worker.js?url'),
  ])
  const bundle = await duckdb.selectBundle({
    mvp: { mainModule: mvpWasm.default, mainWorker: mvpWorker.default },
    eh: { mainModule: ehWasm.default, mainWorker: ehWorker.default },
  })
  const worker = createWorker(bundle.mainWorker!)
  const db = new duckdb.AsyncDuckDB(new duckdb.VoidLogger(), worker)
  try {
    await db.instantiate(bundle.mainModule, bundle.pthreadWorker)
    return db
  } catch (error) {
    worker.terminate()
    throw error
  }
}

type NodeWorker = {
  on(event: 'message', listener: (data: unknown) => void): void
  on(event: 'error', listener: (error: Error) => void): void
  on(event: 'exit', listener: () => void): void
  postMessage(data: unknown, transfer?: readonly ArrayBuffer[]): void
  terminate(): Promise<number>
  unref(): void
}

// duckdb-node's createWorker() fetches a blob URL. Node's fetch cannot do that.
async function createNodeDb(): Promise<duckdb.AsyncDuckDB> {
  const load = new Function('specifier', 'return import(specifier)') as (
    specifier: string,
  ) => Promise<Record<string, unknown>>
  const nodeModule = (await load('node:module')) as {
    createRequire: (from: string) => { resolve: (id: string) => string }
  }
  const nodePath = (await load('node:path')) as {
    dirname: (path: string) => string
    join: (...parts: string[]) => string
  }
  const nodeWorker = (await load('node:worker_threads')) as {
    Worker: new (filename: string, options: { workerData: { mod: string } }) => NodeWorker
  }
  const require = nodeModule.createRequire(import.meta.url)
  const host = require.resolve('@duckdb/duckdb-wasm/dist/duckdb-node.cjs')
  const dist = nodePath.dirname(host)
  const bundle = await duckdb.selectBundle({
    mvp: {
      mainModule: nodePath.join(dist, 'duckdb-mvp.wasm'),
      mainWorker: nodePath.join(dist, 'duckdb-node-mvp.worker.cjs'),
    },
    eh: {
      mainModule: nodePath.join(dist, 'duckdb-eh.wasm'),
      mainWorker: nodePath.join(dist, 'duckdb-node-eh.worker.cjs'),
    },
  })
  const listeners = new Map<string, Array<(event: unknown) => void>>()
  const worker = new nodeWorker.Worker(host, { workerData: { mod: bundle.mainWorker! } })
  worker.unref()
  worker.on('message', (data) => {
    for (const listener of listeners.get('message') ?? []) listener({ data })
  })
  worker.on('error', (error) => {
    for (const listener of listeners.get('error') ?? []) listener(error)
  })
  worker.on('exit', () => {
    for (const listener of listeners.get('close') ?? []) listener({})
  })
  const adapter = {
    addEventListener(type: string, listener: (event: unknown) => void) {
      const list = listeners.get(type) ?? []
      list.push(listener)
      listeners.set(type, list)
    },
    removeEventListener(type: string, listener: (event: unknown) => void) {
      const list = listeners.get(type) ?? []
      const index = list.indexOf(listener)
      if (index !== -1) list.splice(index, 1)
    },
    postMessage(data: unknown, transfer?: readonly ArrayBuffer[]) {
      worker.postMessage(data, transfer)
    },
    terminate() {
      return worker.terminate()
    },
  }
  const db = new duckdb.AsyncDuckDB(new duckdb.VoidLogger(), adapter as unknown as Worker)
  try {
    await db.instantiate(bundle.mainModule, bundle.pthreadWorker)
    return db
  } catch (error) {
    await worker.terminate()
    throw error
  }
}

async function createDb(): Promise<duckdb.AsyncDuckDB> {
  if (typeof window === 'undefined') return createNodeDb()
  return createBrowserDb()
}

function getDb(): Promise<duckdb.AsyncDuckDB> {
  if (!dbPromise) {
    dbPromise = createDb().catch((error: unknown) => {
      dbPromise = null
      connPromise = null
      seedPromise = null
      seedSlug = null
      seededFor = null
      seededSql = null
      seedDirty = false
      throw error
    })
  }
  return dbPromise
}

async function openConnection(): Promise<duckdb.AsyncDuckDBConnection> {
  const db = await getDb()
  const conn = await db.connect()
  // Locked so a later statement cannot turn file or network access back on.
  await conn.query('SET enable_external_access=false')
  await conn.query('SET lock_configuration=true')
  return conn
}

function getConnection(): Promise<duckdb.AsyncDuckDBConnection> {
  if (!connPromise) {
    connPromise = openConnection().catch((error: unknown) => {
      connPromise = null
      throw error
    })
  }
  return connPromise
}

async function dropNamed(
  conn: duckdb.AsyncDuckDBConnection,
  sql: string,
  kind: 'VIEW' | 'MACRO' | 'TABLE',
): Promise<void> {
  const table = await conn.query(sql)
  for (const row of table.toArray()) {
    const record = recordOf(row)
    const schema = record.schema_name
    const name = record.object_name
    if (typeof schema !== 'string' || schema.length === 0) continue
    if (typeof name !== 'string' || name.length === 0) continue
    const qualified = `"${schema.replaceAll('"', '""')}"."${name.replaceAll('"', '""')}"`
    await conn.query(`DROP ${kind} IF EXISTS ${qualified}`)
  }
}

async function applySeed(conn: duckdb.AsyncDuckDBConnection, sql: string): Promise<void> {
  await conn.query("SET schema = 'main'")
  await conn.query("SET search_path = 'main'")
  await dropNamed(
    conn,
    'SELECT DISTINCT schema_name, view_name AS object_name FROM duckdb_views() WHERE NOT internal',
    'VIEW',
  )
  await dropNamed(
    conn,
    "SELECT DISTINCT schema_name, function_name AS object_name FROM duckdb_functions() WHERE NOT internal AND function_type IN ('macro', 'table_macro')",
    'MACRO',
  )
  await dropNamed(
    conn,
    'SELECT DISTINCT schema_name, table_name AS object_name FROM duckdb_tables() WHERE NOT internal',
    'TABLE',
  )
  for (const statement of seedStatements([], sql)) {
    await conn.query(statement)
  }
}

async function restoreSeed(conn: duckdb.AsyncDuckDBConnection): Promise<void> {
  if (seededSql === null) return
  try {
    await conn.query('ROLLBACK')
  } catch {
    // A script that already committed leaves nothing to roll back.
  }
  await applySeed(conn, seededSql)
  seedDirty = false
}

export function ensureChallengeData(challenge: Challenge): Promise<void> {
  if (seedPromise && seedSlug === challenge.slug) return seedPromise
  if (!seedPromise && seededFor === challenge.slug) return Promise.resolve()

  const slug = challenge.slug
  const sql = challenge.seedSql
  const previous = seedPromise ?? Promise.resolve()
  let current = Promise.resolve()
  seedSlug = slug
  current = enqueue(() =>
    previous.catch(() => undefined).then(async () => {
      const conn = await getConnection()
      await applySeed(conn, sql)
      if (seedSlug === slug) {
        seededFor = slug
        seededSql = sql
        seedDirty = false
      }
    }),
  ).then(
    () => {
      if (seedPromise === current) {
        seedPromise = null
        seedSlug = null
      }
    },
    (error: unknown) => {
      if (seedPromise === current) {
        seedPromise = null
        seedSlug = null
        seededFor = null
        seededSql = null
        seedDirty = false
      }
      throw error
    },
  )
  seedPromise = current
  return current
}

async function readCapped(conn: duckdb.AsyncDuckDBConnection, sql: string): Promise<ReadOutcome> {
  const rows: string[][] = []
  let columns: string[] = []
  let truncated = false
  try {
    const reader = await conn.send(sql, true)
    for await (const batch of reader) {
      if (columns.length === 0) columns = batch.schema.fields.map((field) => field.name)
      // One vector is already in memory. Do not ask the engine for the next one.
      for (const row of batch.toArray()) {
        if (rows.length === RESULT_ROW_CAP) {
          truncated = true
          break
        }
        rows.push(columns.map((col) => formatCell(recordOf(row)[col])))
      }
      if (truncated) break
    }
  } catch (error) {
    if (!truncated) return { kind: 'error', error }
  }
  if (truncated) await conn.cancelSent().catch(() => undefined)
  return { kind: 'rows', columns, rows, truncated }
}

async function withTimeout(work: Promise<ReadOutcome>): Promise<ReadOutcome | 'timeout'> {
  let timer: ReturnType<typeof setTimeout> | undefined
  try {
    return await new Promise<ReadOutcome | 'timeout'>((resolve) => {
      timer = setTimeout(() => resolve('timeout'), QUERY_TIMEOUT_MS)
      work.then(resolve)
    })
  } finally {
    if (timer !== undefined) clearTimeout(timer)
  }
}

async function runQueued(sql: string): Promise<QueryResult> {
  const started = performance.now()
  const elapsed = () => Math.round(performance.now() - started)
  const conn = await getConnection()
  if (seedDirty) await restoreSeed(conn)
  try {
    await conn.query('BEGIN TRANSACTION')
  } catch (error) {
    return failure(error, elapsed())
  }
  seedDirty = true
  const work = readCapped(conn, sql)
  const winner = await withTimeout(work)
  if (winner === 'timeout') await conn.cancelSent().catch(() => undefined)
  await work
  try {
    await restoreSeed(conn)
  } catch (error) {
    seedDirty = true
    if (winner === 'timeout') return { ok: false, message: TIMEOUT_MESSAGE, elapsedMs: elapsed() }
    if (winner.kind === 'error') return failure(winner.error, elapsed())
    return failure(error, elapsed())
  }
  if (winner === 'timeout') {
    return { ok: false, message: TIMEOUT_MESSAGE, elapsedMs: elapsed() }
  }
  if (winner.kind === 'error') return failure(winner.error, elapsed())
  return {
    ok: true,
    columns: winner.columns,
    rows: winner.rows,
    rowCount: winner.rows.length,
    elapsedMs: Math.max(1, elapsed()),
    truncated: winner.truncated,
  }
}

export async function stopEngine(): Promise<void> {
  const pending = dbPromise
  dbPromise = null
  connPromise = null
  seedPromise = null
  seedSlug = null
  seededFor = null
  seededSql = null
  seedDirty = false
  if (!pending) return
  const db = await pending.catch(() => null)
  if (db) await db.terminate()
}

export function runQuery(sql: string): Promise<QueryResult> {
  const trimmed = sql.trim()
  if (!trimmed) {
    return Promise.resolve({
      ok: false,
      message: 'Query masih kosong. Tulis SELECT, lalu jalankan.',
      elapsedMs: 0,
    })
  }
  return enqueue(() => runQueued(trimmed))
}
