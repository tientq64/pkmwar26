import data from '@/data/moves'
import { keyBy } from 'es-toolkit'

export const moves = [...data]

export type Move = (typeof data)[number]
export type MoveName = Move['name']
export type MoveTarget = Move['target']

export const movesMap = keyBy(moves, (move) => move.name)

export const implementedMoveFlags: Partial<Record<MoveName, true>> = {
    // flamethrower: true,
    // thunderbolt: true,
    // fissure: true,
    blueFlare: true,
    boltStrike: true,
}
