import { PMath } from '@/constants/consts'
import type { Pokemon } from '@/constants/pokemon'
import type { BoostName } from '@/constants/stats'

export function changeBoost(pkm: Pokemon, boostName: BoostName, amount: number): number {
    const { boosts } = pkm
    const prevBoost = boosts[boostName]

    boosts[boostName] = PMath.Clamp(boosts[boostName] + amount, -6, 6)

    return boosts[boostName] - prevBoost
}
