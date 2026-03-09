import { jest } from '@jest/globals'

export const solveProblem =
  jest.fn<typeof import('../src/solver.js').solveProblem>()
