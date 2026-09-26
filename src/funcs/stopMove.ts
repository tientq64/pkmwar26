import type { Pokemon } from '@/constants/pokemon'

export function stopMove(pkm: Pokemon) {
    pkm.body.stop()
    pkm.setFrame(pkm.baseFrame)
}
