import type {ObjectId, WithId} from 'mongodb'
import type Genre from '../genre'
import {gamesCollection, genresCollection} from '..'
import type {GenreDto} from '$lib/data/genre'
import {aggregateFirst} from '$lib/server/data/access/index'
import type {GenreCountMap} from '$lib/data/count-map'


/**
 * Gets all genres from the database.
 * @returns A Promise of an array of Genre objects with their IDs.
 */
export async function getGenres(): Promise<WithId<Genre>[]> {
    // Find all genres in the genres collection, excluding the _id field, and sort them by name
    return await genresCollection.find({}, {projection: {_id: 0}}).sort({name: 1}).toArray()
}

/**
 * Gets all genres from the database and maps them to DTOs.
 * @returns A Promise of an array of GenreDto objects.
 */
export async function getGenresAsDto(): Promise<GenreDto[]> {
    // Aggregate the genres collection using the sort and project stages and get the resulting data
    return await genresCollection.aggregate<GenreDto>([
        {$sort: {name: 1}},
        {$project: {_id: 0, id: {$toString: '$_id'}, name: 1, shortName: 1}}
    ]).toArray()
}

export async function getGenreAsDto(id: ObjectId): Promise<GenreDto | null> {
    return await aggregateFirst(genresCollection.aggregate<GenreDto>([
        {$match: {_id: id}},
        {$sort: {name: 1}},
        {$project: {_id: 0, id: {$toString: '$_id'}, name: 1, shortName: 1}}
    ]))
}

/**
 * Gets the release counts as a map of the genre id to the count
 * @returns {Promise<GenreCountMap>} of the release counts
 */
export async function getReleaseCountsForGenres() {
    const counts = await gamesCollection.aggregate<{ genre: string, count: number }>([
        {
            $unwind: '$genres'
        },
        {
            $group: {
                _id: '$genres',
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
                genre: '$_id'
            }
        }
    ]).toArray()

    const map: GenreCountMap = {}

    for (const count of counts) {
        map[count.genre] = count.count
    }

    return map
}