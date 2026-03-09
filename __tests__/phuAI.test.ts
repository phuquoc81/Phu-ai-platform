/**
 * Unit tests for src/phuAI.ts
 */
import { buildTeachingPrompt, phuTeacher } from '../src/phuAI.js'

describe('phuAI.ts', () => {
  describe('phuTeacher', () => {
    it('Returns a response that includes the user question', () => {
      const question = 'How do I automate my work with AI?'
      const answer = phuTeacher(question)
      expect(answer).toContain(question)
    })

    it('Returns a response with PHU AI Teacher branding', () => {
      const answer = phuTeacher('Any question')
      expect(answer).toContain('PHU AI Teacher')
    })

    it('Returns a response that contains step-by-step guidance', () => {
      const answer = phuTeacher('How do I make money with AI?')
      expect(answer).toContain('Step 1')
      expect(answer).toContain('Step 2')
      expect(answer).toContain('Step 3')
    })

    it('Handles an empty question string', () => {
      const answer = phuTeacher('')
      expect(typeof answer).toBe('string')
      expect(answer.length).toBeGreaterThan(0)
    })
  })

  describe('buildTeachingPrompt', () => {
    it('Includes the user question in the prompt', () => {
      const question = 'What is AI automation?'
      const prompt = buildTeachingPrompt(question)
      expect(prompt).toContain(question)
    })

    it('Includes PHU AI Teacher instructions', () => {
      const prompt = buildTeachingPrompt('test question')
      expect(prompt).toContain('PHU AI Teacher')
    })

    it('Instructs the AI to teach step by step', () => {
      const prompt = buildTeachingPrompt('test question')
      expect(prompt).toContain('step by step')
    })
  })
})
