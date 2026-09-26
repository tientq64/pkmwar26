import type { Body } from '@/constants/consts'
import type { Pokemon } from '@/constants/pokemon'
import { collide } from '@/funcs/collide'

export function onWorldBounds(pkm: Pokemon, body: Body) {
    if (body.gameObject !== pkm) return

    collide(pkm)
}
