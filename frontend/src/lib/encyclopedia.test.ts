import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { test } from 'node:test'
import { fileURLToPath } from 'node:url'
import { CHALLENGES } from './challenge.ts'
import {
  DIALECTS,
  equivalentsFor,
  functionBySlug,
  listFunctions,
  PG_CATEGORIES,
  PG_FUNCTIONS,
  pgCategory,
  POSTGRES_PATH,
  resolveDialect,
  type DialectId,
} from './encyclopedia.ts'

const NOT_FUNCTIONS = new Set(['IN', 'VALUES'])

function calledFunctions(sql: string): string[] {
  const found = new Set<string>()
  for (const match of sql.matchAll(/\b([A-Za-z_][A-Za-z0-9_]*)\s*\(/g)) {
    const name = match[1].toUpperCase()
    if (!NOT_FUNCTIONS.has(name)) found.add(name)
  }
  return [...found]
}

function mudahSql(): string[] {
  const src = dirname(fileURLToPath(import.meta.url))
  const blocks = [
    ...readFileSync(join(src, 'mudah.test.ts'), 'utf8').matchAll(
      /`\s*((?:SELECT|WITH)\b[\s\S]*?)`/g,
    ),
  ].map((match) => match[1])
  const content = readFileSync(join(src, '../../../backend/src/lesson/content.ts'), 'utf8')
  const mudah = CHALLENGES.filter((item) => item.level === 'Mudah')
  const solutions = mudah.map((item) => {
    const at = content.indexOf(`"${item.slug}":`)
    assert.ok(at >= 0, item.slug)
    const next = content.indexOf('\n  "', at + item.slug.length + 3)
    const slice = content.slice(at, next === -1 ? undefined : next)
    const sql = slice.match(/"sql": "((?:\\.|[^"\\])*)"/)
    assert.ok(sql, item.slug)
    return sql[1]
  })
  return [
    ...blocks,
    ...solutions,
    ...mudah.flatMap((item) => [item.prompt, item.starterSql]),
  ]
}

function selectList(syntax: string): string {
  const text = syntax.trim().replace(/;\s*$/, '')
  const start = /^SELECT\s+/i.exec(text)
  assert.ok(start, syntax)
  let depth = 0
  for (let i = start[0].length; i < text.length; i++) {
    const ch = text[i]
    if (ch === '(') depth++
    else if (ch === ')') depth--
    else if (depth === 0 && /^FROM\b/i.test(text.slice(i))) {
      return text.slice(start[0].length, i).trim()
    }
  }
  return text.slice(start[0].length).trim()
}

function selectAliases(syntax: string): string[] {
  const list = selectList(syntax)
  const parts: string[] = []
  let depth = 0
  let current = ''
  for (const ch of list) {
    if (ch === '(') depth++
    else if (ch === ')') depth--
    if (ch === ',' && depth === 0) {
      parts.push(current.trim())
      current = ''
    } else current += ch
  }
  if (current.trim()) parts.push(current.trim())
  return parts.map((part) => {
    let alias = ''
    for (const match of part.matchAll(/\bAS\s+([A-Za-z_][A-Za-z0-9_]*)/gi)) {
      let inner = 0
      for (const ch of part.slice(0, match.index ?? 0)) {
        if (ch === '(') inner++
        else if (ch === ')') inner--
      }
      if (inner === 0) alias = match[1]
    }
    assert.ok(alias, part)
    return alias
  })
}

