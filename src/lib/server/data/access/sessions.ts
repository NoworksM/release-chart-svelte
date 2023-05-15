import {sessionCollection} from '..'
import type {SessionHash} from '../session'


/**
 * This function retrieves a session hash from the session collection based on a given token.
 * It uses an aggregation pipeline to match the token and project the token, expiresAt and userId fields.
 * If a result is found, it returns the first result, otherwise it returns null.
 * @param token - The token to match against the session collection.
 * @returns A SessionHash object or null.
 */
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