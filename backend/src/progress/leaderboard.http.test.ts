import '../env.ts'
import assert from 'node:assert/strict'
import { after, test } from 'node:test'
import { inArray } from 'drizzle-orm'
import { app } from '../app.ts'
import { pool, db } from '../db/client.ts'
import { completions, users } from '../db/schema.ts'

const hex = Date.now().toString(16).padStart(10, '0').slice(-10)
const idEarly = `00000000-0000-4000-8000-${hex}90`
const idLate = `00000000-0000-4000-8000-${hex}10`
const idLow = `00000000-0000-4000-8000-${hex}20`
const idHigh = `00000000-0000-4000-8000-${hex}30`
const idTop = `00000000-0000-4000-8000-${hex}40`
const idAlmost = `00000000-0000-4000-8000-${hex}50`
const idOne = `00000000-0000-4000-8000-${hex}60`
const idHidden = `00000000-0000-4000-8000-${hex}70`

const earlyName = `lb10-early-${hex}`
const lateName = `lb10-late-${hex}`
const lowName = `lb10-low-${hex}`
const highName = `lb10-high-${hex}`
const topName = `lb10-top-${hex}`
const almostName = `lb10-almost-${hex}`
const oneName = `lb10-one-${hex}`
const hiddenEmail = `lb10-noat-${hex}`
const playerName = `lb10-player-${hex}`
const playerEmail = `${playerName}@contoh.test`
const password = 'kulasql-level-10'
const hashMark = `lb10-hash-${hex}`
const marker = 8_000_000 + Number.parseInt(hex.slice(-4), 16)

const emails = [
  `${earlyName}@contoh.test`,
  `${lateName}@contoh.test`,
  `${lowName}@contoh.test`,
  `${highName}@contoh.test`,
  `${topName}@contoh.test`,
  `${almostName}@contoh.test`,
  `${oneName}@contoh.test`,
  hiddenEmail,
  playerEmail,
]

const tEarly = new Date('2024-01-01T00:00:00.000Z')
const tMid = new Date('2024-03-01T00:00:00.000Z')
const tiedAt = new Date('2024-04-01T00:00:00.000Z')
const tLate = new Date('2024-05-01T00:00:00.000Z')
const tOne = new Date('2024-06-01T00:00:00.000Z')
const tTop = new Date('2025-01-01T00:00:00.000Z')

type BoardRow = {
  rank: number
  name: string
  xp: number
  level: number
  you: boolean
}

