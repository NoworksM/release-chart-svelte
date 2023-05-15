import {userInfoCollection} from '..'
import type {ObjectId} from 'mongodb'
import type {UserInfoDto} from '$lib/data/user'
import { aggregateFirst } from '.'


/**
 * Retrieves a user from the database based on their external ID.
 * @param userId The external ID of the user to retrieve.
 * @returns A Promise that resolves to the user object, or null if the user is not found.
 */
export async function getUser(userId: string) {
    return await userInfoCollection.findOne({externalId: userId})
}

/**
 * Retrieves all users from the database.
 * @returns A cursor to the collection of user objects.
 */
export function getUsers() {
    return userInfoCollection.find()
}

/**
 * Retrieves a user's information from the database based on their Object ID.
 * @param id The Object ID of the user to retrieve.
 * @returns A Promise that resolves to the user's information object, or null if the user is not found.
 */
export async function getUserInfoDto(id: ObjectId): Promise<UserInfoDto | null> {
    return await aggregateFirst(userInfoCollection.aggregate<UserInfoDto>([
        {
            $match: {_id: id}
        },
        {
            $project: {
                roles: 1,
                name: 1,
                email: 1,
                externalId: 1,
                createdAt: {$toString: '$createdAt'},
                updatedAt: {$toString: '$createdAt'}
            }
        }
    ]))
}

