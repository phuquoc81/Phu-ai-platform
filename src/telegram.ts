/**
 * Telegram alert utility for the PHU AI platform.
 * Sends messages to a Telegram chat via the Bot API.
 */

/**
 * Sends a message to a Telegram chat using the Bot API.
 *
 * @param botToken - The Telegram bot token used to authenticate the request.
 * @param chatId - The target chat ID to send the message to.
 * @param message - The message text to send (supports Markdown).
 * @returns Resolves when the message has been sent successfully.
 */
export async function sendTelegramAlert(
  botToken: string,
  chatId: string,
  message: string
): Promise<void> {
  const url = `https://api.telegram.org/bot${botToken}/sendMessage`

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text: message,
      parse_mode: 'Markdown'
    })
  })

  if (!response.ok) {
    const body = await response.text().catch(() => '')
    throw new Error(
      `Telegram API error: ${response.status} ${response.statusText}${body ? ` - ${body}` : ''}`
    )
  }
}
