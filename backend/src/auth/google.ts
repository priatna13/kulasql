import { createPublicKey, createVerify, type JsonWebKey } from 'node:crypto'

export const GOOGLE_AUTH = 'https://accounts.google.com/o/oauth2/v2/auth'
export const GOOGLE_TOKEN = 'https://oauth2.googleapis.com/token'
export const GOOGLE_JWKS = 'https://www.googleapis.com/oauth2/v3/certs'

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export type GoogleIdentity = {
  sub: string
  email: string
}

type TokenHeader = {
  alg?: string
  kid?: string
}

type TokenPayload = {
  iss?: string
  aud?: string | string[]
  exp?: number
  email?: string
  email_verified?: boolean | string
  sub?: string
}

export function safeNext(value: unknown): string {
  if (typeof value !== 'string' || value.length > 512) return '/'
  if (!value.startsWith('/') || value.startsWith('//') || value.includes('\\') || value.includes('://')) {
    return '/'
  }
  if (value.startsWith('/api')) return '/'
  return value
}

export function googleRedirectUri(origin: string): string {
  return `${origin.replace(/\/$/, '')}/api/auth/google/callback`
}

export function googleAuthUrl(input: {
  clientId: string
  redirectUri: string
  state: string
}): string {
  const url = new URL(GOOGLE_AUTH)
  url.searchParams.set('client_id', input.clientId)
  url.searchParams.set('redirect_uri', input.redirectUri)
  url.searchParams.set('response_type', 'code')
  url.searchParams.set('scope', 'openid email profile')
  url.searchParams.set('state', input.state)
  url.searchParams.set('prompt', 'select_account')
  return url.toString()
}

export function requestOrigin(
  forwardedProto: string | undefined,
  forwardedHost: string | undefined,
  host: string | undefined,
  configured?: string,
): string {
  const fromEnv = configured?.trim()
  if (fromEnv && /^https?:\/\/[^/]+$/i.test(fromEnv)) return fromEnv.replace(/\/$/, '')
  const proto = forwardedProto?.split(',')[0]?.trim() || 'http'
  const name = forwardedHost?.split(',')[0]?.trim() || host || 'localhost'
  return `${proto}://${name}`
}

function readJsonPart(part: string): unknown {
  return JSON.parse(Buffer.from(part, 'base64url').toString('utf8'))
}

export async function identityFromIdToken(
  idToken: string,
  clientId: string,
  getKey: (kid: string) => Promise<JsonWebKey | undefined>,
): Promise<{ ok: true; identity: GoogleIdentity } | { ok: false; reason: 'unverified' | 'invalid' }> {
  const parts = idToken.split('.')
  if (parts.length !== 3 || !parts[0] || !parts[1] || !parts[2]) {
    return { ok: false, reason: 'invalid' }
  }
  let header: TokenHeader
  let payload: TokenPayload
  try {
    const rawHeader = readJsonPart(parts[0])
    const rawPayload = readJsonPart(parts[1])
    if (!rawHeader || typeof rawHeader !== 'object' || !rawPayload || typeof rawPayload !== 'object') {
      return { ok: false, reason: 'invalid' }
    }
    header = rawHeader as TokenHeader
    payload = rawPayload as TokenPayload
  } catch {
    return { ok: false, reason: 'invalid' }
  }
  if (header.alg !== 'RS256' || !header.kid) return { ok: false, reason: 'invalid' }
  const jwk = await getKey(header.kid)
  if (!jwk) return { ok: false, reason: 'invalid' }
  let verified = false
  try {
    const key = createPublicKey({ key: jwk, format: 'jwk' })
    const verifier = createVerify('RSA-SHA256')
    verifier.update(`${parts[0]}.${parts[1]}`)
    verifier.end()
    verified = verifier.verify(key, Buffer.from(parts[2], 'base64url'))
  } catch {
    return { ok: false, reason: 'invalid' }
  }
  if (!verified) return { ok: false, reason: 'invalid' }
  const audience = payload.aud
  const audienceOk =
    audience === clientId || (Array.isArray(audience) && audience.includes(clientId))
  const issuerOk =
    payload.iss === 'https://accounts.google.com' || payload.iss === 'accounts.google.com'
  if (
    !audienceOk ||
    !issuerOk ||
    typeof payload.exp !== 'number' ||
    payload.exp * 1000 <= Date.now()
  ) {
    return { ok: false, reason: 'invalid' }
  }
  if (payload.email_verified !== true && payload.email_verified !== 'true') {
    return { ok: false, reason: 'unverified' }
  }
  if (typeof payload.sub !== 'string' || payload.sub.length < 1 || typeof payload.email !== 'string') {
    return { ok: false, reason: 'invalid' }
  }
  const email = payload.email.trim().toLowerCase()
  if (!EMAIL.test(email) || email.length > 254) return { ok: false, reason: 'invalid' }
  return { ok: true, identity: { sub: payload.sub, email } }
}

let jwksCache: { at: number; keys: Map<string, JsonWebKey> } | null = null

export async function googleSigningKey(
  kid: string,
  fetchImpl: typeof fetch = fetch,
): Promise<JsonWebKey | undefined> {
  if (!jwksCache || Date.now() - jwksCache.at > 60 * 60 * 1000) {
    const response = await fetchImpl(GOOGLE_JWKS)
    if (!response.ok) return jwksCache?.keys.get(kid)
    const body = (await response.json()) as { keys?: Array<JsonWebKey & { kid?: string }> }
    const keys = new Map<string, JsonWebKey>()
    for (const key of body.keys ?? []) {
      if (key.kid) keys.set(key.kid, key)
    }
    jwksCache = { at: Date.now(), keys }
  }
  return jwksCache.keys.get(kid)
}

export function resetGoogleKeyCache(): void {
  jwksCache = null
}

export async function exchangeGoogleCode(input: {
  code: string
  clientId: string
  clientSecret: string
  redirectUri: string
  fetchImpl?: typeof fetch
}): Promise<string | null> {
  const fetchImpl = input.fetchImpl ?? fetch
  const body = new URLSearchParams({
    code: input.code,
    client_id: input.clientId,
    client_secret: input.clientSecret,
    redirect_uri: input.redirectUri,
    grant_type: 'authorization_code',
  })
  const response = await fetchImpl(GOOGLE_TOKEN, {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body,
  })
  if (!response.ok) return null
  const payload = (await response.json()) as { id_token?: string }
  return typeof payload.id_token === 'string' && payload.id_token.includes('.')
    ? payload.id_token
    : null
}
