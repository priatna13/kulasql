import { Hono } from 'hono'
import { db } from '../db/client.ts'
import { kelasWaitlist } from '../db/schema.ts'
import { normalizeEmail } from './auth.ts'

export const waitlist = new Hono()

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

waitlist.post('/kelas-data', async (c) => {
  let body: unknown
  try {
    body = await c.req.json()
  } catch {
    body = undefined
  }
  if (!isRecord(body)) return c.json({ ok: false, error: 'Permintaan tidak terbaca.' }, 400)

  const email = normalizeEmail(body.email)
  if (!email) return c.json({ ok: false, error: 'Email tidak valid.' }, 400)

  try {
    await db.insert(kelasWaitlist).values({ email }).onConflictDoNothing()
    return c.json({ ok: true })
  } catch {
    console.error('waitlist insert')
    return c.json({ ok: false, error: 'Daftar tunggu belum tersimpan. Coba lagi.' }, 500)
  }
})
