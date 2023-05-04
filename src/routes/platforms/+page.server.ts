import type {PageServerLoad, RouteParams} from './$types'
import {getPlatformsAsDto, getReleaseCountsForPlatforms} from '../../data/access/platforms'
// eslint-disable-next-line no-duplicate-imports
import type {PlatformCountMap} from '../../data/access/platforms'
import type {PlatformDto} from '../../data/dto/platform-dto'

type PlatformsPageData = { platforms: PlatformDto[], releaseCounts: PlatformCountMap }

export const load = (async ({params}: { params: RouteParams }): Promise<PlatformsPageData> => {
    const platforms = await getPlatformsAsDto()
    const releaseCounts = await getReleaseCountsForPlatforms()

    return {
        platforms,
        releaseCounts
    }
}) satisfies PageServerLoad<PlatformsPageData>