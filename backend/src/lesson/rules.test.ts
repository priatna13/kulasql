import assert from 'node:assert/strict'
import { test } from 'node:test'
import { canOpenHint, visibleHints } from './rules.ts'

const hints = ['konsep satu', 'bentuk query', 'dekat solusi'] as const

test('hint 2 is refused until hint 1 is open and hint 3 until hint 2', () => {
  assert.equal(canOpenHint(0, 2), false)
  assert.equal(canOpenHint(0, 3), false)
  assert.equal(canOpenHint(1, 3), false)
  assert.equal(canOpenHint(0, 1), true)
  assert.equal(canOpenHint(1, 2), true)
  assert.equal(canOpenHint(2, 3), true)
  assert.equal(canOpenHint(2, 2), true)
  assert.equal(canOpenHint(1, 4), false)

  const closed = visibleHints(hints, 0)
  assert.equal(closed[1]?.body, undefined)
  assert.equal(closed[2]?.body, undefined)
  assert.equal(JSON.stringify(closed).includes('bentuk query'), false)
  assert.equal(JSON.stringify(closed).includes('dekat solusi'), false)

  const one = visibleHints(hints, 1)
  assert.equal(one[0]?.body, 'konsep satu')
  assert.equal(one[1]?.body, undefined)
  assert.equal(JSON.stringify(one).includes('bentuk query'), false)
  assert.equal(JSON.stringify(one).includes('dekat solusi'), false)

  const two = visibleHints(hints, 2)
  assert.equal(two[1]?.body, 'bentuk query')
  assert.equal(two[2]?.body, undefined)
  assert.equal(JSON.stringify(two).includes('dekat solusi'), false)
})
