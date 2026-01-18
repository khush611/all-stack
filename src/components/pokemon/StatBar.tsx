import { getStatColor, getStatWidth } from '@/utils'

interface Props {
  name: string
  value: number
  maxValue?: number
}

export function StatBar({ name, value, maxValue = 255 }: Props) {
  return (
    <div className="flex items-center gap-4">
      <span className="w-24 text-sm font-medium text-gray-600 flex-shrink-0">
        {name}
      </span>
      <div
        className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden"
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={maxValue}
        aria-label={`${name}: ${value}`}
      >
        <div
          className={`h-full rounded-full transition-all duration-500 ${getStatColor(value)}`}
          style={{ width: getStatWidth(value, maxValue) }}
        />
      </div>
      <span className="w-10 text-right font-bold text-gray-800">{value}</span>
    </div>
  )
}
