/**
 * Subscription management for Phu AI Platform.
 *
 * Defines the two available plans and provides helpers for validating
 * subscription tokens that are issued after a successful Stripe payment.
 */

/** Available subscription tiers. */
export enum SubscriptionTier {
  FREE = 'free',
  PRO = 'pro'
}

/** Monthly price for the Pro plan in USD. */
export const PRO_PLAN_PRICE_USD = 1.99

/** Human-readable plan labels. */
export const PLAN_LABELS: Record<SubscriptionTier, string> = {
  [SubscriptionTier.FREE]: 'Phu AI (Free)',
  [SubscriptionTier.PRO]: `Phu AI Pro ($${PRO_PLAN_PRICE_USD.toFixed(2)}/month)`
}

/**
 * Validates a subscription token supplied by the user.
 *
 * A valid Pro token is a non-empty string that begins with the prefix
 * `phuai_pro_`.  Real deployments would verify the token against the Stripe
 * Billing API; this implementation performs the lightweight format check that
 * is suitable for a GitHub Action where the token is stored as a secret.
 *
 * @param token - The subscription token to validate, or an empty string for
 *   the free tier.
 * @returns The resolved {@link SubscriptionTier} for the token.
 */
export function resolveSubscriptionTier(token: string): SubscriptionTier {
  if (token && token.startsWith('phuai_pro_')) {
    return SubscriptionTier.PRO
  }
  return SubscriptionTier.FREE
}
