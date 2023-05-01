import type {WithId} from 'mongodb'
import type Genre from '../genre'
import {genresCollection} from '../index'
import type {GenreDto} from '../dto/genre-dto'


export async function getGenres(): Promise<WithId<Genre>[]> {
    return await genresCollection.find({}, {projection: {_id: 0}}).sort({name: 1}).toArray()
}

export async function getGenresAsDto(): Promise<GenreDto[]> {
    return await genresCollection.aggregate<GenreDto>([
        {$sort: {name: 1}},
        {$project: {_id: 0, id: {$toString: '$_id'}, name: 1}}
    ]).toArray()
}