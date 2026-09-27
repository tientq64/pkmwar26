import type { Ability } from '@/constants/abilities'
import { type Body, type Image } from '@/constants/consts'
import { formsMap, type Form } from '@/constants/forms'
import { physics, scene } from '@/constants/game'
import type { Move } from '@/constants/moves'
import { pkms } from '@/constants/pkms'
import type { Specy } from '@/constants/species'
import { type BoostName, type StatName } from '@/constants/stats'
import type { AilmentName } from '@/constants/statuses'
import type { Team } from '@/constants/teams'
import { getFormBaseFrame } from '@/funcs/getFormBaseFrame'
import { idle } from '@/funcs/idle'
import { makeEvs } from '@/funcs/makeEvs'
import { makeIvs } from '@/funcs/makeIvs'
import { makeMoveSlots } from '@/funcs/makeMoveSlots'
import { makePkmAbility } from '@/funcs/makePkmAbility'
import { makePkmBoosts } from '@/funcs/makePkmBoosts'
import { makePkmStats } from '@/funcs/makePkmStats'
import { onWorldBounds } from '@/funcs/onWorldBounds'
import { preUpdate } from '@/funcs/preUpdate'
import { pick } from '@/utils/pick'
import { Display, Physics } from 'phaser'

export type Facing = 'left' | 'right'
export type Direction = 'left' | 'right' | 'up' | 'down'
export type State = 'idle' | 'walk' | 'battle' | 'dead'

export type Boosts = Record<BoostName, number>
export type Stats = Record<StatName, number>

export interface VolatileStatuses {
    confusion?: {
        turns: number
    }
    infatuation?: {
        source: Pokemon
    }
    leechSeed?: {
        source: Pokemon
    }
    nightmare?: boolean
    flinch?: boolean
    cursed?: boolean
    drowsy?: boolean
    forestCursed?: boolean
    healingPrevented?: boolean
    lockedOn?: {
        target: Pokemon
    }
    moveDisabled?: {
        moveSlot: MoveSlot
        turns: number
    }
    noAbility?: boolean
    tarShot?: boolean
}

export interface MoveSlot {
    move: Move
    pp: number
}

export class Pokemon extends Physics.Arcade.Sprite {
    id: number

    form: Form
    level: number
    ability: Ability
    ivs: Stats
    evs: Stats
    boosts: Boosts
    stats: Stats
    moveSlots: MoveSlot[]
    ailment: AilmentName | undefined
    volatileStatuses: VolatileStatuses

    team: Team
    baseFrame: number
    radius: number
    facing: Facing
    direction: Direction
    state: State
    health: number
    foe: Pokemon | undefined
    idleTimer: number
    walkTimer: number

    body = null as unknown as Body
    filter = null as unknown as Display.ColorMatrix
    maxHealthBar = null as unknown as Image
    healthBar = null as unknown as Image

    constructor(specy: Specy, x: number, y: number, team: Team) {
        super(scene, x, y, 'pokemons')

        this.id = Pokemon.id++

        this.form = formsMap[specy.forms[0]]
        this.level = 100
        this.ability = makePkmAbility(this)
        this.ivs = makeIvs()
        this.evs = makeEvs()
        this.boosts = makePkmBoosts()
        this.stats = makePkmStats(this)
        this.moveSlots = makeMoveSlots(this)
        this.ailment = undefined
        this.volatileStatuses = {}

        this.team = team
        this.baseFrame = getFormBaseFrame(this.form)
        this.facing = 'left'
        this.direction = pick(Pokemon.directions)
        this.state = 'idle'
        this.health = this.stats.hp
        this.foe = undefined
        this.idleTimer = 0
        this.walkTimer = 0

        scene.add.existing(this)
        pkms.add(this)

        const { body } = this
        body.setSize(8, 8)
        body.setCircle(4)
        body.setCollideWorldBounds(true)
        body.onWorldBounds = true

        this.setFrame(this.baseFrame)
        this.setScale(3)
        this.radius = this.body.radius * this.scale

        this.enableFilters()
        this.filter = this.filters!.internal.addColorMatrix().colorMatrix

        const maxHealthBar = scene.add.image(this.x, this.y, 'hpBar')
        maxHealthBar.setTint(0x111111)
        maxHealthBar.setDepth(1e4)
        maxHealthBar.setScale(this.stats.hp / 12, 3)
        maxHealthBar.setOrigin(0.5, 1)
        this.maxHealthBar = maxHealthBar

        const healthBar = scene.add.image(this.x, this.y, 'hpBar')
        healthBar.setTint(this.team)
        healthBar.setDepth(maxHealthBar.depth + 1)
        healthBar.setScale(maxHealthBar.scaleX, maxHealthBar.scaleY)
        healthBar.setOrigin(0, 1)
        this.healthBar = healthBar

        physics.world.on('worldbounds', onWorldBounds.bind(null, this))
        this.preUpdate = preUpdate.bind(null, this)

        idle(this)
    }

    static id = 0
    static facings: Facing[] = ['left', 'right']
    static directions: Direction[] = ['left', 'right', 'up', 'down']
    static actions: State[] = ['idle', 'walk', 'battle', 'dead']
}
