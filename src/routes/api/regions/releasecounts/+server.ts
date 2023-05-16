import type {RequestHandler} from './$types'
import {json} from '@sveltejs/kit'
import {getReleaseCountsForRegions} from '$lib/server/data/access/regions'

export const GET = (async () => {
    const counts = await getReleaseCountsForRegions()

    return json(counts)
}) satisfies RequestHandler