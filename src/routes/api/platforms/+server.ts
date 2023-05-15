import type {RequestHandler} from './$types'
import {json} from '@sveltejs/kit'
import {getPlatformsAsDto} from '$lib/server/data/access/platforms'

export const GET = (async () => {
    const platforms = await getPlatformsAsDto()

    return json(platforms)
}) satisfies RequestHandler