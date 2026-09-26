export type CamelCase<S extends string> = S extends `${infer A}-${infer B}`
    ? `${A}${Capitalize<CamelCase<B>>}`
    : S

export function camelCase<T extends string>(text: T) {
    return text.replace(/[-_]+([a-z0-9])/g, (_, char) => char.toUpperCase()) as CamelCase<T>
}
