import { PMath } from '@/constants/consts'
import type { Pokemon } from '@/constants/pokemon'
import { getNearbyPkms } from '@/funcs/getNearbyPkms'

export interface PkmTargetsGroup {
    normal: Pokemon[]
    allAdjacentFoes: Pokemon[]
    self: Pokemon[]
    any: Pokemon[]
    randomNormal: Pokemon[]
    allySide: Pokemon[]
    allAdjacent: Pokemon[]
    scripted: Pokemon[]
    all: Pokemon[]
    foeSide: Pokemon[]
    allyTeam: Pokemon[]
    adjacentAlly: Pokemon[]
    allies: Pokemon[]
    adjacentAllyOrSelf: Pokemon[]
    adjacentFoe: Pokemon[]
}

export function getPkmTargetsGroup(pkm: Pokemon): PkmTargetsGroup {
    const { pick } = PMath.RND

    const { targets, foes, allies, alliesAndSelf, all } = getNearbyPkms(pkm)

    return {
        normal: [pick(foes)],
        allAdjacentFoes: foes,
        self: [pkm],
        any: [pick(targets)],
        randomNormal: [pick(foes)],
        allySide: alliesAndSelf,
        allAdjacent: targets,
        scripted: [],
        all: targets.concat(pkm),
        foeSide: foes,
        allyTeam: alliesAndSelf,
        adjacentAlly: [pick(allies)],
        allies: alliesAndSelf,
        adjacentAllyOrSelf: [pick(alliesAndSelf)],
        adjacentFoe: [pick(foes)],
    }
}
