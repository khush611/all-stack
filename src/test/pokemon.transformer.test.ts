
import { toTableData, toDetailData, batchToTableData } from '@/transformers/pokemon.transformer'
import type { Pokemon } from '@/types'

// Mocking the API module
jest.mock('@/api', () => ({
  getPokemon: jest.fn(),
  getPokemonSpecies: jest.fn(),
  getEvolutionChain: jest.fn(),
  getMoveDetail: jest.fn(),
}))

// Mocking the config module
jest.mock('@/config', () => ({
  config: {
    moves: {
      maxFetchCount: 2,
    },
  },
}))

import { getPokemon, getPokemonSpecies, getEvolutionChain, getMoveDetail } from '@/api'

const mockGetPokemon = getPokemon as jest.MockedFunction<typeof getPokemon>
const mockGetPokemonSpecies = getPokemonSpecies as jest.MockedFunction<typeof getPokemonSpecies>
const mockGetEvolutionChain = getEvolutionChain as jest.MockedFunction<typeof getEvolutionChain>
const mockGetMoveDetail = getMoveDetail as jest.MockedFunction<typeof getMoveDetail>

// Mock Pokemon data
const createMockPokemon = (overrides: Partial<Pokemon> = {}): Pokemon => ({
  id: 25,
  name: 'pikachu',
  base_experience: 112,
  height: 4,
  weight: 60,
  sprites: {
    front_default: 'https://example.com/pikachu.png',
    other: {
      'official-artwork': {
        front_default: 'https://example.com/pikachu-artwork.png',
      },
    },
  },
  types: [
    { slot: 1, type: { name: 'electric', url: '' } },
  ],
  stats: [
    { base_stat: 35, stat: { name: 'hp', url: '' } },
    { base_stat: 55, stat: { name: 'attack', url: '' } },
    { base_stat: 40, stat: { name: 'defense', url: '' } },
    { base_stat: 50, stat: { name: 'special-attack', url: '' } },
    { base_stat: 50, stat: { name: 'special-defense', url: '' } },
    { base_stat: 90, stat: { name: 'speed', url: '' } },
  ],
  abilities: [
    { ability: { name: 'static', url: '' }, is_hidden: false, slot: 1 },
    { ability: { name: 'lightning-rod', url: '' }, is_hidden: true, slot: 3 },
  ],
  moves: [
    { move: { name: 'thunderbolt', url: '' } },
    { move: { name: 'quick-attack', url: '' } },
  ],
  ...overrides,
} as Pokemon)

