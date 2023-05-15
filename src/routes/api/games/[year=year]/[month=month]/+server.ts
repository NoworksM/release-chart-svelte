import * as z from 'zod'
import type {RequestEvent, RequestHandler} from './$types'
import {json} from '@sveltejs/kit'
import {getRegionalReleasesForMonth} from '$lib/server/data/access/releases'

const ParamsSchema = z.object({
    year: z.coerce.number().min(1950),
    month: z.coerce.number().min(1).max(12)
})

export const GET = (async ({params}: RequestEvent) => {
    const query = await ParamsSchema.parseAsync(params)

    const releases = await getRegionalReleasesForMonth(query.year, query.month, 'North America')

    return json(releases)
}) satisfies RequestHandler