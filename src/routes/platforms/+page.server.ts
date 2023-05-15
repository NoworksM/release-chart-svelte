import type {PageServerLoad, RouteParams} from './$types'
import {getPlatformsAsDto, getReleaseCountsForPlatforms} from '$lib/server/data/access/platforms'
// eslint-disable-next-line no-duplicate-imports
import type {PlatformCountMap} from '$lib/server/data/access/platforms'
import type {PlatformDto} from '$lib/data/dto/platform-dto'

type PlatformsPageData = { platforms: PlatformDto[], releaseCounts: PlatformCountMap }

export const load = (async ({params}: { params: RouteParams }): Promise<PlatformsPageData> => {
    const platforms = await getPlatformsAsDto()
    const releaseCounts = await getReleaseCountsForPlatforms()

    return {
        platforms,
        releaseCounts
    }
}) satisfies PageServerLoad<PlatformsPageData>