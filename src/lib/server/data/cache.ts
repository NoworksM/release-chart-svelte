import {createClient, type RedisClientType} from 'redis'
import {env} from '$env/dynamic/private'
import {BrokenCircuitError, circuitBreaker, ConsecutiveBreaker, handleAll} from 'cockatiel'
import {SessionHashSchema, type Session, type SessionHash} from './session'
import {UserInfoHashSchema, type UserInfo, type UserInfoHash} from './user-info'
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

/**
 * Returns a Redis key for a SessionSearchable object.
 * @param session - A Session, SessionHash, or string representing the session to generate a key for.
 * @returns A string representing the Redis key for the session.
 */
export function sessionCacheKey(session: SessionSearchable): string {
  if (typeof session === 'string') {
    return `session:${session}`
  } else {
    return `session:${session.token}`
  }
}

/**
 * Returns a Promise of a SessionHash object or null from the Redis cache.
 * @param cookie - A string or undefined representing the session cookie.
 * @returns A Promise of a SessionHash object or null.
 */
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


/**
 * Updates the cached session in Redis.
 * @param session - A SessionHash or Session object representing the session to update.
 * @returns A Promise that resolves when the session is updated in Redis.
 */
export async function updateCachedSession(session: SessionHash | Session) {
  // If Redis is not being used, return
  if (!redis) {
    return
  }

  const key = sessionCacheKey(session)

  try {
    // If the session object has a 'user' property, update the user ID as a string
    if ('user' in session) {
      await Promise.all([
        redis.hSet(key, 'token', session.token),
        redis.hSet(key, 'userId', session.user.oid.toString()),
        redis.hSet(key, 'expiresAt', session.expiresAt.toISOString())
      ])
    } else {
      // If the session object does not have a 'user' property, update the user ID as is
      await Promise.all([
        redis.hSet(key, 'token', session.token),
        redis.hSet(key, 'userId', session.userId),
        redis.hSet(key, 'expiresAt', session.expiresAt)
      ])
    }
  } catch {
    // Ignore any errors
  }
}

/**
 * Deletes the cached session from Redis.
 * @param session - A Session, SessionHash, or string representing the session to delete.
 * @returns A Promise that resolves when the session is deleted from Redis.
 */
export async function deleteCachedSession(session: SessionSearchable) {
  // If Redis is not being used, return
  if (!redis) {
    return
  }

  try {
    // Use Redis 'del' command to delete the session from the cache
    await redis.del(sessionCacheKey(session))
  } catch {
    // Ignore any errors
  }
}

/**
 * Returns a Promise of a SessionHash object or null.
 * @param cookie - A string or undefined representing the session cookie.
 * @returns A Promise of a SessionHash object or null.
 */
export async function getSession(cookie: string | undefined): Promise<SessionHash | null> {
  // If cookie is undefined, return null
  if (!cookie) {
    return null
  }

  let sessionHash: SessionHash | null = null

  // If Redis is being used, check if there is a cached session for the cookie
  if (redis) {
    sessionHash = await getCachedSession(cookie)
  }

  // If there is no cached session, get the session hash
  if (!sessionHash) {
    sessionHash = await getSessionHash(cookie)
  }

  // If there is no session hash, return null
  if (!sessionHash) {
    return null
  }

  // Check if the session has expired
  const expiresAt = DateTime.fromISO(sessionHash.expiresAt)
  if (!expiresAt.isValid || expiresAt < DateTime.now()) {
    return null
  }

  // If Redis is being used and the session hash is valid, update the cached session
  if (sessionHash && redis) {
    await updateCachedSession(sessionHash)
  }

  // Return the session hash
  return sessionHash
}

type UserId = string
type UserSearchable = UserInfo | UserId | ObjectId | Session | SessionHash


/**
 * Returns the ID of a user as a string.
 * @param user - A UserSearchable object representing the user.
 * @returns A string representing the ID of the user.
 */
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

/**
 * Returns the Redis key for a user.
 * @param user - A UserSearchable object representing the user.
 * @returns A string representing the Redis key for the user.
 */
function userCacheKey(user: UserSearchable): string {
    return `user:${getUserSearchableId(user)}`
}

/**
 * Gets a user hash from Redis cache.
 * @param userId - A UserSearchable object representing the user to get from the cache.
 * @returns A Promise of a UserInfoHash object or null from the Redis cache.
 */
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
        // ignore any errors and return null
        return null
    }
}

/**
 * Updates a user hash in Redis cache.
 * @param userId - A UserSearchable object representing the user to update in the cache.
 * @param user - A UserInfoHash object representing the updated user information.
 * @returns A Promise that resolves when the user is updated in Redis.
 */
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
        // ignore any errors
    }
}

/**
 * Gets a user hash from Redis cache or database.
 * @param userId - A UserSearchable object representing the user to get from the cache or database.
 * @returns A Promise of a UserInfoHash object or null.
 */
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