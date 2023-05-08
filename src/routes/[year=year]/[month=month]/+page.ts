import type {PageLoad, PageLoadEvent} from './$types'
import type {RegionalReleaseDto} from '../../../data/dto/regional-release-dto'
import type {PlatformDto} from '../../../data/dto/platform-dto'

export const load = (async ({params, fetch}: PageLoadEvent) => {
    const [releases, platforms] = await Promise.all([
        fetch(`/api/games/${params.year}/${params.month}`),
        fetch('/api/platforms')
    ].map(p => p.then(r => r.json())))

    return {
        releases: releases as RegionalReleaseDto[],
        platforms: platforms as PlatformDto[],
        year: parseInt(params.year),
        month: parseInt(params.month)
    }
}) satisfies PageLoad