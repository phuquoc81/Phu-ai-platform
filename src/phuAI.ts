/**
 * PHU AI Core — teacher logic for the PHU AI Learning Module.
 *
 * Generates step-by-step AI teaching responses that guide users through
 * using AI tools for work and income generation.
 */

/**
 * Generates a structured teaching response from the PHU AI teacher.
 *
 * @param question - The user's question or topic they want to learn about.
 * @returns A formatted step-by-step teaching answer.
 */
export function phuTeacher(question: string): string {
  return `Hello, I am PHU AI Teacher.

Your question:
${question}

Step 1: Use AI to create a task.
Step 2: Generate results with PHU AI.
Step 3: Turn results into a digital service.
Step 4: Sell online.
Step 5: Automate the work.

This is how PHU AI helps you build income.`
}

/**
 * Builds the teaching prompt used to instruct the PHU AI engine.
 *
 * @param question - The user's raw question.
 * @returns A prompt string formatted for the PHU AI Core engine.
 */
export function buildTeachingPrompt(question: string): string {
  return `You are PHU AI Teacher.

Teach step by step how to use AI for work and make money.

User question: ${question}`
}
