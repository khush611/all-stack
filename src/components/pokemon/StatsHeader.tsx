import { CollectionStats, TypeName } from '@/types'
import { TYPE_COLORS, TYPE_ICONS } from '@/constants'
import { formatName } from '@/utils'

interface Props {
    stats: CollectionStats
    totalInCollection: number
}

export function StatsHeader({ stats, totalInCollection }: Props) {
    // get top 3 types by percentage
    const topTypes = Object.entries(stats.typeDistribution)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 3) as [TypeName, number][]

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* Total Pokemon */}
            <div className="bg-white rounded-xl border-2 border-gray-200 p-6 text-center">
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">
                    Total Pokémon
                </p>
                <p className="text-4xl font-bold text-gray-800">{totalInCollection}</p>
                <p className="text-sm text-gray-500 mt-1">in collection</p>
            </div>

            {/* Average HP */}
            <div className="bg-white rounded-xl border-2 border-gray-200 p-6 text-center">
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">
                    Average HP
                </p>
                <p className="text-4xl font-bold text-gray-800">{stats.averageHp}</p>
                <p className="text-sm text-gray-500 mt-1">in current view</p>
            </div>

            {/* type distribution */}
            <div className="bg-white rounded-xl border-2 border-gray-200 p-6 text-center">
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-3">
                    Type Distribution
                </p>
                <div className="flex justify-center gap-2 flex-wrap">
                    {topTypes.map(([type, percentage]) => (
                        <span
                            key={type}
                            className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs text-white ${TYPE_COLORS[type]}`}
                        >
                            <span aria-hidden="true">{TYPE_ICONS[type]}</span>
                            <span>{percentage}%</span>
                        </span>
                    ))}
                </div>
            </div>

            {/* Most Powerful */}
            <div className="bg-white rounded-xl border-2 border-gray-200 p-6 text-center">
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">
                    Most Powerful
                </p>
                {stats.mostPowerful ? (
                    <>
                        <p className="text-2xl font-bold text-gray-800 capitalize">
                            {formatName(stats.mostPowerful.name)}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                            Score: {stats.mostPowerful.score}
                        </p>
                    </>
                ) : (
                    <p className="text-gray-400">N/A</p>
                )}
            </div>
        </div>
    )
}
