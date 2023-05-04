import type {PageServerLoad, RouteParams} from './$types'
import {getPlatformAsDto} from '../../../data/access/platforms'
import {error} from '@sveltejs/kit'
import {ObjectId} from 'mongodb'
import type {PlatformDto} from '../../../data/dto/platform-dto'

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