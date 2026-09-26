export function lowerCase<T extends string>(text: T) {
    return text.toLowerCase() as Lowercase<T>
}
