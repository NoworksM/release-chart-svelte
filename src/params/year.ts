const objectIdRegex = /^\d{4}$/

export function match(value: string) {
    return objectIdRegex.test(value)
}