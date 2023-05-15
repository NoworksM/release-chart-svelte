import type {RequestHandler} from './$types'
import {deleteCachedSession} from '$lib/server/data/cache'
import {env} from '$env/dynamic/private'
import {sessionCollection} from '$lib/server/data'
import {redirect} from '@sveltejs/kit'

export const POST = (async ({cookies}) => {
    const token = cookies.get(env.SESSION_COOKIE_NAME)

    if (token) {
        await sessionCollection.deleteOne({token})

        await deleteCachedSession(token)

        cookies.delete(env.SESSION_COOKIE_NAME)
    }

    throw redirect( 303, `${env.BASE_URL}/`)
}) satisfies RequestHandler