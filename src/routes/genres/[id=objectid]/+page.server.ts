import type {RequestEvent} from './$types'
import {fail} from '@sveltejs/kit'
import {ObjectId} from 'mongodb'
import {genresCollection, regionsCollection} from '$lib/server/data'
import {GenreDtoSchema} from '$lib/data/genre'

const action = async ({request, params}: RequestEvent) => {
    const _id = new ObjectId(params.id)

    if (await genresCollection.countDocuments({_id}) === 0) {
        return fail(404, {message: 'Genre does not exist'})
    }

    const formData = Object.fromEntries(await request.formData())
    const result = await GenreDtoSchema.safeParseAsync(formData)

    if (!result.success) {
        return fail(400, {error: result.error})
    }

    await genresCollection.updateOne({_id}, {
        $set: result.data
    })
}

export const actions = {
    default: action
}