import * as z from 'zod'
import type {PageServerLoad, RouteParams} from './$types'
import {error} from '@sveltejs/kit'
import {getGamesPage, searchGamesPage} from '$lib/server/data/access/games'
import type {GamePage} from '$lib/data/game'

const ParamsSchema = z.object({
    q: z.string().optional(),
    page: z.coerce.number().optional().default(1),
})

export const load = (async({params}: {params: RouteParams}): Promise<GamePage> => {
    const validatedParams = await ParamsSchema.safeParseAsync(params)

    if (!validatedParams.success) {
        throw error(400, validatedParams.error)
    }

    let page: GamePage
    if (validatedParams.data.q) {
        page = await searchGamesPage(validatedParams.data.q, validatedParams.data.page)
    } else {
        page = await getGamesPage(validatedParams.data.page)
    }

    return page
}) satisfies PageServerLoad<GamePage>