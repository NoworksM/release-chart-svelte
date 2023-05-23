import type {PageLoad} from './$types'
import type {RegionDto} from '$lib/data/region'

type RegionPageData = {region: Promise<RegionDto>}

export const load = (async ({params, fetch}): Promise<RegionPageData> => {
    return {
        region: fetch(`/api/regions/${params.id}`).then(r => r.json())
    }
}) satisfies PageLoad<RegionPageData>