// eslint-disable-next-line no-duplicate-imports
import type {RedisClientType} from 'redis'
// eslint-disable-next-line no-duplicate-imports
import {createClient} from 'redis'
import {env} from '$env/dynamic/private'
import {BrokenCircuitError, circuitBreaker, ConsecutiveBreaker, handleAll} from 'cockatiel'
import type {Session, SessionHash} from './session'
// eslint-disable-next-line no-duplicate-imports
import {SessionHashSchema} from './session'
import type {UserInfo, UserInfoHash} from './user-info'
// eslint-disable-next-line no-duplicate-imports
import {UserInfoHashSchema} from './user-info'
import {ObjectId} from 'mongodb'
import {getUserInfoDto} from './access/users'
import {getSessionHash} from './access/sessions'
import {DateTime} from 'luxon'

let redis: RedisClientType | null = null
try {
    redis = env.REDIS_CONNECTION_STRING ? createClient({
        url: env.REDIS_CONNECTION_STRING,
        socket: {reconnectStrategy: 30 * 1000},
        disableOfflineQueue: true
    }) : null
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

export function sessionCacheKey(session: SessionSearchable) {
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

    try {
        const sessionHash = await redis.hGetAll(sessionCacheKey(cookie))

        const result = await SessionHashSchema.safeParseAsync(sessionHash)

        if (!result.success) {
            return null
        }

        return result.data
    } catch {
        return null
    }
}

export async function updateCachedSession(session: SessionHash | Session) {
    if (!redis) {
        return
    }

    const key = sessionCacheKey(session)

    try {
        if ('user' in session) {
            await Promise.all([
                redis.hSet(key, 'token', session.token),
                redis.hSet(key, 'userId', session.user.oid.toString()),
                redis.hSet(key, 'expiresAt', session.expiresAt.toISOString())
            ])
        } else {
            await Promise.all([
                redis.hSet(key, 'token', session.token),
                redis.hSet(key, 'userId', session.userId),
                redis.hSet(key, 'expiresAt', session.expiresAt)
            ])
        }
    } catch {
        // Ignore
    }
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
    }

    if (!sessionHash) {
        return null
    }

    const expiresAt = DateTime.fromISO(sessionHash.expiresAt)

    if (!expiresAt.isValid || expiresAt < DateTime.now()) {
        return null
    }

    if (sessionHash && redis) {
        await updateCachedSession(sessionHash)
    }

    return sessionHash
}

type UserId = string
type UserSearchable = UserInfo | UserId | ObjectId | Session | SessionHash

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
        return (<UserInfo>user)._id.toString()
    }
}

function userCacheKey(user: UserSearchable): string {
    return `user:${getUserSearchableId(user)}`
}

export async function getCachedUser(userId: UserSearchable): Promise<UserInfoHash | null> {
    if (!redis) {
        return null
    }

    try {
        const data = await redis.hGetAll(userCacheKey(userId))

        const result = await UserInfoHashSchema.safeParseAsync(data)

        if (!result.success) {
            return null
        }

        return result.data
    } catch {
        // ignore
        return null
    }
}

export async function updateCachedUser(userId: UserSearchable, user: UserInfoHash) {
    if (!redis) {
        return
    }

    const key = userCacheKey(userId)

    try {
        await Promise.all([
            redis.hSet(key, 'externalId', user.externalId),
            redis.hSet(key, 'name', user.name),
            redis.hSet(key, 'email', user.email),
            redis.hSet(key, 'roles', user.roles.join(',')),
            redis.hSet(key, 'createdAt', user.createdAt ?? ''),
            redis.hSet(key, 'updatedAt', user.updatedAt ?? ''),
            redis.expireAt(key, DateTime.now().plus({day: 7}).toJSDate())
        ])
    } catch {
        // ignore
    }
}

export async function getSessionUser(userId: UserSearchable): Promise<UserInfoHash | null> {
    let user: UserInfoHash | null = null
    if (redis) {
        user = await getCachedUser(userId)
    }

    if (!user) {
        user = await getUserInfoDto(new ObjectId(getUserSearchableId(userId)))

        if (user && redis) {
            await updateCachedUser(userId, user)
        }
    }

    return user
}

export default redis