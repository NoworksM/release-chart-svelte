export class Result<T, TError> {
    private _value: T | undefined
    private _error: TError | undefined

    constructor(value: T | undefined, error: TError | undefined) {
        this._value = value
        this._error = error
    }

    public get isOk() {
        return this._value !== undefined
    }

    public get isErr() {
        return this._value === undefined
    }

    public bind<U>(ok: (value: T) => Result<U, TError>): Result<U, TError> {
        if (this.isOk) {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            return ok(this._value!)
        } else {
            return err<U, TError>(this._error!)
        }
    }
}

export function ok<T, TError>(value: T): Result<T, TError> {
    return new Result<T, TError>(value, undefined)
}

export function err<T, TError>(error: TError): Result<T, TError> {
    return new Result<T, TError>(undefined, error)
}