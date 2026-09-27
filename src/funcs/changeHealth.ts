import { PMath } from '@/constants/consts'
import type { Pokemon } from '@/constants/pokemon'

export function changeHealth(pkm: Pokemon, amount: number): number {
    if (pkm.health === 0) return 0

    const prevHealth = pkm.health

    pkm.health = PMath.Clamp(pkm.health + amount, 0, pkm.stats.hp)

    if (pkm.health === 0) {
        pkm.filter.grayscale()
    }
    return pkm.health - prevHealth
}
