import assert from 'node:assert/strict'
import { test } from 'node:test'
import {
  catalogQuery,
  CHALLENGES,
  FIRST_CHALLENGE_SLUG,
  listChallenges,
  PAGE_SIZE,
  pageOf,
  seedStatements,
  type CatalogQuery,
} from './challenge.ts'

const none = new Set<string>()

const open: CatalogQuery = {
  level: null,
  category: null,
  status: null,
  tag: null,
  q: '',
}

test('guest catalog objects do not carry hints or solutions', () => {
  assert.equal(CHALLENGES.length, 100)
  for (const challenge of CHALLENGES) {
    assert.equal('hints' in challenge, false)
    assert.equal('solution' in challenge, false)
    assert.equal('why' in challenge, false)
    assert.equal('sql' in challenge, false)
  }
})

test('the same filter and search stay in catalog order', () => {
  const query: CatalogQuery = { ...open, level: 'Mudah', tag: 'filtering' }
  const once = listChallenges(query, none).map((item) => item.slug)
  const twice = listChallenges(query, none).map((item) => item.slug)
  assert.deepEqual(once, twice)
  assert.deepEqual(once, [
    'mencari-pelanggan-dari-jakarta',
    'produk-dengan-harga-terjangkau',
    'pelanggan-dari-jakarta-atau-bandung',
    'pelanggan-jakarta-belanja-besar',
    'pelanggan-di-tiga-kota',
    'belanja-di-antara',
    'nama-berawalan-de',
    'harga-di-bawah-dua-puluh-ribu',
    'pelanggan-bukan-dari-medan',
    'nama-berakhiran-wati',
    'pelanggan-bandung-atau-surabaya',
    'harga-antara-dua-batas',
  ])
})

test('filters combine and a slug outside completions stays unfinished', () => {
  const sulit = listChallenges(
    { ...open, level: 'Sulit', category: 'Agregasi', tag: 'group_by' },
    none,
  ).map((item) => item.slug)
  assert.deepEqual(sulit, ['top-5-produk-terlaris'])

  const done = new Set([FIRST_CHALLENGE_SLUG])
  const selesai = listChallenges({ ...open, status: 'selesai' }, done).map((item) => item.slug)
  assert.deepEqual(selesai, [FIRST_CHALLENGE_SLUG])

  const belum = listChallenges(
    { ...open, level: 'Mudah', status: 'belum', tag: 'filtering' },
    done,
  ).map((item) => item.slug)
  assert.deepEqual(belum, [
    'mencari-pelanggan-dari-jakarta',
    'produk-dengan-harga-terjangkau',
    'pelanggan-dari-jakarta-atau-bandung',
    'pelanggan-jakarta-belanja-besar',
    'pelanggan-di-tiga-kota',
    'belanja-di-antara',
    'nama-berawalan-de',
    'harga-di-bawah-dua-puluh-ribu',
    'pelanggan-bukan-dari-medan',
    'nama-berakhiran-wati',
    'pelanggan-bandung-atau-surabaya',
    'harga-antara-dua-batas',
  ])
  assert.equal(belum.includes(FIRST_CHALLENGE_SLUG), false)
})

test('search matches titles, not category or tag names', () => {
  const query: CatalogQuery = { ...open, level: 'Mudah', tag: 'filtering', q: '  JaKaRTa ' }
  assert.deepEqual(
    listChallenges(query, none).map((item) => item.slug),
    [
      'mencari-pelanggan-dari-jakarta',
      'pelanggan-dari-jakarta-atau-bandung',
      'pelanggan-jakarta-belanja-besar',
    ],
  )
  assert.deepEqual(
    listChallenges({ ...open, q: 'group_by' }, none).map((item) => item.slug),
    [],
  )
  assert.deepEqual(
    listChallenges({ ...open, q: 'Agregasi' }, none).map((item) => item.slug),
    [],
  )
})

test('page slice is 25 rows, including a list longer than one page', () => {
  const items = Array.from({ length: 30 }, (_, index) => `soal-${index}`)
  const first = pageOf(items, 1)
  const second = pageOf(items, 2)
  assert.equal(PAGE_SIZE, 25)
  assert.equal(first.length, 25)
  assert.equal(first[0], 'soal-0')
  assert.equal(first[24], 'soal-24')
  assert.equal(second.length, 5)
  assert.equal(second[0], 'soal-25')
  assert.equal(second[4], 'soal-29')
  assert.deepEqual(pageOf(items, 2), second)
  assert.equal(pageOf(items, 3).length, 0)

  assert.equal(CHALLENGES.length, 100)
  assert.equal(pageOf(CHALLENGES, 1).length, PAGE_SIZE)
  assert.equal(pageOf(CHALLENGES, 2).length, PAGE_SIZE)
  assert.equal(pageOf(CHALLENGES, 3).length, PAGE_SIZE)
  assert.equal(pageOf(CHALLENGES, 4).length, PAGE_SIZE)
  assert.equal(pageOf(CHALLENGES, 5).length, 0)

  const sedangPage = listChallenges({ ...open, level: 'Sedang' }, none)
  assert.equal(sedangPage.length, 41)
  assert.equal(pageOf(sedangPage, 1).length, PAGE_SIZE)
  assert.equal(pageOf(sedangPage, 2).length, 16)
  assert.equal(pageOf(sedangPage, 3).length, 0)

  const sulitPage = listChallenges({ ...open, level: 'Sulit' }, none)
  assert.equal(sulitPage.length, 28)
  assert.equal(pageOf(sulitPage, 1).length, PAGE_SIZE)
  assert.equal(pageOf(sulitPage, 2).length, 3)
  assert.equal(pageOf(sulitPage, 3).length, 0)
})

