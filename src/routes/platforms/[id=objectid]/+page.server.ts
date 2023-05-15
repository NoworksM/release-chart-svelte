import type {PageServerLoad, RequestEvent, RouteParams} from './$types'
import {getPlatformAsDto} from '$lib/server/data/access/platforms'
import {error, fail, redirect} from '@sveltejs/kit'
import {ObjectId} from 'mongodb'
import type {PlatformDto} from '$lib/data/platform'
// eslint-disable-next-line no-duplicate-imports
import {PlatformDtoSchema} from '$lib/data/platform'
import {platformsCollection} from '$lib/server/data'
import _ from 'lodash'
import {env} from '$env/dynamic/private'
const {omit} = _

interface EditPlatformPageData {
    platform: PlatformDto
}

export const load = (async ({params}: { params: RouteParams }): Promise<EditPlatformPageData> => {
    const platform = await getPlatformAsDto(new ObjectId(params.id))

    if (!platform) {
        throw error(404, 'Platform not found')
    }

    return {
        platform
    }
}) satisfies PageServerLoad<EditPlatformPageData>

async function savePlatform({ request, params }: RequestEvent) {
    const data = Object.fromEntries(await request.formData())

    const result = await PlatformDtoSchema.safeParseAsync(data)

    if (!result.success) {
        return fail(400, {})
    }

    const update = {
        $set: omit(result.data, ['id'])
    }

    await platformsCollection.updateOne({_id: new ObjectId(params.id)}, update)

    throw redirect(303, `${env.BASE_URL}/platforms`)
}

export const actions = {
    default: savePlatform
}