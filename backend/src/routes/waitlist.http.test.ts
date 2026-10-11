import '../env.ts'
import assert from 'node:assert/strict'
import { after, test } from 'node:test'
import { eq } from 'drizzle-orm'
import { app } from '../app.ts'
import { pool, db } from '../db/client.ts'
import { kelasWaitlist } from '../db/schema.ts'

const email = `kelas15-${Date.now()}@contoh.test`
const bad = `bukan-email-${Date.now()}`

function call(path: string, init: RequestInit = {}) {
  const headers = new Headers(init.headers)
  if (init.body != null && !headers.has('content-type')) headers.set('content-type', 'application/json')
  return app.request(path, { ...init, headers })
}

after(async () => {
  await db.delete(kelasWaitlist).where(eq(kelasWaitlist.email, email))
  await pool.end()
})

test('kelas data waitlist stores one email and hides it from errors', async () => {
  const missing = await call('/api/kelas-data', { method: 'POST', body: '{' })
  assert.equal(missing.status, 400)
  const missingBody = (await missing.json()) as { ok: boolean }
  assert.equal(missingBody.ok, false)

  const denied = await call('/api/kelas-data', {
    method: 'POST',
    body: JSON.stringify({ email: bad }),
  })
  assert.equal(denied.status, 400)
  const deniedText = await denied.text()
  assert.equal(deniedText.includes(bad), false)
  assert.equal(JSON.parse(deniedText).ok, false)

  const saved = await call('/api/kelas-data', {
    method: 'POST',
    body: JSON.stringify({ email: `  ${email.toUpperCase()}  ` }),
  })
  assert.equal(saved.status, 200)
  assert.deepEqual(await saved.json(), { ok: true })

  const again = await call('/api/kelas-data', {
    method: 'POST',
    body: JSON.stringify({ email }),
  })
  assert.equal(again.status, 200)
  assert.deepEqual(await again.json(), { ok: true })

  const rows = await db.select().from(kelasWaitlist).where(eq(kelasWaitlist.email, email))
  assert.equal(rows.length, 1)
})
