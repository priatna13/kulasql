import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'
import { fileURLToPath } from 'node:url'
import { REWARDS } from '../progress/grant.ts'
import { LESSONS, lessonFor } from './content.ts'

const PASS = /'([a-z0-9-]+)':\s*\{\s*pass:\s*`([\s\S]*?)`,\s*fail:/g

function passes(path: string): Map<string, string> {
  const text = readFileSync(fileURLToPath(new URL(path, import.meta.url)), 'utf8')
  const out = new Map<string, string>()
  for (const match of text.matchAll(PASS)) {
    out.set(match[1] ?? '', (match[2] ?? '').replace(/\r\n/g, '\n'))
  }
  return out
}

function collapsed(text: string): string {
  return text.replace(/\s+/g, ' ').trim().toLowerCase()
}

const fixtures = new Map([
  ...passes('../../../frontend/src/lib/mudah.test.ts'),
  ...passes('../../../frontend/src/lib/sedang.test.ts'),
  ...passes('../../../frontend/src/lib/sulit.test.ts'),
])

test('every solution is the fixture query and hints are not that query', () => {
  assert.equal(fixtures.size, 100)
  assert.deepEqual(Object.keys(LESSONS).sort(), Object.keys(REWARDS).sort())
  const seen = new Set<string>()
  for (const [slug, lesson] of Object.entries(LESSONS)) {
    const expected = fixtures.get(slug)
    assert.equal(lesson.sql, expected, slug)
    assert.equal(lesson.hints.length, 3, slug)
    assert.equal(new Set(lesson.hints).size, 3, slug)
    const query = collapsed(lesson.sql).replace(/;$/, '')
    for (const hint of lesson.hints) {
      assert.equal(hint.length > 20, true, slug)
      assert.equal(collapsed(hint).includes(query), false, slug)
    }
    assert.equal(collapsed(lesson.why).includes(query), false, slug)
    assert.equal(lesson.why.length > 40, true, slug)
    assert.match(lesson.why, /benar|Soal|baris|kolom/i)
    assert.doesNotMatch(`${lesson.hints.join(' ')} ${lesson.why}`, /upgrade|langganan|paywall|Rp69|535\.000/)
    const key = lesson.hints.join('\n')
    assert.equal(seen.has(key), false, slug)
    seen.add(key)
  }

  assert.equal(
    lessonFor('hari-pertama-di-tokokulwon')?.sql,
    fixtures.get('hari-pertama-di-tokokulwon'),
  )
  assert.equal(
    lessonFor('pelanggan-vip-dari-surabaya')?.sql,
    fixtures.get('pelanggan-vip-dari-surabaya'),
  )
  assert.equal(lessonFor('top-5-produk-terlaris')?.sql, fixtures.get('top-5-produk-terlaris'))
  const hari = lessonFor('hari-pertama-di-tokokulwon')
  assert.ok(hari)
  assert.equal(collapsed(hari.hints[2] ?? '').includes(collapsed(hari.sql).replace(/;$/, '')), false)

  const alias = lessonFor('alias-tabel-pelanggan')
  assert.ok(alias)
  assert.match(alias.hints[0] ?? '', /nama singkat untuk tabel/)
  assert.doesNotMatch(`${alias.hints[0]} ${alias.why}`, /memberi nama pada hasilnya/)
  const tigaHari = lessonFor('jumlah-tiga-hari-terakhir')
  assert.ok(tigaHari)
  assert.match(tigaHari.hints[2] ?? '', /jendela baris/)
  assert.doesNotMatch(tigaHari.hints[2] ?? '', /batas rentang/)
  const ujung = lessonFor('ujung-qty-tiap-toko')
  assert.ok(ujung)
  assert.match(ujung.hints[2] ?? '', /baris terakhir/)
  assert.doesNotMatch(ujung.hints[2] ?? '', /batas rentang/)
  const omzet = lessonFor('omzet-kota-lewat-ringkasan')
  assert.ok(omzet)
  assert.match(omzet.hints[1] ?? '', /sudah diringkas/)
  assert.doesNotMatch(omzet.hints[1] ?? '', /sebelum ringkasan/)
})
