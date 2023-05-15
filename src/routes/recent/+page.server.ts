import type {PageServerLoad} from './$types'
import {getRecentRegionalReleasesAsDto} from '$lib/server/data/access/releases'
import { getPlatformsAsDto } from '$lib/server/data/access/platforms'
import type ReleaseGridDto from '$lib/data/dto/release-grid-dto'

export const load = (async (): Promise<ReleaseGridDto> => {
    const region = 'North America'

    const releases = await getRecentRegionalReleasesAsDto(region)
    const platforms = await getPlatformsAsDto()

    return {
        releases,
        platforms
    }
}) satisfies PageServerLoad<ReleaseGridDto>