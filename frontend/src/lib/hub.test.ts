import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'
import { SITE_FOOTER } from './legal.ts'
import { CHEATSHEET } from './store.ts'
import { HUB_ENTRIES } from './surfaces.ts'
import { parseWarmindoCsv, warmindoIdeas } from './warmindo.ts'

function source(path: string): string {
  return readFileSync(new URL(path, import.meta.url), 'utf8')
}

test('/kulasql is the main page and beranda lives at /beranda', () => {
  const app = source('../App.tsx')
  assert.match(app, /<Route path="\/" element=\{<Navigate to="\/kulasql" replace/)
  assert.match(app, /<Route path="\/beranda" element=\{<Hub/)
  assert.match(app, /<Route path="\/kulasql" element=\{<Landing/)
  assert.doesNotMatch(app, /<Route path="\/" element=\{<Hub/)
  assert.doesNotMatch(app, /<Route path="\/" element=\{<Landing/)
  assert.match(source('../pages/Privacy.tsx'), /to="\/beranda">Kembali ke beranda/)
  assert.match(source('../components/Chrome.tsx'), /to="\/beranda"/)
  const chrome = source('../components/Chrome.tsx')
  assert.match(chrome, /const onRamp = path === '\/kulasql'/)
  assert.match(
    chrome,
    /path === '\/kulasql\/syarat' \|\|\s*\(!path\.startsWith\('\/kulasql'\) && !path\.startsWith\('\/functions'\)\)/,
  )
  assert.doesNotMatch(chrome, /path === '\/spreadsheet'/)
  assert.match(chrome, /prose\s*\?\s*'#isi'/)
  assert.equal(chrome.includes('isOnRamp'), false)
  assert.equal(chrome.includes('isProse'), false)
  assert.deepEqual(
    HUB_ENTRIES.map((entry) => entry.name),
    ['SQL', 'Spreadsheet', 'Dataset', 'FAQ'],
  )
  const hub = source('../pages/Hub.tsx')
  assert.match(hub, /HUB_ENTRIES\.map/)
  assert.equal(hub.includes('openAuth'), false)
})

test('store surface has no price wording', () => {
  const page = source('../pages/Store.tsx')
  const text = [
    CHEATSHEET.title,
    CHEATSHEET.mark,
    CHEATSHEET.intro,
    ...CHEATSHEET.sections.flatMap((section) => [section.title, section.note, section.sql]),
    page,
  ].join('\n')
  const price =
    /\b(rp|harga|xendit|upgrade|lifetime|langganan|premium|checkout|berbayar|e-course|e-book)\b|rp\s*\d|\d{2,3}\.\d{3}/i
  assert.equal(price.test(text), false)
  assert.match(text, /SQL Fundamental Cheatsheet/)
  assert.match(text, /Gratis/)
  assert.match(page, /CHEATSHEET\.sections\.map/)
})

test('warmindo columns on the page come from the file', () => {
  const csv = source('../../public/warmindo-lite.csv')
  const newline = csv.indexOf('\n')
  assert.ok(newline > 0)
  const header = csv.slice(0, newline).replace(/\r$/, '').split(',')
  const table = parseWarmindoCsv(csv)
  assert.deepEqual(table.columns, header)
  assert.ok(table.rows.length > 0)
  for (const row of table.rows) assert.equal(row.length, header.length)

  for (const idea of warmindoIdeas) {
    const snakes = `${idea.title} ${idea.body}`.match(/[a-z]+(?:_[a-z]+)+/g) ?? []
    for (const token of snakes) assert.ok(header.includes(token), token)
  }

  const page = source('../pages/Warmindo.tsx')
  assert.match(page, /parseWarmindoCsv/)
  assert.match(page, /table\.columns\.map/)
  assert.match(page, /warmindoIdeas\.map/)
  assert.equal(page.includes('kasir'), false)
})

test('footer constant carries terms, privacy, identity, and support', () => {
  assert.equal(SITE_FOOTER.termsHref, '/tos')
  assert.equal(SITE_FOOTER.privacyHref, '/privasi')
  assert.match(SITE_FOOTER.identity, /^kulaSQL\b/)
  assert.match(SITE_FOOTER.identity, /belum dipublikasikan/)
  assert.equal(SITE_FOOTER.supportEmail, 'bantuan@kulasql.test')

  const footer = source('../components/SiteFooter.tsx')
  assert.match(footer, /SITE_FOOTER\.termsHref/)
  assert.match(footer, /SITE_FOOTER\.privacyHref/)
  assert.match(footer, /SITE_FOOTER\.identity/)
  assert.match(footer, /SITE_FOOTER\.supportEmail/)

  const terms = source('../pages/Terms.tsx')
  assert.match(terms, /SITE_FOOTER\.identity/)
  assert.match(terms, /SITE_FOOTER\.supportEmail/)
})
