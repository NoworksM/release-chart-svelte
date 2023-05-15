import type {RequestHandler} from './$types'
import {json} from '@sveltejs/kit'

export const GET = (async ({locals}) => {
    if (locals.user) {
        return json(locals.user)
    } else {
        return new Response(null, {status: 204})
    }
}) satisfies RequestHandler