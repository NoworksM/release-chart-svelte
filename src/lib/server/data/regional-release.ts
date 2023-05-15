import type {ObjectId} from 'mongodb'
import type {RegionalReleaseDto} from '$lib/data/regional-release'


export interface RegionalRelease {
    gameId: ObjectId;
    title: string
    description: string
    releaseDate: Date
    platforms: string[]
    regions: string[]
    developer: string
    publisher: string
    genres: string[]
    posterId: ObjectId
}

export function regionalReleaseToDto(release: RegionalRelease): RegionalReleaseDto {
    return {
        gameId: release.gameId.toString(),
        title: release.title,
        description: release.description,
        releaseDate: release.releaseDate.toISOString(),
        platforms: release.platforms,
        regions: release.regions,
        developer: release.developer,
        publisher: release.publisher,
        genres: release.genres,
        posterId: release.posterId.toString()
    }
}