/**
 * Unit tests for src/solver.ts
 */
import { solveProblem, ProblemType } from '../src/solver.js'
import { SubscriptionTier } from '../src/subscription.js'

describe('solver.ts', () => {
  describe('solveProblem', () => {
    it('throws when problem description is empty', () => {
      expect(() =>
        solveProblem('', ProblemType.MATH, SubscriptionTier.FREE)
      ).toThrow('problem description must not be empty')
    })

    it('throws when problem description is whitespace only', () => {
      expect(() =>
        solveProblem('   ', ProblemType.MATH, SubscriptionTier.FREE)
      ).toThrow('problem description must not be empty')
    })

    describe('FREE tier', () => {
      it('returns a basic math solution', () => {
        const result = solveProblem(
          'What is 2 + 2?',
          ProblemType.MATH,
          SubscriptionTier.FREE
        )
        expect(result.advanced).toBe(false)
        expect(result.solution).toContain('[Phu AI – Math]')
        expect(result.solution).toContain('Upgrade to Phu AI Pro')
      })

      it('returns a basic physics solution', () => {
        const result = solveProblem(
          "What is Newton's second law?",
          ProblemType.PHYSICS,
          SubscriptionTier.FREE
        )
        expect(result.advanced).toBe(false)
        expect(result.solution).toContain('[Phu AI – Physics]')
        expect(result.solution).toContain('Upgrade to Phu AI Pro')
      })

      it('returns a basic puzzle hint', () => {
        const result = solveProblem(
          'Solve the Tower of Hanoi with 3 disks',
          ProblemType.PUZZLE,
          SubscriptionTier.FREE
        )
        expect(result.advanced).toBe(false)
        expect(result.solution).toContain('[Phu AI – Puzzle]')
        expect(result.solution).toContain('Upgrade to Phu AI Pro')
      })
    })

    describe('PRO tier', () => {
      it('returns an advanced math solution', () => {
        const result = solveProblem(
          'Integrate x^2 from 0 to 3',
          ProblemType.MATH,
          SubscriptionTier.PRO
        )
        expect(result.advanced).toBe(true)
        expect(result.solution).toContain('[Phu AI Pro – Math]')
        expect(result.solution).toContain('Step-by-step')
      })

      it('returns an advanced physics solution', () => {
        const result = solveProblem(
          'Calculate gravitational force between two masses',
          ProblemType.PHYSICS,
          SubscriptionTier.PRO
        )
        expect(result.advanced).toBe(true)
        expect(result.solution).toContain('[Phu AI Pro – Physics]')
        expect(result.solution).toContain('free-body diagram')
      })

      it('returns a master-level puzzle solution', () => {
        const result = solveProblem(
          "Solve the Rubik's cube in minimum moves",
          ProblemType.PUZZLE,
          SubscriptionTier.PRO
        )
        expect(result.advanced).toBe(true)
        expect(result.solution).toContain('[Phu AI Pro – Puzzle]')
        expect(result.solution).toContain('optimal path')
      })
    })

    it('includes the trimmed problem text in the solution', () => {
      const result = solveProblem(
        '  find x  ',
        ProblemType.MATH,
        SubscriptionTier.FREE
      )
      expect(result.solution).toContain('find x')
    })
  })
})
