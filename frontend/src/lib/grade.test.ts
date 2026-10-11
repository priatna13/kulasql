import assert from 'node:assert/strict'
import { test } from 'node:test'
import { FIRST_CHALLENGE, type ResultTable } from './challenge.ts'
import { grade } from './grade.ts'

const fixture = FIRST_CHALLENGE.expected
if (!fixture) throw new Error('Soal pertama kehilangan kunci jawaban.')
const expected: ResultTable = fixture
const order = { requireOrder: true }
const bag = { requireOrder: false }

test('identical result set passes', () => {
  const result = grade(expected, expected, order)
  assert.equal(result.ok, true)
})

test('reordered columns still pass when values line up', () => {
  const actual: ResultTable = {
    columns: ['nama', 'id', 'kota', 'total_belanja'],
    rows: expected.rows.map((row) => [row[1] ?? '', row[0] ?? '', row[2] ?? '', row[3] ?? '']),
  }
  assert.equal(grade(actual, expected, order).ok, true)
})

test('column names are case-insensitive', () => {
  const actual: ResultTable = {
    columns: ['ID', 'Nama', 'KOTA', 'Total_Belanja'],
    rows: expected.rows,
  }
  assert.equal(grade(actual, expected, order).ok, true)
})

test('numeric strings 185000 and 185000.0 are equal', () => {
  const actual: ResultTable = {
    columns: expected.columns,
    rows: expected.rows.map((row, i) =>
      i === 0 ? [row[0] ?? '', row[1] ?? '', row[2] ?? '', '185000.0'] : row,
    ),
  }
  assert.equal(grade(actual, expected, order).ok, true)
})

test('leading-zero numeric strings are not coerced', () => {
  const want: ResultTable = { columns: ['kode'], rows: [['010']] }
  const got: ResultTable = { columns: ['kode'], rows: [['10']] }
  const result = grade(got, want, order)
  assert.equal(result.ok, false)
  if (result.ok) return
  assert.equal(result.diffs?.[0]?.expected, '010')
  assert.equal(result.diffs?.[0]?.actual, '10')
})

test('missing columns fail with the missing names', () => {
  const actual: ResultTable = {
    columns: ['nama'],
    rows: expected.rows.map((row) => [row[1] ?? '']),
  }
  const result = grade(actual, expected, order)
  assert.equal(result.ok, false)
  if (result.ok) return
  assert.deepEqual(result.missingColumns, ['id', 'kota', 'total_belanja'])
  assert.match(result.message, /kurang/)
})

test('extra columns fail with the extra names', () => {
  const actual: ResultTable = {
    columns: [...expected.columns, 'bonus'],
    rows: expected.rows.map((row) => [...row, 'x']),
  }
  const result = grade(actual, expected, order)
  assert.equal(result.ok, false)
  if (result.ok) return
  assert.deepEqual(result.extraColumns, ['bonus'])
  assert.match(result.message, /ekstra/)
})

test('row count mismatch is explicit', () => {
  const actual: ResultTable = {
    columns: expected.columns,
    rows: expected.rows.slice(0, 2),
  }
  const result = grade(actual, expected, order)
  assert.equal(result.ok, false)
  if (result.ok) return
  assert.match(result.message, /6/)
  assert.match(result.message, /2/)
})

test('requireOrder fails when row sequence differs', () => {
  const actual: ResultTable = {
    columns: expected.columns,
    rows: [...expected.rows].reverse(),
  }
  const result = grade(actual, expected, order)
  assert.equal(result.ok, false)
  if (result.ok) return
  assert.ok(result.diffs && result.diffs.length > 0)
  assert.match(result.message, /ORDER BY/)
  const first = result.diffs[0]
  assert.ok(first)
  assert.notEqual(first.expected, first.actual)
  assert.equal(result.truncated, true)
})

test('without requireOrder, row permutation still passes', () => {
  const actual: ResultTable = {
    columns: expected.columns,
    rows: [...expected.rows].reverse(),
  }
  assert.equal(grade(actual, expected, bag).ok, true)
})

test('wrong cell value fails with expected vs actual', () => {
  const actual: ResultTable = {
    columns: expected.columns,
    rows: expected.rows.map((row, i) =>
      i === 1 ? [row[0] ?? '', 'Budi Salah', row[2] ?? '', row[3] ?? ''] : row,
    ),
  }
  const result = grade(actual, expected, order)
  assert.equal(result.ok, false)
  if (result.ok) return
  const diff = result.diffs?.find((item) => item.column === 'nama')
  assert.ok(diff)
  assert.equal(diff.row, 2)
  assert.equal(diff.expected, 'Budi Santoso')
  assert.equal(diff.actual, 'Budi Salah')
  assert.equal('sql' in result, false)
  assert.equal('solution' in result, false)
  assert.equal('why' in result, false)
})

test('NULL matches NULL and differs from a value', () => {
  const withNull: ResultTable = {
    columns: ['id', 'nama'],
    rows: [
      ['1', 'NULL'],
      ['2', 'Ada'],
    ],
  }
  assert.equal(grade(withNull, withNull, order).ok, true)

  const actual: ResultTable = {
    columns: ['id', 'nama'],
    rows: [
      ['1', 'Ada'],
      ['2', 'Ada'],
    ],
  }
  const result = grade(actual, withNull, order)
  assert.equal(result.ok, false)
  if (result.ok) return
  const diff = result.diffs?.[0]
  assert.ok(diff)
  assert.equal(diff.expected, 'NULL')
  assert.equal(diff.actual, 'Ada')
})

test('does not compare SQL text', () => {
  const actual = expected
  const result = grade(actual, expected, order)
  assert.equal(result.ok, true)
  assert.equal('sql' in result, false)
})
