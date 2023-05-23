import type {RequestEvent, RequestHandler} from './$types'
import {fail, json} from '@sveltejs/kit'
import {getRegionAsDto} from '$lib/server/data/access/regions'
import {ObjectId} from 'mongodb'

export const GET = (async ({params}: RequestEvent) => {
    const region = await getRegionAsDto(new ObjectId(params.id))

    if (!region) {
        throw fail(404, {message: 'Region does not exist'})
    }

    return json(region)
}) satisfies RequestHandler