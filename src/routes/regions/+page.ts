import type {PageLoad} from './$types'
import type {RegionDto} from '$lib/data/region'
import type {RegionCountMap} from '$lib/data/count-map'

type RegionPageData = {regions: Promise<RegionDto[]>, streamed: {counts: Promise<RegionCountMap>}}

export const load = (async ({fetch}): Promise<RegionPageData> => {
    return {
        regions: fetch('/api/regions').then(r => r.json()),
        streamed: {
            counts: fetch('/api/regions/releasecounts').then(r => r.json())
        }
    }
}) satisfies PageLoad<RegionPageData>