test('unknown kategori and tag are ignored; a real empty combination stays empty', () => {
  const ignored = catalogQuery({
    tingkat: 'mudah',
    kategori: 'Nope',
    status: 'nope',
    tag: 'select',
    q: '',
  })
  assert.deepEqual(ignored, open)
  assert.ok(listChallenges(ignored, none).length > 0)

  const blank = catalogQuery({
    tingkat: null,
    kategori: '   ',
    status: null,
    tag: '',
    q: null,
  })
  assert.deepEqual(blank, open)

  const kept = catalogQuery({
    tingkat: 'Mudah',
    kategori: 'Filter Data',
    status: 'belum',
    tag: 'filtering',
    q: 'jakarta',
  })
  assert.equal(kept.level, 'Mudah')
  assert.equal(kept.category, 'Filter Data')
  assert.equal(kept.tag, 'filtering')
  assert.deepEqual(
    listChallenges({ ...open, level: 'Sulit', tag: 'beginner' }, none).map((item) => item.slug),
    [],
  )
})

test('a later seed drops tables that belong only to the earlier challenge', () => {
  const hari = CHALLENGES.find((item) => item.slug === FIRST_CHALLENGE_SLUG)
  const harga = CHALLENGES.find((item) => item.slug === 'produk-dengan-harga-terjangkau')
  assert.ok(hari)
  assert.ok(harga)

  const afterTop = seedStatements(['produk', 'penjualan'], hari.seedSql)
  assert.deepEqual(afterTop.slice(0, 2), [
    'DROP TABLE IF EXISTS "produk"',
    'DROP TABLE IF EXISTS "penjualan"',
  ])
  assert.equal(
    afterTop.some((sql) => /penjualan/i.test(sql) && !sql.startsWith('DROP')),
    false,
  )
  assert.match(afterTop[2] ?? '', /CREATE OR REPLACE TABLE pelanggan/)

  const afterPelanggan = seedStatements(['pelanggan'], harga.seedSql)
  assert.equal(afterPelanggan[0], 'DROP TABLE IF EXISTS "pelanggan"')
  assert.equal(
    afterPelanggan.some((sql) => /CREATE OR REPLACE TABLE pelanggan/.test(sql)),
    false,
  )
  assert.match(afterPelanggan[1] ?? '', /CREATE OR REPLACE TABLE produk/)
  assert.equal(seedStatements(['a"b'], 'SELECT 1')[0], 'DROP TABLE IF EXISTS "a""b"')
})

test('premium stays listed and every level is graded', () => {
  const mudah = CHALLENGES.filter((item) => item.level === 'Mudah')
  const sedang = CHALLENGES.filter((item) => item.level === 'Sedang')
  const sulit = CHALLENGES.filter((item) => item.level === 'Sulit')
  assert.equal(mudah.length, 31)
  assert.equal(sedang.length, 41)
  assert.equal(sulit.length, 28)
  assert.deepEqual(sedang.slice(0, 4).map((item) => item.slug), [
    'pelanggan-vip-dari-surabaya',
    'daftar-produk-termahal',
    'total-belanja-per-kota',
    'produk-tanpa-harga',
  ])
  for (const item of sedang) {
    assert.notEqual(item.expected, null)
    assert.equal(item.xpReward, 50)
    assert.equal(item.premium, false)
  }
  assert.deepEqual(sulit.slice(0, 3).map((item) => item.slug), [
    'top-5-produk-terlaris',
    'kelas-pelanggan-dari-belanja',
    'email-pelanggan-yang-kosong',
  ])
  for (const item of sulit) {
    assert.notEqual(item.expected, null)
    assert.equal(item.xpReward, 50)
  }
  assert.equal(CHALLENGES.find((item) => item.slug === FIRST_CHALLENGE_SLUG)?.xpReward, 50)
  const premium = CHALLENGES.filter((item) => item.premium)
  assert.deepEqual(
    premium.map((item) => item.slug),
    ['top-5-produk-terlaris'],
  )
  assert.notEqual(premium[0]?.expected, null)
  assert.equal(premium[0]?.xpReward, 50)
  assert.equal(listChallenges(open, none).some((item) => item.premium), true)
  assert.deepEqual(
    [...new Set(CHALLENGES.map((item) => item.level))],
    ['Mudah', 'Sedang', 'Sulit'],
  )
})
