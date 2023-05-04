import {gamesCollection, platformsCollection} from '../index'
import type {PlatformDto} from '../dto/platform-dto'
import type {ObjectId} from 'mongodb'


export async function getPlatforms() {
    return await platformsCollection.find().sort({priority: -1, manufacturer: 1, name: 1}).toArray()
}

export async function getPlatformsAsDto(): Promise<PlatformDto[]> {
    return await platformsCollection.aggregate<PlatformDto>([
        {$sort: {priority: -1, manufacturer: 1, name: 1}},
        {$project: {_id: 0, id: {$toString: '$_id'}, name: 1, manufacturer: 1, shortName: 1, hasIcon: 1, priority: 1}}
    ]).toArray()
}

export async function getPlatformAsDto(id: ObjectId): Promise<PlatformDto | undefined> {
    const platforms = await platformsCollection.aggregate<PlatformDto>([
        {$match: {_id: id}},
        {$project: {_id: 0, id: {$toString: '$_id'}, name: 1, manufacturer: 1, shortName: 1, hasIcon: 1, priority: 1}}
    ]).toArray()

    return platforms[0]
}

export type PlatformCountMap = {[platform: string]: number}

export async function getReleaseCountsForPlatforms(): Promise<PlatformCountMap> {
    const counts = await gamesCollection.aggregate<{platform: string, count: number}>([
        {
            $unwind: '$releases'
        },
        {
            $unwind: '$releases.platforms'
        },
        {
            $group: {
                _id: '$releases.platforms',
                count: {
                    $sum: 1
                }
            }
        },
        {
            $sort: {
                _id: 1
            }
        },
        {
            $project: {
                _id: 0,
                count: 1,
                platform: '$_id'
            }
        }
    ]).toArray()

    const map: PlatformCountMap = {}

    for (const count of counts) {
        map[count.platform] = count.count
    }

    return map
}