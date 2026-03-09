/**
 * Unit tests for src/lessons.ts
 */
import { buildLesson, getLessonById, getLessons } from '../src/lessons.js'

describe('lessons.ts', () => {
  describe('getLessons', () => {
    it('Returns a non-empty array of lessons', () => {
      const lessons = getLessons()
      expect(lessons.length).toBeGreaterThan(0)
    })

    it('Each lesson has required fields', () => {
      const lessons = getLessons()
      for (const lesson of lessons) {
        expect(typeof lesson.id).toBe('number')
        expect(typeof lesson.title).toBe('string')
        expect(lesson.title.length).toBeGreaterThan(0)
        expect(Array.isArray(lesson.steps)).toBe(true)
        expect(lesson.steps.length).toBeGreaterThan(0)
        expect(typeof lesson.moneyExample).toBe('string')
      }
    })

    it('All lesson IDs are unique', () => {
      const lessons = getLessons()
      const ids = lessons.map((l) => l.id)
      const uniqueIds = new Set(ids)
      expect(uniqueIds.size).toBe(ids.length)
    })
  })

  describe('getLessonById', () => {
    it('Returns the correct lesson for a valid ID', () => {
      const lessons = getLessons()
      const first = lessons[0]
      const found = getLessonById(first.id)
      expect(found).toBeDefined()
      expect(found?.id).toBe(first.id)
      expect(found?.title).toBe(first.title)
    })

    it('Returns undefined for a non-existent ID', () => {
      const result = getLessonById(99999)
      expect(result).toBeUndefined()
    })
  })

  describe('buildLesson', () => {
    it('Creates a lesson with the given topic as the title', () => {
      const lesson = buildLesson('AI Automation')
      expect(lesson.title).toBe('AI Automation')
    })

    it('Includes at least one step', () => {
      const lesson = buildLesson('Test Topic')
      expect(lesson.steps.length).toBeGreaterThan(0)
    })

    it('Includes a money example', () => {
      const lesson = buildLesson('Freelancing With AI')
      expect(typeof lesson.moneyExample).toBe('string')
      expect(lesson.moneyExample.length).toBeGreaterThan(0)
    })

    it('Returns a lesson with id 0 for custom-built lessons', () => {
      const lesson = buildLesson('Custom Topic')
      expect(lesson.id).toBe(0)
    })
  })
})
