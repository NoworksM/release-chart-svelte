import type {PageServerLoad} from './$types'
import {getRecentRegionalReleasesAsDto} from '../../data/access/releases'
import type {RegionalReleaseDto} from '../../data/dto/regional-release-dto'

export const load = (async (): Promise<{ releases: RegionalReleaseDto[] }> => {
    const region = 'North America'

    const releases = await getRecentRegionalReleasesAsDto(region)

    return {
        releases
    }
}) satisfies PageServerLoad<{ releases: RegionalReleaseDto[] }>