import assert from 'node:assert/strict'
import { test } from 'node:test'
import { isAtLeast13, parseIsoDate } from './age.ts'

const today = '2026-09-22'

test('13th birthday today is allowed', () => {
  assert.equal(isAtLeast13('2013-09-22', today), true)
})

test('the day before the 13th birthday is rejected', () => {
  assert.equal(isAtLeast13('2013-09-23', today), false)
})

test('an impossible calendar date is not a birth date', () => {
  assert.equal(parseIsoDate('2013-02-31'), null)
  assert.equal(isAtLeast13('2013-02-31', today), false)
})
