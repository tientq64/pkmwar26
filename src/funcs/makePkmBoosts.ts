import type { Boosts } from '@/constants/pokemon'

export function makePkmBoosts(): Boosts {
    return {
        atk: 0,
        def: 0,
        spA: 0,
        spD: 0,
        spe: 0,
        acc: 0,
        eva: 0,
    }
}
