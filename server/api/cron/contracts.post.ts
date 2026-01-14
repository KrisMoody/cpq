import { usePrisma } from '../../utils/prisma'

/**
 * Scheduled job to transition contract statuses based on dates.
 *
 * This endpoint should be called periodically (e.g., daily) by an external cron service.
 * It performs the following transitions:
 * - DRAFT contracts with startDate <= now and endDate >= now → ACTIVE
 * - ACTIVE contracts with endDate < now → EXPIRED
 *
 * To secure this endpoint in production, consider:
 * - Using a secret token in the Authorization header
 * - Restricting to specific IP addresses
 * - Using Vercel/Netlify cron features with built-in authentication
 */
export default defineEventHandler(async (_event) => {
  const prisma = usePrisma()
  const now = new Date()

  // Track results for logging
  const results = {
    activated: 0,
    expired: 0,
    errors: [] as string[],
  }

  try {
    // Activate DRAFT contracts that should now be active
    // (start date has passed and end date hasn't)
    const activatedContracts = await prisma.contract.updateMany({
      where: {
        status: 'DRAFT',
        startDate: { lte: now },
        endDate: { gte: now },
      },
      data: {
        status: 'ACTIVE',
      },
    })
    results.activated = activatedContracts.count

    // Expire ACTIVE contracts that have passed their end date
    const expiredContracts = await prisma.contract.updateMany({
      where: {
        status: 'ACTIVE',
        endDate: { lt: now },
      },
      data: {
        status: 'EXPIRED',
      },
    })
    results.expired = expiredContracts.count
  } catch (e: any) {
    results.errors.push(e.message || 'Unknown error during contract status transitions')
  }

  return {
    success: results.errors.length === 0,
    timestamp: now.toISOString(),
    transitions: {
      activated: results.activated,
      expired: results.expired,
    },
    errors: results.errors,
  }
})
