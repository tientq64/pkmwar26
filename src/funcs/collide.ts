import { Pokemon } from '@/constants/pokemon'
import { idle } from '@/funcs/idle'

export function collide(pkm: Pokemon, target?: Pokemon) {
    if (pkm.state !== 'walk') return

    if (!target) {
        idle(pkm)
        return
    }
    if (pkm.team !== target.team) return

    pkm.facing = pkm.x < target.x ? 'right' : 'left'
    idle(pkm)
}
