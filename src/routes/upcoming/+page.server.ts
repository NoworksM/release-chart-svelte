import type {PageServerLoad} from './$types'
import type {RegionalReleaseDto} from '../../data/dto/regional-release-dto'
import {getUpcomingRegionalReleasesAsDto} from '../../data/access/releases'
import {getPlatformsAsDto} from '../../data/access/platforms'
import type {PlatformDto} from '../../data/dto/platform-dto'
import type ReleaseGridDto from '../../data/dto/release-grid-dto'

export const load = (async (): Promise<ReleaseGridDto> => {
    const region = 'North America'

    const releases = await getUpcomingRegionalReleasesAsDto(region)
    const platforms = await getPlatformsAsDto()

    return {
        releases,
        platforms
    }
}) satisfies PageServerLoad<ReleaseGridDto>