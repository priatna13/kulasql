import { randomBytes, timingSafeEqual } from 'node:crypto'
import { eq } from 'drizzle-orm'
import { Hono, type Context } from 'hono'
import { deleteCookie, getCookie, setCookie } from 'hono/cookie'
import { isAtLeast13, parseIsoDate } from '../auth/age.ts'
import {
  exchangeGoogleCode,
  googleAuthUrl,
  googleRedirectUri,
  googleSigningKey,
  identityFromIdToken,
  requestOrigin,
  safeNext,
} from '../auth/google.ts'
import { hashPassword, verifyPassword } from '../auth/password.ts'
import { endSession, readSessionUser, sessionCookieBase, startSession } from '../auth/session.ts'
import { db } from '../db/client.ts'
import { users } from '../db/schema.ts'
import { loadProgress } from '../progress/store.ts'

const dummyHash = hashPassword('kulasql-dummy')

export const auth = new Hono()

const MIN_PASSWORD = 8
const MAX_PASSWORD = 128

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

async function readJson(c: { req: { json: () => Promise<unknown> } }): Promise<unknown> {
  try {
    return await c.req.json()
  } catch {
    return undefined
  }
}

export function normalizeEmail(value: unknown): string | null {
  if (typeof value !== 'string') return null
  const email = value.trim().toLowerCase()
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return null
  return email
}

function isUniqueViolation(error: unknown): boolean {
  let current: unknown = error
  for (let depth = 0; depth < 5 && current && typeof current === 'object'; depth += 1) {
    if ('code' in current && current.code === '23505') return true
    current = 'cause' in current ? current.cause : undefined
  }
  return false
}

auth.post('/auth/register', async (c) => {
  const body = await readJson(c)
  if (!isRecord(body)) return c.json({ ok: false, error: 'Permintaan tidak terbaca.' }, 400)

  const email = normalizeEmail(body.email)
  if (!email) return c.json({ ok: false, error: 'Email tidak valid.' }, 400)

  if (typeof body.password !== 'string' || body.password.length > MAX_PASSWORD) {
    return c.json({ ok: false, error: 'Kata sandi tidak valid.' }, 400)
  }
  if (body.password.length < MIN_PASSWORD) {
    return c.json({ ok: false, error: 'Kata sandi minimal 8 karakter.' }, 400)
  }

  if (typeof body.birthDate !== 'string' || !parseIsoDate(body.birthDate)) {
    return c.json({ ok: false, error: 'Tanggal lahir tidak valid.' }, 400)
  }
  if (!isAtLeast13(body.birthDate)) {
    return c.json({ ok: false, error: 'Usia minimal 13 tahun.' }, 400)
  }
  if (body.tosAccepted !== true) {
    return c.json({ ok: false, error: 'Setujui syarat akun sebelum daftar.' }, 400)
  }

  const passwordHash = await hashPassword(body.password)
  try {
    const [created] = await db
      .insert(users)
      .values({
        email,
        passwordHash,
        birthDate: body.birthDate,
        tosAcceptedAt: new Date(),
      })
      .returning({ id: users.id, email: users.email })
    if (!created) throw new Error('akun tidak tersimpan')
    await startSession(c, created.id)
    const progress = await loadProgress(created.id)
    return c.json({ ok: true, user: created, progress })
  } catch (error) {
    if (isUniqueViolation(error)) {
      return c.json({ ok: false, error: 'Email ini sudah dipakai.' }, 409)
    }
    throw error
  }
})

auth.post('/auth/login', async (c) => {
  const body = await readJson(c)
  if (!isRecord(body)) return c.json({ ok: false, error: 'Permintaan tidak terbaca.' }, 400)

  const email = normalizeEmail(body.email)
  const password = typeof body.password === 'string' ? body.password : ''
  if (!email || password.length < 1 || password.length > MAX_PASSWORD) {
    return c.json({ ok: false, error: 'Email atau kata sandi tidak cocok.' }, 401)
  }

  const [user] = await db
    .select({
      id: users.id,
      email: users.email,
      passwordHash: users.passwordHash,
      googleSub: users.googleSub,
    })
    .from(users)
    .where(eq(users.email, email))
    .limit(1)

  if (user && !user.passwordHash && user.googleSub) {
    return c.json({ ok: false, error: 'Akun ini masuk dengan Google.' }, 401)
  }

  const hash = user?.passwordHash ?? (await dummyHash)
  const passwordOk = await verifyPassword(password, hash)
  if (!user || !passwordOk) {
    return c.json({ ok: false, error: 'Email atau kata sandi tidak cocok.' }, 401)
  }

  await startSession(c, user.id)
  const progress = await loadProgress(user.id)
  return c.json({
    ok: true,
    user: { id: user.id, email: user.email },
    progress,
  })
})

auth.post('/auth/logout', async (c) => {
  await endSession(c)
  return c.json({ ok: true })
})

auth.get('/auth/me', async (c) => {
  const user = await readSessionUser(c)
  if (!user) return c.json({ ok: false, error: 'Belum masuk.' }, 401)
  const progress = await loadProgress(user.id)
  return c.json({ ok: true, user, progress })
})

const OAUTH_COOKIE = 'kulasql_oauth'
const OAUTH_NEXT = 'kulasql_oauth_next'

