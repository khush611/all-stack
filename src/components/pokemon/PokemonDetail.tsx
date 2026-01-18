import { Link } from 'react-router-dom'
import { DetailData } from '@/types'
import { TypeBadge } from './TypeBadge'
import { StatBar } from './StatBar'
import { TYPE_GRADIENTS } from '@/constants'
import {
    formatId,
    formatName,
    formatHeight,
    formatWeight,
} from '@/utils'

interface Props {
    pokemon: DetailData
}

export function PokemonDetail({ pokemon }: Props) {
    // grab first type for the gradient background
    const primaryType = pokemon.types[0] || 'normal'

    return (
        <article className="max-w-6xl mx-auto" data-testid="pokemon-detail">
            {/* link back to the list */}
            <Link
                to="/"
                className="inline-flex items-center gap-2 mb-6 text-gray-600 hover:text-gray-900 
                   transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
            >
                <span aria-hidden="true">←</span>
                <span>Back to Collection</span>
            </Link>

            <div className="bg-white rounded-xl border-2 border-gray-200 overflow-hidden">
                {/* hero section with name and big artwork */}
                <header
                    className={`relative p-8 bg-gradient-to-br ${TYPE_GRADIENTS[primaryType]}`}
                >
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                        <div>
                            <h1 className="text-4xl font-bold text-gray-800 capitalize mb-2">
                                {formatName(pokemon.name)}
                            </h1>
                            <p className="text-xl text-gray-600">{formatId(pokemon.id)}</p>
                        </div>

                        <div className="w-36 h-36 bg-white/80 rounded-full flex items-center justify-center shadow-lg">
                            {pokemon.artwork || pokemon.sprite ? (
                                <img
                                    src={pokemon.artwork || pokemon.sprite || ''}
                                    alt={`${pokemon.name} official artwork`}
                                    className="w-28 h-28 object-contain"
                                />
                            ) : (
                                <span className="text-6xl text-gray-300">?</span>
                            )}
                        </div>
                    </div>
                </header>

                {/* two column table on desktop */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
                    {/* left side - types, abilities, traits, evolutions */}
                    <div className="space-y-8">
                        {/* type badges */}
                        <section aria-labelledby="types-heading">
                            <h2
                                id="types-heading"
                                className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3"
                            >
                                Type
                            </h2>
                            <div className="flex flex-wrap gap-2">
                                {pokemon.types.map((type) => (
                                    <TypeBadge key={type} type={type} size="lg" />
                                ))}
                            </div>
                        </section>

                        {/* abilities - dashed border = hidden ability */}
                        <section aria-labelledby="abilities-heading">
                            <h2
                                id="abilities-heading"
                                className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3"
                            >
                                Abilities
                            </h2>
                            <div className="flex flex-wrap gap-2">
                                {pokemon.abilities.map((ability) => (
                                    <span
                                        key={ability.name}
                                        className={`px-4 py-2 rounded-full border-2 capitalize ${ability.isHidden
                                                ? 'border-dashed border-gray-400 text-gray-500'
                                                : 'border-gray-300 text-gray-700'
                                            }`}
                                    >
                                        {formatName(ability.name)}
                                        {ability.isHidden && (
                                            <span className="ml-1 text-xs">(Hidden)</span>
                                        )}
                                    </span>
                                ))}
                            </div>
                        </section>

                        {/* height, weight, base exp */}
                        <section aria-labelledby="traits-heading">
                            <h2
                                id="traits-heading"
                                className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3"
                            >
                                Physical Traits
                            </h2>
                            <div className="grid grid-cols-3 gap-4">
                                <div className="p-4 border-2 border-gray-200 rounded-lg text-center">
                                    <p className="text-2xl font-bold text-gray-800">
                                        {formatHeight(pokemon.height)}
                                    </p>
                                    <p className="text-xs text-gray-500 uppercase mt-1">Height</p>
                                </div>
                                <div className="p-4 border-2 border-gray-200 rounded-lg text-center">
                                    <p className="text-2xl font-bold text-gray-800">
                                        {formatWeight(pokemon.weight)}
                                    </p>
                                    <p className="text-xs text-gray-500 uppercase mt-1">Weight</p>
                                </div>
                                <div className="p-4 border-2 border-gray-200 rounded-lg text-center">
                                    <p className="text-2xl font-bold text-gray-800">
                                        {pokemon.baseExperience}
                                    </p>
                                    <p className="text-xs text-gray-500 uppercase mt-1">Base Exp</p>
                                </div>
                            </div>
                        </section>

                        {/* evolution chain - only show if pokemon evolves */}
                        {pokemon.evolutionChain.length > 1 && (
                            <section aria-labelledby="evolution-heading">
                                <h2
                                    id="evolution-heading"
                                    className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3"
                                >
                                    Evolution Chain
                                </h2>
                                <div className="flex items-center gap-4 overflow-x-auto py-4">
                                    {pokemon.evolutionChain.map((evo, index) => (
                                        <div key={evo.name} className="flex items-center gap-4">
                                            {/* arrow between each stage */}
                                            {index > 0 && (
                                                <span className="text-2xl text-gray-300" aria-hidden="true">
                                                    →
                                                </span>
                                            )}
                                            <Link
                                                to={`/pokemon/${evo.id}`}
                                                className={`text-center group ${evo.id === pokemon.id ? 'ring-2 ring-blue-500 rounded-lg' : ''
                                                    }`}
                                            >
                                                <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center mb-2 group-hover:bg-gray-200 transition-colors">
                                                    {evo.sprite ? (
                                                        <img
                                                            src={evo.sprite}
                                                            alt={`${evo.name} sprite`}
                                                            className="w-16 h-16 object-contain"
                                                        />
                                                    ) : (
                                                        <span className="text-2xl text-gray-400">?</span>
                                                    )}
                                                </div>
                                                <p className="text-sm text-gray-600 capitalize group-hover:text-gray-900">
                                                    {formatName(evo.name)}
                                                </p>
                                            </Link>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>

                    {/* right side - stats with bars */}
                    <div>
                        <section aria-labelledby="stats-heading">
                            <h2
                                id="stats-heading"
                                className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4"
                            >
                                Base Stats
                            </h2>
                            <div className="space-y-4">
                                <StatBar name="HP" value={pokemon.stats.hp} />
                                <StatBar name="Attack" value={pokemon.stats.attack} />
                                <StatBar name="Defense" value={pokemon.stats.defense} />
                                <StatBar name="Sp. Attack" value={pokemon.stats.specialAttack} />
                                <StatBar name="Sp. Defense" value={pokemon.stats.specialDefense} />
                                <StatBar name="Speed" value={pokemon.stats.speed} />
                            </div>

                            {/* sum of all stats */}
                            <div className="mt-6 pt-4 border-t-2 border-gray-200">
                                <div className="flex justify-between items-center">
                                    <span className="font-semibold text-gray-700">Total</span>
                                    <span className="text-2xl font-bold text-gray-800">
                                        {Object.values(pokemon.stats).reduce((a, b) => a + b, 0)}
                                    </span>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>

                {/* moves list - scrollable if too many */}
                <div className="px-8 pb-8">
                    <section aria-labelledby="moves-heading">
                        <h2
                            id="moves-heading"
                            className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3"
                        >
                            Moves
                        </h2>
                        <div className="max-h-72 overflow-y-auto space-y-2 pr-2">
                            {pokemon.moves.map((move) => (
                                <div
                                    key={move.name}
                                    className="flex items-center justify-between p-3 border-2 border-gray-200 rounded-lg w-full"
                                >
                                    <span className="text-gray-800 capitalize">
                                        {formatName(move.name)}
                                    </span>
                                    <TypeBadge type={move.type} size="sm" showIcon={false} />
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </div>
        </article>
    )
}