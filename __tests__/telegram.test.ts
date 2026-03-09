/**
 * Unit tests for src/telegram.ts
 */
import { jest } from '@jest/globals'
import { sendTelegramAlert } from '../src/telegram.js'

describe('telegram.ts', () => {
  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('Sends a message successfully', async () => {
    const fetchSpy = jest
      .spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce({ ok: true } as Response)

    await sendTelegramAlert('bot_token', 'chat_123', 'Hello *world*!')

    expect(fetchSpy).toHaveBeenCalledTimes(1)

    const [url, options] = fetchSpy.mock.calls[0] as [string, RequestInit]
    expect(url).toBe('https://api.telegram.org/botbot_token/sendMessage')
    expect(options.method).toBe('POST')

    const body = JSON.parse(options.body as string)
    expect(body.chat_id).toBe('chat_123')
    expect(body.text).toBe('Hello *world*!')
    expect(body.parse_mode).toBe('Markdown')
  })

  it('Throws when the Telegram API returns an error response', async () => {
    jest.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: false,
      status: 400,
      statusText: 'Bad Request',
      text: async () =>
        '{"ok":false,"description":"Bad Request: chat not found"}'
    } as Response)

    await expect(
      sendTelegramAlert('bad_token', 'chat_123', 'msg')
    ).rejects.toThrow(
      'Telegram API error: 400 Bad Request - {"ok":false,"description":"Bad Request: chat not found"}'
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

    await expect(
      sendTelegramAlert('bot_token', 'chat_123', 'msg')
    ).rejects.toThrow('Telegram API error: 500 Internal Server Error')
  })
})
