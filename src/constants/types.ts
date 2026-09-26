import data from '@/data/types'
import { keyBy } from 'es-toolkit'

export const types = [...data]

export type TypeName = (typeof types)[number]['name']

export const typesMap = keyBy(types, (type) => type.name)
