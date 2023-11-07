import type {RegionalRelease} from '../regional-release'
import {gamesCollection} from '..'
import {DateTime} from 'luxon'
import type {RegionalReleaseDto} from '$lib/data/regional-release'
import type {Regions} from '$lib/data/region'


/**
 * Group by the release date and game ID
 */
const GroupByReleases = [
    {
        // Group by the release date and game ID
        $group: {
            _id: {
                releaseDate: '$releases.releaseDate',
                gameId: '$_id'
            },
            title: { $first: '$title' },
            platforms: { $addToSet: '$releases.platforms' }, // Collect unique platforms
            description: { $first: '$description' },
            developer: { $first: '$developer' },
            genres: { $first: '$genres' },
            posterId: { $first: '$posterId' },
            publisher: { $first: '$publisher' },
            createdAt: { $first: '$createdAt' },
            updatedAt: { $first: '$updatedAt' }
        }
    },
    {
        // To flatten the platforms array (because of $addToSet, it'll be an array of arrays)
        $project: {
            _id: 0,
            gameId: {$toString: '$_id.gameId'},
            title: 1,
            releaseDate: {
                $dateToString: {
                    date: '$_id.releaseDate',
                    format: '%Y-%m-%d'
                }
            },
            platforms: { $reduce: {
                    input: '$platforms',
                    initialValue: [],
                    in: { $concatArrays: ['$$value', '$$this'] }
                }},
            createdAt: 1,
            description: 1,
            developer: 1,
            genres: 1,
            publisher: 1,
            updatedAt: 1
        }
    }
]

/**
 * Get releases for a region for a specific month
 * @param year The year to get releases for
 * @param month The month to get releases for
 * @param region The region to get releases for
 * @returns A list of releases for the specified month and region
 */
export async function getRegionalReleasesForMonth(year: number, month: number, region: Regions) {
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
        ...GroupByReleases
    ])
        .sort({releaseDate: 1, title: 1})
        .toArray()
}

/**
 * Get upcoming releases for a region
 * @param region The region to get upcoming releases for
 * @returns A list of upcoming releases
 */
export async function getUpcomingRegionalReleases(region: Regions): Promise<RegionalReleaseDto[]> {
    const start = DateTime.now().startOf('day').toJSDate()

    return await gamesCollection.aggregate<RegionalReleaseDto>([
        {
            // Unwind the releases array to process each release individually
            $unwind: '$releases'
        },
        {
            // Filter out the releases that happened before today
            $match: {
                'releases.releaseDate': {
                    $gte: start
                },
                'releases.regions': { $in: [region] }
            }
        },
        ...GroupByReleases
    ])
        .sort({releaseDate: 1, title: 1})
        .limit(100)
        .toArray()
}

export const getUpcomingRegionalReleasesAsDto = (region: Regions) => getUpcomingRegionalReleases(region)

/**
 * Get recent releases for a region
 * @param region The region to get recent releases for
 * @returns A list of recent releases
 */
export async function getRecentRegionalReleases(region: Regions): Promise<RegionalReleaseDto[]> {
    const end = DateTime.now().endOf('day').toJSDate()

    return await gamesCollection.aggregate<RegionalReleaseDto>([
        {
            // Unwind the releases array to process each release individually
            $unwind: '$releases'
        },
        {
            // Filter out the releases that happened before today
            $match: {
                'releases.releaseDate': {
                    $lte: end
                },
                'releases.regions': { $in: [region] }
            }
        },
        ...GroupByReleases
    ])
        .sort({releaseDate: -1, title: 1})
        .limit(100)
        .toArray()
}

export const getRecentRegionalReleasesAsDto = (region: Regions) => getRecentRegionalReleases(region)