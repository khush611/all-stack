import { ApiError, fetchWithCache, buildUrl, clearCache, getCacheStats } from '@/api/client'

// mock the config module
jest.mock('@/config', () => ({
  config: {
    api: {
      baseUrl: 'https://pokeapi.co/api/v2',
    },
    cache: {
      enabled: true,
      ttl: 5 * 60 * 1000,
    },
  },
}))

// mock global fetch
const mockFetch = jest.fn()
global.fetch = mockFetch

describe('API Client', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    clearCache()
  })

  describe('ApiError', () => {
    it('should create an error with message', () => {
      const error = new ApiError('Test error')
      expect(error.message).toBe('Test error')
      expect(error.name).toBe('ApiError')
    })

    it('should include status code and endpoint', () => {
      const error = new ApiError('Not found', 404, '/pokemon/999999')
      expect(error.statusCode).toBe(404)
      expect(error.endpoint).toBe('/pokemon/999999')
    })
  })

  describe('buildUrl', () => {
    it('should build URL from endpoint', () => {
      const url = buildUrl('/pokemon')
      expect(url).toBe('https://pokeapi.co/api/v2/pokemon')
    })

    it('should build URL with query parameters', () => {
      const url = buildUrl('/pokemon', { limit: 10, offset: 20 })
      expect(url).toContain('limit=10')
      expect(url).toContain('offset=20')
    })

    it('should handle string and number params', () => {
      const url = buildUrl('/pokemon/ditto', { foo: 'bar', num: 123 })
      expect(url).toContain('foo=bar')
      expect(url).toContain('num=123')
    })
  })

  describe('fetchWithCache', () => {
    it('should fetch data from API', async () => {
      const mockData = { name: 'pikachu', id: 25 }
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockData),
      })

      const result = await fetchWithCache<typeof mockData>('https://pokeapi.co/api/v2/pokemon/pikachu')
      
      expect(result).toEqual(mockData)
      expect(mockFetch).toHaveBeenCalledTimes(1)
    })

    it('should return cached data on subsequent calls', async () => {
      const mockData = { name: 'bulbasaur', id: 1 }
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockData),
      })

      const url = 'https://pokeapi.co/api/v2/pokemon/bulbasaur'
      
      // First call - should fetch
      await fetchWithCache(url)
      // Second call - should use cache
      const result = await fetchWithCache(url)
      
      expect(result).toEqual(mockData)
      expect(mockFetch).toHaveBeenCalledTimes(1)
    })

    it('should throw ApiError on failed response', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
      })

      await expect(
        fetchWithCache('https://pokeapi.co/api/v2/pokemon/notreal')
      ).rejects.toThrow(ApiError)
    })

    it('should throw ApiError with status code', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
      })

      try {
        await fetchWithCache('https://pokeapi.co/api/v2/pokemon/error')
      } catch (error) {
        expect(error).toBeInstanceOf(ApiError)
        expect((error as ApiError).statusCode).toBe(500)
      }
    })
  })

  describe('clearCache', () => {
    it('should clear entire cache when no URL provided', async () => {
      const mockData = { name: 'charmander', id: 4 }
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockData),
      })

      await fetchWithCache('https://pokeapi.co/api/v2/pokemon/charmander')
      
      expect(getCacheStats().size).toBe(1)
      
      clearCache()
      
      expect(getCacheStats().size).toBe(0)
    })

    it('should clear specific cache entry when URL provided', async () => {
      const mockData1 = { name: 'squirtle', id: 7 }
      const mockData2 = { name: 'pidgey', id: 16 }
      
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockData1),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockData2),
        })

      const url1 = 'https://pokeapi.co/api/v2/pokemon/squirtle'
      const url2 = 'https://pokeapi.co/api/v2/pokemon/pidgey'
      
      await fetchWithCache(url1)
      await fetchWithCache(url2)
      
      expect(getCacheStats().size).toBe(2)
      
      clearCache(url1)
      
      expect(getCacheStats().size).toBe(1)
      expect(getCacheStats().keys).toContain(url2)
    })
  })

  describe('getCacheStats', () => {
    it('should return cache statistics', async () => {
      const mockData = { name: 'rattata', id: 19 }
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockData),
      })

      const url = 'https://pokeapi.co/api/v2/pokemon/rattata'
      await fetchWithCache(url)
      
      const stats = getCacheStats()
      
      expect(stats.size).toBe(1)
      expect(stats.keys).toContain(url)
    })
  })
})
