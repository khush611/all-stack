import {
  getPokemonList,
  getPokemon,
  getPokemonSpecies,
  getEvolutionChain,
  getMoveDetail,
  getBatch,
} from '@/api/pokemon.api'
import * as client from '@/api/client'

// Mock the client module
jest.mock('@/api/client', () => ({
  fetchWithCache: jest.fn(),
  buildUrl: jest.fn((endpoint, params) => {
    const url = `https://pokeapi.co/api/v2${endpoint}`
    if (params) {
      const searchParams = new URLSearchParams()
      Object.entries(params).forEach(([key, value]) => {
        searchParams.set(key, String(value))
      })
      return `${url}?${searchParams.toString()}`
    }
    return url
  }),
}))

const mockFetchWithCache = client.fetchWithCache as jest.MockedFunction<typeof client.fetchWithCache>

describe('Pokemon API', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('getPokemonList', () => {
    it('should fetch pokemon list with default params', async () => {
      const mockResponse = {
        count: 1302,
        results: [
          { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
          { name: 'ivysaur', url: 'https://pokeapi.co/api/v2/pokemon/2/' },
        ],
      }
      mockFetchWithCache.mockResolvedValueOnce(mockResponse)

      const result = await getPokemonList()

      expect(result).toEqual(mockResponse)
      expect(client.buildUrl).toHaveBeenCalledWith('/pokemon', { limit: 10, offset: 0 })
    })

    it('should fetch pokemon list with custom params', async () => {
      const mockResponse = { count: 1302, results: [] }
      mockFetchWithCache.mockResolvedValueOnce(mockResponse)

      await getPokemonList(20, 40)

      expect(client.buildUrl).toHaveBeenCalledWith('/pokemon', { limit: 20, offset: 40 })
    })
  })

  describe('getPokemon', () => {
    it('should fetch pokemon by name', async () => {
      const mockPokemon = { id: 25, name: 'pikachu', types: [] }
      mockFetchWithCache.mockResolvedValueOnce(mockPokemon)

      const result = await getPokemon('pikachu')

      expect(result).toEqual(mockPokemon)
      expect(client.buildUrl).toHaveBeenCalledWith('/pokemon/pikachu')
    })

    it('should fetch pokemon by id', async () => {
      const mockPokemon = { id: 1, name: 'bulbasaur', types: [] }
      mockFetchWithCache.mockResolvedValueOnce(mockPokemon)

      const result = await getPokemon(1)

      expect(result).toEqual(mockPokemon)
      expect(client.buildUrl).toHaveBeenCalledWith('/pokemon/1')
    })
  })

  describe('getPokemonSpecies', () => {
    it('should fetch pokemon species', async () => {
      const mockSpecies = {
        name: 'pikachu',
        evolution_chain: { url: 'https://pokeapi.co/api/v2/evolution-chain/10/' },
      }
      mockFetchWithCache.mockResolvedValueOnce(mockSpecies)

      const result = await getPokemonSpecies('pikachu')

      expect(result).toEqual(mockSpecies)
      expect(client.buildUrl).toHaveBeenCalledWith('/pokemon-species/pikachu')
    })

    it('should fetch pokemon species by id', async () => {
      const mockSpecies = {
        name: 'bulbasaur',
        evolution_chain: { url: 'https://pokeapi.co/api/v2/evolution-chain/1/' },
      }
      mockFetchWithCache.mockResolvedValueOnce(mockSpecies)

      await getPokemonSpecies(1)

      expect(client.buildUrl).toHaveBeenCalledWith('/pokemon-species/1')
    })
  })

  describe('getEvolutionChain', () => {
    it('should fetch evolution chain', async () => {
      const mockChain = {
        chain: {
          species: { name: 'bulbasaur' },
          evolves_to: [{ species: { name: 'ivysaur' }, evolves_to: [] }],
        },
      }
      mockFetchWithCache.mockResolvedValueOnce(mockChain)

      const result = await getEvolutionChain(1)

      expect(result).toEqual(mockChain)
      expect(client.buildUrl).toHaveBeenCalledWith('/evolution-chain/1')
    })
  })

  describe('getMoveDetail', () => {
    it('should fetch move details', async () => {
      const mockMove = {
        name: 'thunderbolt',
        type: { name: 'electric' },
        power: 90,
      }
      mockFetchWithCache.mockResolvedValueOnce(mockMove)

      const result = await getMoveDetail('thunderbolt')

      expect(result).toEqual(mockMove)
      expect(client.buildUrl).toHaveBeenCalledWith('/move/thunderbolt')
    })
  })

  describe('getBatch', () => {
    it('should fetch multiple pokemon in parallel', async () => {
      const mockPokemon1 = { id: 1, name: 'bulbasaur' }
      const mockPokemon2 = { id: 4, name: 'charmander' }
      const mockPokemon3 = { id: 7, name: 'squirtle' }

      mockFetchWithCache
        .mockResolvedValueOnce(mockPokemon1)
        .mockResolvedValueOnce(mockPokemon2)
        .mockResolvedValueOnce(mockPokemon3)

      const result = await getBatch(['bulbasaur', 'charmander', 'squirtle'])

      expect(result).toHaveLength(3)
      expect(result).toEqual([mockPokemon1, mockPokemon2, mockPokemon3])
    })

    it('should return empty array for empty input', async () => {
      const result = await getBatch([])
      expect(result).toEqual([])
    })
  })
})
