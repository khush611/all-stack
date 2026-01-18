// types that match what pokeapi actually returns
import type { TypeName } from './domain.types'

// what you get from /pokemon?limit=x&offset=y
export interface PokemonListResponse {
  count: number
  next: string | null
  previous: string | null
  results: ListItem[]
}

export interface ListItem {
  name: string
  url: string
}

// main pokemon object from /pokemon/{id}
export interface Pokemon {
  id: number
  name: string
  base_experience: number
  height: number
  weight: number
  sprites: Sprites
  types: TypeSlot[]
  stats: Stat[]
  abilities: AbilitySlot[]
  moves: MoveSlot[]
}

// sprite urls - the official artwork is nested weirdly
export interface Sprites {
  front_default: string | null
  other: {
    'official-artwork': {
      front_default: string | null
    }
  }
}

// pokemon can have multiple types (slot 1 is primary)
export interface TypeSlot {
  slot: number
  type: {
    name: TypeName
    url: string
  }
}

// base stats like hp, attack, etc
export interface Stat {
  base_stat: number
  effort: number
  stat: {
    name: string
    url: string
  }
}

// abilities - some are hidden
export interface AbilitySlot {
  ability: {
    name: string
    url: string
  }
  is_hidden: boolean
  slot: number
}

// moves are complicated - they have version info we mostly ignore
export interface MoveSlot {
  move: {
    name: string
    url: string
  }
  version_group_details: {
    level_learned_at: number
    move_learn_method: {
      name: string
      url: string
    }
  }[]
}

// from /move/{name}
export interface MoveDetail {
  id: number
  name: string
  type: {
    name: TypeName
    url: string
  }
  power: number | null
  pp: number
  accuracy: number | null
}

// evolution chain is a nested tree structure
export interface EvolutionChainResponse {
  id: number
  chain: EvolutionChainLink
}

// each link can have multiple evolves_to (like eevee)
export interface EvolutionChainLink {
  species: {
    name: string
    url: string
  }
  evolves_to: EvolutionChainLink[]
}

// species data - we mainly use this to get the evolution chain url
export interface PokemonSpecies {
  id: number
  name: string
  evolution_chain: {
    url: string
  }
}