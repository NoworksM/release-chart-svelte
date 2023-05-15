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
                expiresAt: {$toString: '$expiresAt'},
                userId: {$toString: '$user.$id'}
            }
        }
    ]).toArray()

    if (results.length > 0) {
        return results[0]
    }

    return null
}