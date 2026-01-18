// all the pokeapi endpoints we use in one place (centralized, I would say)

export const ENDPOINTS = {
    POKEMON: '/pokemon',
    POKEMON_SPECIES: '/pokemon-species',
    EVOLUTION_CHAIN: '/evolution-chain',
    MOVE: '/move',
  } as const
  
  export type EndpointKey = keyof typeof ENDPOINTS