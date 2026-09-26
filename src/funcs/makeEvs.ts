import type { Stats } from '@/constants/pokemon'
import { statNames } from '@/constants/stats'

export function makeEvs(): Stats {
    const entries = statNames.map((statName) => {
        return [statName, 0]
    })
    return Object.fromEntries(entries) as Stats
}
