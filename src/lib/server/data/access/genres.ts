import type {WithId} from 'mongodb'
import type Genre from '../genre'
import {genresCollection} from '..'
import type {GenreDto} from '$lib/data/genre'


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
        {$project: {_id: 0, id: {$toString: '$_id'}, name: 1}}
    ]).toArray()
}