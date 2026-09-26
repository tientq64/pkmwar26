import type { Pokemon, Stats } from '@/constants/pokemon'
import { calcPkmStat } from '@/funcs/calcPkmStat'

export function makePkmStats(pkm: Pokemon): Stats {
    return {
        get hp() {
            return calcPkmStat(pkm, 'hp')
        },
        get atk() {
            return calcPkmStat(pkm, 'atk')
        },
        get def() {
            return calcPkmStat(pkm, 'def')
        },
        get spA() {
            return calcPkmStat(pkm, 'spA')
        },
        get spD() {
            return calcPkmStat(pkm, 'spD')
        },
        get spe() {
            return calcPkmStat(pkm, 'spe')
        },
    }
}
