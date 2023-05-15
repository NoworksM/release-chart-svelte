import type {PageServerLoad} from './$types'
import {getUpcomingRegionalReleasesAsDto} from '$lib/server/data/access/releases'
import { getPlatformsAsDto } from '$lib/server/data/access/platforms'
import type ReleaseGridDto from '$lib/data/release-grid'

export const load = (async (): Promise<ReleaseGridDto> => {
    const region = 'North America'

    const releases = await getUpcomingRegionalReleasesAsDto(region)
    const platforms = await getPlatformsAsDto()

    return {
        releases,
        platforms
    }
}) satisfies PageServerLoad<ReleaseGridDto>