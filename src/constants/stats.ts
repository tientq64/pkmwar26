import data from '@/data/stats'

export const allStats = [...data]
export const stats = data.filter((stat) => stat.isPermanent)
export const inBattleStats = data.filter((stat) => !stat.isPermanent)
export const stageStats = data.filter((stat) => stat.name !== 'hp')
export const nonInBattleStageStats = data.filter((stat) => {
    return stat.name !== 'hp' && stat.name !== 'acc' && stat.name !== 'eva'
})

export const allStatNames = allStats.map((stat) => stat.name)
export const statNames = stats.map((stat) => stat.name)
export const inBattleStatNames = inBattleStats.map((stat) => stat.name)
export const stageStatNames = stageStats.map((stat) => stat.name)
export const nonInBattleStageStatNames = nonInBattleStageStats.map((stat) => stat.name)

export type AllStatName = (typeof allStatNames)[number]
export type StatName = (typeof statNames)[number]
export type InBattleStatName = (typeof inBattleStatNames)[number]
export type StageStatName = (typeof stageStatNames)[number]
export type NonInBattleStageStatName = (typeof nonInBattleStageStatNames)[number]
