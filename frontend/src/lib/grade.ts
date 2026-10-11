import type { ResultTable } from './challenge.ts'

export type CellDiff = {
  row: number
  column: string
  expected: string
  actual: string
}

export type GradeFail = {
  ok: false
  message: string
  missingColumns?: string[]
  extraColumns?: string[]
  diffs?: CellDiff[]
  truncated?: boolean
}

export type GradeResult = { ok: true } | GradeFail

const DIFF_CAP = 5

export function grade(
  actual: ResultTable,
  expected: ResultTable,
  opts: { requireOrder: boolean },
): GradeResult {
  const missingColumns = unmatchedNames(expected.columns, actual.columns)
  const extraColumns = unmatchedNames(actual.columns, expected.columns)
  if (missingColumns.length > 0 || extraColumns.length > 0) {
    return {
      ok: false,
      message: columnMessage(missingColumns, extraColumns),
      missingColumns: missingColumns.length ? missingColumns : undefined,
      extraColumns: extraColumns.length ? extraColumns : undefined,
    }
  }

  const aligned = alignByColumnName(actual, expected.columns)

  if (aligned.length !== expected.rows.length) {
    return {
      ok: false,
      message: `Jumlah baris tidak cocok: diharapkan ${expected.rows.length}, hasilmu ${aligned.length}.`,
    }
  }

  const left = opts.requireOrder ? aligned : sortRows(aligned)
  const right = opts.requireOrder ? expected : { ...expected, rows: sortRows(expected.rows) }
  const { diffs, truncated } = orderedDiffs(left, right)
  if (diffs.length === 0) return { ok: true }

  return {
    ok: false,
    message: opts.requireOrder
      ? 'Urutan atau nilai baris belum cocok. Soal ini menilai urutan (ORDER BY).'
      : 'Isi baris belum cocok. Urutan baris tidak dinilai di soal ini.',
    diffs,
    truncated: truncated || undefined,
  }
}

function columnMessage(missing: string[], extra: string[]): string {
  if (missing.length && extra.length) {
    return 'Kolom tidak cocok: ada yang kurang dan ada yang berlebih.'
  }
  if (missing.length) return 'Kolom tidak cocok: hasilmu kurang kolom.'
  return 'Kolom tidak cocok: hasilmu punya kolom ekstra.'
}

function unmatchedNames(need: string[], have: string[]): string[] {
  const leftover = have.map((name) => name.toLowerCase())
  const missing: string[] = []
  for (const name of need) {
    const at = leftover.indexOf(name.toLowerCase())
    if (at === -1) missing.push(name)
    else leftover.splice(at, 1)
  }
  return missing
}

function alignByColumnName(actual: ResultTable, expectedColumns: string[]): string[][] {
  const indexes = expectedColumns.map((name) => {
    const key = name.toLowerCase()
    return actual.columns.findIndex((col) => col.toLowerCase() === key)
  })
  return actual.rows.map((row) =>
    indexes.map((index) => (index >= 0 ? (row[index] ?? 'NULL') : 'NULL')),
  )
}

function sortRows(rows: string[][]): string[][] {
  return rows
    .map((row) => row.slice())
    .sort((a, b) => {
      const ka = rowKey(a)
      const kb = rowKey(b)
      if (ka < kb) return -1
      if (ka > kb) return 1
      return 0
    })
}

function rowKey(row: string[]): string {
  return row.map((cell) => (looksNumeric(cell) ? String(Number(cell)) : cell)).join('\0')
}

function orderedDiffs(
  actualRows: string[][],
  expected: ResultTable,
): { diffs: CellDiff[]; truncated: boolean } {
  const diffs: CellDiff[] = []
  for (let i = 0; i < expected.rows.length; i++) {
    const expectedRow = expected.rows[i] ?? []
    const actualRow = actualRows[i] ?? []
    for (let c = 0; c < expected.columns.length; c++) {
      const want = expectedRow[c] ?? 'NULL'
      const got = actualRow[c] ?? 'NULL'
      if (cellsEqual(want, got)) continue
      if (diffs.length >= DIFF_CAP) return { diffs, truncated: true }
      diffs.push({
        row: i + 1,
        column: expected.columns[c] ?? '',
        expected: want,
        actual: got,
      })
    }
  }
  return { diffs, truncated: false }
}

function cellsEqual(a: string, b: string): boolean {
  if (a === b) return true
  if (a === 'NULL' || b === 'NULL') return false
  if (looksNumeric(a) && looksNumeric(b)) return Number(a) === Number(b)
  return false
}

function looksNumeric(value: string): boolean {
  return /^[+-]?(?:0|[1-9]\d*)(?:\.\d+)?$|^[+-]?\.\d+$/.test(value)
}
