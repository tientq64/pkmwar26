import { scene } from '@/constants/game'
import type { Pokemon } from '@/constants/pokemon'
import { wait } from '@/utils/wait'

export interface PkmEffect {
    delay?: number
    duration?: number
    scale?: number | number[]
    alpha?: number | number[]
    contrast?: number | number[]
}

export async function addPkmEffect(pkm: Pokemon, pkmEffects: PkmEffect[] = []) {
    const filters = { contrast: 1 }

    for (const pkmEffect of pkmEffects) {
        let { delay = 0 } = pkmEffect

        await wait(delay)

        let { duration = 400, scale, alpha, contrast } = pkmEffect

        const pkmProps = {
            scale,
            alpha,
        } as const
        for (const key in pkmProps) {
            const propName = key as keyof typeof pkmProps
            if (pkmProps[propName] === undefined) delete pkmProps[propName]
        }

        scene.tweens.add({
            targets: pkm,
            duration,
            ...pkmProps,
        })

        if (contrast !== undefined) {
            scene.tweens.add({
                targets: filters,
                duration,
                contrast,
                onUpdate: () => {
                    pkm.filter.contrast(filters.contrast)
                },
            })
        }
    }
}
