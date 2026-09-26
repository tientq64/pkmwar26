import { random } from '@/utils/random'

export function chance(rate: number = 50) {
    return random(99) < rate
}
