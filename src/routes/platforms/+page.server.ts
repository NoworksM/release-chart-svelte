import type {PageServerLoad} from './$types'
import {getPlatformsAsDto, getReleaseCountsForPlatforms, type PlatformCountMap} from '$lib/server/data/access/platforms'
import type {PlatformDto} from '$lib/data/platform'

type PlatformsPageData = { platforms: PlatformDto[], releaseCounts: PlatformCountMap }

export const load = (async (): Promise<PlatformsPageData> => {
    const platforms = await getPlatformsAsDto()
    const releaseCounts = await getReleaseCountsForPlatforms()

    return {
        platforms,
        releaseCounts
    }
}) satisfies PageServerLoad<PlatformsPageData>