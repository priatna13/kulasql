import type { Context } from 'hono'
import { Hono } from 'hono'
import { readSessionUser } from '../auth/session.ts'
import { lessonFor } from '../lesson/content.ts'
import { visibleHints } from '../lesson/rules.ts'
import { openHintLevel, readWorkspace, writeDraft } from '../lesson/store.ts'

const SIGN_IN = 'Masuk dulu untuk membuka hint, solusi, atau draf.'
const MAX_DRAFT = 20_000

export const lesson = new Hono()

function send(c: Context, body: unknown, status: 200 | 400 | 401 | 404 | 409 = 200) {
  c.header('cache-control', 'private, no-store')
  return c.json(body, status)
}

function cleanSlug(value: string): string | null {
  const slug = value.trim()
  if (!/^[a-z0-9-]{1,80}$/.test(slug)) return null
  return slug
}

async function readJson(c: Context): Promise<unknown> {
  try {
    return await c.req.json()
  } catch {
    return undefined
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

async function userId(c: Context): Promise<string | null> {
  const user = await readSessionUser(c)
  return user?.id ?? null
}

lesson.get('/lesson/:slug', async (c) => {
  const id = await userId(c)
  if (!id) return send(c, { ok: false, error: SIGN_IN }, 401)
  const slug = cleanSlug(c.req.param('slug'))
  if (!slug) return send(c, { ok: false, error: 'Tantangan itu belum ada.' }, 404)
  const view = await readWorkspace(id, slug)
  if ('error' in view) return send(c, { ok: false, error: 'Tantangan itu belum ada.' }, 404)
  return send(c, { ok: true, ...view })
})

lesson.post('/lesson/:slug/hint', async (c) => {
  const id = await userId(c)
  if (!id) return send(c, { ok: false, error: SIGN_IN }, 401)
  const slug = cleanSlug(c.req.param('slug'))
  if (!slug) return send(c, { ok: false, error: 'Tantangan itu belum ada.' }, 404)
  const body = await readJson(c)
  const level = isRecord(body) ? body.level : undefined
  if (level !== 1 && level !== 2 && level !== 3) {
    return send(c, { ok: false, error: 'Hint itu tidak ada.' }, 400)
  }
  const saved = await openHintLevel(id, slug, level)
  if ('error' in saved) {
    if (saved.error === 'unknown') return send(c, { ok: false, error: 'Tantangan itu belum ada.' }, 404)
    return send(c, { ok: false, error: 'Buka hint sebelumnya dulu.' }, 409)
  }
  const known = lessonFor(slug)
  if (!known) return send(c, { ok: false, error: 'Tantangan itu belum ada.' }, 404)
  return send(c, { ok: true, opened: saved.opened, hints: visibleHints(known.hints, saved.opened) })
})

lesson.post('/lesson/:slug/solution', async (c) => {
  const id = await userId(c)
  if (!id) return send(c, { ok: false, error: SIGN_IN }, 401)
  const slug = cleanSlug(c.req.param('slug'))
  if (!slug) return send(c, { ok: false, error: 'Tantangan itu belum ada.' }, 404)
  const known = lessonFor(slug)
  if (!known) return send(c, { ok: false, error: 'Tantangan itu belum ada.' }, 404)
  return send(c, { ok: true, sql: known.sql, why: known.why })
})

lesson.post('/lesson/:slug/draft', async (c) => {
  const id = await userId(c)
  if (!id) return send(c, { ok: false, error: SIGN_IN }, 401)
  const slug = cleanSlug(c.req.param('slug'))
  if (!slug) return send(c, { ok: false, error: 'Tantangan itu belum ada.' }, 404)
  const body = await readJson(c)
  if (!isRecord(body) || typeof body.sql !== 'string') {
    return send(c, { ok: false, error: 'Draf tidak terbaca.' }, 400)
  }
  if (body.sql.length > MAX_DRAFT) return send(c, { ok: false, error: 'Draf terlalu panjang.' }, 400)
  if (typeof body.revision !== 'number') return send(c, { ok: false, error: 'Revisi draf tidak valid.' }, 400)
  const saved = await writeDraft(id, slug, body.sql, body.revision, false)
  if ('error' in saved) {
    if (saved.error === 'unknown') return send(c, { ok: false, error: 'Tantangan itu belum ada.' }, 404)
    return send(c, { ok: false, error: 'Revisi draf tidak valid.' }, 400)
  }
  return send(c, { ok: true, ...saved })
})

lesson.post('/lesson/:slug/reset', async (c) => {
  const id = await userId(c)
  if (!id) return send(c, { ok: false, error: SIGN_IN }, 401)
  const slug = cleanSlug(c.req.param('slug'))
  if (!slug) return send(c, { ok: false, error: 'Tantangan itu belum ada.' }, 404)
  const body = await readJson(c)
  if (!isRecord(body) || typeof body.revision !== 'number') {
    return send(c, { ok: false, error: 'Revisi draf tidak valid.' }, 400)
  }
  const saved = await writeDraft(id, slug, '', body.revision, true)
  if ('error' in saved) {
    if (saved.error === 'unknown') return send(c, { ok: false, error: 'Tantangan itu belum ada.' }, 404)
    return send(c, { ok: false, error: 'Revisi draf tidak valid.' }, 400)
  }
  return send(c, { ok: true, ...saved })
})
