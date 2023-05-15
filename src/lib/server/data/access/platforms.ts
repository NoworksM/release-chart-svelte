import {gamesCollection, platformsCollection} from '..'
import type {PlatformDto} from '$lib/data/platform'
import type {ObjectId} from 'mongodb'


/**
 * Gets all platforms from the database.
 * @returns A Promise of an array of Platform objects.
 */
export async function getPlatforms() {
    // Find all platforms in the platforms collection and sort them by priority, manufacturer, and name
    return await platformsCollection.find().sort({priority: -1, manufacturer: 1, name: 1}).toArray()
}

/**
 * Gets all platforms from the database and maps them to DTOs.
 * @returns A Promise of an array of PlatformDto objects.
 */
export async function getPlatformsAsDto(): Promise<PlatformDto[]> {
    // Aggregate the platforms collection using the sort and project stages and get the resulting data
    return await platformsCollection.aggregate<PlatformDto>([
        {$sort: {priority: -1, manufacturer: 1, name: 1}},
        {$project: {_id: 0, id: {$toString: '$_id'}, name: 1, manufacturer: 1, shortName: 1, hasIcon: 1, priority: 1}}
    ]).toArray()
}

/**
 * Gets a platform from the database by its ID and maps it to a DTO.
 * @param id The ID of the platform to get.
 * @returns A Promise of a PlatformDto object representing the platform.
 */
export async function getPlatformAsDto(id: ObjectId): Promise<PlatformDto | undefined> {
    // Aggregate the platforms collection using the match and project stages and get the resulting data
    const platforms = await platformsCollection.aggregate<PlatformDto>([
        {$match: {_id: id}},
        {$project: {_id: 0, id: {$toString: '$_id'}, name: 1, manufacturer: 1, shortName: 1, hasIcon: 1, priority: 1}}
    ]).toArray()

    // Return the first item in the platforms array, or undefined if the array is empty
    return platforms[0]
}

/**
 * Gets the release counts for each platform in the database.
 * @returns A Promise of a PlatformCountMap object representing the release counts for each platform.
 */
export type PlatformCountMap = {[platform: string]: number}

export async function getReleaseCountsForPlatforms(): Promise<PlatformCountMap> {
    // Aggregate the games collection using the unwind, group, sort, and project stages and get the resulting data
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

    // Map the counts to a PlatformCountMap object
    const map: PlatformCountMap = {}

    for (const count of counts) {
        map[count.platform] = count.count
    }

    return map
}