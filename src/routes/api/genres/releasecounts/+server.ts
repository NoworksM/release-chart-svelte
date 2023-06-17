import type {RequestHandler} from './$types'
import {json} from '@sveltejs/kit'
import {getReleaseCountsForGenres} from '$lib/server/data/access/genres'

export const GET = (async () => {
    const counts = await getReleaseCountsForGenres()

    return json(counts)
}) satisfies RequestHandler