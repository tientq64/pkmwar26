import { physics } from '@/constants/game'
import type { Pokemon } from '@/constants/pokemon'
import { wait } from '@/utils/wait'

export interface TackleOptions {
    delay?: number
    duration?: number
    backTime?: number
}

export async function tackle(pkm: Pokemon, foe: Pokemon, options: TackleOptions = {}) {
    const { delay = 0, duration = 400, backTime = 200 } = options

    await wait(delay)

    const { x, y } = pkm

    physics.moveToObject(pkm, foe, undefined, duration)
    await wait(duration)
    pkm.body.stop()

    if (backTime) await wait(backTime)

    physics.moveTo(pkm, x, y, undefined, duration)
    await wait(duration)
    pkm.body.stop()
}
