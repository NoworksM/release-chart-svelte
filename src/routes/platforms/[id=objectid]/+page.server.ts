import type {ActionData, PageServerLoad, RequestEvent, RouteParams} from './$types'
import {getPlatformAsDto} from '../../../data/access/platforms'
import {error, fail} from '@sveltejs/kit'
import {ObjectId} from 'mongodb'
import type {PlatformDto} from '../../../data/dto/platform-dto'
// eslint-disable-next-line no-duplicate-imports
import {PlatformDtoSchema} from '../../../data/dto/platform-dto'
import {platformsCollection} from '../../../data'
import _ from 'lodash'
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

    await platformsCollection.updateOne({_id: new ObjectId(params.id)}, {
        $set: omit(data, ['id'])
    })

    return {success: true}
}

export const actions = {
    default: savePlatform
}