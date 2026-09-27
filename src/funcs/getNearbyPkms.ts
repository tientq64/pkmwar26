import { PMath } from '@/constants/consts'
import { pkms } from '@/constants/pkms'
import type { Pokemon } from '@/constants/pokemon'

export interface NearbyPkmsGroup {
    targets: Pokemon[]
    foes: Pokemon[]
    allies: Pokemon[]
    alliesAndSelf: Pokemon[]
    all: Pokemon[]
}

export function getNearbyPkms(pkm: Pokemon, maxDistance = 100): NearbyPkmsGroup {
    const targets: Pokemon[] = []
    const foes: Pokemon[] = []
    const allies: Pokemon[] = []

    for (const pkmB of pkms.children as Set<Pokemon>) {
        if (pkmB.health === 0) continue
        if (pkmB.id === pkm.id) continue

        const distance = PMath.Distance.BetweenPoints(pkm, pkmB) - pkm.radius - pkmB.radius
        if (distance > maxDistance) continue

        if (pkmB.team === pkm.team) {
            if (allies.length < 2) {
                allies.push(pkmB)
            }
        } else {
            if (foes.length < 3) {
                foes.push(pkmB)
            }
        }
        targets.push(pkmB)
        if (targets.length === 5) break
    }
    const alliesAndSelf: Pokemon[] = [...allies, pkm]
    const all: Pokemon[] = [...targets, pkm]

    return { targets, foes, allies, alliesAndSelf, all }
}
