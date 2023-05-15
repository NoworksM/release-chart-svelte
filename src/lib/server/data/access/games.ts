import {env} from '$env/dynamic/private'
import {gamesCollection} from '..'
import type {GameDto, GamePage} from '$lib/data/game'
import type {ObjectId} from 'mongodb'


const pageSize = env.PAGE_SIZE ? parseInt(env.PAGE_SIZE) : 25

let checkedIndex = false

/**
 * Creates a text index for the games collection in MongoDB.
 * The index is used for text search on game titles, descriptions, genres, releases, developer, publisher, and regions.
 * @returns A Promise that resolves when the index is created.
 */
async function createGamesTextIndex() {
    // Check if the index has already been created and create it if it hasn't
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

/**
 * The stages for mapping game documents to DTOs.
 * The stages convert the _id and releaseDate fields to strings and map the releases array to a new format.
 */
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

interface GameSort {
    title?: number
    description?: number
    imagePath?: number
    developer?: number
    publisher?: number
    score?: number
    updatedAt?: number
    createdAt?: number
}

/**
 * Creates the stages for a paged game query.
 * The stages sort the games by the given sort order, skip the games on previous pages, limit the games on the current page,
 * map the games to DTOs using the mapToDtoStages, count the total number of games, calculate the total number of pages,
 * and project the pages and data fields.
 * @param page The page number.
 * @param sort Optional sort order.
 * @returns The stages for the query.
 */
function createPaginationStages(page: number, sort: GameSort = {updatedAt: -1, title: 1}) {
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
 * Gets a page of games from the database.
 * @param page The page number.
 * @returns A Promise of a GamePage object representing the page of games.
 */
export async function getGamesPage(page = 1) {
    const actualPage = page - 1

    // Aggregate the games collection using the pagination stages and get the resulting pages
    const pages = await gamesCollection.aggregate<GamePage>(createPaginationStages(actualPage)).toArray()

    // If there are no pages, return an empty page object
    if (pages.length === 0) {
        return {
            page: 1,
            pages: 1,
            data: []
        }
    }

    // Get the first page and set its page number to the requested page number
    const gamePage = pages[0]
    gamePage.page = page

    return gamePage
}

/**
 * Searches for games in the database using a text query.
 * @param query The text query.
 * @param page The page number.
 * @returns A Promise of a GamePage object representing the page of games that match the query.
 */
export async function searchGamesPage(query: string, page = 1) {
    // Create the text index if it hasn't been created yet
    await createGamesTextIndex()

    const actualPage = page - 1

    // Aggregate the games collection using the text search and pagination stages and get the resulting pages
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

    // If there are no pages, return an empty page object
    if (pages.length === 0) {
        return {
            page: 1,
            pages: 1,
            data: []
        }
    }

    // Get the first page and set its page number to the requested page number
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

/**
 * Gets a game from the database by its ID.
 * @param gameId The ID of the game to get.
 * @returns A Promise of a Game object representing the game.
 */
export async function getGame(gameId: ObjectId) {
    return await gamesCollection.findOne({_id: gameId})
}

/**
 * Gets a game from the database by its ID and maps it to a DTO.
 * @param gameId The ID of the game to get.
 * @returns A Promise of a GameDto object representing the game.
 */
export async function getGameAsDto(gameId: ObjectId) {
    // Aggregate the games collection using the match and mapping stages and get the resulting data
    const data = await gamesCollection.aggregate<GameDto>([
        {$match: {_id: gameId}},
        ...mapToDtoStages
    ]).toArray()

    // Return the first item in the data array
    return data[0]
}