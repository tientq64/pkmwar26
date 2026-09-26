import data from '@/data/abilities'
import { keyBy } from 'es-toolkit'

export const abilities = [...data]

export type Ability = (typeof data)[number]
export type AbilityName = Ability['name']

export const abilitiesMap = keyBy(abilities, (ability) => ability.name)
