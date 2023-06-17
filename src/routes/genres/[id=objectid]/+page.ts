import type {PageLoad} from './$types'
import type {GenreDto} from '$lib/data/genre'

type GenrePageData = {genre: Promise<GenreDto>}

export const load = (async ({params, fetch}): Promise<GenrePageData> => {
    return {
        genre: fetch(`/api/genres/${params.id}`).then(r => r.json())
    }
}) satisfies PageLoad<GenrePageData>