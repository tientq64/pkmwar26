import { game, setScene } from '@/constants/game'
import { setPkms } from '@/constants/pkms'
import { Pokemon } from '@/constants/pokemon'
import { species, speciesMap } from '@/constants/species'
import { teams } from '@/constants/teams'
import { die } from '@/funcs/die'
import { pick } from '@/utils/pick'
import { random } from '@/utils/random'
import { type Scene } from 'phaser'

export function sceneCreate(this: Scene) {
    setScene(this)
    setPkms(this)

    let i = 160
    while (i > 0) {
        const specy = pick(species)
        if (specy.id > speciesMap.ribombee.id) continue

        const x = random(100, game.scale.width - 100)
        const y = random(100, game.scale.height - 100)
        const team = pick(teams)
        const pkm = new Pokemon(specy, x, y, team)

        if (pkm.moveSlots.length === 0) {
            die(pkm)
            continue
        }

        i--
    }
}
