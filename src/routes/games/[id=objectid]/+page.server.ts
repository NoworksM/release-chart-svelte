import {getGameAsDto} from '$lib/server/data/access/games'
import {getRegionsAsDto} from '$lib/server/data/access/regions'
import {getPlatformsAsDto} from '$lib/server/data/access/platforms'
import {getGenresAsDto} from '$lib/server/data/access/genres'
import {ObjectId} from 'mongodb'
import type {RegionDto} from '$lib/data/dto/region-dto'
import type {GameDto} from '$lib/data/dto/game-dto'
import type {PlatformDto} from '$lib/data/dto/platform-dto'
import type {GenreDto} from '$lib/data/dto/genre-dto'
import type {PageServerLoad, RouteParams} from '../../../../.svelte-kit/types/src/routes/games/[id=objectid]/$types'
import upsertGame from '../UpsertGame.server'

interface EditGamePageData {
    game: GameDto,
    regions: RegionDto[],
    platforms: PlatformDto[],
    genres: GenreDto[],
}

export const load = (async ({params}: { params: RouteParams }): Promise<EditGamePageData> => {
    const [game, regions, platforms, genres] = await Promise.all([
        getGameAsDto(new ObjectId(params.id)),
        getRegionsAsDto(),
        getPlatformsAsDto(),
        getGenresAsDto()
    ])

    return {
        game,
        regions,
        platforms,
        genres,
    }
}) satisfies PageServerLoad<EditGamePageData>


export const actions = {
    default: upsertGame
}