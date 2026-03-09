import { jest } from '@jest/globals'

export const fetchStripeRevenue =
  jest.fn<typeof import('../src/stripe.js').fetchStripeRevenue>()
