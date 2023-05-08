import type {PageServerLoad} from './$types'
import {getPlatformsAsDto} from '../../../data/access/platforms'
import {getYearRangeForRegion} from '../../../data/access/games'

export const load = (async () => {
    return {
        platforms: getPlatformsAsDto(),
        yearRange: getYearRangeForRegion('North America')
    }
}) satisfies PageServerLoad