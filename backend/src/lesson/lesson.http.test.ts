import '../env.ts'
import assert from 'node:assert/strict'
import { after, test } from 'node:test'
import { eq } from 'drizzle-orm'
import { app } from '../app.ts'
import { pool, db } from '../db/client.ts'
import { users } from '../db/schema.ts'
import { lessonFor } from './content.ts'

const email = `hint06-${Date.now()}@contoh.test`
const password = 'kulasql-hint-06'

function cookieHeader(response: Response): string {
  const rows = response.headers.getSetCookie()
  return rows
    .map((row) => row.split(';')[0] ?? '')
    .filter(Boolean)
    .join('; ')
}

function call(path: string, cookie?: string, init: RequestInit = {}) {
  const headers = new Headers(init.headers)
  if (cookie) headers.set('cookie', cookie)
  if (init.body != null && !headers.has('content-type')) headers.set('content-type', 'application/json')
  return app.request(path, { ...init, headers })
}

after(async () => {
  await db.delete(users).where(eq(users.email, email))
  await pool.end()
})

test('hint, solution, draft, and reset follow the session rules', { timeout: 180_000 }, async () => {
  const hari = lessonFor('hari-pertama-di-tokokulwon')
  const hintSlug = 'nama-berawalan-de'
  const hintLesson = lessonFor(hintSlug)
  const freshSlug = 'urut-id-dari-belakang'
  const freshLesson = lessonFor(freshSlug)
  const draftSlug = 'daftar-pesanan'
  const resetSlug = 'belanja-paling-kecil'
  const resetLesson = lessonFor(resetSlug)
  const otherSlug = 'belanja-paling-besar'
  const otherLesson = lessonFor(otherSlug)
  const otherDone = 'jumlah-seluruh-belanja'
  assert.ok(hari && hintLesson && freshLesson && resetLesson && otherLesson)

  const guestSolution = await call('/api/lesson/hari-pertama-di-tokokulwon/solution', undefined, {
    method: 'POST',
    body: '{}',
  })
  assert.equal(guestSolution.status, 401)
  const guestSolutionText = await guestSolution.text()
  assert.equal(guestSolutionText.includes(hari.sql), false)
  assert.equal(guestSolutionText.includes(hari.why), false)
  for (const hint of hari.hints) assert.equal(guestSolutionText.includes(hint), false)

  const guestHint = await call('/api/lesson/hari-pertama-di-tokokulwon/hint', undefined, {
    method: 'POST',
    body: JSON.stringify({ level: 1 }),
  })
  assert.equal(guestHint.status, 401)
  const guestHintText = await guestHint.text()
  assert.equal(guestHintText.includes(hari.hints[0] ?? ''), false)
  assert.equal(guestHintText.includes(hari.sql), false)

  const guestRead = await call('/api/lesson/hari-pertama-di-tokokulwon')
  assert.equal(guestRead.status, 401)
  const guestReadText = await guestRead.text()
  assert.equal(guestReadText.includes(hari.sql), false)
  assert.equal(guestReadText.includes(hari.hints[2] ?? ''), false)

  const registered = await call('/api/auth/register', undefined, {
    method: 'POST',
    body: JSON.stringify({
      email,
      password,
      birthDate: '2000-01-15',
      tosAccepted: true,
    }),
  })
  assert.equal(registered.status, 200)
  const cookie = cookieHeader(registered)
  assert.ok(cookie.includes('kulasql_session'))

  const fresh = await call(`/api/lesson/${freshSlug}`, cookie)
  assert.equal(fresh.status, 200)
  const freshBody = (await fresh.json()) as {
    hints: { level: number; body?: string }[]
    draft: { sql: string } | null
    sql?: string
    why?: string
  }
  assert.equal(freshBody.draft, null)
  assert.equal(freshBody.sql, undefined)
  assert.equal(freshBody.why, undefined)
  assert.equal(JSON.stringify(freshBody).includes(freshLesson.sql), false)
  assert.equal(freshBody.hints.every((hint) => hint.body === undefined), true)

  const tooSoon = await call(`/api/lesson/${hintSlug}/hint`, cookie, {
    method: 'POST',
    body: JSON.stringify({ level: 2 }),
  })
  assert.equal(tooSoon.status, 409)
  const tooSoonText = await tooSoon.text()
  assert.equal(tooSoonText.includes(hintLesson.hints[1] ?? ''), false)
  assert.equal(tooSoonText.includes(hintLesson.sql), false)

  const opened1 = await call(`/api/lesson/${hintSlug}/hint`, cookie, {
    method: 'POST',
    body: JSON.stringify({ level: 1 }),
  })
  assert.equal(opened1.status, 200)
  const opened1Body = (await opened1.json()) as { opened: number; hints: { body?: string }[] }
  assert.equal(opened1Body.opened, 1)
  assert.equal(opened1Body.hints[0]?.body, hintLesson.hints[0])
  assert.equal(opened1Body.hints[1]?.body, undefined)
  assert.equal(opened1Body.hints[2]?.body, undefined)

  const tooFar = await call(`/api/lesson/${hintSlug}/hint`, cookie, {
    method: 'POST',
    body: JSON.stringify({ level: 3 }),
  })
  assert.equal(tooFar.status, 409)
  assert.equal((await tooFar.text()).includes(hintLesson.hints[2] ?? ''), false)

  assert.equal(
    (
      await call(`/api/lesson/${hintSlug}/hint`, cookie, {
        method: 'POST',
        body: JSON.stringify({ level: 2 }),
      })
    ).status,
    200,
  )
  const opened3 = await call(`/api/lesson/${hintSlug}/hint`, cookie, {
    method: 'POST',
    body: JSON.stringify({ level: 3 }),
  })
  assert.equal(opened3.status, 200)
  const again = await call(`/api/lesson/${hintSlug}`, cookie)
  const againBody = (await again.json()) as { opened: number; hints: { body?: string }[]; sql?: string }
  assert.equal(againBody.opened, 3)
  assert.equal(againBody.hints[0]?.body, hintLesson.hints[0])
  assert.equal(againBody.hints[1]?.body, hintLesson.hints[1])
  assert.equal(againBody.hints[2]?.body, hintLesson.hints[2])
  assert.equal(againBody.sql, undefined)
  assert.equal(JSON.stringify(againBody).includes(hintLesson.sql), false)

  const solution = await call('/api/lesson/hari-pertama-di-tokokulwon/solution', cookie, {
    method: 'POST',
    body: '{}',
  })
  assert.equal(solution.status, 200)
  const solutionBody = (await solution.json()) as { sql: string; why: string }
  assert.equal(solutionBody.sql, hari.sql)
  assert.equal(solutionBody.why, hari.why)
  assert.match(solutionBody.why, /kolom|urutan|baris/)
  const sedang = await call('/api/lesson/pelanggan-vip-dari-surabaya/solution', cookie, {
    method: 'POST',
    body: '{}',
  })
  const sulit = await call('/api/lesson/top-5-produk-terlaris/solution', cookie, {
    method: 'POST',
    body: '{}',
  })
  assert.equal(((await sedang.json()) as { sql: string }).sql, lessonFor('pelanggan-vip-dari-surabaya')?.sql)
  assert.equal(((await sulit.json()) as { sql: string }).sql, lessonFor('top-5-produk-terlaris')?.sql)

  const beforePass = await call('/api/auth/me', cookie)
  const beforeBody = (await beforePass.json()) as { progress: { completions: unknown[] } }
  assert.equal(beforeBody.progress.completions.length, 0)

  const savedNew = await call(`/api/lesson/${draftSlug}/draft`, cookie, {
    method: 'POST',
    body: JSON.stringify({ sql: 'SELECT baru', revision: 50 }),
  })
  assert.equal(savedNew.status, 200)
  const savedOld = await call(`/api/lesson/${draftSlug}/draft`, cookie, {
    method: 'POST',
    body: JSON.stringify({ sql: 'SELECT lama', revision: 40 }),
  })
  assert.equal(savedOld.status, 200)
  assert.equal(((await savedOld.json()) as { stored: boolean }).stored, false)
  await Promise.all([
    call(`/api/lesson/${draftSlug}/draft`, cookie, {
      method: 'POST',
      body: JSON.stringify({ sql: 'REV-2', revision: 80 }),
    }),
    call(`/api/lesson/${draftSlug}/draft`, cookie, {
      method: 'POST',
      body: JSON.stringify({ sql: 'REV-1', revision: 70 }),
    }),
  ])
  const draftRead = await call(`/api/lesson/${draftSlug}`, cookie)
  const draftBody = (await draftRead.json()) as { draft: { sql: string; revision: number } | null }
  assert.equal(draftBody.draft?.sql, 'REV-2')
  assert.equal(draftBody.draft?.revision, 80)

  const progressResponse = await call('/api/progress', cookie, {
    method: 'POST',
    body: JSON.stringify({ slug: resetSlug }),
  })
  assert.equal(progressResponse.status, 200)
  const progressText = await progressResponse.text()
  assert.equal(progressText.includes(resetLesson.sql), false)
  assert.equal(progressText.includes(resetLesson.why), false)
  const progressBody = JSON.parse(progressText) as {
    awarded: number
    sql?: string
    solution?: string
    why?: string
    progress: { xp: number }
  }
  assert.equal(progressBody.awarded, 50)
  assert.equal(progressBody.sql, undefined)
  assert.equal(progressBody.solution, undefined)
  assert.equal(progressBody.why, undefined)
  const otherProgress = await call('/api/progress', cookie, {
    method: 'POST',
    body: JSON.stringify({ slug: otherDone }),
  })
  const otherProgressBody = (await otherProgress.json()) as { progress: { xp: number } }
  assert.equal(otherProgressBody.progress.xp, 100)

  assert.equal(
    (
      await call(`/api/lesson/${otherSlug}/hint`, cookie, {
        method: 'POST',
        body: JSON.stringify({ level: 1 }),
      })
    ).status,
    200,
  )
  assert.equal(
    (
      await call(`/api/lesson/${otherSlug}/draft`, cookie, {
        method: 'POST',
        body: JSON.stringify({ sql: 'SELECT tetap', revision: 5 }),
      })
    ).status,
    200,
  )
  assert.equal(
    (
      await call(`/api/lesson/${resetSlug}/hint`, cookie, {
        method: 'POST',
        body: JSON.stringify({ level: 1 }),
      })
    ).status,
    200,
  )
  assert.equal(
    (
      await call(`/api/lesson/${resetSlug}/draft`, cookie, {
        method: 'POST',
        body: JSON.stringify({ sql: 'SELECT hilang', revision: 30 }),
      })
    ).status,
    200,
  )
  await Promise.all([
    call(`/api/lesson/${resetSlug}/draft`, cookie, {
      method: 'POST',
      body: JSON.stringify({ sql: 'SELECT lama', revision: 10 }),
    }),
    call(`/api/lesson/${resetSlug}/reset`, cookie, {
      method: 'POST',
      body: JSON.stringify({ revision: 90 }),
    }),
  ])

  const resetRead = await call(`/api/lesson/${resetSlug}`, cookie)
  const resetBody = (await resetRead.json()) as {
    draft: { sql: string } | null
    hints: { body?: string }[]
    opened: number
  }
  assert.equal(resetBody.draft, null)
  assert.equal(resetBody.opened, 1)
  assert.equal(resetBody.hints[0]?.body, resetLesson.hints[0])

  const otherRead = await call(`/api/lesson/${otherSlug}`, cookie)
  const otherBody = (await otherRead.json()) as {
    draft: { sql: string } | null
    hints: { body?: string }[]
  }
  assert.equal(otherBody.draft?.sql, 'SELECT tetap')
  assert.equal(otherBody.hints[0]?.body, otherLesson.hints[0])

  const me = await call('/api/auth/me', cookie)
  const meBody = (await me.json()) as {
    progress: { xp: number; level: number; completions: { slug: string }[] }
  }
  assert.equal(meBody.progress.xp, 100)
  assert.equal(meBody.progress.level, 1)
  assert.equal(
    meBody.progress.completions.some((row) => row.slug === resetSlug),
    true,
  )
  assert.equal(
    meBody.progress.completions.some((row) => row.slug === otherDone),
    true,
  )
})
