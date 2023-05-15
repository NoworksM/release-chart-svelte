// eslint-disable-next-line no-duplicate-imports
import type {RedisClientType} from 'redis'
// eslint-disable-next-line no-duplicate-imports
import {createClient} from 'redis'
import {env} from '$env/dynamic/private'
import {BrokenCircuitError, circuitBreaker, ConsecutiveBreaker, handleAll} from 'cockatiel'
import type {Session, SessionHash} from './session'
import type {UserInfoHash, UserInfo} from './user-info'
import {ObjectId} from 'mongodb'
// eslint-disable-next-line no-duplicate-imports
import {SessionHashSchema} from './session'
import {getUserInfoDto} from './access/users'
import {getSessionHash} from './access/sessions'
// eslint-disable-next-line no-duplicate-imports
import {UserInfoHashSchema} from './user-info'

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

type SessionSearchable = Session | SessionHash | string

export function sessionKey(session: SessionSearchable) {
    if (typeof session === 'string') {
        return `session:${session}`
    } else {
        return `session:${session.token}`
    }
}

export async function getCachedSession(cookie: string | undefined): Promise<SessionHash | null> {
    if (!redis || !cookie) {
        return null
    }

    const sessionHash = await redis.hGetAll(sessionKey(cookie))

    const result = await SessionHashSchema.safeParseAsync(sessionHash)

    if (!result.success) {
        return null
    }

    return result.data
}

export async function getSession(cookie: string | undefined): Promise<SessionHash | null> {
    if (!cookie) {
        return null
    }

    let sessionHash: SessionHash | null = null

    if (redis) {
        sessionHash = await getCachedSession(cookie)
    }

    if (!sessionHash) {
        sessionHash = await getSessionHash(cookie)

        if (sessionHash && redis) {
            const key = sessionKey(sessionHash)

            await Promise.all([
                redis.hSet(key, 'token', sessionHash.token),
                redis.hSet(key, 'userId', sessionHash.userId),
                redis.hSet(key, 'expiresAt', sessionHash.expiresAt)
            ])
        }
    }

    return sessionHash
}

type UserSearchable = UserInfo | string | ObjectId | Session | SessionHash

function getUserSearchableId(user: UserSearchable): string {
    if (typeof user === 'string') {
        return user
    } else if (user.constructor === ObjectId) {
        return user.toString()
    } else if ('userId' in user) {
        return user.userId
    } else if ('user' in user) {
        return user.user.oid.toString()
    } else {
        return (<UserInfo> user)._id.toString()
    }
}

function userCacheKey(user: UserSearchable): string {
    return `user:${getUserSearchableId(user)}`
}

export async function getCachedUser(userId: UserSearchable) : Promise<UserInfoHash | null> {
    if (!redis) {
        return null
    }

    const data = await redis.hGetAll(userCacheKey(userId))

    const result = await UserInfoHashSchema.safeParseAsync(data)

    if (!result.success) {
        return null
    }

    return result.data
}

export async function getSessionUser(userId: UserSearchable): Promise<UserInfoHash | null> {
    let user: UserInfoHash | null = null
    if (redis) {
        user = await getCachedUser(userId)
    }

    if (!user) {
        user = await getUserInfoDto(new ObjectId(getUserSearchableId(userId)))

        if (user && redis) {
            const key = userCacheKey(userId)

            await Promise.all([
                redis.hSet(key, 'externalId', user.externalId),
                redis.hSet(key, 'name', user.name),
                redis.hSet(key, 'email', user.email),
                redis.hSet(key, 'roles', user.roles.join(',')),
                redis.hSet(key, 'createdAt', user.createdAt ?? ''),
                redis.hSet(key, 'updatedAt', user.updatedAt ?? '')
            ])
        }
    }

    return user
}

export default redis