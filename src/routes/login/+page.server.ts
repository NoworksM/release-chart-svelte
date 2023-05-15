import type {RequestEvent} from './$types'
import * as z from 'zod'
import {sessionCollection, userInfoCollection} from '$lib/server/data'
import {fail} from '@sveltejs/kit'
import argon2 from 'argon2'
import type {Session} from '$lib/server/data/session'
import {DBRef} from 'mongodb'
import crypto from 'crypto'
import {DateTime} from 'luxon'
import {updateCachedSession} from '$lib/server/data/cache'
import {env} from '$env/dynamic/private'

const LoginSchema = z.object({
    username: z.string(),
    password: z.string()
})

async function login({request, cookies}: RequestEvent) {
    const formData = await request.formData()

    const result = await LoginSchema.safeParseAsync(Object.fromEntries(formData))

    if (!result.success) {
        return fail(400, {error: 'Invalid username and password'})
    }

    const data = result.data

    const user = await userInfoCollection.findOne({name: data.username})

    if (!user) {
        return fail(400, {error: 'Invalid username and password'})
    }

    const matches = await argon2.verify(user.password, data.password, {type: argon2.argon2id})

    if (!matches) {
        return fail(400, {error: 'Invalid username and password'})
    }

    const tokenBuffer = crypto.randomBytes(1024)

    const expiresAt = DateTime.now().plus({months: 1}).toJSDate()

    const session: Session = {
        token: tokenBuffer.toString('base64'),
        expiresAt: expiresAt,
        user: new DBRef('userInfo', user._id)
    }

    await sessionCollection.insertOne(session)

    await updateCachedSession(session)

    cookies.set(env.SESSION_COOKIE_NAME, session.token, {expires: session.expiresAt})

    return Response.redirect(`${env.BASE_URL}/games`, 303)
}

export const actions = {
    default: login
}