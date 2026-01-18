// app-level types - what our components actually use (not raw api stuff)

// all 18 pokemon types
export type TypeName =
  | 'normal'
  | 'fire'
  | 'water'
  | 'electric'
  | 'grass'
  | 'ice'
  | 'fighting'
  | 'poison'
  | 'ground'
  | 'flying'
  | 'psychic'
  | 'bug'
  | 'rock'
  | 'ghost'
  | 'dragon'
  | 'dark'
  | 'steel'
  | 'fairy'

// slimmed down pokemon data for the list/table
export interface TableData {
  id: number
  name: string
  sprite: string | null
  baseExperience: number
  types: TypeName[]
  hp: number
  speed: number
  primaryAbility: string
}

// everything we need for the detail page
export interface DetailData {
  id: number
  name: string
  artwork: string | null
  sprite: string | null
  types: TypeName[]
  stats: Stats
  height: number
  weight: number
  baseExperience: number
  abilities: Ability[]
  moves: Move[]
  evolutionChain: EvolutionStage[]
}

// the 6 base stats every pokemon has
export interface Stats {
  hp: number
  attack: number
  defense: number
  specialAttack: number
  specialDefense: number
  speed: number
}

export interface Ability {
  name: string
  isHidden: boolean
}

export interface Move {
  name: string
  type: TypeName
}

// one pokemon in the evolution line
export interface EvolutionStage {
  name: string
  id: number
  sprite: string | null
}

// stats shown in the header - aggregated from current page
export interface CollectionStats {
  total: number
  averageHp: number
  typeDistribution: Record<TypeName, number>
  mostPowerful: {
    name: string
    score: number
  } | null
}

// for sorting the table
export type SortField = 'name' | 'hp' | 'speed' | 'baseExperience'
export type SortDirection = 'asc' | 'desc'