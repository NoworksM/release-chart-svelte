import type {RequestEvent, RequestHandler} from './$types'
import {error, json} from '@sveltejs/kit'
import * as z from 'zod'
import {getGamesPage, searchGamesPage} from '../../../data/access/games'

const GetSearchParamsSchema = z.object({
    page: z.coerce.number().min(1).default(1),
    q: z.string().optional()
})

export const GET = (async ({url}: RequestEvent) => {
    const result = await GetSearchParamsSchema.safeParseAsync(Object.fromEntries(url.searchParams))

    if (!result.success) {
        throw error(400, result.error)
    }

    const params = result.data

    const gamePage = params.q
        ? await searchGamesPage(params.q, params.page)
        : await getGamesPage(params.page)

    return json(gamePage)
}) satisfies RequestHandler