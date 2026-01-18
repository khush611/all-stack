// little colored pill that shows pokemon type (fire, water, etc)

import { TypeName } from '@/types'
import { TYPE_COLORS, TYPE_ICONS } from '@/constants'
import { formatName } from '@/utils'

interface Props {
    type: TypeName
    showIcon?: boolean
    size?: 'sm' | 'md' | 'lg'
}

// tailwind classes for different sizes
const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base',
}

export function TypeBadge({ type, showIcon = true, size = 'md' }: Props) {
    return (
        <span
            className={`
        inline-flex items-center gap-1.5 rounded-full font-medium text-white
        ${TYPE_COLORS[type]} ${sizeClasses[size]}
      `}
            role="img"
            aria-label={`${type} type`}
        >
            {showIcon && <span aria-hidden="true">{TYPE_ICONS[type]}</span>}
            <span className="capitalize">{formatName(type)}</span>
        </span>
    )
}