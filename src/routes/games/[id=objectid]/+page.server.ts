import {getGameAsDto} from '../../../data/access/games'
import {getRegions, getRegionsAsDto} from '../../../data/access/regions'
import {getPlatforms, getPlatformsAsDto} from '../../../data/access/platforms'
import {getGenres, getGenresAsDto} from '../../../data/access/genres'
import {ObjectId} from 'mongodb'
import type {RegionDto} from '../../../data/dto/region-dto'
import type {GameDto} from '../../../data/dto/game-dto'
import type {PlatformDto} from '../../../data/dto/platform-dto'
import type {GenreDto} from '../../../data/dto/genre-dto'
import type {PageServerLoad, RouteParams} from '../../../../.svelte-kit/types/src/routes/games/[id=objectid]/$types'

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

}