import { createHash, randomBytes } from 'node:crypto'
import { eq } from 'drizzle-orm'
import type { Context } from 'hono'
import { deleteCookie, getCookie, setCookie } from 'hono/cookie'
import { db } from '../db/client.ts'
import { sessions, users } from '../db/schema.ts'

const COOKIE = 'kulasql_session'
const MAX_AGE = 60 * 60 * 24 * 30

export type SessionUser = {
  id: string
  email: string
}

function sessionIdForToken(token: string): string {
  return createHash('sha256').update(token).digest('hex')
}

function isLocalHost(host: string | undefined): boolean {
  const name = (host ?? '').split(':')[0]?.toLowerCase()
  return name === 'localhost' || name === '127.0.0.1'
}

export function sessionCookieBase(c: Context) {
  return {
    path: '/',
    httpOnly: true,
    sameSite: 'Lax' as const,
    secure: !isLocalHost(c.req.header('host')),
  }
}

export async function readSessionUser(c: Context): Promise<SessionUser | null> {
  const token = getCookie(c, COOKIE)
  if (!token) return null
  const id = sessionIdForToken(token)
  const rows = await db
    .select({
      expiresAt: sessions.expiresAt,
      userId: users.id,
      email: users.email,
    })
    .from(sessions)
    .innerJoin(users, eq(users.id, sessions.userId))
    .where(eq(sessions.id, id))
    .limit(1)
  const row = rows[0]
  if (!row) return null
  if (row.expiresAt.getTime() <= Date.now()) {
    await db.delete(sessions).where(eq(sessions.id, id))
    return null
  }
  return { id: row.userId, email: row.email }
}

export async function startSession(c: Context, userId: string): Promise<void> {
  const previous = getCookie(c, COOKIE)
  const token = randomBytes(32).toString('base64url')
  const nextId = sessionIdForToken(token)
  await db.transaction(async (tx) => {
    await tx.insert(sessions).values({
      id: nextId,
      userId,
      expiresAt: new Date(Date.now() + MAX_AGE * 1000),
    })
    if (!previous) return
    const previousId = sessionIdForToken(previous)
    if (previousId === nextId) return
    await tx.delete(sessions).where(eq(sessions.id, previousId))
  })
  setCookie(c, COOKIE, token, { ...sessionCookieBase(c), maxAge: MAX_AGE })
}

export async function endSession(c: Context): Promise<void> {
  const token = getCookie(c, COOKIE)
  if (token) {
    await db.delete(sessions).where(eq(sessions.id, sessionIdForToken(token)))
  }
  deleteCookie(c, COOKIE, sessionCookieBase(c))
}
