import type {RequestEvent} from './$types'
import {fail} from '@sveltejs/kit'
import {regionsCollection} from '$lib/server/data'
import {ObjectId} from 'mongodb'
import {RegionDtoSchema} from '$lib/data/region'

const action = async ({request, params}: RequestEvent) => {
    const _id = new ObjectId(params.id)

    if (await regionsCollection.countDocuments({_id}) === 0) {
        throw fail(404, {message: 'Region does not exist'})
    }

    const formData = await request.formData()
    const result = await RegionDtoSchema.safeParseAsync(formData)

    if (!result.success) {
        throw fail(400, {error: result.error})
    }

    await regionsCollection.updateOne({_id}, {
        $set: result.data
    })
}

export const actions = {
    default: action
}