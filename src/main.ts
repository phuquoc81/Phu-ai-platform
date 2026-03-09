import * as core from '@actions/core'
import { buildLesson, getLessons } from './lessons.js'
import { phuTeacher } from './phuAI.js'

/**
 * The main function for the PHU AI Learning Module action.
 *
 * Accepts an optional `topic` and `question` input, then outputs a structured
 * lesson and an AI teacher response so downstream workflow steps can consume
 * them.
 *
 * @returns Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    const topic: string = core.getInput('topic') || 'Make Money With AI'
    const question: string = core.getInput('question') || topic

    core.debug(`Generating lesson for topic: "${topic}"`)
    core.debug(`Answering question: "${question}"`)

    const lesson = buildLesson(topic)
    const answer = phuTeacher(question)
    const allLessons = getLessons()

    core.info(`PHU AI Learning Module — platform ready`)
    core.info(`Lesson: ${lesson.title}`)
    core.info(`Total available lessons: ${allLessons.length}`)

    core.setOutput('lesson', JSON.stringify(lesson))
    core.setOutput('answer', answer)
    core.setOutput('lesson_count', String(allLessons.length))
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}
