import { sceneCreate } from '@/funcs/sceneCreate'
import { scenePreload } from '@/funcs/scenePreload'
import { sceneUpdate } from '@/funcs/sceneUpdate'
import { Game, Physics, Scale, Scene } from 'phaser'

export const game = new Game({
    scale: {
        mode: Scale.FIT,
    },
    parent: 'root',
    width: innerWidth,
    height: innerHeight,
    pixelArt: true,
    physics: {
        default: 'arcade',
        arcade: {
            // debug: true,
        },
    },
    scene: {
        preload: scenePreload,
        create: sceneCreate,
        update: sceneUpdate,
    },
})

export let scene: Scene
export let physics: Physics.Arcade.ArcadePhysics

export function setScene(newScene: Scene) {
    scene = newScene
    physics = scene.physics
}
