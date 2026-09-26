import data from '@/data/colors'

export const colors = data.map((item) => item.name)

export type ColorName = (typeof colors)[number]
