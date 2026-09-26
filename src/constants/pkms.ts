import type { Pokemon } from '@/constants/pokemon'
import { collide } from '@/funcs/collide'
import { Physics, Scene } from 'phaser'

export let pkms: Physics.Arcade.Group

export function setPkms(scene: Scene) {
    pkms = scene.physics.add.group()

    scene.physics.add.collider(pkms, pkms, (objA, objB) => {
        const pkmA = objA as Pokemon
        const pkmB = objB as Pokemon

        if (pkmA.id >= pkmB.id) return

        collide(pkmA, pkmB)
        collide(pkmB, pkmA)
    })
}
