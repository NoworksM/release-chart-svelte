import type {PageServerLoad} from './$types'
import {getPlatformsAsDto} from '$lib/server/data/access/platforms'
import {getYearRangeForRegion} from '$lib/server/data/access/games'

export const load = (async () => {
    return {
        platforms: getPlatformsAsDto(),
        yearRange: getYearRangeForRegion('North America')
    }
}) satisfies PageServerLoad