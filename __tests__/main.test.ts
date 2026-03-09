/**
 * Unit tests for the action's main functionality, src/main.ts
 *
 * To mock dependencies in ESM, you can create fixtures that export mock
 * functions and objects. For example, the core module is mocked in this test,
 * so that the actual '@actions/core' module is not imported.
 */
import { jest } from '@jest/globals'
import * as core from '../__fixtures__/core.js'
import { resolveSubscriptionTier } from '../__fixtures__/subscription.js'
import { solveProblem } from '../__fixtures__/solver.js'
import { SubscriptionTier, PLAN_LABELS } from '../src/subscription.js'
import { ProblemType } from '../src/solver.js'

// Mocks should be declared before the module being tested is imported.
jest.unstable_mockModule('@actions/core', () => core)
jest.unstable_mockModule('../src/subscription.js', () => ({
  resolveSubscriptionTier,
  SubscriptionTier,
  PLAN_LABELS
}))
jest.unstable_mockModule('../src/solver.js', () => ({
  solveProblem,
  ProblemType
}))

// The module being tested should be imported dynamically. This ensures that the
// mocks are used in place of any actual dependencies.
const { run } = await import('../src/main.js')

describe('main.ts', () => {
  beforeEach(() => {
    // Default inputs
    core.getInput.mockImplementation((name: string) => {
      if (name === 'problem') return 'What is 2 + 2?'
      if (name === 'problem_type') return 'math'
      if (name === 'subscription_token') return ''
      return ''
    })

    resolveSubscriptionTier.mockReturnValue(SubscriptionTier.FREE)

    solveProblem.mockReturnValue({
      solution: '[Phu AI – Math] Basic answer computed for: "What is 2 + 2?"',
      advanced: false
    })
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('Sets the solution and plan outputs for a free-tier math problem', async () => {
    await run()

    expect(core.setOutput).toHaveBeenCalledWith(
      'solution',
      '[Phu AI – Math] Basic answer computed for: "What is 2 + 2?"'
    )
    expect(core.setOutput).toHaveBeenCalledWith(
      'plan',
      PLAN_LABELS[SubscriptionTier.FREE]
    )
  })

  it('Sets the solution and plan outputs for a Pro-tier physics problem', async () => {
    core.getInput.mockImplementation((name: string) => {
      if (name === 'problem') return 'Calculate gravitational force'
      if (name === 'problem_type') return 'physics'
      if (name === 'subscription_token') return 'phuai_pro_abc123'
      return ''
    })

    resolveSubscriptionTier.mockReturnValue(SubscriptionTier.PRO)

    solveProblem.mockReturnValue({
      solution:
        '[Phu AI Pro – Physics] Detailed analysis for: "Calculate gravitational force".',
      advanced: true
    })

    await run()

    expect(core.setOutput).toHaveBeenCalledWith(
      'solution',
      '[Phu AI Pro – Physics] Detailed analysis for: "Calculate gravitational force".'
    )
    expect(core.setOutput).toHaveBeenCalledWith(
      'plan',
      PLAN_LABELS[SubscriptionTier.PRO]
    )
  })

  it('Sets a failed status when an invalid problem_type is provided', async () => {
    core.getInput.mockImplementation((name: string) => {
      if (name === 'problem') return 'Some problem'
      if (name === 'problem_type') return 'chemistry'
      if (name === 'subscription_token') return ''
      return ''
    })

    await run()

    expect(core.setFailed).toHaveBeenCalledWith(
      expect.stringContaining('invalid problem_type')
    )
  })

  it('Sets a failed status when the solver throws', async () => {
    solveProblem.mockImplementation(() => {
      throw new Error('solver error')
    })

    await run()

    expect(core.setFailed).toHaveBeenCalledWith('solver error')
  })
})
