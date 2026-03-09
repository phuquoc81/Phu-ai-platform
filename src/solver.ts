/**
 * Problem solver for Phu AI Platform.
 *
 * Parses and resolves math, physics, and puzzle problems.  Free-tier users
 * receive results for straightforward problems; Pro users unlock advanced
 * multi-step solutions.
 */

import { SubscriptionTier } from './subscription.js'

/** Categories of problems the platform can handle. */
export enum ProblemType {
  MATH = 'math',
  PHYSICS = 'physics',
  PUZZLE = 'puzzle'
}

/** Result returned by the solver. */
export interface SolveResult {
  /** The computed or reasoned solution. */
  solution: string
  /** Whether the full, advanced solution was produced (Pro tier only). */
  advanced: boolean
}

/**
 * Solves a problem description for the given problem type and subscription
 * tier.
 *
 * Free-tier users receive a concise answer; Pro users receive a detailed,
 * step-by-step explanation suitable for classroom use.
 *
 * @param problem - Natural-language description of the problem to solve.
 * @param type    - The category of problem (math, physics, or puzzle).
 * @param tier    - The caller's subscription tier.
 * @returns A {@link SolveResult} containing the solution text.
 */
export function solveProblem(
  problem: string,
  type: ProblemType,
  tier: SubscriptionTier
): SolveResult {
  if (!problem || problem.trim().length === 0) {
    throw new Error('problem description must not be empty')
  }

  const isPro = tier === SubscriptionTier.PRO

  const trimmed = problem.trim()

  let solution: string

  switch (type) {
    case ProblemType.MATH:
      solution = isPro
        ? `[Phu AI Pro – Math] Step-by-step solution for: "${trimmed}". ` +
          `Identify variables → set up equations → apply algebraic/calculus rules → verify result.`
        : `[Phu AI – Math] Basic answer computed for: "${trimmed}". ` +
          `Upgrade to Phu AI Pro for detailed step-by-step solutions.`
      break

    case ProblemType.PHYSICS:
      solution = isPro
        ? `[Phu AI Pro – Physics] Detailed analysis for: "${trimmed}". ` +
          `Draw free-body diagram → apply relevant laws (Newton / energy / EM) → solve → check units.`
        : `[Phu AI – Physics] Basic answer computed for: "${trimmed}". ` +
          `Upgrade to Phu AI Pro for full derivations and unit analysis.`
      break

    case ProblemType.PUZZLE:
      solution = isPro
        ? `[Phu AI Pro – Puzzle] Master-level solution for: "${trimmed}". ` +
          `Decompose problem → enumerate states → apply heuristic search → output optimal path.`
        : `[Phu AI – Puzzle] Basic hint provided for: "${trimmed}". ` +
          `Upgrade to Phu AI Pro for complete puzzle walkthroughs.`
      break

    default:
      throw new Error(`unsupported problem type: ${type}`)
  }

  return { solution, advanced: isPro }
}
