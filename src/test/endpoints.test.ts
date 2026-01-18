import { ENDPOINTS } from '@/api/endpoints'

describe('ENDPOINTS', () => {
    it('should have POKEMON endpoint', () => {
        expect(ENDPOINTS.POKEMON).toBe('/pokemon')
    })

    it('should have POKEMON_SPECIES endpoint', () => {
        expect(ENDPOINTS.POKEMON_SPECIES).toBe('/pokemon-species')
    })

    it('should have EVOLUTION_CHAIN endpoint', () => {
        expect(ENDPOINTS.EVOLUTION_CHAIN).toBe('/evolution-chain')
    })

    it('should have MOVE endpoint', () => {
        expect(ENDPOINTS.MOVE).toBe('/move')
    })

    it('should be read-only (const assertion)', () => {
        //  test to  verify if the structure is correct
        const endpoints = { ...ENDPOINTS }
        expect(Object.keys(endpoints)).toHaveLength(4)
    })
})
