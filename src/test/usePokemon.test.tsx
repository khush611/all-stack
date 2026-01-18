import { renderHook, waitFor, act } from '@testing-library/react'
import { useList, useDetail } from '@/hooks/usePokemon'

// Mock the API module
jest.mock('@/api', () => ({
    getPokemonList: jest.fn(),
    getBatch: jest.fn(),
    getPokemon: jest.fn(),
}))

// Mock the transformers module
jest.mock('@/transformers', () => ({
    toDetailData: jest.fn(),
    batchToTableData: jest.fn(),
}))

// Mock the config module
jest.mock('@/config', () => ({
    config: {
        pagination: {
            defaultPageSize: 10,
        },
    },
}))

import { getPokemonList, getBatch, getPokemon } from '@/api'
import { toDetailData, batchToTableData } from '@/transformers'

const mockGetPokemonList = getPokemonList as jest.MockedFunction<typeof getPokemonList>
const mockGetBatch = getBatch as jest.MockedFunction<typeof getBatch>
const mockGetPokemon = getPokemon as jest.MockedFunction<typeof getPokemon>
const mockToDetailData = toDetailData as jest.MockedFunction<typeof toDetailData>
const mockBatchToTableData = batchToTableData as jest.MockedFunction<typeof batchToTableData>

describe('usePokemon hooks', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    describe('useList', () => {
        const mockTableData = [
            { id: 1, name: 'bulbasaur', hp: 45, speed: 45, baseExperience: 64, types: ['grass', 'poison'], sprite: '', primaryAbility: 'overgrow' },
            { id: 4, name: 'charmander', hp: 39, speed: 65, baseExperience: 62, types: ['fire'], sprite: '', primaryAbility: 'blaze' },
            { id: 7, name: 'squirtle', hp: 44, speed: 43, baseExperience: 63, types: ['water'], sprite: '', primaryAbility: 'torrent' },
        ]

        beforeEach(() => {
            mockGetPokemonList.mockResolvedValue({
                count: 1302,
                results: [
                    { name: 'bulbasaur', url: '' },
                    { name: 'charmander', url: '' },
                    { name: 'squirtle', url: '' },
                ],
                next: '',
                previous: null,
            })
            mockGetBatch.mockResolvedValue([{}, {}, {}] as any)
            mockBatchToTableData.mockReturnValue(mockTableData as any)
        })

        it('should fetch pokemon on mount', async () => {
            const { result } = renderHook(() => useList())

            expect(result.current.loading).toBe(true)

            await waitFor(() => {
                expect(result.current.loading).toBe(false)
            })

            expect(mockGetPokemonList).toHaveBeenCalledWith(10, 0)
            expect(result.current.pokemon).toHaveLength(3)
        })

        it('should handle fetch errors', async () => {
            mockGetPokemonList.mockRejectedValueOnce(new Error('Network error'))

            const { result } = renderHook(() => useList())

            await waitFor(() => {
                expect(result.current.loading).toBe(false)
            })

            expect(result.current.error).toBe('Network error')
        })

        it('should handle non-Error exceptions', async () => {
            mockGetPokemonList.mockRejectedValueOnce('Unknown error')

            const { result } = renderHook(() => useList())

            await waitFor(() => {
                expect(result.current.loading).toBe(false)
            })

            expect(result.current.error).toBe('Failed to fetch Pokemon')
        })

        it('should sort pokemon by name ascending by default', async () => {
            const { result } = renderHook(() => useList())

            await waitFor(() => {
                expect(result.current.loading).toBe(false)
            })

            expect(result.current.sortField).toBe('name')
            expect(result.current.sortDirection).toBe('asc')
            expect(result.current.pokemon[0].name).toBe('bulbasaur')
        })

        it('should handle sorting', async () => {
            const { result } = renderHook(() => useList())

            await waitFor(() => {
                expect(result.current.loading).toBe(false)
            })

            // Sort check
            act(() => {
                result.current.handleSort('hp')
            })

            expect(result.current.sortField).toBe('hp')
            expect(result.current.sortDirection).toBe('asc')

            // Toggle direction (for sort)
            act(() => {
                result.current.handleSort('hp')
            })

            expect(result.current.sortDirection).toBe('desc')
        })

        it('should sort by different fields', async () => {
            const { result } = renderHook(() => useList())

            await waitFor(() => {
                expect(result.current.loading).toBe(false)
            })

            // Sort by speed
            act(() => {
                result.current.handleSort('speed')
            })
            expect(result.current.pokemon[0].name).toBe('squirtle') // lowest speed

            // Sort by baseExpp
            act(() => {
                result.current.handleSort('baseExperience')
            })
            expect(result.current.pokemon[0].name).toBe('charmander') // least XP
        })

        it('should handle pagination', async () => {
            const { result } = renderHook(() => useList())

            await waitFor(() => {
                expect(result.current.loading).toBe(false)
            })

            expect(result.current.page).toBe(0)
            expect(result.current.totalCount).toBe(1302)
            expect(result.current.totalPages).toBe(131)

            // Go to next page
            act(() => {
                result.current.nextPage()
            })

            await waitFor(() => {
                expect(result.current.page).toBe(1)
            })
        })

        it('should not go below page 0', async () => {
            const { result } = renderHook(() => useList())

            await waitFor(() => {
                expect(result.current.loading).toBe(false)
            })

            act(() => {
                result.current.prevPage()
            })

            expect(result.current.page).toBe(0)
        })

        it('should not exceed total pages', async () => {
            mockGetPokemonList.mockResolvedValue({
                count: 20,
                results: [],
                next: null,
                previous: null,
            })
            mockBatchToTableData.mockReturnValue([])

            const { result } = renderHook(() => useList())

            await waitFor(() => {
                expect(result.current.loading).toBe(false)
            })

            // go to page 2 when only 2 pages exist
            act(() => {
                result.current.nextPage()
            })

            await waitFor(() => {
                expect(result.current.page).toBe(1)
            })

            act(() => {
                result.current.nextPage()
            })

            // should stay on page 1
            expect(result.current.page).toBe(1)
        })

        it('should calculate collection stats', async () => {
            const { result } = renderHook(() => useList())

            await waitFor(() => {
                expect(result.current.loading).toBe(false)
            })

            expect(result.current.stats.total).toBe(3)
            expect(result.current.stats.averageHp).toBeCloseTo(42.7, 1)
            expect(result.current.stats.mostPowerful).toBeDefined()
        })

        it('should handle empty pokemon list for stats', async () => {
            mockBatchToTableData.mockReturnValue([])
            mockGetPokemonList.mockResolvedValue({
                count: 0,
                results: [],
                next: null,
                previous: null,
            })

            const { result } = renderHook(() => useList())

            await waitFor(() => {
                expect(result.current.loading).toBe(false)
            })

            expect(result.current.stats.total).toBe(0)
            expect(result.current.stats.averageHp).toBe(0)
            expect(result.current.stats.mostPowerful).toBeNull()
        })

        it('should provide refetch function', async () => {
            const { result } = renderHook(() => useList())

            await waitFor(() => {
                expect(result.current.loading).toBe(false)
            })

            expect(mockGetPokemonList).toHaveBeenCalledTimes(1)

            act(() => {
                result.current.refetch()
            })

            await waitFor(() => {
                expect(mockGetPokemonList).toHaveBeenCalledTimes(2)
            })
        })
    })

    describe('useDetail', () => {
        const mockDetailData = {
            id: 25,
            name: 'pikachu',
            artwork: 'https://example.com/pikachu.png',
            sprite: null,
            types: ['electric'],
            stats: { hp: 35, attack: 55, defense: 40, specialAttack: 50, specialDefense: 50, speed: 90 },
            height: 4,
            weight: 60,
            baseExperience: 112,
            abilities: [{ name: 'static', isHidden: false }],
            moves: [],
            evolutionChain: [],
        }

        beforeEach(() => {
            mockGetPokemon.mockResolvedValue({} as any)
            mockToDetailData.mockResolvedValue(mockDetailData as any)
        })

        it('should fetch pokemon detail by id', async () => {
            const { result } = renderHook(() => useDetail(25))

            expect(result.current.loading).toBe(true)

            await waitFor(() => {
                expect(result.current.loading).toBe(false)
            })

            expect(mockGetPokemon).toHaveBeenCalledWith(25)
            expect(result.current.pokemon).toEqual(mockDetailData)
        })

        it('should fetch pokemon detail by name', async () => {
            const { result } = renderHook(() => useDetail('pikachu'))

            await waitFor(() => {
                expect(result.current.loading).toBe(false)
            })

            expect(mockGetPokemon).toHaveBeenCalledWith('pikachu')
        })

        it('should handle fetch errors', async () => {
            mockGetPokemon.mockRejectedValueOnce(new Error('Pokemon not found'))

            const { result } = renderHook(() => useDetail(999999))

            await waitFor(() => {
                expect(result.current.loading).toBe(false)
            })

            expect(result.current.error).toBe('Pokemon not found')
            expect(result.current.pokemon).toBeNull()
        })

        it('should handle non-Error exceptions', async () => {
            mockGetPokemon.mockRejectedValueOnce('Unknown error')

            const { result } = renderHook(() => useDetail(999999))

            await waitFor(() => {
                expect(result.current.loading).toBe(false)
            })

            expect(result.current.error).toBe('Failed to fetch Pokemon details')
        })

        it('should refetch when id changes', async () => {
            const { result, rerender } = renderHook(
                ({ id }) => useDetail(id),
                { initialProps: { id: 25 as string | number } }
            )

            await waitFor(() => {
                expect(result.current.loading).toBe(false)
            })

            rerender({ id: 1 })

            await waitFor(() => {
                expect(mockGetPokemon).toHaveBeenCalledWith(1)
            })
        })
    })
})
