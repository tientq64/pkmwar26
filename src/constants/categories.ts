import data from '@/data/categories'
import { keyBy } from 'es-toolkit'

export const categories = [...data]

export type CategoryName = (typeof categories)[number]

export const categoriesMap = keyBy(categories, (category) => category.name)
