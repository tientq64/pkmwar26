import type { Pokemon } from '@/constants/pokemon'
import type { StatName } from '@/constants/stats'

export function calcPkmStat(pkm: Pokemon, statName: StatName): number {
    const base = pkm.form.stats[statName].base
    const iv = pkm.ivs[statName]
    const ev = pkm.evs[statName]
    const level = pkm.level
    const nature = 1

    if (statName === 'hp') {
        if (pkm.ability.name === 'wonderGuard') {
            return 1
        }
        return ((2 * base + iv + ev / 4) * level) / 100 + level + 10
    } else {
        return (((2 * base + iv + ev / 4) * level) / 100 + 5) * nature
    }
}
