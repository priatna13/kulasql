import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { PLAYBOOK, PLAYBOOK_JOBS, PLAYBOOK_PATH, PLAYBOOK_STORE } from './playbook.ts'

const WORK =
  /(laporan|pelanggan|penjualan|stok|omzet|nota|kasir|produk|kota|belanja|pesanan|harga|barang|gudang|kanal)/i

test('playbook holds a hundred Indonesian work templates', () => {
  assert.equal(PLAYBOOK_STORE, 'TokoKulwon')
  assert.equal(PLAYBOOK.length, 100)
  const ids = new Set<string>()
  const titles = new Set<string>()
  const sqls = new Set<string>()
  for (const item of PLAYBOOK) {
    assert.equal(ids.has(item.id), false, item.id)
    ids.add(item.id)
    assert.equal(titles.has(item.title), false, item.title)
    titles.add(item.title)
    assert.equal(PLAYBOOK_JOBS.includes(item.job), true, item.id)
    assert.match(`${item.title} ${item.scenario}`, WORK, item.id)
    assert.doesNotMatch(`${item.title} ${item.scenario}`, /leetcode|puzzle|hackerrank/i, item.id)
    const sql = item.sql.trim()
    assert.equal(sql, item.sql, item.id)
    assert.match(sql, /^(SELECT|WITH)\b/, item.id)
    assert.match(sql, /\bFROM\b/, item.id)
    assert.match(sql, /\b(pelanggan|produk|pesanan|baris_pesanan)\b/, item.id)
    assert.equal(sqls.has(sql), false, item.id)
    sqls.add(sql)
  }
  for (const job of PLAYBOOK_JOBS) {
    assert.ok(PLAYBOOK.some((item) => item.job === job), job)
  }
})

test('playbook route is registered beside the other paths', () => {
  const src = dirname(fileURLToPath(import.meta.url))
  const app = readFileSync(join(src, '../App.tsx'), 'utf8')
  const chrome = readFileSync(join(src, '../components/Chrome.tsx'), 'utf8')
  const landing = readFileSync(join(src, '../pages/Landing.tsx'), 'utf8')
  const course = readFileSync(join(src, '../pages/Course.tsx'), 'utf8')
  assert.equal(PLAYBOOK_PATH, '/kulasql/playbook')
  assert.match(app, /path=\{PLAYBOOK_PATH\}/)
  assert.match(app, /<Playbook \/>/)
  assert.match(chrome, /to=\{PLAYBOOK_PATH\}/)
  assert.match(chrome, /to=\{POSTGRES_PATH\}/)
  assert.doesNotMatch(chrome, /#jalur">Ensiklopedia/)
  assert.match(landing, /to=\{PLAYBOOK_PATH\}>Buka Playbook/)
  assert.equal(landing.includes('Belum dibuka'), false)
  assert.equal(course.includes('masih catatan'), false)
  assert.match(course, /to=\{PLAYBOOK_PATH\}/)
})
