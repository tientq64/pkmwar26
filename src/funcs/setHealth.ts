import { PMath } from '@/constants/consts'
import type { Pokemon } from '@/constants/pokemon'

export function setHealth(pkm: Pokemon, amount: number) {
    if (pkm.health === 0) return

    pkm.health += amount
    pkm.health = PMath.Clamp(pkm.health, 0, pkm.stats.hp)

    if (pkm.health === 0) {
        pkm.enableFilters()
        pkm.filters?.internal.addColorMatrix().colorMatrix.grayscale(1)
    }
}
