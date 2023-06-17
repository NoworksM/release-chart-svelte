import type {PageLoad} from './$types'
import type {GenreDto} from '$lib/data/genre'
import type {GenreCountMap} from '$lib/data/count-map'

type GenresPageData = {genres: Promise<GenreDto[]>, counts: Promise<GenreCountMap>}

export const load = (async ({fetch}): Promise<GenresPageData> => {
    return {
        genres: fetch('/api/genres').then(r => r.json()),
        counts: fetch('/api/genres/releasecounts').then(r => r.json())
    }
}) satisfies PageLoad<GenresPageData>