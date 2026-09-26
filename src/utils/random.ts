export function random(min: number, max?: number): number {
    if (max === undefined) {
        max = min
        min = 0
    }
    return min + Math.floor(Math.random() * (max - min + 1))
}
