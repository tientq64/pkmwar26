import type { Pokemon } from '@/constants/pokemon'
import { findFoes } from '@/funcs/findFoes'

export function preUpdate(pkm: Pokemon, time: number) {
    if (pkm.state === 'dead') return

    const { state, direction } = pkm

    switch (state) {
        case 'walk': {
            const frame = pkm.baseFrame + (time % 400 < 200 ? 0 : 32)
            pkm.setFrame(frame)

            if (direction === 'left' || direction === 'right') {
                pkm.facing = direction
            }
            break
        }
        case 'battle': {
            if (pkm.foe) {
                if (pkm.x < pkm.foe.x) {
                    pkm.facing = 'right'
                } else if (pkm.x > pkm.foe.x) {
                    pkm.facing = 'left'
                }
            }
            break
        }
    }

    pkm.setFlipX(pkm.facing === 'right')

    pkm.setDepth(pkm.y)

    pkm.maxHealthBar.setPosition(pkm.x, pkm.y - 18)

    pkm.healthBar.setPosition(pkm.x - pkm.stats.hp / 24, pkm.y - 18)
    pkm.healthBar.setScale(pkm.health / 12, pkm.maxHealthBar.scaleY)

    findFoes(pkm)
}
