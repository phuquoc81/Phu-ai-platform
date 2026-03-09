import * as core from '@actions/core'
import { wait } from './wait.js'
import { fetchStripeRevenue } from './stripe.js'
import { sendTelegramAlert } from './telegram.js'

/**
 * The main function for the action.
 *
 * @returns Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    const ms: string = core.getInput('milliseconds')

    // Debug logs are only output if the `ACTIONS_STEP_DEBUG` secret is true
    core.debug(`Waiting ${ms} milliseconds ...`)

    // Log the current timestamp, wait, then log the new timestamp
    core.debug(new Date().toTimeString())
    await wait(parseInt(ms, 10))
    core.debug(new Date().toTimeString())

    // Set outputs for other workflow steps to use
    core.setOutput('time', new Date().toTimeString())

    // Fetch Stripe revenue if a secret key is provided
    const stripeSecretKey = core.getInput('stripe_secret_key')
    if (stripeSecretKey) {
      core.info('Fetching Stripe revenue data...')
      const { totalRevenue, payments } =
        await fetchStripeRevenue(stripeSecretKey)
      core.info(`Total Revenue: $${totalRevenue.toFixed(2)}`)
      core.setOutput('total_revenue', totalRevenue.toFixed(2))
      core.setOutput('payment_count', String(payments.length))
    }

    // Send a Telegram alert if credentials and message are provided
    const botToken = core.getInput('telegram_bot_token')
    const chatId = core.getInput('telegram_chat_id')
    const alertMessage = core.getInput('telegram_alert_message')
    if (botToken && chatId && alertMessage) {
      core.info('Sending Telegram alert...')
      await sendTelegramAlert(botToken, chatId, alertMessage)
      core.info('Telegram alert sent.')
    }
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message)
  }
}
