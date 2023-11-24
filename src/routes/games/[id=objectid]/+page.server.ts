import {getGameAsDto} from '$lib/server/data/access/games'
import {getRegionsAsDto} from '$lib/server/data/access/regions'
import {getPlatformsAsDto} from '$lib/server/data/access/platforms'
import {getGenresAsDto} from '$lib/server/data/access/genres'
import {ObjectId} from 'mongodb'
import type {RegionDto} from '$lib/data/region'
import type {GameDto} from '$lib/data/game'
import type {PlatformDto} from '$lib/data/platform'
import type {GenreDto} from '$lib/data/genre'
import type {PageServerLoad, RouteParams} from './$types'
import upsertGame from '../UpsertGame.server'
import {type RequestEvent, fail, redirect} from '@sveltejs/kit'
import {gamesCollection} from '$lib/server/data'
import {env} from '$env/dynamic/private'

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


async function del({params}: RequestEvent) {
    const _id = new ObjectId(params.id)

    if (await gamesCollection.countDocuments({_id}) !== 1) {
        throw fail(404)
    }

    await gamesCollection.deleteOne({_id})

    throw redirect(303, `${env.BASE_URL}/games`)
}

export const actions = {
    save: upsertGame,
    delete: del
}