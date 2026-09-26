import { Pokemon, type Direction } from '@/constants/pokemon'
import { idle } from '@/funcs/idle'
import { pick } from '@/utils/pick'
import { random } from '@/utils/random'

export function walk(pkm: Pokemon, direction?: Direction) {
    clearTimeout(pkm.walkTimer)

    pkm.state = 'walk'

    direction ??= pick(Pokemon.directions)
    pkm.direction = direction

    const speed = pkm.stats.spe / 2
    const walkTime = random(1000, 8000)

    switch (direction) {
        case 'left':
            pkm.setVelocityX(-speed)
            break
        case 'right':
            pkm.setVelocityX(speed)
            break
        case 'up':
            pkm.setVelocityY(-speed)
            break
        case 'down':
            pkm.setVelocityY(speed)
            break
    }

    pkm.walkTimer = setTimeout(idle, walkTime, pkm)
}
