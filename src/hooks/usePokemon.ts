import { useState, useEffect, useCallback } from 'react'
import { getPokemonList, getBatch, getPokemon } from '@/api'
import { toDetailData, batchToTableData } from '@/transformers'
import { config } from '@/config'
import type {
  TableData,
  DetailData,
  CollectionStats,
  SortField,
  SortDirection,
  TypeName,
} from '@/types'

const { defaultPageSize } = config.pagination

export function useList() {
  const [pokemon, setPokemon] = useState<TableData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(0)
  const [totalCount, setTotalCount] = useState(0)
  const [sortField, setSortField] = useState<SortField>('name')
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')

  const fetchPokemon = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const offset = page * defaultPageSize
      const listResponse = await getPokemonList(defaultPageSize, offset)
      setTotalCount(listResponse.count)

      const names = listResponse.results.map((p) => p.name)
      const rawPokemon = await getBatch(names)
      const pokemonData = batchToTableData(rawPokemon)

      setPokemon(pokemonData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch Pokemon')
    } finally {
      setLoading(false)
    }
  }, [page])

  useEffect(() => {
    fetchPokemon()
  }, [fetchPokemon])

  const sortedPokemon = [...pokemon].sort((a, b) => {
    let comparison = 0

    switch (sortField) {
      case 'name':
        comparison = a.name.localeCompare(b.name)
        break
      case 'hp':
        comparison = a.hp - b.hp
        break
      case 'speed':
        comparison = a.speed - b.speed
        break
      case 'baseExperience':
        comparison = a.baseExperience - b.baseExperience
        break
    }

    return sortDirection === 'asc' ? comparison : -comparison
  })

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const nextPage = () => {
    if ((page + 1) * defaultPageSize < totalCount) {
      setPage((prev) => prev + 1)
    }
  }

  const prevPage = () => {
    if (page > 0) {
      setPage((prev) => prev - 1)
    }
  }

  const stats = calcStats(pokemon)

  return {
    pokemon: sortedPokemon,
    loading,
    error,
    page,
    totalCount,
    totalPages: Math.ceil(totalCount / defaultPageSize),
    nextPage,
    prevPage,
    sortField,
    sortDirection,
    handleSort,
    stats,
    refetch: fetchPokemon,
  }
}

export function useDetail(id: string | number) {
  const [pokemon, setPokemon] = useState<DetailData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true)
      setError(null)

      try {
        const rawPokemon = await getPokemon(id)
        const detailData = await toDetailData(rawPokemon)
        setPokemon(detailData)
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to fetch Pokemon details'
        )
      } finally {
        setLoading(false)
      }
    }

    fetchDetail()
  }, [id])

  return { pokemon, loading, error }
}

function calcStats(pokemon: TableData[]): CollectionStats {
  if (pokemon.length === 0) {
    return {
      total: 0,
      averageHp: 0,
      typeDistribution: {} as Record<TypeName, number>,
      mostPowerful: null,
    }
  }

  const total = pokemon.length
  const averageHp =
    pokemon.reduce((sum, p) => sum + p.hp, 0) / pokemon.length

  // Calculate type distribution
  const typeCounts: Record<string, number> = {}
  pokemon.forEach((p) => {
    p.types.forEach((type) => {
      typeCounts[type] = (typeCounts[type] || 0) + 1
    })
  })

  const totalTypes = Object.values(typeCounts).reduce((a, b) => a + b, 0)
  const typeDistribution = Object.fromEntries(
    Object.entries(typeCounts).map(([type, count]) => [
      type,
      Math.round((count / totalTypes) * 100),
    ])
  ) as Record<TypeName, number>

  // Find most powerful (combination of HP, Speed, and Base XP)
  const mostPowerful = pokemon.reduce(
    (best, current) => {
      const score = current.hp + current.speed + current.baseExperience
      if (!best || score > best.score) {
        return { name: current.name, score }
      }
      return best
    },
    null as { name: string; score: number } | null
  )

  return {
    total,
    averageHp: Math.round(averageHp * 10) / 10,
    typeDistribution,
    mostPowerful,
  }
}
