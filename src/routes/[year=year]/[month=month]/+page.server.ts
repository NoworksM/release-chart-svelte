import type {PageServerLoad} from './$types'
import {getPlatformsAsDto} from '$lib/server/data/access/platforms'
import {getYearRangeForRegion} from '$lib/server/data/access/games'
import {RegionsSchema} from '$lib/data/region'

export const load = (async () => {
    return {
        platforms: getPlatformsAsDto(),
        yearRange: getYearRangeForRegion(RegionsSchema.enum.NA)
    }
}) satisfies PageServerLoad