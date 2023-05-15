import type {Handle} from '@sveltejs/kit'
import { sequence } from '@sveltejs/kit/hooks'
import {env} from '$env/dynamic/private'
import {getSession, getSessionUser} from '$lib/server/data/cache'
import {Role} from '$lib/data/roles'

const injectSessionAndUser = (async ({event, resolve}) => {
    const cookie = event.cookies.get(env.SESSION_COOKIE_NAME)

    if (cookie) {
        event.locals.session = await getSession(cookie)
        if (event.locals.session) {
            event.locals.user = await getSessionUser(event.locals.session.userId)
        } else {
            event.locals.user = null
        }
    }

    return resolve(event)
}) satisfies Handle

const whitelistedRoutes = [
    /^\/$/,
    /^\/upcoming\/?$/,
    /^\/recent\/?$/,
    /^\/\d{4}\/\d{2}\/?$/,
    /^\/games\/[a-fA-F0-9]{24}\/poster\/?$/,
    /^\/api\/games\/\d{4}\/\d{2}\/?$/,
    /^\/login\/?$/
]

const blacklistedRoutes = [
    /^\/login\/?$/
]

const requireAdmin = (async ({event, resolve}) => {
    if (event.locals.user && blacklistedRoutes.some(r => r.test(event.url.pathname))) {
        return Response.redirect(`${env.BASE_URL}/`, 303)
    }

    if (whitelistedRoutes.some(r => r.test(event.url.pathname))) {
        return resolve(event)
    }

    if (!event.locals.user || event.locals.user.roles.indexOf(Role.enum.admin) === -1) {
        return Response.redirect(`${env.BASE_URL}/`, 303)
    }

    return resolve(event)
}) satisfies Handle

export const handle = sequence(injectSessionAndUser, requireAdmin)