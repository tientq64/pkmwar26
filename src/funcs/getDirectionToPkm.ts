import { PI_3_4, PI_4, PMath } from '@/constants/consts'
import type { Direction, Pokemon } from '@/constants/pokemon'

export function getDirectionToPkm(pkm: Pokemon, target: Pokemon): Direction {
    const angle = PMath.Angle.BetweenPoints(pkm, target)
    const absAngle = Math.abs(angle)

    if (absAngle <= PI_4) return 'right'
    if (absAngle >= PI_3_4) return 'left'
    if (angle < 0) return 'up'
    return 'down'
}
