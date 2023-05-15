import type {RequestEvent} from './$types'
import {deleteCachedSession} from '$lib/server/data/cache'
import {env} from '$env/dynamic/private'

async function logout({cookies}: RequestEvent) {
    const session = cookies.get(env.SESSION_COOKIE_NAME)

    if (session) {
        await deleteCachedSession(session)

        cookies.delete(env.SESSION_COOKIE_NAME)
    }

    return Response.redirect(`${env.BASE_URL}/`, 303)
}

export const actions = {
    default: login
}