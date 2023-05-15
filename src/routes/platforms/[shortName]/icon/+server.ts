import {error} from '@sveltejs/kit'
import type {RequestHandler} from './$types'
import {platformsCollection} from '$lib/server/data'

export const GET = (async ({params}) => {
    const platform = await platformsCollection.findOne({name: params.shortName})

    if (!platform?.icon) {
        throw error(404, 'Platform icon not found')
    }

    return new Response(platform.icon.data.buffer, {headers: {'Content-Type': platform.icon.contentType}})
}) satisfies RequestHandler