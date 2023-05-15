import type {RequestEvent} from './$types'
import * as z from 'zod'
import {sessionCollection, userInfoCollection} from '../../data'
import {fail} from '@sveltejs/kit'
import argon2 from 'argon2'
import type Session from '../../data/session'
import {DBRef} from 'mongodb'
import crypto from 'crypto'
import {DateTime} from 'luxon'
import redis, {sessionKey} from '../../data/cache'

const LoginSchema = z.object({
    username: z.string(),
    password: z.string()
})

async function login({request}: RequestEvent) {
    const formData = await request.formData()

    const result = await LoginSchema.safeParseAsync(Object.fromEntries(formData))

    if (!result.success) {
        return fail(400, {error: 'Invalid username and password'})
    }

    const data = result.data

    const user = await userInfoCollection.findOne({username: data.username})

    if (!user) {
        return fail(400, {error: 'Invalid username and password'})
    }

    if (!await argon2.verify(user.password, data.password)) {
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

    if (redis) {
        const key = sessionKey(session)

        await Promise.all([
            redis!.hSet(key, 'userId', user._id.toString()),
            redis!.hSet(key, 'roles', JSON.stringify(user.roles)),
            redis!.expireAt(key, expiresAt)
        ])
    }
}

export const actions = {
    default: login
}