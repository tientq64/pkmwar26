import { random } from '@/utils/random'

export function pick<T>(items: T[]): T {
    const index = random(items.length - 1)
    return items[index]
}
