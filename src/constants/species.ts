import data from '@/data/species'
import { keyBy } from 'es-toolkit'

export const species = data.map((item, id) => ({
    ...item,
    id,
}))

export type Specy = (typeof data)[number]
export type SpecyName = Specy['name']

export const speciesMap = keyBy(species, (specy) => specy.name)
