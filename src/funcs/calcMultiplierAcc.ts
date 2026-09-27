import { PMath } from '@/constants/consts'
import type { Pokemon } from '@/constants/pokemon'

export function calcMultiplierAcc(pkm: Pokemon, foe: Pokemon): number {
    const stage = PMath.Clamp(pkm.boosts.acc - foe.boosts.eva, -6, 6)

    return stage >= 0 ? (3 + stage) / 3 : 3 / (3 - stage)
}
