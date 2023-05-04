import {env} from '$env/dynamic/private'
import {gamesCollection} from '../index'
import type {GameDto, GamePage} from '../dto/game-dto'
import type {ObjectId} from 'mongodb'


const pageSize = env.PAGE_SIZE ? parseInt(env.PAGE_SIZE) : 25

let checkedIndex = false

/**
 * Create the text index for the games collection if it doesn't exist
 */
async function createGamesTextIndex() {
    if (!checkedIndex && !await gamesCollection.indexExists('TextIndex')) {
        await gamesCollection.createIndex({
            title: 'text',
            description: 'text',
            genres: 'text',
            'releases.platforms': 'text',
            developer: 'text',
            publisher: 'text',
            regions: 'text'
        }, {
            weights: {
                title: 10,
                description: 7,
                'releases.platforms': 3
            },
            name: 'TextIndex',
        })
        checkedIndex = true
    }
}

const mapToDtoStages = [
    {
        $set: {
            id: {$toString: '$_id'},
            posterId: {$toString: '$posterId'},
            releases: {
                $map: {
                    input: '$releases',
                    as: 'release',
                    in: {
                        releaseDate: {
                            $dateToString: {
                                date: '$$release.releaseDate',
                                format: '%Y-%m-%d',
                            }
                        },
                        platforms: '$$release.platforms',
                        regions: '$$release.regions'
                    },
                },
            },
            createdAt: {$toString: '$createdAt'},
            updatedAt: {$toString: '$updatedAt'}
        }
    },
    {$unset: '_id'},
]

/**
 * Create the stages for paged game query
 * @param page The page number
 * @param sort Optional sort order
 * @returns The stages for the query
 */
function createPaginationStages(page: number, sort: any = {updatedAt: -1, title: 1}) {
    return [
        {
            $facet: {
                data: [
                    {$sort: sort},
                    {$skip: pageSize * page},
                    {$limit: pageSize},
                    ...mapToDtoStages
                ],
                count: [
                    {$count: 'count'},
                ]
            }
        },
        {$unwind: '$count'},
        {$set: {pages: {$ceil: {$divide: ['$count.count', pageSize]}}}},
        {
            $project: {
                pages: 1,
                data: 1
            }
        }
    ]
}

/**
 * Get a page of games
 * @param page The page number
 * @returns A page of games
 */
export async function getGamesPage(page = 1) {
    const actualPage = page - 1

    const pages = await gamesCollection.aggregate<GamePage>(createPaginationStages(actualPage)).toArray()

    if (pages.length === 0) {
        return {
            page: 1,
            pages: 1,
            data: []
        }
    }

    const gamePage = pages[0]

    gamePage.page = page

    return gamePage
}

/**
 * Get a search page of games
 * @param query The search query
 * @param page The page number
 * @returns A page of the searched games
 */
export async function searchGamesPage(query: string, page = 1) {
    await createGamesTextIndex()

    const actualPage = page - 1

    const pages = await gamesCollection.aggregate<GamePage>([
        {
            $match: {
                $text: {$search: query}
            }
        },
        {
            $set:
                {
                    score: {$meta: 'textScore'}
                }
        },
        ...createPaginationStages(actualPage, {score: -1, updatedAt: -1, title: 1}),
    ]).toArray()

    if (pages.length === 0) {
        return {
            page: 1,
            pages: 1,
            data: []
        }
    }

    const gamePage = pages[0]

    gamePage.page = page

    return gamePage
}

/**
 * Get the start and end year range for a region
 * @param region The region to query the year range for
 * @returns The year range
 */
export async function getYearRangeForRegion(region: string): Promise<{ min: number, max: number }> {
    const yearRanges = await gamesCollection.aggregate<{ min: number, max: number }>([
        {
            $match: {
                'releases.regions': {$all: [region]}
            }
        },
        {
            $unwind: {
                path: '$releases'
            }
        },
        {
            $group: {
                _id: null,
                min: {$min: {$year: '$releases.releaseDate'}},
                max: {$max: {$year: '$releases.releaseDate'}}
            }
        },
        {
            $project: {
                _id: 0
            }
        }
    ]).toArray()

    return yearRanges[0]
}

export async function getGame(gameId: ObjectId) {
    return await gamesCollection.findOne({_id: gameId})
}

export async function getGameAsDto(gameId: ObjectId) {
    const data = await gamesCollection.aggregate<GameDto>([
        {$match: {_id: gameId}},
        ...mapToDtoStages
    ]).toArray()

    return data[0]
}