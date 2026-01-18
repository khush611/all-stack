// transforms raw pokeapi responses into cleaner objects for our components

import { config } from '@/config'
import {
  getPokemon,
  getPokemonSpecies,
  getEvolutionChain,
  getMoveDetail,
} from '@/api'
import type {
  Pokemon,
  EvolutionChainResponse,
  TableData,
  DetailData,
  TypeName,
} from '@/types'

// converts pokemon data into what the table needs
export function toTableData(pokemon: Pokemon): TableData {
  const hpStat = pokemon.stats.find((s) => s.stat.name === 'hp')
  const speedStat = pokemon.stats.find((s) => s.stat.name === 'speed')
  const primaryAbility = pokemon.abilities.find((a) => !a.is_hidden)

  return {
    id: pokemon.id,
    name: pokemon.name,
    sprite: pokemon.sprites.front_default,
    baseExperience: pokemon.base_experience || 0,
    types: pokemon.types.map((t) => t.type.name as TypeName),
    hp: hpStat?.base_stat || 0,
    speed: speedStat?.base_stat || 0,
    primaryAbility: primaryAbility?.ability.name || 'unknown',
  }
}

// recursively walks the evolution tree and returns flat array of names
function flattenChain(
  chain: EvolutionChainResponse['chain']
): string[] {
  const result: string[] = [chain.species.name]

  if (chain.evolves_to.length > 0) {
    // just follow the first branch, ignore alternate evolutions like eevee
    result.push(...flattenChain(chain.evolves_to[0]))
  }

  return result
}

// pulls out all 6 base stats into a nice object
function getStats(pokemon: Pokemon) {
  return {
    hp: pokemon.stats.find((s) => s.stat.name === 'hp')?.base_stat || 0,
    attack: pokemon.stats.find((s) => s.stat.name === 'attack')?.base_stat || 0,
    defense: pokemon.stats.find((s) => s.stat.name === 'defense')?.base_stat || 0,
    specialAttack: pokemon.stats.find((s) => s.stat.name === 'special-attack')?.base_stat || 0,
    specialDefense: pokemon.stats.find((s) => s.stat.name === 'special-defense')?.base_stat || 0,
    speed: pokemon.stats.find((s) => s.stat.name === 'speed')?.base_stat || 0,
  }
}

// formats abilities, marking which ones are hidden
function getAbilities(pokemon: Pokemon) {
  return pokemon.abilities.map((a) => ({
    name: a.ability.name,
    isHidden: a.is_hidden,
  }))
}

// fetches move details - limited to avoid hammering the api
async function fetchMoves(pokemon: Pokemon) {
  const movesToFetch = pokemon.moves.slice(0, config.moves.maxFetchCount)

  return Promise.all(
    movesToFetch.map(async (m) => {
      try {
        const detail = await getMoveDetail(m.move.name)
        return {
          name: m.move.name,
          type: detail.type.name as TypeName,
        }
      } catch {
        // if move fetch fails, just default to normal type
        return {
          name: m.move.name,
          type: 'normal' as TypeName,
        }
      }
    })
  )
}

// gets evolution chain with sprites for each stage
async function fetchEvolutions(pokemonId: number): Promise<DetailData['evolutionChain']> {
  try {
    const species = await getPokemonSpecies(pokemonId)
    // chain id is at the end of the url, gotta parse it out
    const chainId = species.evolution_chain.url.split('/').filter(Boolean).pop()

    if (!chainId) return []

    const chain = await getEvolutionChain(parseInt(chainId))
    const evolutionNames = flattenChain(chain.chain)

    // fetch each evolution's sprite
    return Promise.all(
      evolutionNames.map(async (name) => {
        try {
          const evoPokemon = await getPokemon(name)
          return {
            name,
            id: evoPokemon.id,
            sprite: evoPokemon.sprites.front_default,
          }
        } catch {
          return { name, id: 0, sprite: null }
        }
      })
    )
  } catch {
    // some pokemon don't have evolution chains, that's fine
    return []
  }
}

// builds the full detail object - fetches extra stuff like moves and evolutions
export async function toDetailData(
  pokemon: Pokemon
): Promise<DetailData> {
  // run these in parallel to speed things up
  const [moveDetails, evolutionChain] = await Promise.all([
    fetchMoves(pokemon),
    fetchEvolutions(pokemon.id),
  ])

  return {
    id: pokemon.id,
    name: pokemon.name,
    artwork: pokemon.sprites.other['official-artwork'].front_default,
    sprite: pokemon.sprites.front_default,
    types: pokemon.types.map((t) => t.type.name as TypeName),
    stats: getStats(pokemon),
    height: pokemon.height,
    weight: pokemon.weight,
    baseExperience: pokemon.base_experience || 0,
    abilities: getAbilities(pokemon),
    moves: moveDetails,
    evolutionChain,
  }
}

// same as toTableData but for an array
export function batchToTableData(pokemonList: Pokemon[]): TableData[] {
  return pokemonList.map(toTableData)
}