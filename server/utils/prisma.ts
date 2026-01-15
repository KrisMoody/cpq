import { PrismaClient } from '../../app/generated/prisma/client'
import { PrismaNeon } from '@prisma/adapter-neon'
import { neonConfig } from '@neondatabase/serverless'
import ws from 'ws'

// Configure WebSocket for Neon in Node.js environments
// This is required for local development and non-edge runtimes
neonConfig.webSocketConstructor = ws

// Global variable to store the Prisma client instance
// This prevents multiple instances during hot module replacement
declare global {
  var __prisma: PrismaClient | undefined
}

/**
 * Creates a Prisma client configured for Neon Postgres
 * Uses the Neon serverless driver adapter for edge compatibility
 */
function createPrismaClient(): PrismaClient {
  const config = useRuntimeConfig()
  const connectionString = config.databaseUrl

  if (!connectionString || typeof connectionString !== 'string') {
    throw new Error('DATABASE_URL environment variable is not set')
  }

  // Create the Neon adapter for Prisma with connection config
  // PrismaNeon takes a PoolConfig object, not an instantiated Pool
  const adapter = new PrismaNeon({ connectionString })

  // Create and return the Prisma client with the adapter
  return new PrismaClient({ adapter })
}

// Singleton instance
let prismaInstance: PrismaClient | null = null

/**
 * Get the Prisma client singleton
 * In development, uses global variable to survive hot reloads
 * In production, creates a singleton per process
 */
export function usePrisma(): PrismaClient {
  if (process.env.NODE_ENV === 'development') {
    // In development, reuse the global instance to survive hot reloads
    if (!global.__prisma) {
      global.__prisma = createPrismaClient()
    }
    return global.__prisma
  }

  // In production, use a module-level singleton
  if (!prismaInstance) {
    prismaInstance = createPrismaClient()
  }
  return prismaInstance
}

// Default export for convenience
export default usePrisma
