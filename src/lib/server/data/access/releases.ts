import type {RegionalRelease} from '../regional-release'
import {gamesCollection} from '..'
import {DateTime} from 'luxon'
import type {RegionalReleaseDto} from '$lib/data/regional-release'
import type {Regions} from '$lib/data/region'
import type {Document, ObjectId} from 'mongodb'
import {none, type Option, some} from '$lib/util/option'


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
            title: {$first: '$title'},
            platforms: {$addToSet: '$releases.platforms'}, // Collect unique platforms
            description: {$first: '$description'},
            developer: {$first: '$developer'},
            genres: {$first: '$genres'},
            posterId: {$first: '$posterId'},
            publisher: {$first: '$publisher'},
            createdAt: {$first: '$createdAt'},
            updatedAt: {$first: '$updatedAt'}
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
            platforms: {
                $reduce: {
                    input: '$platforms',
                    initialValue: [],
                    in: {$concatArrays: ['$$value', '$$this']}
                }
            },
            createdAt: 1,
            description: 1,
            developer: 1,
            genres: 1,
            publisher: 1,
            updatedAt: 1
        }
    }
]

type ReleaseFiltering = {
    platform?: string
}

/**
 * Get releases for a region for a specific month
 * @param year The year to get releases for
 * @param month The month to get releases for
 * @param region The region to get releases for
 * @param filters Filters to apply to the releases
 * @returns A list of releases for the specified month and region
 */
export async function getRegionalReleasesForMonth(year: number, month: number, region: Regions, filters: ReleaseFiltering = {}) {
    const now = DateTime.fromObject({year, month})

    const start = now.startOf('month').toJSDate()
    const end = now.endOf('month').toJSDate()

    const stages: Document[] = [
        {
            $unwind: {path: '$releases'}
        },
        {
            $match: {
                'releases.releaseDate': {$gte: start, $lte: end},
                'releases.regions': {$in: [region]}
            }
        }
    ]

    if (filters.platform) {
        stages.push({
            $match: {
                'releases.platforms': {$in: [filters.platform]}
            }
        })
    }

    // Aggregate the games collection to get releases for the specified month and region
    return await gamesCollection.aggregate<RegionalRelease>([
            ...stages,
        ...GroupByReleases
    ])
        .sort({releaseDate: 1, title: 1})
        .toArray()
}

/**
 * Get upcoming releases for a region
 * @param region The region to get upcoming releases for
 * @param filters Filters to apply to the releases
 * @returns A list of upcoming releases
 */
export async function getUpcomingRegionalReleases(region: Regions, filters: ReleaseFiltering = {}): Promise<RegionalReleaseDto[]> {
    const start = DateTime.now().startOf('day').toJSDate()

    const stages: Document[] = [
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
                'releases.regions': {$in: [region]}
            }
        }]

    if (filters.platform) {
        stages.push({
            $match: {
                'releases.platforms': {$in: [filters.platform]}
            }
        })
    }

    return await gamesCollection.aggregate<RegionalReleaseDto>([
        ...stages,
        ...GroupByReleases
    ])
        .sort({releaseDate: 1, title: 1})
        .limit(100)
        .toArray()
}

export const getUpcomingRegionalReleasesAsDto = (region: Regions, filters: ReleaseFiltering = {}) => getUpcomingRegionalReleases(region, filters)

/**
 * Get recent releases for a region
 * @param region The region to get recent releases for
 * @param filters Filters to apply to the releases
 * @returns A list of recent releases
 */
export async function getRecentRegionalReleases(region: Regions, filters: ReleaseFiltering = {}): Promise<RegionalReleaseDto[]> {
    const end = DateTime.now().endOf('day').toJSDate()


    const stages: Document[] = [{
        // Unwind the releases array to process each release individually
        $unwind: '$releases'
    },
        {
            // Filter out the releases that happened before today
            $match: {
                'releases.releaseDate': {
                    $lte: end
                },
                'releases.regions': {$in: [region]}
            }
        }]

    if (filters.platform) {
        stages.push({
            $match: {
                'releases.platforms': {$in: [filters.platform]}
            }
        })
    }

    return await gamesCollection.aggregate<RegionalReleaseDto>([
        ...stages,
        ...GroupByReleases
    ])
        .sort({releaseDate: -1, title: 1})
        .limit(100)
        .toArray()
}

export const getRecentRegionalReleasesAsDto = (region: Regions, filters: ReleaseFiltering = {}) => getRecentRegionalReleases(region, filters)

export async function getReleaseForRegion(id: ObjectId, region: Regions): Promise<Option<RegionalRelease>> {
    const games = await gamesCollection.aggregate<RegionalRelease>([
        {
            $match: {
                _id: id
            }
        },
        {
            $unwind: '$releases'
        },
        {
            $match: {
                'releases.regions': {$in: [region]}
            }
        },
        ...GroupByReleases
    ]).toArray()

    if (games.length === 0) {
        return none<RegionalRelease>()
    }

    return some(games[0])
}