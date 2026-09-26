import { PMath } from '@/constants/consts'
import { implementedMoveFlags, movesMap } from '@/constants/moves'
import type { MoveSlot, Pokemon } from '@/constants/pokemon'

export function makeMoveSlots(pkm: Pokemon): MoveSlot[] {
    const implementedMoves = pkm.form.moves.filter((move) => {
        return implementedMoveFlags[move.name]
    })
    const formMoves = PMath.RND.shuffle(implementedMoves).slice(0, 4)

    const moveSlots: MoveSlot[] = formMoves.map((formMove) => {
        const move = movesMap[formMove.name]
        return {
            move,
            pp: move.pp,
        }
    })
    return moveSlots
}
