import assert from 'node:assert/strict'
import { generateKeyPairSync, sign, type JsonWebKey } from 'node:crypto'
import { test } from 'node:test'
import {
  googleAuthUrl,
  googleRedirectUri,
  identityFromIdToken,
  requestOrigin,
  safeNext,
} from './google.ts'

const { publicKey, privateKey } = generateKeyPairSync('rsa', { modulusLength: 2048 })
const jwk = publicKey.export({ format: 'jwk' }) as JsonWebKey
jwk.kid = 'test-key'
jwk.alg = 'RS256'
jwk.use = 'sig'

const clientId = 'kulasql-client'

function idToken(payload: Record<string, unknown>, kid = 'test-key'): string {
  const header = Buffer.from(JSON.stringify({ alg: 'RS256', kid })).toString('base64url')
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url')
  const signature = sign('RSA-SHA256', Buffer.from(`${header}.${body}`), privateKey).toString('base64url')
  return `${header}.${body}.${signature}`
}

function claims(overrides: Record<string, unknown> = {}) {
  return {
    iss: 'https://accounts.google.com',
    aud: clientId,
    exp: Math.floor(Date.now() / 1000) + 600,
    sub: 'google-sub-1',
    email: 'Gazel@Contoh.test',
    email_verified: true,
    ...overrides,
  }
}

test('verified Google identity is accepted and the email is normalized', async () => {
  const checked = await identityFromIdToken(idToken(claims()), clientId, async () => jwk)
  assert.equal(checked.ok, true)
  if (!checked.ok) return
  assert.equal(checked.identity.email, 'gazel@contoh.test')
  assert.equal(checked.identity.sub, 'google-sub-1')
})

test('an unverified Google email is rejected before an account can be created', async () => {
  const checked = await identityFromIdToken(
    idToken(claims({ email_verified: false })),
    clientId,
    async () => jwk,
  )
  assert.deepEqual(checked, { ok: false, reason: 'unverified' })
})

test('a token for another client or a bad signature is invalid', async () => {
  const other = await identityFromIdToken(
    idToken(claims({ aud: 'bukan-kulasql' })),
    clientId,
    async () => jwk,
  )
  assert.deepEqual(other, { ok: false, reason: 'invalid' })

  const forged = await identityFromIdToken(`${idToken(claims())}x`, clientId, async () => jwk)
  assert.equal(forged.ok, false)
})

test('the Google redirect stays on the public origin and next paths stay local', () => {
  assert.equal(
    googleRedirectUri('https://kulasql.onrender.com/'),
    'https://kulasql.onrender.com/api/auth/google/callback',
  )
  const url = new URL(
    googleAuthUrl({
      clientId,
      redirectUri: googleRedirectUri('http://localhost:5173'),
      state: 'abc',
    }),
  )
  assert.equal(url.searchParams.get('scope'), 'openid email profile')
  assert.equal(url.searchParams.get('redirect_uri'), 'http://localhost:5173/api/auth/google/callback')
  assert.equal(safeNext('https://evil.test'), '/')
  assert.equal(safeNext('//evil.test'), '/')
  assert.equal(safeNext('/kulasql/challenges'), '/kulasql/challenges')
  assert.equal(
    requestOrigin('https', 'kulasql.onrender.com', 'localhost:3010', 'http://localhost:5173'),
    'http://localhost:5173',
  )
})
