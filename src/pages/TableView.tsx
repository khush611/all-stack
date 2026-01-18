import { useList } from '@/hooks'
import {
  StatsHeader,
  PokemonTable,
  Pagination,
  LoadingSpinner,
  ErrorMessage,
} from '@/components'

export default function TableView() {
  const {
    pokemon,
    loading,
    error,
    page,
    totalCount,
    totalPages,
    nextPage,
    prevPage,
    sortField,
    sortDirection,
    handleSort,
    stats,
    refetch,
  } = useList()

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Page Title */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Pokémon Collection
          </h1>
          <p className="text-gray-600 mt-1">
            Explore and discover all Pokémon species
          </p>
        </header>

        {/* Stats Header */}
        <StatsHeader stats={stats} totalInCollection={totalCount} />

        {/* Main Content */}
        <main>
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <LoadingSpinner size="lg" message="Loading Pokémon..." />
            </div>
          ) : error ? (
            <ErrorMessage
              title="Failed to load Pokémon"
              message={error}
              onRetry={refetch}
            />
          ) : pokemon.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              No Pokémon found
            </div>
          ) : (
            <>
              <PokemonTable
                pokemon={pokemon}
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={handleSort}
              />

              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPrevious={prevPage}
                onNext={nextPage}
              />
            </>
          )}
        </main>
      </div>
    </div>
  )
}
