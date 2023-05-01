import type {RegionalRelease} from '../regional-release'
import {gamesCollection} from '../index'
import {DateTime} from 'luxon'
import type {Document} from 'mongodb'
import type {RegionalReleaseDto} from '../dto/regional-release-dto'


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

export const getUpcomingRegionalReleasesAsDto = (region: string) => getUpcomingRegionalReleases<RegionalReleaseDto>(region, regionalReleaseDtoProjection)

/**
 * Get recent releases for a region
 * @param region The region to get recent releases for
 * @param projection Optional projection to apply to the results
 * @returns A list of recent releases
 */
export async function getRecentRegionalReleases<T extends Document>(region: string, projection: object = regionalReleaseProjection): Promise<T[]> {
    const end = DateTime.now().endOf('day').toJSDate()

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