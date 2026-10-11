import { and, asc, desc, eq, sql } from 'drizzle-orm'
import { db } from '../db/client.ts'
import { completions, users } from '../db/schema.ts'
import { decideXpGrant, levelFromXp, REWARDS } from './grant.ts'

export type ProgressPayload = {
  xp: number
  level: number
  completions: { slug: string; xpGranted: number; completedAt: string }[]
}

export type LeaderboardRow = {
  rank: number
  name: string
  xp: number
  level: number
  you: boolean
}

export async function loadLeaderboard(viewerId: string | null): Promise<LeaderboardRow[]> {
  const stored = await db
    .select({
      userId: users.id,
      email: users.email,
      xp: sql<number>`cast(sum(${completions.xpGranted}) as int)`,
    })
    .from(completions)
    .innerJoin(users, eq(users.id, completions.userId))
    .groupBy(users.id, users.email)
    .orderBy(
      desc(sql`sum(${completions.xpGranted})`),
      asc(sql`min(${completions.completedAt})`),
      asc(users.id),
    )

  return stored.map((row, index) => {
    const xp = typeof row.xp === 'number' ? row.xp : Number(row.xp)
    if (!Number.isInteger(xp)) throw new Error('XP papan tidak terbaca.')
    const at = row.email.indexOf('@')
    return {
      rank: index + 1,
      name: at <= 0 ? 'Pelajar' : row.email.slice(0, at),
      xp,
      level: levelFromXp(xp),
      you: viewerId !== null && row.userId === viewerId,
    }
  })
}

export async function loadProgress(userId: string): Promise<ProgressPayload> {
  const rows = await db
    .select({
      slug: completions.slug,
      xpGranted: completions.xpGranted,
      completedAt: completions.completedAt,
    })
    .from(completions)
    .where(eq(completions.userId, userId))
    .orderBy(asc(completions.completedAt))
  const xp = rows.reduce((sum, row) => sum + row.xpGranted, 0)
  return {
    xp,
    level: levelFromXp(xp),
    completions: rows.map((row) => ({
      slug: row.slug,
      xpGranted: row.xpGranted,
      completedAt: row.completedAt.toISOString(),
    })),
  }
}

export async function grantChallenge(
  userId: string,
  slug: string,
): Promise<{ awarded: number; progress: ProgressPayload } | { error: 'unknown' }> {
  const reward = REWARDS[slug]
  if (reward === undefined) return { error: 'unknown' }

  const existing = await db
    .select({ slug: completions.slug })
    .from(completions)
    .where(and(eq(completions.userId, userId), eq(completions.slug, slug)))
    .limit(1)

  let awarded = decideXpGrant(existing.length > 0, reward)
  if (existing.length === 0) {
    const inserted = await db
      .insert(completions)
      .values({ userId, slug, xpGranted: awarded })
      .onConflictDoNothing()
      .returning({ slug: completions.slug })
    if (inserted.length === 0) awarded = decideXpGrant(true, reward)
  }

  return { awarded, progress: await loadProgress(userId) }
}
