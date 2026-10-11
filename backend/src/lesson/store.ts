import { and, eq, sql } from 'drizzle-orm'
import { db } from '../db/client.ts'
import { challengeDrafts, hintOpens } from '../db/schema.ts'
import { lessonFor, type Lesson } from './content.ts'
import { canOpenHint, visibleHints } from './rules.ts'

export type DraftView = { sql: string; revision: number } | null

export type WorkspaceView = {
  opened: number
  hints: { level: number; body?: string }[]
  draft: DraftView
  revision: number
}

function asRevision(value: unknown): number {
  const revision = typeof value === 'number' ? value : typeof value === 'string' ? Number(value) : NaN
  return Number.isSafeInteger(revision) ? revision : 0
}

function toDraft(row: { body: string; revision: unknown; cleared: boolean } | undefined): {
  draft: DraftView
  revision: number
} {
  if (!row) return { draft: null, revision: 0 }
  const revision = asRevision(row.revision)
  if (row.cleared) return { draft: null, revision }
  return { draft: { sql: row.body, revision }, revision }
}

async function readOpened(userId: string, slug: string): Promise<number> {
  const rows = await db
    .select({ openedLevel: hintOpens.openedLevel })
    .from(hintOpens)
    .where(and(eq(hintOpens.userId, userId), eq(hintOpens.slug, slug)))
    .limit(1)
  return rows[0]?.openedLevel ?? 0
}

async function readDraft(userId: string, slug: string) {
  const rows = await db
    .select({
      body: challengeDrafts.body,
      revision: challengeDrafts.revision,
      cleared: challengeDrafts.cleared,
    })
    .from(challengeDrafts)
    .where(and(eq(challengeDrafts.userId, userId), eq(challengeDrafts.slug, slug)))
    .limit(1)
  return toDraft(rows[0])
}

function workspace(lesson: Lesson, opened: number, draft: { draft: DraftView; revision: number }): WorkspaceView {
  return {
    opened,
    hints: visibleHints(lesson.hints, opened),
    draft: draft.draft,
    revision: draft.revision,
  }
}

export async function readWorkspace(userId: string, slug: string): Promise<WorkspaceView | { error: 'unknown' }> {
  const lesson = lessonFor(slug)
  if (!lesson) return { error: 'unknown' }
  const opened = await readOpened(userId, slug)
  const draft = await readDraft(userId, slug)
  return workspace(lesson, opened, draft)
}

export async function openHintLevel(
  userId: string,
  slug: string,
  level: number,
): Promise<{ opened: number } | { error: 'unknown' | 'order' }> {
  if (!lessonFor(slug)) return { error: 'unknown' }
  const current = await readOpened(userId, slug)
  if (!canOpenHint(current, level)) return { error: 'order' }
  if (level <= current) return { opened: current }

  if (current === 0) {
    const inserted = await db
      .insert(hintOpens)
      .values({ userId, slug, openedLevel: level })
      .onConflictDoNothing()
      .returning({ openedLevel: hintOpens.openedLevel })
    if (inserted.length > 0) return { opened: level }
    const again = await readOpened(userId, slug)
    if (level <= again) return { opened: again }
    return { error: 'order' }
  }

  const updated = await db
    .update(hintOpens)
    .set({ openedLevel: level, openedAt: new Date() })
    .where(
      and(eq(hintOpens.userId, userId), eq(hintOpens.slug, slug), eq(hintOpens.openedLevel, current)),
    )
    .returning({ openedLevel: hintOpens.openedLevel })
  if (updated.length > 0) return { opened: level }
  const again = await readOpened(userId, slug)
  if (level <= again) return { opened: again }
  return { error: 'order' }
}

export async function writeDraft(
  userId: string,
  slug: string,
  body: string,
  revision: number,
  cleared: boolean,
): Promise<{ stored: boolean; draft: DraftView; revision: number } | { error: 'unknown' | 'revision' }> {
  if (!lessonFor(slug)) return { error: 'unknown' }
  if (!Number.isSafeInteger(revision) || revision < 1) return { error: 'revision' }

  const written = await db
    .insert(challengeDrafts)
    .values({
      userId,
      slug,
      body: cleared ? '' : body,
      revision,
      cleared,
    })
    .onConflictDoUpdate({
      target: [challengeDrafts.userId, challengeDrafts.slug],
      set: {
        body: cleared ? '' : body,
        revision,
        cleared,
        updatedAt: new Date(),
      },
      setWhere: sql`${challengeDrafts.revision} < ${revision}`,
    })
    .returning({
      body: challengeDrafts.body,
      revision: challengeDrafts.revision,
      cleared: challengeDrafts.cleared,
    })

  if (written.length === 0) {
    const current = await readDraft(userId, slug)
    return { stored: false, ...current }
  }
  return { stored: true, ...toDraft(written[0]) }
}
