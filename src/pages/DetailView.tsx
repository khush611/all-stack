import { useParams } from 'react-router-dom'
import { useDetail } from '@/hooks'
import { PokemonDetail, LoadingSpinner, ErrorMessage } from '@/components'
import { Link } from 'react-router-dom'

export default function DetailView() {
  const { id } = useParams<{ id: string }>()
  const { pokemon, loading, error } = useDetail(id || '1')

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <LoadingSpinner size="lg" message="Loading Pokémon details..." />
        </div>
      ) : error ? (
        <div className="max-w-2xl mx-auto">
          <Link
            to="/"
            className="inline-flex items-center gap-2 mb-6 text-gray-600 hover:text-gray-900 
                       transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
          >
            <span aria-hidden="true">←</span>
            <span>Back to Collection</span>
          </Link>
          <ErrorMessage
            title="Failed to load Pokémon"
            message={error}
          />
        </div>
      ) : pokemon ? (
        <PokemonDetail pokemon={pokemon} />
      ) : (
        <div className="text-center py-20 text-gray-500">
          Pokémon not found
        </div>
      )}
    </div>
  )
}
