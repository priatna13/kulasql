import '../env.ts'
import assert from 'node:assert/strict'
import { after, test } from 'node:test'
import { eq } from 'drizzle-orm'
import { app } from '../app.ts'
import { hashPassword } from '../auth/password.ts'
import { pool, db } from '../db/client.ts'
import { users } from '../db/schema.ts'

const googleEmail = `google-${Date.now()}@contoh.test`
const linkedEmail = `linked-${Date.now()}@contoh.test`

function call(path: string, init: RequestInit = {}) {
  const headers = new Headers(init.headers)
  if (init.body != null && !headers.has('content-type')) headers.set('content-type', 'application/json')
  return app.request(path, { ...init, headers })
}

after(async () => {
  await db.delete(users).where(eq(users.email, googleEmail))
  await db.delete(users).where(eq(users.email, linkedEmail))
  await pool.end()
})

test('google start without credentials says the door is off', async () => {
  const previousId = process.env.GOOGLE_CLIENT_ID
  const previousSecret = process.env.GOOGLE_CLIENT_SECRET
  delete process.env.GOOGLE_CLIENT_ID
  delete process.env.GOOGLE_CLIENT_SECRET
  try {
    const response = await call('/api/auth/google')
    assert.equal(response.status, 503)
    const text = await response.text()
    assert.match(text, /belum disetel/)
    assert.equal(text.toLowerCase().includes('secret'), false)
  } finally {
    if (previousId !== undefined) process.env.GOOGLE_CLIENT_ID = previousId
    if (previousSecret !== undefined) process.env.GOOGLE_CLIENT_SECRET = previousSecret
  }
})

test('a Google-only account is told to use Google, and a linked account still checks the password', async () => {
  await db.insert(users).values({ email: googleEmail, googleSub: `sub-${googleEmail}` })
  await db.insert(users).values({
    email: linkedEmail,
    googleSub: `sub-${linkedEmail}`,
    passwordHash: await hashPassword('rahasia-panjang'),
    birthDate: '2000-01-15',
    tosAcceptedAt: new Date(),
  })

  const googleOnly = await call('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email: googleEmail, password: 'apa-saja-123' }),
  })
  assert.equal(googleOnly.status, 401)
  const googleBody = (await googleOnly.json()) as { error?: string }
  assert.equal(googleBody.error, 'Akun ini masuk dengan Google.')

  const wrong = await call('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email: linkedEmail, password: 'bukan-sandinya' }),
  })
  assert.equal(wrong.status, 401)
  const wrongBody = (await wrong.json()) as { error?: string }
  assert.equal(wrongBody.error, 'Email atau kata sandi tidak cocok.')

  const missing = await call('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email: `tidak-ada-${Date.now()}@contoh.test`, password: 'apa-saja-123' }),
  })
  const missingBody = (await missing.json()) as { error?: string }
  assert.equal(missingBody.error, 'Email atau kata sandi tidak cocok.')
})
