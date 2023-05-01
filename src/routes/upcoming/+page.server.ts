import type {PageServerLoad} from './$types'
import type {RegionalReleaseDto} from '../../data/dto/regional-release-dto'
import {getUpcomingRegionalReleasesAsDto} from '../../data/access/releases'

export const load = (async (): Promise<{ releases: RegionalReleaseDto[] }> => {
    const region = 'North America'

    const releases = await getUpcomingRegionalReleasesAsDto(region)

    return {
        releases
    }
}) satisfies PageServerLoad<{ releases: RegionalReleaseDto[] }>