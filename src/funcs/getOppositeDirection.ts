import type { Direction } from '@/constants/pokemon'

export function getOppositeDirection(direction: Direction): Direction {
    if (direction === 'left') return 'right'
    if (direction === 'right') return 'left'
    if (direction === 'up') return 'down'
    return 'up'
}
