import { pkms } from '@/constants/pkms'
import type { Pokemon } from '@/constants/pokemon'

export function die(pkm: Pokemon) {
    if (pkm.state === 'dead') return

    clearTimeout(pkm.idleTimer)
    clearTimeout(pkm.walkTimer)

    pkm.state = 'dead'
    pkm.foe = undefined

    pkm.maxHealthBar.destroy()
    pkm.healthBar.destroy()
    pkm.destroy()
    pkms.remove(pkm)
}
