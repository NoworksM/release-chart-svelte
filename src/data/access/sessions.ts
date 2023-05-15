import {sessionCollection} from '../index'
import type {SessionHash} from '../session'

export async function getSessionHash(token: string) {
    const results = await sessionCollection.aggregate<SessionHash>([
        {
            $match: {token}
        },
        {
            $project: {
                token: 1,
                expiresAt: 1,
                userId: {$toString: '$user.oid'}
            }
        }
    ]).toArray()

    if (results.length > 0) {
        return results[0]
    }

    return null
}