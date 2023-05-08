import type {PageServerLoad} from './$types'
import {getPlatformsAsDto} from '../../../data/access/platforms'

export const load = (async () => {
    return {
        platforms: getPlatformsAsDto()
    }
}) satisfies PageServerLoad