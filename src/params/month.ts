const objectIdRegex = /^\d{2}$/

export function match(value: string) {
    return objectIdRegex.test(value)
}