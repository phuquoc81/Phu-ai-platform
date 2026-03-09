/**
 * Lesson building logic for the PHU AI Learning Module.
 *
 * Provides structured lesson content for users learning how to use AI tools
 * for productivity and income generation.
 */

/** A single lesson with a title, step-by-step guide, and income example. */
export interface Lesson {
  id: number
  title: string
  steps: string[]
  moneyExample: string
}

/** The catalog of available lessons. */
const LESSON_CATALOG: Lesson[] = [
  {
    id: 1,
    title: 'Start Using PHU AI',
    steps: [
      'Open PHU AI dashboard',
      'Ask PHU AI a question',
      'Generate ideas or code',
      'Save the result',
      'Use it for work or business'
    ],
    moneyExample: 'Use PHU AI to write content for clients and charge a fee'
  },
  {
    id: 2,
    title: 'Make Money With AI',
    steps: [
      'Use PHU AI to create content',
      'Turn content into a digital product',
      'Sell online on a marketplace',
      'Automate marketing with AI',
      'Scale your income'
    ],
    moneyExample:
      'Create AI social media posts and sell marketing services to businesses'
  },
  {
    id: 3,
    title: 'Automate Tasks With AI',
    steps: [
      'Identify repetitive tasks in your workflow',
      'Choose an AI tool for your work',
      'Automate tasks with AI',
      'Create digital products from the results',
      'Sell online using AI marketing'
    ],
    moneyExample:
      'Automate customer support with AI and offer the service to small businesses'
  }
]

/**
 * Returns all available lessons.
 *
 * @returns The full lesson catalog.
 */
export function getLessons(): Lesson[] {
  return LESSON_CATALOG
}

/**
 * Returns a lesson by its numeric ID, or undefined if not found.
 *
 * @param id - The lesson ID to look up.
 * @returns The matching lesson, or undefined.
 */
export function getLessonById(id: number): Lesson | undefined {
  return LESSON_CATALOG.find((lesson) => lesson.id === id)
}

/** Generic money example used for custom-built lessons. */
const DEFAULT_MONEY_EXAMPLE =
  'Use AI to build a digital product or service and sell it online'

/**
 * Builds a custom lesson for the given topic.
 *
 * @param topic - The subject for the generated lesson.
 * @returns A newly constructed lesson object.
 */
export function buildLesson(topic: string): Lesson {
  return {
    id: 0,
    title: topic,
    steps: [
      'Understand the AI tool used in this skill',
      'Create an account on the platform',
      'Use AI to automate work tasks',
      'Turn the result into a digital product',
      'Sell the product online'
    ],
    moneyExample: DEFAULT_MONEY_EXAMPLE
  }
}
