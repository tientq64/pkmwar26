import data from '@/data/stats'

export const allStats = [...data]
export const stats = data.filter((stat) => stat.isPermanent)
export const inBattleStats = data.filter((stat) => !stat.isPermanent)
export const boostStats = data.filter((stat) => stat.name !== 'hp')
export const nonInBattleBoostStats = data.filter((stat) => {
    return stat.name !== 'hp' && stat.name !== 'acc' && stat.name !== 'eva'
})

export const allStatNames = allStats.map((stat) => stat.name)
export const statNames = stats.map((stat) => stat.name)
export const inBattleStatNames = inBattleStats.map((stat) => stat.name)
export const boostNames = boostStats.map((stat) => stat.name)
export const nonInBattleBoostNames = nonInBattleBoostStats.map((stat) => stat.name)

export type AllStatName = (typeof allStatNames)[number]
export type StatName = (typeof statNames)[number]
export type InBattleStatName = (typeof inBattleStatNames)[number]
export type BoostName = (typeof boostNames)[number]
export type NonInBattleBoostName = (typeof nonInBattleBoostNames)[number]
