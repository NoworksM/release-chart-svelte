// eslint-disable-next-line no-duplicate-imports
import type {RedisClientType} from 'redis'
// eslint-disable-next-line no-duplicate-imports
import {createClient} from 'redis'
import {env} from '$env/dynamic/private'
import {BrokenCircuitError, circuitBreaker, ConsecutiveBreaker, handleAll} from 'cockatiel'

let redis: RedisClientType | null = null
try {
    redis = env.REDIS_CONNECTION_STRING ? createClient({url: env.REDIS_CONNECTION_STRING, socket: {reconnectStrategy: 30 * 1000}, disableOfflineQueue: true}) : null
    if (redis) {
        await redis.connect()
        redis.on('error', (err) => console.error(err))
    }
} catch {
    // ignore
}

const breaker = circuitBreaker(handleAll, {
    halfOpenAfter: 30 * 1000,
    breaker: new ConsecutiveBreaker(5)
})

const breakerProxied = redis ? new Proxy<RedisClientType>(redis, {
    get(target, symbol) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const value: unknown = target[symbol]

        if (typeof value === 'function') {
            return async (...params: unknown[]) => {
                try {
                    return await breaker.execute(() => value.apply(target, params))
                } catch (err) {
                    if (err instanceof BrokenCircuitError) {
                        return null
                    } else {
                        throw err
                    }
                }
            }
        }

        return value
    }
}) : null

export default redis