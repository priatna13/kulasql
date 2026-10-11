import { Hono } from 'hono'
import { readSessionUser } from '../auth/session.ts'
import { grantChallenge, loadLeaderboard } from '../progress/store.ts'

export const progress = new Hono()

progress.get('/leaderboard', async (c) => {
  const user = await readSessionUser(c)
  const rows = await loadLeaderboard(user?.id ?? null)
  c.header('Cache-Control', 'no-store')
  return c.json({ ok: true, rows })
})

progress.post('/progress', async (c) => {
  const user = await readSessionUser(c)
  if (!user) {
    return c.json({ ok: false, error: 'Masuk dulu untuk menyimpan progres.' }, 401)
  }

  let body: unknown
  try {
    body = await c.req.json()
  } catch {
    return c.json({ ok: false, error: 'Permintaan tidak terbaca.' }, 400)
  }
  const slug =
    typeof body === 'object' && body !== null && 'slug' in body && typeof body.slug === 'string'
      ? body.slug.trim()
      : ''
  if (!/^[a-z0-9-]{1,80}$/.test(slug)) {
    return c.json({ ok: false, error: 'Tantangan itu belum ada.' }, 404)
  }

  const saved = await grantChallenge(user.id, slug)
  if ('error' in saved) {
    return c.json({ ok: false, error: 'Tantangan itu belum ada.' }, 404)
  }
  return c.json({ ok: true, awarded: saved.awarded, progress: saved.progress })
})
