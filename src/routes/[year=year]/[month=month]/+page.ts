import type {PageLoad, PageLoadEvent} from './$types'
import type {RegionalReleaseDto} from '../../../data/dto/regional-release-dto'

export const load = (async ({params, fetch, data}: PageLoadEvent) => {
    const [releases] = await Promise.all([
        fetch(`/api/games/${params.year}/${params.month}`)
    ].map(p => p.then(r => r.json())))

    return {
        ...data,
        releases: releases as RegionalReleaseDto[],
        year: parseInt(params.year),
        month: parseInt(params.month)
    }
}) satisfies PageLoad