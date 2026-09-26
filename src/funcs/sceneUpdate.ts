import { pkms } from '@/constants/pkms'
import type { Scene } from 'phaser'

export function sceneUpdate(this: Scene) {
    pkms.shuffle()
}
