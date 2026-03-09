import { jest } from '@jest/globals'

export const sendTelegramAlert =
  jest.fn<typeof import('../src/telegram.js').sendTelegramAlert>()
