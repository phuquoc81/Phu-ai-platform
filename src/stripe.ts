/**
 * Stripe revenue fetching module for the PHU AI platform.
 * Retrieves payment charges from the Stripe API.
 */

/** Represents a single Stripe payment charge. */
export interface Payment {
  id: string
  amount: number
  currency: string
  created: number
  customer: string | null
}

/** Aggregated Stripe revenue data. */
export interface RevenueData {
  totalRevenue: number
  payments: Payment[]
}

/**
 * Fetches revenue data from the Stripe API.
 *
 * @param secretKey - The Stripe secret key used to authenticate API requests.
 * @returns Resolves with aggregated revenue data including total revenue and
 *   individual payments.
 */
export async function fetchStripeRevenue(
  secretKey: string
): Promise<RevenueData> {
  const response = await fetch('https://api.stripe.com/v1/charges?limit=100', {
    headers: {
      Authorization: `Bearer ${secretKey}`
    }
  })

  if (!response.ok) {
    const body = await response.text().catch(() => '')
    throw new Error(
      `Stripe API error: ${response.status} ${response.statusText}${body ? ` - ${body}` : ''}`
    )
  }

  const data = (await response.json()) as {
    data: Array<{
      id: string
      amount: number
      currency: string
      created: number
      customer: string | null
    }>
  }

  const payments: Payment[] = data.data.map((charge) => ({
    id: charge.id,
    amount: charge.amount / 100,
    currency: charge.currency.toUpperCase(),
    created: charge.created,
    customer: charge.customer
  }))

  const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0)

  return { totalRevenue, payments }
}
