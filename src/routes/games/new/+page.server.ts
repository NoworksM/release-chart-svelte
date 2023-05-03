import {getRegionsAsDto} from '../../../data/access/regions'
import {getPlatformsAsDto} from '../../../data/access/platforms'
import {getGenresAsDto} from '../../../data/access/genres'
import type {RegionDto} from '../../../data/dto/region-dto'
import type {PlatformDto} from '../../../data/dto/platform-dto'
import type {GenreDto} from '../../../data/dto/genre-dto'
import type {PageServerLoad, RouteParams} from '../../../../.svelte-kit/types/src/routes/games/[id=objectid]/$types'

interface NewGamePageData {
    regions: RegionDto[],
    platforms: PlatformDto[],
    genres: GenreDto[],
}

export const load = (async ({params}: { params: RouteParams }): Promise<NewGamePageData> => {
    const [regions, platforms, genres] = await Promise.all([
        getRegionsAsDto(),
        getPlatformsAsDto(),
        getGenresAsDto()
    ])

    return {
        regions,
        platforms,
        genres,
    }
}) satisfies PageServerLoad<NewGamePageData>


export const actions = {}