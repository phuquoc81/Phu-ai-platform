import { jest } from '@jest/globals'

export const resolveSubscriptionTier =
  jest.fn<typeof import('../src/subscription.js').resolveSubscriptionTier>()
