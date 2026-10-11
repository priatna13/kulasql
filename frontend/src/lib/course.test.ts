import assert from 'node:assert/strict'
import { test } from 'node:test'
import { CHALLENGES } from './challenge.ts'
import { CAPSTONE, JENJANG } from './course.ts'

const slugs = new Set(CHALLENGES.map((item) => item.slug))

test('three jenjang cover the syllabus topics', () => {
  assert.deepEqual(
    JENJANG.map((item) => ({ materi: item.materi, topics: [...item.topics] })),
    [
      { materi: 1, topics: ['SELECT', 'WHERE', 'JOIN', 'agregasi'] },
      { materi: 2, topics: ['GROUP BY', 'subquery', 'CASE'] },
      { materi: 3, topics: ['window', 'CTE', 'optimasi'] },
    ],
  )
  for (const jenjang of JENJANG) {
    for (const topic of jenjang.topics) {
      assert.equal(
        jenjang.lessons.some((lesson) => lesson.topic === topic),
        true,
        `${topic} di jenjang ${jenjang.materi}`,
      )
    }
    for (const lesson of jenjang.lessons) {
      assert.equal(jenjang.topics.includes(lesson.topic), true, lesson.slug)
    }
  }
})

test('every lesson and capstone link is a catalog slug', () => {
  const linked = [
    ...JENJANG.flatMap((jenjang) => jenjang.lessons.map((lesson) => lesson.slug)),
    ...CAPSTONE.steps.map((step) => step.slug),
  ]
  assert.equal(JENJANG.length, 3)
  assert.ok(linked.length > CAPSTONE.steps.length)
  assert.ok(CAPSTONE.steps.length > 0)
  for (const slug of linked) {
    assert.equal(slugs.has(slug), true, slug)
  }
})
