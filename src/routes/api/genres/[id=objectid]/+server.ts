import type {RequestHandler} from './$types'
import {fail, json} from '@sveltejs/kit'
import {ObjectId} from 'mongodb'
import {getGenreAsDto} from '$lib/server/data/access/genres'

export const GET = (async ({params}) => {
    const genre = await getGenreAsDto(new ObjectId(params.id))

    if (!genre) {
        throw fail(404, {error: 'Genre does not exist'})
    }

    return json(genre)
}) satisfies RequestHandler