import { PMath } from '@/constants/consts'
import type { Pokemon, VolatileStatuses } from '@/constants/pokemon'
import { nonInBattleStageStatNames, stageStatNames } from '@/constants/stats'
import { type AilmentName, type VolatileStatusName } from '@/constants/statuses'
import { typesMap } from '@/constants/types'
import { addMoveEffect } from '@/funcs/addMoveEffect'
import { addPkmEffect } from '@/funcs/addPkmEffect'
import { calcMultiplierAcc } from '@/funcs/calcMultiplierAcc'
import { chance } from '@/funcs/chance'
import { die } from '@/funcs/die'
import { endBattle } from '@/funcs/endBattle'
import { getNearbyPkms } from '@/funcs/getNearbyPkms'
import { makePkmStages } from '@/funcs/makePkmStages'
import { setHealth } from '@/funcs/setHealth'
import { pick } from '@/utils/pick'
import { random } from '@/utils/random'
import { wait } from '@/utils/wait'
import { includes } from 'es-toolkit/compat'

export async function takeTurn(pkm: Pokemon) {
    if (pkm.health === 0) {
        die(pkm)
        return
    }

    if (!pkm.foe) return

    const nearby = getNearbyPkms(pkm)
    if (!nearby.foes.includes(pkm.foe)) {
        endBattle(pkm)
        return
    }

    const { volatileStatuses } = pkm

    const moveSlot = pick(pkm.moveSlots)
    const { move } = moveSlot

    let { confusion } = volatileStatuses
    const isConfusionSelfHit = confusion && chance(33)

    if (!isConfusionSelfHit) {
        moveSlot.pp--
    }

    await wait(100)

    let foes = [pkm.foe]

    if (isConfusionSelfHit) foes = [pkm]

    let { desc } = move

    if (isConfusionSelfHit) desc = 'No additional effect.'

    await Promise.all(
        foes.map(async (foe) => {
            const abilityDesc = pkm.ability.desc
            const foeAbilityDesc = foe.ability.desc

            let { category } = move

            if (isConfusionSelfHit) category = 'physical'

            let moveType = move.type

            let { accuracy } = move

            if (isConfusionSelfHit) accuracy = true

            if (accuracy !== true) {
                switch (abilityDesc) {
                    case "This Pokemon's moves have their accuracy multiplied by 1.3.":
                        accuracy *= 1.3
                        break
                    case "This Pokemon's Attack is 1.5x and accuracy of its physical attacks is 0.8x.":
                        if (category === 'physical') accuracy *= 0.8
                        break
                }
                switch (desc) {
                    case 'This move does not check accuracy.':
                        accuracy = true
                        break
                }
            }

            const multiplierAcc = calcMultiplierAcc(pkm, foe)
            let otherAcc = 1

            let hitChance = 100

            if (accuracy !== true) {
                hitChance = accuracy * multiplierAcc * otherAcc
            }

            let level = pkm.level

            let power: number = move.basePower

            switch (desc) {
                case "Less power as user's HP decreases. Hits foe(s).":
                    power = Math.max(Math.floor((pkm.health * 150) / pkm.stats.hp), 1)
                    break
                case 'More power the heavier the target.': {
                    const { weight } = foe.form
                    if (weight < 10) power = 20
                    else if (weight < 25) power = 40
                    else if (weight < 50) power = 60
                    else if (weight < 100) power = 80
                    else if (weight < 200) power = 100
                    else power = 120
                    break
                }
            }

            let { atk, spA } = pkm.stats

            switch (abilityDesc) {
                case "This Pokemon's Attack is doubled.":
                    atk *= 2
                    break
                case "This Pokemon's Attack is 1.5x and accuracy of its physical attacks is 0.8x.":
                    atk *= 1.5
                    break
            }

            let attack = category === 'physical' ? atk : spA

            let { def, spD } = foe.stats

            let defend = category === 'physical' ? def : spD

            let targets = foes.length > 1 ? 0.75 : 1
            let pb = 1
            let weather = 1
            let glaiveRush = 1
            let critical = 1
            let rand = PMath.RND.between(85, 100) / 100

            let stab = includes(pkm.form.types, moveType) ? 1.5 : 1

            if (isConfusionSelfHit) stab = 1

            let efficacy = foe.form.types.reduce((total, type) => {
                return total * typesMap[moveType].efficacies[type]
            }, 1)
            let burn = 1
            let other = 1

            let damage = 0

            if (category === 'status') {
            } else {
                damage =
                    ((((2 * level) / 5 + 2) * power * (attack / defend)) / 50 + 2) *
                    targets *
                    pb *
                    weather *
                    glaiveRush *
                    critical *
                    rand *
                    stab *
                    efficacy *
                    burn *
                    other
            }

            switch (desc) {
                case 'Always does 20 HP of damage.':
                    if (efficacy) damage = 20
                    break
                case "Does damage equal to the user's level.":
                    damage = level
                    break
                case 'OHKOs the target. Fails if user is a lower level.':
                    damage = 1e4
                    break
            }
            switch (foeAbilityDesc) {
                case 'This Pokemon can only be damaged by supereffective moves and indirect damage.':
                    if (efficacy <= 1) damage = 0
                    break
            }

            let hpHeal = 0

            let hpLoss = 0

            switch (desc) {
                case 'OHKOs the target. Fails if user is a lower level.':
                    hitChance = level < foe.level ? 0 : level - foe.level + 30
                    break
            }

            let hasHit = chance(hitChance)

            switch (desc) {
                case "1/8 of target's HP is restored to user every turn.":
                    hpHeal = Math.floor(foe.stats.hp / 8)
                    break
            }

            switch (desc) {
                case 'User is hurt by 50% of its max HP if it misses.':
                    if (!hasHit) hpLoss = Math.floor(pkm.health / 2)
                    break
                case 'Has 1/4 recoil.':
                    if (damage) hpLoss = Math.max(Math.floor(damage / 4), 1)
                    break
                case 'Has 33% recoil.':
                    if (damage) hpLoss = Math.max(Math.floor(damage / 3), 1)
                    break
            }

            switch (move.name) {
                case 'flamethrower':
                    addMoveEffect(pkm, [
                        {
                            frame: 2,
                            quantity: 5,
                            foe,
                            burst: [12],
                            alpha: [0.1, 0.8],
                        },
                        {
                            movementY: -24,
                            alpha: 0,
                        },
                    ])
                    break
                case 'thunderbolt':
                    addMoveEffect(pkm, [
                        {
                            frame: 3,
                            quantity: 5,
                            foe,
                            burst: [12],
                            rotateToMovement: true,
                            alpha: [0.1, 0.8],
                        },
                        {
                            burst: 32,
                            rotateToMovement: true,
                            alpha: 0,
                        },
                    ])
                    break
                case 'fissure':
                    addMoveEffect(pkm, [
                        {
                            frame: 5,
                            quantity: 5,
                            foe,
                            burst: [12],
                            toPositionRatio: (i, total) => (i + 1) / total,
                            rotateToMovement: true,
                            skipMovementAnim: true,
                            alpha: [0.8, 0.1],
                        },
                    ])
                    break
                case 'blueFlare':
                    addMoveEffect(pkm, [
                        {
                            frame: 6,
                            quantity: 5,
                            foe,
                            burst: [12],
                            alpha: [0.1, 0.8],
                            scale: [4, 5],
                        },
                        {
                            movementY: -32,
                            alpha: 0,
                        },
                    ])
                    break
                case 'boltStrike':
                    addPkmEffect(pkm, foe, {
                        tackle: true,
                    })
                    break
            }

            await wait(1500)

            switch (foeAbilityDesc) {
                case 'If this Pokemon is at full HP, it survives one hit with at least 1 HP. Immune to OHKO.':
                    if (foe.health === foe.stats.hp && foe.health - damage < 1) {
                        damage = foe.health - 1
                    }
                    break
            }

            if (hasHit) {
                if (damage) {
                    setHealth(foe, -damage)
                }
                if (hpHeal) {
                    setHealth(pkm, hpHeal)
                }
                if (hpLoss) {
                    setHealth(pkm, -hpLoss)
                }
            }

            const selfStageChanges = makePkmStages()

            switch (desc) {
                case "Raises the user's Attack by 2.":
                    selfStageChanges.atk += 2
                    break
                case "Raises user's Attack by 3 if this KOes the target.":
                    if (!foe.health) selfStageChanges.atk += 3
                    break
                case "20% chance to raise the user's Attack by 1.":
                    if (chance(20)) selfStageChanges.atk++
                    break
                case "Lowers the user's Sp. Atk by 2.":
                    selfStageChanges.spA -= 2
                    break
                case '10% chance to raise all stats by 1 (not acc/eva).':
                    if (chance(10)) {
                        for (const name of nonInBattleStageStatNames) {
                            selfStageChanges[name]++
                        }
                    }
                    break
                case "Raises the user's Sp. Atk by 2.":
                    selfStageChanges.spA += 2
                    break
                case "Raises the user's Defense and Sp. Def by 1.":
                    selfStageChanges.def++
                    selfStageChanges.spD++
                    break
                case "Raises the user's Speed by 2.":
                    selfStageChanges.spe += 2
                    break
                case "Lowers the user's Defense, Sp. Def, Speed by 1.":
                    selfStageChanges.def--
                    selfStageChanges.spD--
                    selfStageChanges.spe--
                    break
            }

            const foeStageChanges = makePkmStages()

            switch (desc) {
                case 'Lowers the foe(s) Attack by 1.':
                    foeStageChanges.atk--
                    break
                case "10% chance to lower the target's Attack by 1.":
                    if (chance(10)) foeStageChanges.atk--
                    break
                case 'Lowers the foe(s) Defense by 1.':
                    foeStageChanges.def--
                    break
                case "50% chance to lower the target's Defense by 1.":
                    if (chance()) foeStageChanges.def--
                    break
                case "10% chance to lower the target's Sp. Def by 1.":
                case '10% chance to lower the foe(s) Sp. Def by 1.':
                    if (chance(10)) foeStageChanges.spD--
                    break
                case "Lowers the target's Sp. Def by 2.":
                    foeStageChanges.spD -= 2
                    break
                case "100% chance to lower the target's Speed by 1.":
                    foeStageChanges.spe--
                    break
                case "10% chance to lower the target's Speed by 1.":
                    if (chance(10)) foeStageChanges.spe--
                    break
                case "Lowers the target's Attack and Defense by 1.":
                    foeStageChanges.atk--
                    foeStageChanges.def--
                    break
                case "Lowers the target's accuracy by 1.":
                    foeStageChanges.acc--
                    break
                case "30% chance to lower the target's accuracy by 1.":
                    if (chance(30)) foeStageChanges.acc--
                    break
            }

            let selfAilment: AilmentName | undefined = undefined

            let foeAilment: AilmentName | undefined = undefined

            switch (desc) {
                case '10% chance to burn the target.':
                case '10% chance to burn. 10% chance to flinch.':
                    if (chance(10)) foeAilment = 'burn'
                    break
                case '20% chance to burn the target.':
                    if (chance(20)) foeAilment = 'burn'
                    break
                case '30% chance to burn adjacent Pokemon.':
                    if (chance(30)) foeAilment = 'burn'
                    break
                case '10% chance to paralyze the target.':
                case '10% chance to paralyze. 10% chance to flinch.':
                    if (chance(10)) foeAilment = 'paralysis'
                    break
                case '20% chance to paralyze the target.':
                    if (chance(20)) foeAilment = 'paralysis'
                    break
                case '30% chance to paralyze the target.':
                case '30% chance to paralyze adjacent Pokemon.':
                    if (chance(30)) foeAilment = 'paralysis'
                    break
                case '10% chance to freeze the target.':
                case '10% chance to freeze. 10% chance to flinch.':
                    if (chance(10)) foeAilment = 'freeze'
                    break
                case '30% chance to poison the target.':
                    if (chance(30)) foeAilment = 'poison'
                    break
                case '50% chance to badly poison the target.':
                    if (chance()) foeAilment = 'badlyPoisoned'
                    break
                case 'Causes the target to fall asleep.':
                    foeAilment = 'sleep'
                    break
            }

            const selfVolatileStatuses: VolatileStatuses = {}

            const foeVolatileStatuses: VolatileStatuses = {}

            switch (desc) {
                case 'Causes the target to become confused.':
                    foeVolatileStatuses.confusion = { turns: random(2, 5) }
                    break
                case '10% chance to confuse the target.':
                    if (chance(10)) foeVolatileStatuses.confusion = { turns: random(2, 5) }
                    break
                case '20% chance to confuse the target.':
                    if (chance(20)) foeVolatileStatuses.confusion = { turns: random(2, 5) }
                    break
                case '10% chance to burn. 10% chance to flinch.':
                case '10% chance to paralyze. 10% chance to flinch.':
                case '10% chance to freeze. 10% chance to flinch.':
                    if (chance(10)) foeVolatileStatuses.flinch = true
                    break
                case '20% chance to make the target flinch.':
                    if (chance(20)) foeVolatileStatuses.flinch = true
                    break
                case '30% chance to make the target flinch.':
                    if (chance(30)) foeVolatileStatuses.flinch = true
                    break
            }

            for (const statName of stageStatNames) {
                const selfChange = selfStageChanges[statName]
                pkm.stages[statName] = PMath.Clamp(pkm.stages[statName] + selfChange, -6, 6)

                const foeChange = foeStageChanges[statName]
                foe.stages[statName] = PMath.Clamp(foe.stages[statName] + foeChange, -6, 6)
            }

            if (selfAilment) {
                if (!pkm.ailment) {
                    pkm.ailment = selfAilment
                }
            }
            if (foeAilment) {
                if (!foe.ailment) {
                    foe.ailment = foeAilment
                }
            }

            for (const name in selfVolatileStatuses) {
                const statusName = name as VolatileStatusName
                pkm.volatileStatuses[statusName] = selfVolatileStatuses[statusName] as any
            }
            for (const name in foeVolatileStatuses) {
                const statusName = name as VolatileStatusName
                foe.volatileStatuses[statusName] = foeVolatileStatuses[statusName] as any
            }
        }),
    )

    await wait(500)

    if (confusion) {
        confusion.turns--
        if (!confusion.turns) delete volatileStatuses.confusion
    }

    await wait(100)

    takeTurn(pkm)
}
