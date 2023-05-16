import type {PageServerLoad} from './$types'
import {getRecentRegionalReleasesAsDto} from '$lib/server/data/access/releases'
import { getPlatformsAsDto } from '$lib/server/data/access/platforms'
import type ReleaseGridDto from '$lib/data/release-grid'
import {RegionsSchema} from '$lib/data/region'

export const load = (async (): Promise<ReleaseGridDto> => {
    const region = RegionsSchema.enum.NA

    const releases = await getRecentRegionalReleasesAsDto(region)
    const platforms = await getPlatformsAsDto()

    return {
        releases,
        platforms
    }
}) satisfies PageServerLoad<ReleaseGridDto>