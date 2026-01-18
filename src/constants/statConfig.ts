
export interface StatConfig {
    key: string
    label: string
    shortLabel: string
    color: string
    tailwindColor: string
    maxValue: number
}

export const statConfigs: StatConfig[] = [
    {
        key: 'hp',
        label: 'HP',
        shortLabel: 'HP',
        color: '#22c55e',
        tailwindColor: 'bg-green-500',
        maxValue: 255,
    },
    {
        key: 'attack',
        label: 'Attack',
        shortLabel: 'ATK',
        color: '#ef4444',
        tailwindColor: 'bg-red-500',
        maxValue: 190,
    },
    {
        key: 'defense',
        label: 'Defense',
        shortLabel: 'DEF',
        color: '#3b82f6',
        tailwindColor: 'bg-blue-500',
        maxValue: 230,
    },
    {
        key: 'special-attack',
        label: 'Special Attack',
        shortLabel: 'Sp. Atk',
        color: '#a855f7',
        tailwindColor: 'bg-purple-500',
        maxValue: 194,
    },
    {
        key: 'special-defense',
        label: 'Special Defense',
        shortLabel: 'Sp. Def',
        color: '#eab308',
        tailwindColor: 'bg-yellow-500',
        maxValue: 230,
    },
    {
        key: 'speed',
        label: 'Speed',
        shortLabel: 'SPD',
        color: '#ec4899',
        tailwindColor: 'bg-pink-500',
        maxValue: 200,
    },
]


export function getStatConfig(key: string | undefined | null): StatConfig | undefined {
    if (!key) return undefined
    
    const normalizedKey = key.toLowerCase().replace(/\s+/g, '-')
    return statConfigs.find((s) => s.key === normalizedKey)
  }
  

  export function getStatTailwindColor(key: string | undefined): string {
    if (!key) return 'bg-gray-500'
    const config = getStatConfig(key)
    return config?.tailwindColor || 'bg-gray-500'
  }
  
  
  export function getStatLabel(key: string | undefined): string {
    if (!key) return ''
    const config = getStatConfig(key)
    return config?.shortLabel || key
  }


export const statRatings = {
    low: { max: 50, label: 'Low', color: 'text-red-500' },
    medium: { max: 80, label: 'Average', color: 'text-yellow-500' },
    high: { max: 120, label: 'High', color: 'text-green-500' },
    excellent: { max: 255, label: 'Excellent', color: 'text-blue-500' },
}

export function getStatRatingConfig(value: number) {
    if (value < statRatings.low.max) return statRatings.low
    if (value < statRatings.medium.max) return statRatings.medium
    if (value < statRatings.high.max) return statRatings.high
    return statRatings.excellent
}