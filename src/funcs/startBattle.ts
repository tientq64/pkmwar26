import type { Pokemon } from '@/constants/pokemon'
import { stopMove } from '@/funcs/stopMove'
import { takeTurn } from '@/funcs/takeTurn'

export function startBattle(pkm: Pokemon) {
    if (pkm.state === 'battle') return

    clearTimeout(pkm.idleTimer)
    clearTimeout(pkm.walkTimer)

    pkm.state = 'battle'

    stopMove(pkm)
    takeTurn(pkm)
}