describe('Pokemon Transformer', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('toTableData', () => {
    it('should transform pokemon to table data', () => {
      const pokemon = createMockPokemon()
      const result = toTableData(pokemon)

      expect(result).toEqual({
        id: 25,
        name: 'pikachu',
        sprite: 'https://example.com/pikachu.png',
        baseExperience: 112,
        types: ['electric'],
        hp: 35,
        speed: 90,
        primaryAbility: 'static',
      })
    })

    it('should handle pokemon with multiple types', () => {
      const pokemon = createMockPokemon({
        types: [
          { slot: 1, type: { name: 'water', url: '' } },
          { slot: 2, type: { name: 'flying', url: '' } },
        ],
      })
      const result = toTableData(pokemon)

      expect(result.types).toEqual(['water', 'flying'])
    })

    it('should handle missing base experience', () => {
      const pokemon = createMockPokemon({ base_experience: null as unknown as number })
      const result = toTableData(pokemon)

      expect(result.baseExperience).toBe(0)
    })

    it('should handle pokemon with no abilities', () => {
      const pokemon = createMockPokemon({ abilities: [] })
      const result = toTableData(pokemon)

      expect(result.primaryAbility).toBe('unknown')
    })

    it('should find primary ability (non-hidden)', () => {
      const pokemon = createMockPokemon({
        abilities: [
          { ability: { name: 'hidden-ability', url: '' }, is_hidden: true, slot: 3 },
          { ability: { name: 'normal-ability', url: '' }, is_hidden: false, slot: 1 },
        ],
      })
      const result = toTableData(pokemon)

      expect(result.primaryAbility).toBe('normal-ability')
    })
  })

  describe('batchToTableData', () => {
    it('should transform array of pokemon', () => {
      const pokemon1 = createMockPokemon({ id: 1, name: 'bulbasaur' })
      const pokemon2 = createMockPokemon({ id: 4, name: 'charmander' })

      const result = batchToTableData([pokemon1, pokemon2])

      expect(result).toHaveLength(2)
      expect(result[0].name).toBe('bulbasaur')
      expect(result[1].name).toBe('charmander')
    })

    it('should return empty array for empty input', () => {
      const result = batchToTableData([])
      expect(result).toEqual([])
    })
  })

  describe('toDetailData', () => {
    beforeEach(() => {
      // Setup default mocks
      mockGetMoveDetail.mockImplementation((name) =>
        Promise.resolve({
          name,
          type: { name: 'electric', url: '' },
          power: 90,
          accuracy: 100,
          pp: 15,
        } as any)
      )

      mockGetPokemonSpecies.mockResolvedValue({
        name: 'pikachu',
        evolution_chain: { url: 'https://pokeapi.co/api/v2/evolution-chain/10/' },
      } as any)

      mockGetEvolutionChain.mockResolvedValue({
        chain: {
          species: { name: 'pichu', url: '' },
          evolves_to: [
            {
              species: { name: 'pikachu', url: '' },
              evolves_to: [
                {
                  species: { name: 'raichu', url: '' },
                  evolves_to: [],
                },
              ],
            },
          ],
        },
      } as any)

      mockGetPokemon.mockImplementation((name) =>
        Promise.resolve(
          createMockPokemon({
            name: String(name),
            id: name === 'pichu' ? 172 : name === 'raichu' ? 26 : 25,
          })
        )
      )
    })

    it('should transform pokemon to detail data', async () => {
      const pokemon = createMockPokemon()
      const result = await toDetailData(pokemon)

      expect(result.id).toBe(25)
      expect(result.name).toBe('pikachu')
      expect(result.artwork).toBe('https://example.com/pikachu-artwork.png')
      expect(result.types).toEqual(['electric'])
      expect(result.height).toBe(4)
      expect(result.weight).toBe(60)
      expect(result.baseExperience).toBe(112)
    })

    it('should include stats', async () => {
      const pokemon = createMockPokemon()
      const result = await toDetailData(pokemon)

      expect(result.stats).toEqual({
        hp: 35,
        attack: 55,
        defense: 40,
        specialAttack: 50,
        specialDefense: 50,
        speed: 90,
      })
    })

    it('should include abilities', async () => {
      const pokemon = createMockPokemon()
      const result = await toDetailData(pokemon)

      expect(result.abilities).toEqual([
        { name: 'static', isHidden: false },
        { name: 'lightning-rod', isHidden: true },
      ])
    })

    it('should fetch and include moves', async () => {
      const pokemon = createMockPokemon()
      const result = await toDetailData(pokemon)

      expect(result.moves).toHaveLength(2)
      expect(mockGetMoveDetail).toHaveBeenCalledWith('thunderbolt')
      expect(mockGetMoveDetail).toHaveBeenCalledWith('quick-attack')
    })

    it('should handle move fetch errors gracefully', async () => {
      mockGetMoveDetail.mockRejectedValueOnce(new Error('API Error'))
      mockGetMoveDetail.mockResolvedValueOnce({
        name: 'quick-attack',
        type: { name: 'normal', url: '' },
      } as any)

      const pokemon = createMockPokemon()
      const result = await toDetailData(pokemon)

      // Should still have 2 moves, first one with default type
      expect(result.moves).toHaveLength(2)
      expect(result.moves[0].type).toBe('normal') // Fallback type
    })

    it('should fetch evolution chain', async () => {
      const pokemon = createMockPokemon()
      const result = await toDetailData(pokemon)

      expect(result.evolutionChain).toBeDefined()
      expect(result.evolutionChain.length).toBeGreaterThan(0)
      expect(mockGetPokemonSpecies).toHaveBeenCalledWith(25)
    })

    it('should handle evolution chain errors gracefully', async () => {
      mockGetPokemonSpecies.mockRejectedValueOnce(new Error('API Error'))

      const pokemon = createMockPokemon()
      const result = await toDetailData(pokemon)

      expect(result.evolutionChain).toEqual([])
    })
  })
})