test('postgresql encyclopedia covers mudah functions and keeps an unknown category', () => {
  assert.ok(PG_FUNCTIONS.length > 5)
  assert.ok(PG_CATEGORIES.length > 1)
  const slugs = new Set<string>()
  const names = new Set<string>()
  for (const item of PG_FUNCTIONS) {
    assert.equal(slugs.has(item.slug), false, item.slug)
    slugs.add(item.slug)
    assert.equal(item.slug, item.name.toLowerCase(), item.slug)
    assert.equal(names.has(item.name), false, item.name)
    names.add(item.name.toUpperCase())
    assert.equal(PG_CATEGORIES.includes(item.category), true, item.slug)
    assert.ok(item.description.trim(), item.slug)
    assert.ok(item.resultType.trim(), item.slug)
    assert.ok(item.syntax.trim(), item.slug)
    assert.ok(item.parameters.length > 0, item.slug)
    for (const param of item.parameters) {
      assert.ok(param.name.trim(), item.slug)
      assert.ok(param.type.trim(), item.slug)
      assert.ok(param.note.trim(), item.slug)
    }
    assert.ok(item.example.columns.length > 0, item.slug)
    assert.ok(item.example.rows.length > 0, item.slug)
    for (const row of item.example.rows) {
      assert.equal(row.length, item.example.columns.length, item.slug)
    }
    assert.deepEqual([...item.example.columns], selectAliases(item.syntax), item.slug)
    assert.ok(item.faq.length > 0, item.slug)
    for (const entry of item.faq) {
      assert.ok(entry.q.trim(), item.slug)
      assert.ok(entry.a.trim(), item.slug)
    }
  }

  const used = new Set(mudahSql().flatMap((sql) => calledFunctions(sql)))
  assert.ok(used.size > 0)
  for (const name of used) assert.ok(names.has(name), name)

  for (const category of PG_CATEGORIES) {
    const rows = listFunctions('postgresql', category)
    assert.ok(rows.length > 0, category)
    assert.ok(rows.length < PG_FUNCTIONS.length, category)
    assert.ok(rows.every((item) => item.category === category), category)
  }
  assert.deepEqual(
    listFunctions('postgresql', 'bukan-kategori').map((item) => item.slug),
    PG_FUNCTIONS.map((item) => item.slug),
  )
  assert.equal(pgCategory('bukan-kategori'), null)
  assert.equal(listFunctions('postgresql', null).length, PG_FUNCTIONS.length)

  const src = dirname(fileURLToPath(import.meta.url))
  const app = readFileSync(join(src, '../App.tsx'), 'utf8')
  const chrome = readFileSync(join(src, '../components/Chrome.tsx'), 'utf8')
  const landing = readFileSync(join(src, '../pages/Landing.tsx'), 'utf8')
  const page = readFileSync(join(src, '../pages/Encyclopedia.tsx'), 'utf8')
  assert.equal(POSTGRES_PATH, '/functions/sql/postgresql')
  assert.match(app, /path="\/functions\/sql\/:dialect"/)
  assert.match(app, /path="\/functions\/sql\/:dialect\/:fn"/)
  assert.doesNotMatch(app, /path=\{POSTGRES_PATH\}/)
  assert.match(app, /<Encyclopedia \/>/)
  assert.match(chrome, /to=\{POSTGRES_PATH\}/)
  assert.doesNotMatch(chrome, /#jalur">Ensiklopedia/)
  assert.match(landing, /to=\{POSTGRES_PATH\}/)
  assert.match(page, /window\.location\.search/)
  assert.match(page, /listFunctions/)
  assert.equal(PG_FUNCTIONS.length, 36)
  const power = functionBySlug('postgresql', 'power')
  assert.ok(power)
  assert.equal(
    power.faq.some((item) => item.a.includes('POWER(0, 0)') && item.a.includes('1')),
    true,
  )
})

test('four dialects keep the postgres page shape and ignore an unknown category', () => {
  for (const dialect of DIALECTS) {
    if (dialect.id === 'postgresql') continue
    const rows = listFunctions(dialect.id, null)
    assert.ok(rows.length > 15, dialect.id)
    const slugs = new Set<string>()
    for (const item of rows) {
      assert.equal(slugs.has(item.slug), false, item.slug)
      slugs.add(item.slug)
      assert.equal(item.slug, item.name.toLowerCase(), item.slug)
      assert.equal(PG_CATEGORIES.includes(item.category), true, item.slug)
      assert.ok(item.description.trim(), item.slug)
      assert.ok(item.resultType.trim(), item.slug)
      assert.ok(item.syntax.trim(), item.slug)
      assert.ok(item.parameters.length > 0, item.slug)
      assert.deepEqual([...item.example.columns], selectAliases(item.syntax), item.slug)
      for (const row of item.example.rows) {
        assert.equal(row.length, item.example.columns.length, item.slug)
      }
      assert.ok(item.faq.length > 0, item.slug)
    }
    for (const category of PG_CATEGORIES) {
      const filtered = listFunctions(dialect.id, category)
      assert.ok(filtered.length > 0, `${dialect.id} ${category}`)
      assert.ok(filtered.length < rows.length, `${dialect.id} ${category}`)
      assert.ok(filtered.every((item) => item.category === category))
    }
    assert.equal(listFunctions(dialect.id, 'bukan-kategori').length, rows.length)
    assert.equal(functionBySlug(dialect.id, 'tidak-ada'), undefined)
  }

  assert.equal(resolveDialect('postgresql')?.id, 'postgresql')
  assert.equal(resolveDialect(undefined), null)
  assert.equal(resolveDialect('oracle'), null)
  assert.equal(functionBySlug('mysql', 'tidak-ada'), undefined)
})

test('date and string equivalents point at a real function in another dialect', () => {
  const age = equivalentsFor('postgresql', 'age').map((item) => `${item.dialect}:${item.slug}`)
  assert.deepEqual(age.sort(), [
    'bigquery:date_diff',
    'duckdb:date_diff',
    'mysql:datediff',
    'snowflake:datediff',
  ])
  const back = equivalentsFor('mysql', 'datediff')
  assert.equal(back.some((item) => item.dialect === 'postgresql' && item.slug === 'age'), true)
  assert.equal(back.some((item) => item.path === '/functions/sql/postgresql/age'), true)

  const datediff = functionBySlug('mysql', 'datediff')
  const dateDiff = functionBySlug('bigquery', 'date_diff')
  const snowDiff = functionBySlug('snowflake', 'datediff')
  const duckDiff = functionBySlug('duckdb', 'date_diff')
  assert.ok(datediff && dateDiff && snowDiff && duckDiff)
  assert.match(datediff.syntax, /DATEDIFF\('2026-10-06', '2026-10-01'\)/)
  assert.match(dateDiff.syntax, /DATE_DIFF\(DATE '2026-10-06', DATE '2026-10-01', DAY\)/)
  assert.match(snowDiff.syntax, /DATEDIFF\(day, DATE '2026-10-01', DATE '2026-10-06'\)/)
  assert.match(duckDiff.syntax, /DATE_DIFF\('day', DATE '2026-10-01', DATE '2026-10-06'\)/)
  assert.deepEqual(datediff.example.rows, [['5']])
  assert.deepEqual(dateDiff.example.rows, [['5']])
  assert.deepEqual(snowDiff.example.rows, [['5']])
  assert.deepEqual(duckDiff.example.rows, [['5']])

  const position = equivalentsFor('postgresql', 'position')
  assert.equal(
    position.some((item) => item.dialect === 'bigquery' && item.slug === 'strpos'),
    true,
  )
  const strpos = functionBySlug('bigquery', 'strpos')
  const locate = functionBySlug('mysql', 'locate')
  assert.ok(strpos && locate)
  assert.match(strpos.syntax, /STRPOS\('TokoKulwon', 'Kul'\)/)
  assert.match(locate.syntax, /LOCATE\('Kul', 'TokoKulwon'\)/)
  assert.deepEqual(strpos.example.rows, [['5']])
  assert.deepEqual(locate.example.rows, [['5']])

  const quantiles = functionBySlug('bigquery', 'approx_quantiles')
  const boolor = functionBySlug('snowflake', 'boolor_agg')
  const embed = functionBySlug('snowflake', 'ai_embed')
  assert.ok(quantiles && boolor && embed)
  assert.match(quantiles.syntax, /APPROX_QUANTILES\(x, 2\)/)
  assert.deepEqual(quantiles.example.rows, [['[1, 5, 10]']])
  assert.match(boolor.syntax, /BOOLOR_AGG\(lunas\)/)
  assert.deepEqual(boolor.example.rows, [['True']])
  assert.match(embed.syntax, /AI_EMBED\('snowflake-arctic-embed-m-v1\.5', 'hello world'\)/)
  assert.match(embed.faq.map((item) => item.a).join('\n'), /SNOWFLAKE\.CORTEX\.EMBED_TEXT_768/)
  assert.deepEqual(embed.example.rows, [['768']])
  assert.equal(equivalentsFor('bigquery', 'approx_quantiles').length, 0)
  assert.equal(equivalentsFor('snowflake', 'boolor_agg').length, 0)

  const src = dirname(fileURLToPath(import.meta.url))
  const app = readFileSync(join(src, '../App.tsx'), 'utf8')
  const page = readFileSync(join(src, '../pages/Encyclopedia.tsx'), 'utf8')
  const challenge = readFileSync(join(src, '../pages/Challenge.tsx'), 'utf8')
  const editor = readFileSync(join(src, '../components/SqlEditor.tsx'), 'utf8')
  assert.match(app, /\/functions\/sql\/:dialect/)
  assert.match(page, /Fungsi itu belum ada/)
  assert.match(page, /Dialek itu belum ada/)
  assert.match(page, /document\.title = 'Ensiklopedia · kulaSQL'/)
  const bqCast = functionBySlug('bigquery', 'cast')
  const mysqlCast = functionBySlug('mysql', 'cast')
  assert.ok(bqCast && mysqlCast)
  assert.match(bqCast.faq.map((item) => item.a).join('\n'), /INTEGER adalah alias/)
  assert.doesNotMatch(bqCast.faq.map((item) => item.a).join('\n'), /bukan nama tipe/)
  assert.match(mysqlCast.description, /INTEGER juga diterima/)
  assert.doesNotMatch(mysqlCast.description, /bukan INTEGER/)
  for (const slug of ['round', 'ceil', 'floor'] as const) {
    assert.equal(functionBySlug('duckdb', slug)?.resultType, 'sama dengan tipe masukannya', slug)
  }
  assert.match(page, /equivalentsFor/)
  assert.doesNotMatch(challenge, /dialek/i)
  assert.doesNotMatch(editor, /dialect/i)

  const dialects: DialectId[] = ['mysql', 'bigquery', 'snowflake', 'duckdb']
  for (const id of dialects) {
    assert.equal(listFunctions(id, null).length > 0, true)
    assert.equal(resolveDialect(id)?.path, `/functions/sql/${id}`)
  }
})
