import {getRegionsAsDto} from '$lib/server/data/access/regions'
import {getPlatformsAsDto} from '$lib/server/data/access/platforms'
import {getGenresAsDto} from '$lib/server/data/access/genres'
import type {RegionDto} from '$lib/data/region'
import type {PlatformDto} from '$lib/data/platform'
import type {GenreDto} from '$lib/data/genre'
import type {PageServerLoad} from './$types'
import upsertGame from '../UpsertGame.server'

interface NewGamePageData {
    regions: RegionDto[],
    platforms: PlatformDto[],
    genres: GenreDto[],
}

export const load = (async (): Promise<NewGamePageData> => {
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


export const actions = {
    save: upsertGame
}