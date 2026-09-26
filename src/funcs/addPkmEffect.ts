import { scene } from '@/constants/game'
import type { Pokemon } from '@/constants/pokemon'

export interface PkmEffect {
    tackle?: boolean
    delay?: number
    duration?: number
    x?: number | number[]
    y?: number | number[]
    scale?: number | number[]
    alpha?: number | number[]
}

export function addPkmEffect(pkm: Pokemon, foe: Pokemon, pkmEffect: PkmEffect = {}) {
    let { tackle, delay = 0, duration = 800, x, y, scale, alpha } = pkmEffect

    if (tackle) {
        duration /= 2
        addPkmEffect(pkm, foe, {
            ...pkmEffect,
            tackle: false,
            duration: duration,
            x: foe.x,
            y: foe.y,
        })
        addPkmEffect(pkm, foe, {
            ...pkmEffect,
            tackle: false,
            delay: duration,
            duration: duration,
            x: pkm.x,
            y: pkm.y,
        })
        return
    }

    const pkmProps = {
        x,
        y,
        scale,
        alpha,
    } as const
    for (const key in pkmProps) {
        const propName = key as keyof typeof pkmProps
        if (pkmProps[propName] === undefined) delete pkmProps[propName]
    }

    const tween = scene.tweens.add({
        targets: pkm,
        delay,
        duration,
        ...pkmProps,
        onComplete: () => {
            tween.destroy()
        },
    })
}
