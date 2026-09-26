import { pkms } from '@/constants/pkms'
import type { Pokemon } from '@/constants/pokemon'

export function die(pkm: Pokemon) {
    if (pkm.state === 'dead') return

    pkm.state = 'dead'
    pkm.foe = undefined

    clearTimeout(pkm.idleTimer)
    clearTimeout(pkm.walkTimer)

    pkm.maxHealthBar.destroy()
    pkm.healthBar.destroy()
    pkm.destroy()
    pkms.remove(pkm)
}
