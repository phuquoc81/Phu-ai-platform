/**
 * Unit tests for the action's main functionality, src/main.ts
 *
 * To mock dependencies in ESM, you can create fixtures that export mock
 * functions and objects. For example, the core module is mocked in this test,
 * so that the actual '@actions/core' module is not imported.
 */
import { jest } from '@jest/globals'
import * as core from '../__fixtures__/core.js'
import { wait } from '../__fixtures__/wait.js'
import { fetchStripeRevenue } from '../__fixtures__/stripe.js'
import { sendTelegramAlert } from '../__fixtures__/telegram.js'

// Mocks should be declared before the module being tested is imported.
jest.unstable_mockModule('@actions/core', () => core)
jest.unstable_mockModule('../src/wait.js', () => ({ wait }))
jest.unstable_mockModule('../src/stripe.js', () => ({ fetchStripeRevenue }))
jest.unstable_mockModule('../src/telegram.js', () => ({ sendTelegramAlert }))

// The module being tested should be imported dynamically. This ensures that the
// mocks are used in place of any actual dependencies.
const { run } = await import('../src/main.js')

describe('main.ts', () => {
  beforeEach(() => {
    // By default return empty string for all inputs (no Stripe / Telegram).
    core.getInput.mockImplementation((name: string) => {
      if (name === 'milliseconds') return '500'
      return ''
    })

    // Mock the wait function so that it does not actually wait.
    wait.mockImplementation(() => Promise.resolve('done!'))
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('Sets the time output', async () => {
    await run()

    // Verify the time output was set.
    expect(core.setOutput).toHaveBeenNthCalledWith(
      1,
      'time',
      // Simple regex to match a time string in the format HH:MM:SS.
      expect.stringMatching(/^\d{2}:\d{2}:\d{2}/)
    )
  })

  it('Sets a failed status', async () => {
    // Clear the getInput mock and return an invalid value.
    core.getInput.mockClear().mockReturnValueOnce('this is not a number')

    // Clear the wait mock and return a rejected promise.
    wait
      .mockClear()
      .mockRejectedValueOnce(new Error('milliseconds is not a number'))

    await run()

    // Verify that the action was marked as failed.
    expect(core.setFailed).toHaveBeenNthCalledWith(
      1,
      'milliseconds is not a number'
    )
  })

  it('Fetches Stripe revenue when stripe_secret_key is provided', async () => {
    fetchStripeRevenue.mockResolvedValueOnce({
      totalRevenue: 3.98,
      payments: [
        {
          id: 'ch_1',
          amount: 1.99,
          currency: 'USD',
          created: 1700000000,
          customer: 'cus_abc'
        },
        {
          id: 'ch_2',
          amount: 1.99,
          currency: 'USD',
          created: 1700000001,
          customer: null
        }
      ]
    })

    core.getInput.mockImplementation((name: string) => {
      if (name === 'milliseconds') return '500'
      if (name === 'stripe_secret_key') return 'sk_test_key'
      return ''
    })

    await run()

    expect(fetchStripeRevenue).toHaveBeenCalledWith('sk_test_key')
    expect(core.setOutput).toHaveBeenCalledWith('total_revenue', '3.98')
    expect(core.setOutput).toHaveBeenCalledWith('payment_count', '2')
  })

  it('Sends a Telegram alert when all Telegram inputs are provided', async () => {
    sendTelegramAlert.mockResolvedValueOnce(undefined)

    core.getInput.mockImplementation((name: string) => {
      if (name === 'milliseconds') return '500'
      if (name === 'telegram_bot_token') return 'bot_token'
      if (name === 'telegram_chat_id') return 'chat_123'
      if (name === 'telegram_alert_message') return '✅ PHU AI deployed!'
      return ''
    })

    await run()

    expect(sendTelegramAlert).toHaveBeenCalledWith(
      'bot_token',
      'chat_123',
      '✅ PHU AI deployed!'
    )
  })

  it('Does not send a Telegram alert when message is missing', async () => {
    core.getInput.mockImplementation((name: string) => {
      if (name === 'milliseconds') return '500'
      if (name === 'telegram_bot_token') return 'bot_token'
      if (name === 'telegram_chat_id') return 'chat_123'
      return ''
    })

    await run()

    expect(sendTelegramAlert).not.toHaveBeenCalled()
  })
})
