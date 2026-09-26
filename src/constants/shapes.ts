import data from '@/data/shapes'
import { camelCase } from '@/utils/camelCase'

export const shapes = data.map((item) => camelCase(item.name))

export type ShapeName = (typeof shapes)[number]
