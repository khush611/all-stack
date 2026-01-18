// API client - wraps fetch with caching so we don't hammer the server

import { config } from '@/config'

// what we store in cache
interface CacheEntry<T> {
  data: T
  timestamp: number
}

// simple in-memory cache using url as key
const cache = new Map<string, CacheEntry<unknown>>()

// custom error so we can catch API failures separately
export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public endpoint?: string
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

// checks if cached data is still fresh
function isCacheValid<T>(entry: CacheEntry<T>): boolean {
  if (!config.cache.enabled) return false
  return Date.now() - entry.timestamp < config.cache.ttl
}

// main fetch function - checks cache first, then hits the network
export async function fetchWithCache<T>(url: string): Promise<T> {
  // return cached data if we have it and it's not stale
  if (cache.has(url)) {
    const entry = cache.get(url) as CacheEntry<T>
    if (isCacheValid(entry)) {
      return entry.data
    }
    // expired, toss it
    cache.delete(url)
  }

  // actually fetch
  const response = await fetch(url)
  
  if (!response.ok) {
    throw new ApiError(
      `API Error: ${response.status} ${response.statusText}`,
      response.status,
      url
    )
  }

  const data = await response.json()
  
  // save for next time
  if (config.cache.enabled) {
    cache.set(url, {
      data,
      timestamp: Date.now(),
    })
  }
  
  return data as T
}

// builds full url with query params
export function buildUrl(endpoint: string, params?: Record<string, string | number>): string {
  const url = new URL(`${config.api.baseUrl}${endpoint}`)
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, String(value))
    })
  }
  
  return url.toString()
}

// wipe cache - pass url to clear one entry, or nothing to clear all
export function clearCache(url?: string): void {
  if (url) {
    cache.delete(url)
  } else {
    cache.clear()
  }
}

// handy for debugging cache issues
export function getCacheStats(): { size: number; keys: string[] } {
  return {
    size: cache.size,
    keys: Array.from(cache.keys()),
  }
}