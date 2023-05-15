import {userInfoCollection} from '../index'
import type {ObjectId} from 'mongodb'
import type {UserInfoDto} from '../dto/user-info-dto'

export async function getUser(userId: string) {
    return await userInfoCollection.findOne({externalId: userId})
}

export function getUsers() {
    return userInfoCollection.find()
}

export async function getUserInfoDto(id: ObjectId): Promise<UserInfoDto | null> {
    const rows = await userInfoCollection.aggregate<UserInfoDto>([
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
    ]).toArray()

    if (rows.length > 0) {
        return rows[0]
    } else {
        return null
    }
}