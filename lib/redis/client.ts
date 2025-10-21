import { Redis } from '@upstash/redis'

// Initialize Upstash Redis client
// Uses REST API, works in serverless environments
export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || process.env.REDIS_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

// Helper function to safely get cached data with fallback
export async function getCached<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl: number = 3600
): Promise<T> {
  try {
    // Try to get from cache
    const cached = await redis.get<T>(key)

    if (cached !== null) {
      return cached
    }

    // If not in cache, fetch and cache
    const data = await fetcher()
    await redis.setex(key, ttl, data)

    return data
  } catch (error) {
    // If Redis fails, fall back to fetcher
    console.error('Redis error:', error)
    return await fetcher()
  }
}

// Helper to invalidate cache
export async function invalidateCache(pattern: string): Promise<void> {
  try {
    const keys = await redis.keys(pattern)
    if (keys.length > 0) {
      await redis.del(...keys)
    }
  } catch (error) {
    console.error('Redis invalidation error:', error)
  }
}

// Helper to set cache with expiration
export async function setCache<T>(
  key: string,
  value: T,
  ttl: number = 3600
): Promise<void> {
  try {
    await redis.setex(key, ttl, value)
  } catch (error) {
    console.error('Redis set error:', error)
  }
}

// Helper to delete specific cache key
export async function deleteCache(key: string): Promise<void> {
  try {
    await redis.del(key)
  } catch (error) {
    console.error('Redis delete error:', error)
  }
}
