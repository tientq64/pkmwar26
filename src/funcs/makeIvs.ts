import { PMath } from '@/constants/consts'
import type { Stats } from '@/constants/pokemon'
import { statNames } from '@/constants/stats'

export function makeIvs(): Stats {
    const entries = statNames.map((statName) => {
        return [statName, PMath.RND.between(0, 31)]
    })
    return Object.fromEntries(entries) as Stats
}
