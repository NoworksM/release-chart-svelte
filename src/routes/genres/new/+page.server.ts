import type {RequestEvent} from './$types'
import {fail} from '@sveltejs/kit'
import {ObjectId} from 'mongodb'
import {genresCollection} from '$lib/server/data'
import {GenreDtoSchema} from '$lib/data/genre'

const action = async ({request}: RequestEvent) => {
    const formData = Object.fromEntries(await request.formData())
    const result = await GenreDtoSchema.safeParseAsync(formData)

    if (!result.success) {
        return fail(400, {error: result.error})
    }

    if (await genresCollection.countDocuments({name: result.data.name}) > 0) {
        return fail(404, {message: 'Genre already exists'})
    }

    await genresCollection.insertOne({
        name: result.data.name,
        shortName: result.data.shortName
    })
}

export const actions = {
    default: action
}