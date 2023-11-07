export class Option<T> {
    private readonly _value: T | undefined

    constructor(value: T | undefined) {
        this._value = value
    }

    public get isSome() {
        return this._value !== undefined
    }

    public get isNone() {
        return this._value === undefined
    }

    public bind<U>(some: (value: T) => Option<U>): Option<U> {
        if (this.isSome) {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            return some(this._value!)
        } else {
            return none<U>()
        }
    }

    public contains(value: T): boolean {
        return this.isSome && this._value === value
    }

    public defaultValue(defaultValue: T): T {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return this.isSome ? this._value! : defaultValue
    }

    public defaultValueOption(defaultValue: T): Option<T> {
        return this.isSome ? this : some(defaultValue)
    }

    public defaultWith(defaultValue: () => T): T {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return this.isSome ? this._value! : defaultValue()
    }

    public defaultWithOption(defaultValue: () => T): Option<T> {
        return this.isSome ? this : some(defaultValue())
    }
}

export function some<T>(value: T): Option<T> {
    return new Option<T>(value)
}

export function none<T>(): Option<T> {
    return new Option<T>(undefined)
}