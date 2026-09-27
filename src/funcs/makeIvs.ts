import type { Stats } from '@/constants/pokemon'
import { statNames } from '@/constants/stats'
import { random } from '@/utils/random'

export function makeIvs(): Stats {
    const entries = statNames.map((statName) => {
        return [statName, random(31)]
    })
    return Object.fromEntries(entries) as Stats
}
