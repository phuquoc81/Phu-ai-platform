/**
 * Unit tests for src/subscription.ts
 */
import {
  resolveSubscriptionTier,
  SubscriptionTier,
  PLAN_LABELS,
  PRO_PLAN_PRICE_USD
} from '../src/subscription.js'

describe('subscription.ts', () => {
  describe('resolveSubscriptionTier', () => {
    it('returns FREE tier for an empty token', () => {
      expect(resolveSubscriptionTier('')).toBe(SubscriptionTier.FREE)
    })

    it('returns FREE tier for a token that does not start with phuai_pro_', () => {
      expect(resolveSubscriptionTier('some_random_token')).toBe(
        SubscriptionTier.FREE
      )
    })

    it('returns PRO tier for a token starting with phuai_pro_', () => {
      expect(resolveSubscriptionTier('phuai_pro_abc123')).toBe(
        SubscriptionTier.PRO
      )
    })

    it('returns PRO tier for any valid phuai_pro_ prefixed token', () => {
      expect(resolveSubscriptionTier('phuai_pro_xyz_9999')).toBe(
        SubscriptionTier.PRO
      )
    })
  })

  describe('PLAN_LABELS', () => {
    it('contains a label for the FREE tier', () => {
      expect(PLAN_LABELS[SubscriptionTier.FREE]).toBe('Phu AI (Free)')
    })

    it('contains a label for the PRO tier with correct price', () => {
      expect(PLAN_LABELS[SubscriptionTier.PRO]).toBe(
        `Phu AI Pro ($${PRO_PLAN_PRICE_USD.toFixed(2)}/month)`
      )
    })
  })

  describe('PRO_PLAN_PRICE_USD', () => {
    it('is 1.99', () => {
      expect(PRO_PLAN_PRICE_USD).toBe(1.99)
    })
  })
})
