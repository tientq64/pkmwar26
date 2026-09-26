import hpBar from '@/assets/images/hpBar.png'
import moves12 from '@/assets/images/moves12.png'
import pokemons from '@/assets/images/pokemons.png'
import type { Scene } from 'phaser'

export function scenePreload(this: Scene) {
    this.load.spritesheet('pokemons', pokemons, {
        frameWidth: 12,
        frameHeight: 12,
    })
    this.load.spritesheet('moves12', moves12, {
        frameWidth: 12,
        frameHeight: 12,
    })
    this.load.image('hpBar', hpBar)
}
