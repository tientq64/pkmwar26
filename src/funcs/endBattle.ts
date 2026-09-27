import type { Pokemon } from '@/constants/pokemon'
import { die } from '@/funcs/die'
import { idle } from '@/funcs/idle'

export function endBattle(pkm: Pokemon) {
    if (pkm.state !== 'battle') return

    if (pkm.health === 0) {
        die(pkm)
        return
    }

    idle(pkm)
}
