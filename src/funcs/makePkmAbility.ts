import { abilitiesMap, type Ability } from '@/constants/abilities'
import type { Pokemon } from '@/constants/pokemon'
import { pick } from '@/utils/pick'

export function makePkmAbility(pkm: Pokemon): Ability {
    const regularPkmAbilities = pkm.form.abilities.filter((ability) => !ability.isHidden)

    const pkmAbility = pick(regularPkmAbilities)

    return abilitiesMap[pkmAbility.name]
}
