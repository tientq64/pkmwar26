import data from '@/data/statuses'

export const statuses = [...data]
export const ailments = statuses.filter((status) => status.isAilment)
export const volatileStatuses = statuses.filter((status) => !status.isAilment)

export type Status = (typeof statuses)[number]
export type Ailment = (typeof ailments)[number]
export type VolatileStatus = (typeof volatileStatuses)[number]

export type StatusName = Status['name']
export type AilmentName = Ailment['name']
export type VolatileStatusName = VolatileStatus['name']
