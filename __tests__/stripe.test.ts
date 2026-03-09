/**
 * Unit tests for src/stripe.ts
 */
import { jest } from '@jest/globals'
import { fetchStripeRevenue, type Payment } from '../src/stripe.js'

describe('stripe.ts', () => {
  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('Returns revenue data for successful API response', async () => {
    const mockCharges = [
      {
        id: 'ch_1',
        amount: 199,
        currency: 'usd',
        created: 1700000000,
        customer: 'cus_abc'
      },
      {
        id: 'ch_2',
        amount: 199,
        currency: 'usd',
        created: 1700000001,
        customer: null
      }
    ]

    jest.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: mockCharges })
    } as Response)

    const result = await fetchStripeRevenue('sk_test_key')

    expect(result.payments).toHaveLength(2)
    expect(result.totalRevenue).toBeCloseTo(3.98)

    const first: Payment = result.payments[0]
    expect(first.id).toBe('ch_1')
    expect(first.amount).toBeCloseTo(1.99)
    expect(first.currency).toBe('USD')
    expect(first.customer).toBe('cus_abc')

    const second: Payment = result.payments[1]
    expect(second.customer).toBeNull()
  })

  it('Returns zero revenue when no charges exist', async () => {
    jest.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: [] })
    } as Response)

    const result = await fetchStripeRevenue('sk_test_key')

    expect(result.payments).toHaveLength(0)
    expect(result.totalRevenue).toBe(0)
  })

  it('Throws when the Stripe API returns an error response', async () => {
    jest.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: false,
      status: 401,
      statusText: 'Unauthorized',
      text: async () => '{"error":{"message":"No such API key"}}'
    } as Response)

    await expect(fetchStripeRevenue('sk_bad_key')).rejects.toThrow(
      'Stripe API error: 401 Unauthorized - {"error":{"message":"No such API key"}}'
    )
  })

  it('Throws with base message when response body cannot be read', async () => {
    jest.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
      text: async () => {
        throw new Error('stream error')
      }
    } as unknown as Response)

    await expect(fetchStripeRevenue('sk_test_key')).rejects.toThrow(
      'Stripe API error: 500 Internal Server Error'
    )
  })
})
