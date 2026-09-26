import type { Stages } from '@/constants/pokemon'

export function makePkmStages(): Stages {
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
