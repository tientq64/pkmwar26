import { PMath } from '@/constants/consts'
import type { Pokemon } from '@/constants/pokemon'
import { stopMove } from '@/funcs/stopMove'
import { walk } from '@/funcs/walk'

export function idle(pkm: Pokemon) {
    clearTimeout(pkm.idleTimer)
    clearTimeout(pkm.walkTimer)

    pkm.state = 'idle'

    stopMove(pkm)

    const idleTime = PMath.RND.between(100, 2000)

    pkm.idleTimer = setTimeout(walk, idleTime, pkm)
}