function cookieHeader(response: Response): string {
  return response.headers
    .getSetCookie()
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

function row(rows: BoardRow[], name: string, xp: number): BoardRow {
  const found = rows.filter((item) => item.name === name && item.xp === xp)
  assert.equal(found.length, 1)
  return found[0]!
}

after(async () => {
  await db.delete(users).where(inArray(users.email, emails))
  await pool.end()
})

test('level follows xp and the board hides emails', { timeout: 180_000 }, async () => {
  for (const id of [idEarly, idLate, idLow, idHigh, idTop, idAlmost, idOne, idHidden]) {
    assert.equal(id.length, 36)
  }

  await db.insert(users).values([
    [idEarly, `${earlyName}@contoh.test`],
    [idLate, `${lateName}@contoh.test`],
    [idLow, `${lowName}@contoh.test`],
    [idHigh, `${highName}@contoh.test`],
    [idTop, `${topName}@contoh.test`],
    [idAlmost, `${almostName}@contoh.test`],
    [idOne, `${oneName}@contoh.test`],
    [idHidden, hiddenEmail],
  ].map(([id, email]) => ({
    id,
    email,
    passwordHash: hashMark,
    birthDate: '2000-01-15',
    tosAcceptedAt: new Date(),
  })))

  await db.insert(completions).values([
    { userId: idEarly, slug: 'lb-a', xpGranted: 50, completedAt: tEarly },
    { userId: idEarly, slug: 'lb-b', xpGranted: 200, completedAt: tLate },
    { userId: idLate, slug: 'lb-a', xpGranted: 250, completedAt: tMid },
    { userId: idLow, slug: 'lb-a', xpGranted: 249, completedAt: tiedAt },
    { userId: idHigh, slug: 'lb-a', xpGranted: 249, completedAt: tiedAt },
    { userId: idTop, slug: 'lb-a', xpGranted: 500, completedAt: tTop },
    { userId: idAlmost, slug: 'lb-a', xpGranted: 499, completedAt: tTop },
    { userId: idOne, slug: 'lb-a', xpGranted: 50, completedAt: tOne },
    { userId: idHidden, slug: 'lb-a', xpGranted: marker, completedAt: tTop },
  ])

  const guest = await call('/api/leaderboard')
  assert.equal(guest.status, 200)
  assert.equal(guest.headers.get('cache-control'), 'no-store')
  const guestText = await guest.text()
  assert.equal(guestText.includes('@'), false)
  assert.equal(guestText.includes(hashMark), false)
  assert.equal(guestText.includes(hiddenEmail), false)
  assert.equal(guestText.includes('passwordHash'), false)
  assert.equal(guestText.includes('password_hash'), false)
  const guestBody = JSON.parse(guestText) as { ok: boolean; rows: BoardRow[] }
  assert.equal(guestBody.ok, true)
  assert.deepEqual(
    guestBody.rows.map((item) => item.rank),
    guestBody.rows.map((_, index) => index + 1),
  )
  for (const item of guestBody.rows) {
    assert.deepEqual(Object.keys(item).sort(), ['level', 'name', 'rank', 'xp', 'you'])
    assert.equal(item.you, false)
    assert.equal(item.name.includes('@'), false)
  }

  const top = row(guestBody.rows, topName, 500)
  const almost = row(guestBody.rows, almostName, 499)
  const early = row(guestBody.rows, earlyName, 250)
  const late = row(guestBody.rows, lateName, 250)
  const low = row(guestBody.rows, lowName, 249)
  const high = row(guestBody.rows, highName, 249)
  const one = row(guestBody.rows, oneName, 50)
  const hidden = guestBody.rows.find((item) => item.xp === marker)
  assert.ok(hidden)
  assert.equal(hidden.name, 'Pelajar')
  assert.equal(hidden.level, 1 + Math.floor(marker / 250))
  assert.equal(top.level, 3)
  assert.equal(almost.level, 2)
  assert.equal(early.level, 2)
  assert.equal(late.level, 2)
  assert.equal(low.level, 1)
  assert.equal(high.level, 1)
  assert.equal(one.level, 1)
  assert.ok(hidden.rank < top.rank)
  assert.ok(top.rank < almost.rank)
  assert.ok(almost.rank < early.rank)
  assert.ok(early.rank < late.rank)
  assert.ok(late.rank < low.rank)
  assert.ok(low.rank < high.rank)
  assert.ok(high.rank < one.rank)
  assert.equal(guestBody.rows.some((item) => item.name === playerName), false)

  const registered = await call('/api/auth/register', undefined, {
    method: 'POST',
    body: JSON.stringify({
      email: playerEmail,
      password,
      birthDate: '2000-01-15',
      tosAccepted: true,
    }),
  })
  assert.equal(registered.status, 200)
  const cookie = cookieHeader(registered)
  const fresh = (await (await call('/api/auth/me', cookie)).json()) as {
    progress: { xp: number; level: number }
  }
  assert.equal(fresh.progress.xp, 0)
  assert.equal(fresh.progress.level, 1)

  const slugs = [
    'hari-pertama-di-tokokulwon',
    'laporan-untuk-tim-marketing',
    'mencari-pelanggan-dari-jakarta',
    'produk-dengan-harga-terjangkau',
    'pelanggan-dari-jakarta-atau-bandung',
  ]
  const first = (await (
    await call('/api/progress', cookie, {
      method: 'POST',
      body: JSON.stringify({ slug: slugs[0] }),
    })
  ).json()) as { awarded: number; progress: { xp: number; level: number } }
  assert.equal(first.awarded, 50)
  assert.equal(first.progress.xp, 50)
  assert.equal(first.progress.level, 1)

  const repeat = (await (
    await call('/api/progress', cookie, {
      method: 'POST',
      body: JSON.stringify({ slug: slugs[0] }),
    })
  ).json()) as { awarded: number; progress: { xp: number; level: number } }
  assert.equal(repeat.awarded, 0)
  assert.equal(repeat.progress.xp, 50)
  assert.equal(repeat.progress.level, 1)

  const at50 = (await (await call('/api/leaderboard', cookie)).json()) as { rows: BoardRow[] }
  const player50 = row(at50.rows, playerName, 50)
  const oneStill = row(at50.rows, oneName, 50)
  assert.equal(player50.level, 1)
  assert.equal(player50.you, true)
  assert.equal(at50.rows.filter((item) => item.you).length, 1)
  assert.ok(oneStill.rank < player50.rank)
  const rankAt50 = player50.rank

  const again = (await (
    await call('/api/progress', cookie, {
      method: 'POST',
      body: JSON.stringify({ slug: slugs[0] }),
    })
  ).json()) as { awarded: number; progress: { xp: number; level: number } }
  assert.equal(again.awarded, 0)
  const still50 = (await (await call('/api/leaderboard', cookie)).json()) as { rows: BoardRow[] }
  assert.equal(row(still50.rows, playerName, 50).rank, rankAt50)

  for (const slug of slugs.slice(1)) {
    const saved = (await (
      await call('/api/progress', cookie, {
        method: 'POST',
        body: JSON.stringify({ slug }),
      })
    ).json()) as { awarded: number; progress: { xp: number; level: number } }
    assert.equal(saved.awarded, 50)
  }

  const at250 = (await (await call('/api/auth/me', cookie)).json()) as {
    progress: { xp: number; level: number; completions: unknown[] }
  }
  assert.equal(at250.progress.xp, 250)
  assert.equal(at250.progress.level, 2)
  assert.equal(at250.progress.completions.length, 5)

  const ranked = (await (await call('/api/leaderboard', cookie)).json()) as { rows: BoardRow[] }
  const player = row(ranked.rows, playerName, 250)
  assert.equal(player.level, 2)
  assert.equal(player.you, true)
  assert.ok(row(ranked.rows, lateName, 250).rank < player.rank)
  assert.ok(player.rank < row(ranked.rows, lowName, 249).rank)
  const rankAt250 = player.rank

  const held = (await (
    await call('/api/progress', cookie, {
      method: 'POST',
      body: JSON.stringify({ slug: slugs[0] }),
    })
  ).json()) as { awarded: number; progress: { xp: number; level: number } }
  assert.equal(held.awarded, 0)
  assert.equal(held.progress.xp, 250)
  assert.equal(held.progress.level, 2)
  const afterRepeat = (await (await call('/api/leaderboard', cookie)).json()) as { rows: BoardRow[] }
  assert.equal(row(afterRepeat.rows, playerName, 250).rank, rankAt250)
  assert.equal(JSON.stringify(afterRepeat).includes('@'), false)
  assert.equal(JSON.stringify(afterRepeat).includes(hashMark), false)
})
