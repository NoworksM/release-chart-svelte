import * as z from 'zod'
import {ObjectId} from 'mongodb'
import type {RegionalRelease} from '../server/data/regional-release'

export const RegionalReleaseDtoSchema = z.object({
    gameId: z.string().length(24),
    title: z.string(),
    description: z.string(),
    releaseDate: z.string().datetime(),
    platforms: z.array(z.string()),
    regions: z.array(z.string()),
    developer: z.string(),
    publisher: z.string(),
    genres: z.array(z.string()),
    posterId: z.string()
})

export type RegionalReleaseDto = z.infer<typeof RegionalReleaseDtoSchema>

export function regionalReleaseFromDto(release: RegionalReleaseDto): RegionalRelease {
    return {
        gameId: new ObjectId(release.gameId),
        title: release.title,
        description: release.description,
        releaseDate: new Date(release.releaseDate),
        platforms: release.platforms,
        regions: release.regions,
        developer: release.developer,
        publisher: release.publisher,
        genres: release.genres,
        posterId: new ObjectId(release.posterId)
    }
}