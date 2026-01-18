import { useNavigate } from 'react-router-dom'
import { TableData, SortField, SortDirection } from '@/types'
import { TypeBadge } from './TypeBadge'
import { formatName } from '@/utils'

interface Props {
  pokemon: TableData[]
  sortField: SortField
  sortDirection: SortDirection
  onSort: (field: SortField) => void
}

export function PokemonTable({
  pokemon,
  sortField,
  sortDirection,
  onSort,
}: Props) {
  const navigate = useNavigate()

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) {
      return <span className="text-gray-300 ml-1">↕</span>
    }
    return (
      <span className="text-blue-600 ml-1">
        {sortDirection === 'asc' ? '↑' : '↓'}
      </span>
    )
  }

  const SortableHeader = ({
    field,
    children,
    className = '',
  }: {
    field: SortField
    children: React.ReactNode
    className?: string
  }) => (
    <th
      className={`px-4 py-4 text-left text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors ${className}`}
      onClick={() => onSort(field)}
      role="columnheader"
      aria-sort={
        sortField === field
          ? sortDirection === 'asc'
            ? 'ascending'
            : 'descending'
          : 'none'
      }
    >
      <button className="flex items-center focus:outline-none focus:ring-2 focus:ring-blue-500 rounded">
        {children}
        <SortIcon field={field} />
      </button>
    </th>
  )

  const handleRowClick = (id: number) => {
    navigate(`/pokemon/${id}`)
  }

  const handleKeyDown = (e: React.KeyboardEvent, id: number) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleRowClick(id)
    }
  }

  return (
    <div className="bg-white rounded-xl border-2 border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b-2 border-gray-200">
            <tr>
              <SortableHeader field="name" className="min-w-[200px]">
                Pokémon
              </SortableHeader>
              <th className="px-4 py-4 text-left text-sm font-semibold text-gray-700">
                Type(s)
              </th>
              <SortableHeader field="hp">HP</SortableHeader>
              <SortableHeader field="speed">Speed</SortableHeader>
              <th className="px-4 py-4 text-left text-sm font-semibold text-gray-700">
                Primary Ability
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {pokemon.map((poke) => (
              <tr
                key={poke.id}
                onClick={() => handleRowClick(poke.id)}
                onKeyDown={(e) => handleKeyDown(e, poke.id)}
                tabIndex={0}
                role="row"
                className="hover:bg-gray-50 cursor-pointer transition-colors focus:outline-none focus:bg-blue-50"
                aria-label={`View details for ${formatName(poke.name)}`}
              >
                {/* Pokemon Name + Sprite */}
                <td className="px-4 py-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      {poke.sprite ? (
                        <img
                          src={poke.sprite}
                          alt={`${poke.name} sprite`}
                          className="w-12 h-12 object-contain"
                          loading="lazy"
                        />
                      ) : (
                        <span className="text-gray-400 text-2xl">?</span>
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800 capitalize">
                        {formatName(poke.name)}
                      </p>
                      <p className="text-sm text-gray-500">
                        Base XP: {poke.baseExperience}
                      </p>
                    </div>
                  </div>
                </td>

                {/* Types */}
                <td className="px-4 py-4">
                  <div className="flex flex-wrap gap-2">
                    {poke.types.map((type) => (
                      <TypeBadge key={type} type={type} size="sm" />
                    ))}
                  </div>
                </td>

                {/* HP */}
                <td className="px-4 py-4">
                  <span className="font-bold text-gray-800">{poke.hp}</span>
                </td>

                {/* Speed */}
                <td className="px-4 py-4">
                  <span className="font-bold text-gray-800">{poke.speed}</span>
                </td>

                {/* Primary Ability */}
                <td className="px-4 py-4">
                  <span className="text-gray-600 capitalize">
                    {formatName(poke.primaryAbility)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
