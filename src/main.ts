import * as core from '@actions/core'
import {
  resolveSubscriptionTier,
  PLAN_LABELS,
  SubscriptionTier
} from './subscription.js'
import { solveProblem, ProblemType } from './solver.js'

/**
 * The main function for the Phu AI Platform action.
 *
 * Reads the problem description, type, and subscription token from action
 * inputs, resolves the caller's subscription tier, and outputs a solution.
 *
 * @returns Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    const problem: string = core.getInput('problem', { required: true })
    const typeInput: string = core.getInput('problem_type') || 'math'
    const subscriptionToken: string = core.getInput('subscription_token')

    const tier: SubscriptionTier = resolveSubscriptionTier(subscriptionToken)
    const plan: string = PLAN_LABELS[tier]

    core.info(`Phu AI Platform — active plan: ${plan}`)

    const typeInputLower = typeInput.toLowerCase()
    if (!Object.values(ProblemType).includes(typeInputLower as ProblemType)) {
      throw new Error(
        `invalid problem_type "${typeInput}". Must be one of: ${Object.values(ProblemType).join(', ')}`
      )
    }
    const problemType = typeInputLower as ProblemType

    const { solution, advanced } = solveProblem(problem, problemType, tier)

    core.info(`Solution: ${solution}`)
    core.debug(`Advanced mode: ${advanced}`)

    core.setOutput('solution', solution)
    core.setOutput('plan', plan)
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}
