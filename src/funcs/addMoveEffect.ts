import { PMath } from '@/constants/consts'
import { scene } from '@/constants/game'
import type { Pokemon } from '@/constants/pokemon'
import { random } from '@/utils/random'
import { wait } from '@/utils/wait'
import { range } from 'es-toolkit'

export type KeyframeValueFunc<T> = (index: number, total: number) => T

export type Keyframe = {
    frame?: number
    quantity?: number
    texture?: 12
    fromPkm?: Pokemon
    fromX?: number
    fromY?: number
    foe?: Pokemon
    delay?: number
    duration?: number
    stagger?: number
    burst?: number | [number, number?]
    rotateToMovement?: boolean
    toPositionRatio?: number | KeyframeValueFunc<number>
    movementX?: number
    movementY?: number
    skipMovementAnim?: boolean
    x?: any
    y?: any
    scale?: any
    alpha?: any
} & { [key: string]: any }

export async function addMoveEffect(pkm: Pokemon, keyframes: Keyframe[]) {
    let {
        frame = 0,
        quantity = 5,
        texture = 12,
        fromPkm = pkm,
        fromX = fromPkm.x,
        fromY = fromPkm.y,
        delay = 0,
        stagger = 100,
    } = keyframes[0]

    range(0, quantity).forEach(async (i) => {
        await wait(delay + i * stagger)

        const sprite = scene.add.sprite(fromX, fromY, `moves${texture}`, frame)
        sprite.setScale(3)
        sprite.setDepth(1e5)

        for (let j = 0; j < keyframes.length; j++) {
            const keyframe = keyframes[j]

            let {
                duration = 400,
                foe,
                burst,
                x = foe ? foe.x : sprite.x,
                y = foe ? foe.y : sprite.y,
                scale = sprite.scale,
                alpha = sprite.alpha,
                rotateToMovement,
                toPositionRatio,
                movementX,
                movementY,
                skipMovementAnim,
            } = keyframe

            if (toPositionRatio !== undefined) {
                if (typeof toPositionRatio === 'function') {
                    toPositionRatio = toPositionRatio(i, quantity)
                }
                x = PMath.Linear(fromX, x, toPositionRatio)
                y = PMath.Linear(fromY, y, toPositionRatio)
            }

            if (movementX) x += movementX
            if (movementY) y += movementY

            if (burst) {
                const angle = PMath.Angle.Random()
                const distance = Array.isArray(burst) ? random(...burst) : burst
                const burstX = Math.cos(angle) * distance
                const burstY = Math.sin(angle) * distance
                x += burstX
                y += burstY
            }

            if (rotateToMovement) {
                sprite.setRotation(PMath.Angle.Between(sprite.x, sprite.y, x, y))
            }
            if (skipMovementAnim) {
                sprite.setPosition(x, y)
            }

            await new Promise<void>((resolve) => {
                const tween = scene.tweens.add({
                    targets: sprite,
                    duration,
                    x,
                    y,
                    scale,
                    alpha,
                    onComplete: () => {
                        tween.destroy()
                        resolve()
                    },
                })
            })
        }

        sprite.destroy()
    })
}
