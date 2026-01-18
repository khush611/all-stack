// pokemon api calls - for all the fetch functions 

import { fetchWithCache, buildUrl } from './client'
import { ENDPOINTS } from './endpoints'
import type {
  Pokemon,
  PokemonListResponse,
  PokemonSpecies,
  EvolutionChainResponse,
  MoveDetail,
} from '@/types'

// grabs a page of pokemon (for the list view)
export async function getPokemonList(
  limit: number = 10,
  offset: number = 0
): Promise<PokemonListResponse> {
  const url = buildUrl(ENDPOINTS.POKEMON, { limit, offset })
  return fetchWithCache<PokemonListResponse>(url)
}

// fetch one pokemon by id or name
export async function getPokemon(idOrName: string | number): Promise<Pokemon> {
  const url = buildUrl(`${ENDPOINTS.POKEMON}/${idOrName}`)
  return fetchWithCache<Pokemon>(url)
}

// species data - need this to get the evolution chain url
export async function getPokemonSpecies(
  idOrName: string | number
): Promise<PokemonSpecies> {
  const url = buildUrl(`${ENDPOINTS.POKEMON_SPECIES}/${idOrName}`)
  return fetchWithCache<PokemonSpecies>(url)
}

// gets the full evolution tree
export async function getEvolutionChain(
  id: number
): Promise<EvolutionChainResponse> {
  const url = buildUrl(`${ENDPOINTS.EVOLUTION_CHAIN}/${id}`)
  return fetchWithCache<EvolutionChainResponse>(url)
}

// move info like power, accuracy, etc
export async function getMoveDetail(name: string): Promise<MoveDetail> {
  const url = buildUrl(`${ENDPOINTS.MOVE}/${name}`)
  return fetchWithCache<MoveDetail>(url)
}

// fetch a bunch of pokemon at once - runs in parallel
export async function getBatch(names: string[]): Promise<Pokemon[]> {
  return Promise.all(names.map((name) => getPokemon(name)))
}