function googleNotice(c: Context, message: string, status: 400 | 401 | 409 | 503) {
  const text = message.replace(/[<>&]/g, (char) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' })[char] ?? char)
  return c.html(
    `<!doctype html><html lang="id"><head><meta charset="utf-8"><title>Masuk · kulaSQL</title></head><body style="margin:0;background:#161412;color:#f3efe6;font:18px/1.45 system-ui,sans-serif"><main style="max-width:28rem;margin:4rem auto;padding:0 1.25rem"><p>${text}</p><p><a style="color:#c9a36a" href="/">Kembali</a></p></main></body></html>`,
    status,
  )
}

function sameState(left: string, right: string): boolean {
  const a = Buffer.from(left)
  const b = Buffer.from(right)
  if (a.length !== b.length || a.length === 0) return false
  return timingSafeEqual(a, b)
}

async function openGoogleSession(
  c: Context,
  identity: { sub: string; email: string },
  next: string,
) {
  const [bySub] = await db
    .select({ id: users.id, email: users.email })
    .from(users)
    .where(eq(users.googleSub, identity.sub))
    .limit(1)
  if (bySub) {
    if (bySub.email !== identity.email) {
      const [taken] = await db
        .select({ id: users.id })
        .from(users)
        .where(eq(users.email, identity.email))
        .limit(1)
      if (!taken) {
        await db.update(users).set({ email: identity.email }).where(eq(users.id, bySub.id))
      }
    }
    await startSession(c, bySub.id)
    return c.redirect(next)
  }

  const [byEmail] = await db
    .select({ id: users.id, googleSub: users.googleSub })
    .from(users)
    .where(eq(users.email, identity.email))
    .limit(1)
  if (byEmail) {
    if (byEmail.googleSub && byEmail.googleSub !== identity.sub) {
      return googleNotice(c, 'Email ini sudah terhubung ke akun Google lain.', 409)
    }
    if (!byEmail.googleSub) {
      await db.update(users).set({ googleSub: identity.sub }).where(eq(users.id, byEmail.id))
    }
    await startSession(c, byEmail.id)
    return c.redirect(next)
  }

  try {
    const [created] = await db
      .insert(users)
      .values({ email: identity.email, googleSub: identity.sub })
      .returning({ id: users.id })
    if (!created) throw new Error('akun tidak tersimpan')
    await startSession(c, created.id)
    return c.redirect(next)
  } catch (error) {
    if (!isUniqueViolation(error)) throw error
    const [existing] = await db
      .select({ id: users.id, googleSub: users.googleSub })
      .from(users)
      .where(eq(users.email, identity.email))
      .limit(1)
    if (!existing || (existing.googleSub && existing.googleSub !== identity.sub)) {
      return googleNotice(c, 'Email ini sudah terhubung ke akun Google lain.', 409)
    }
    if (!existing.googleSub) {
      await db.update(users).set({ googleSub: identity.sub }).where(eq(users.id, existing.id))
    }
    await startSession(c, existing.id)
    return c.redirect(next)
  }
}

auth.get('/auth/google', (c) => {
  const clientId = process.env.GOOGLE_CLIENT_ID?.trim()
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET?.trim()
  if (!clientId || !clientSecret) return googleNotice(c, 'Masuk Google belum disetel.', 503)
  const state = randomBytes(32).toString('base64url')
  const origin = requestOrigin(
    c.req.header('x-forwarded-proto'),
    c.req.header('x-forwarded-host'),
    c.req.header('host'),
    process.env.PUBLIC_ORIGIN,
  )
  const next = safeNext(c.req.query('next'))
  setCookie(c, OAUTH_COOKIE, state, { ...sessionCookieBase(c), maxAge: 600 })
  setCookie(c, OAUTH_NEXT, next, { ...sessionCookieBase(c), maxAge: 600 })
  return c.redirect(
    googleAuthUrl({
      clientId,
      redirectUri: googleRedirectUri(origin),
      state,
    }),
  )
})

auth.get('/auth/google/callback', async (c) => {
  const clientId = process.env.GOOGLE_CLIENT_ID?.trim()
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET?.trim()
  const expected = getCookie(c, OAUTH_COOKIE)
  const next = safeNext(getCookie(c, OAUTH_NEXT))
  deleteCookie(c, OAUTH_COOKIE, sessionCookieBase(c))
  deleteCookie(c, OAUTH_NEXT, sessionCookieBase(c))
  if (!clientId || !clientSecret) return googleNotice(c, 'Masuk Google belum disetel.', 503)
  const state = c.req.query('state') ?? ''
  const code = c.req.query('code') ?? ''
  if (!expected || !sameState(expected, state) || !code) {
    return googleNotice(c, 'Masuk Google dibatalkan. Coba lagi dari tombolnya.', 400)
  }
  const origin = requestOrigin(
    c.req.header('x-forwarded-proto'),
    c.req.header('x-forwarded-host'),
    c.req.header('host'),
    process.env.PUBLIC_ORIGIN,
  )
  const idToken = await exchangeGoogleCode({
    code,
    clientId,
    clientSecret,
    redirectUri: googleRedirectUri(origin),
  })
  if (!idToken) return googleNotice(c, 'Google tidak mengembalikan identitas. Coba lagi.', 401)
  const checked = await identityFromIdToken(idToken, clientId, (kid) => googleSigningKey(kid))
  if (!checked.ok && checked.reason === 'unverified') {
    return googleNotice(c, 'Email Google belum diverifikasi. Akun tidak dibuat.', 401)
  }
  if (!checked.ok) return googleNotice(c, 'Identitas Google tidak sah.', 401)
  return openGoogleSession(c, checked.identity, next)
})
