const objectIdRegex = /^[0-9a-fA-F]{24}$/

export function match(value: string) {
    return objectIdRegex.test(value)
}