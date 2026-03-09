/**
 * Unit tests for the action's main functionality, src/main.ts
 *
 * To mock dependencies in ESM, you can create fixtures that export mock
 * functions and objects. For example, the core module is mocked in this test,
 * so that the actual '@actions/core' module is not imported.
 */
import { jest } from '@jest/globals'
import * as core from '../__fixtures__/core.js'

// Mocks should be declared before the module being tested is imported.
jest.unstable_mockModule('@actions/core', () => core)

// The module being tested should be imported dynamically. This ensures that the
// mocks are used in place of any actual dependencies.
const { run } = await import('../src/main.js')

describe('main.ts', () => {
  beforeEach(() => {
    core.getInput.mockImplementation((name: string) => {
      if (name === 'topic') return 'Make Money With AI'
      if (name === 'question') return 'How do I use AI to earn money online?'
      return ''
    })
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('Sets the lesson output as JSON', async () => {
    await run()

    const lessonCall = core.setOutput.mock.calls.find(
      (call) => call[0] === 'lesson'
    )
    expect(lessonCall).toBeDefined()

    const lesson = JSON.parse(lessonCall![1] as string)
    expect(lesson).toMatchObject({
      title: 'Make Money With AI',
      steps: expect.any(Array),
      moneyExample: expect.any(String)
    })
    expect(lesson.steps.length).toBeGreaterThan(0)
  })

  it('Sets the answer output from the AI teacher', async () => {
    await run()

    const answerCall = core.setOutput.mock.calls.find(
      (call) => call[0] === 'answer'
    )
    expect(answerCall).toBeDefined()
    expect(answerCall![1]).toContain('PHU AI Teacher')
    expect(answerCall![1]).toContain('How do I use AI to earn money online?')
  })

  it('Sets the lesson_count output', async () => {
    await run()

    const countCall = core.setOutput.mock.calls.find(
      (call) => call[0] === 'lesson_count'
    )
    expect(countCall).toBeDefined()
    expect(Number(countCall![1])).toBeGreaterThan(0)
  })

  it('Uses default topic when no inputs are provided', async () => {
    core.getInput.mockImplementation(() => '')

    await run()

    const lessonCall = core.setOutput.mock.calls.find(
      (call) => call[0] === 'lesson'
    )
    expect(lessonCall).toBeDefined()
    const lesson = JSON.parse(lessonCall![1] as string)
    expect(lesson.title).toBe('Make Money With AI')
  })

  it('Sets a failed status when an error is thrown', async () => {
    core.getInput.mockImplementation(() => {
      throw new Error('input error')
    })

    await run()

    expect(core.setFailed).toHaveBeenCalledWith('input error')
  })
})
