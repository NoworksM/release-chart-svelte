import type {RegionalRelease} from '../regional-release'
import {gamesCollection} from '..'
import {DateTime} from 'luxon'
import type {Document} from 'mongodb'
import type {RegionalReleaseDto} from '../../../data/dto/regional-release-dto'



// Define a projection object that specifies which fields to include in the results of the upcoming and recent releases queries
const regionalReleaseProjection = {
    _id: 0,
    gameId: '$_id',
    title: 1,
    description: 1,
    imagePath: 1,
    releaseDate: '$releases.releaseDate',
    regions: '$releases.regions',
    platforms: '$releases.platforms',
    developer: 1,
    publisher: 1,
    genres: 1,
    posterId: 1
}

// Define a projection object that specifies which fields to include in the results of the upcoming and recent releases queries, but with the release date formatted as a string
const regionalReleaseDtoProjection = {
    _id: 0,
    gameId: {$toString: '$_id'},
    title: 1,
    description: 1,
    imagePath: 1,
    releaseDate: {
        $dateToString: {
            date: '$releases.releaseDate',
            format: '%Y-%m-%d'
        }
    },
    regions: '$releases.regions',
    platforms: '$releases.platforms',
    developer: 1,
    publisher: 1,
    genres: 1,
}

/**
 * Get upcoming releases for a region
 * @param region The region to get upcoming releases for
 * @param projection Optional projection to apply to the results
 * @returns A list of upcoming releases
 */
export async function getUpcomingRegionalReleases<T extends Document>(region: string, projection: object = regionalReleaseProjection): Promise<T[]> {
    const start = DateTime.now().endOf('day').toJSDate()

    // Aggregate the games collection to get upcoming releases for the specified region
    return await gamesCollection.aggregate<T>([
        {
            $unwind: {path: '$releases'}
        },
        {
            $match: {
                'releases.releaseDate': {$gte: start},
                'releases.regions': {$in: [region]}
            }
        },
        {
            $project: projection
        }
    ])
        .sort({releaseDate: 1})
        .limit(50)
        .toArray()
}

// Define a function that returns upcoming releases as DTOs (data transfer objects)
export const getUpcomingRegionalReleasesAsDto = (region: string) => getUpcomingRegionalReleases<RegionalReleaseDto>(region, regionalReleaseDtoProjection)

/**
 * Get recent releases for a region
 * @param region The region to get recent releases for
 * @param projection Optional projection to apply to the results
 * @returns A list of recent releases
 */
export async function getRecentRegionalReleases<T extends Document>(region: string, projection: object = regionalReleaseProjection): Promise<T[]> {
    const end = DateTime.now().endOf('day').toJSDate()

    // Aggregate the games collection to get recent releases for the specified region
    return await gamesCollection.aggregate<T>([
        {
            $unwind: {path: '$releases'}
        },
        {
            $match: {
                'releases.releaseDate': {$lte: end},
                'releases.regions': {$in: [region]}
            }
        },
        {
            $project: projection
        }
    ])
        .sort({releaseDate: -1})
        .limit(100)
        .toArray()
}

// Define a function that returns recent releases as DTOs (data transfer objects)
export const getRecentRegionalReleasesAsDto = (region: string) => getRecentRegionalReleases<RegionalReleaseDto>(region, regionalReleaseDtoProjection)


/**
 * Get releases for a region for a specific month
 * @param year The year to get releases for
 * @param month The month to get releases for
 * @param region The region to get releases for
 * @returns A list of releases for the specified month and region
 */
export async function getRegionalReleasesForMonth(year: number, month: number, region: string) {
    const now = DateTime.fromObject({year, month})

    const start = now.startOf('month').toJSDate()
    const end = now.endOf('month').toJSDate()

    // Aggregate the games collection to get releases for the specified month and region
    return await gamesCollection.aggregate<RegionalRelease>([
        {
            $unwind: {path: '$releases'}
        },
        {
            $match: {
                'releases.releaseDate': {$gte: start, $lte: end},
                'releases.regions': {$in: [region]}
            }
        },
        {
            $project: regionalReleaseProjection
        }
    ])
        .sort({releaseDate: 1})
        .toArray()
}