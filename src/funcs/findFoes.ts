import type { Pokemon } from '@/constants/pokemon'
import { getNearbyPkms } from '@/funcs/getNearbyPkms'
import { startBattle } from '@/funcs/startBattle'
import { pick } from '@/utils/pick'

export function findFoes(pkm: Pokemon) {
    if (pkm.state === 'battle') return

    const { foes } = getNearbyPkms(pkm)
    if (foes.length === 0) return

    pkm.foe = pick(foes)

    startBattle(pkm)
}
