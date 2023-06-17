import type {RequestHandler} from './$types'
import {json} from '@sveltejs/kit'
import {getGenresAsDto} from '$lib/server/data/access/genres'

export const GET = (async () => {
    const genres = await getGenresAsDto()

    return json(genres)
}) satisfies RequestHandler