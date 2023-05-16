import type {RequestHandler} from './$types'
import {json} from '@sveltejs/kit'
import {getRegionsAsDto} from '$lib/server/data/access/regions'

export const GET = (async () => {
    const regions = await getRegionsAsDto()

    return json(regions)
}) satisfies RequestHandler