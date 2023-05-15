import type {ReleaseDto} from '$lib/data/release'

export interface Release {
    releaseDate: Date
    platforms: string[]
    regions: string[]
}

export function releaseToDto(release: Release): ReleaseDto {
    return {
        ...release,
        releaseDate: release.releaseDate.toISOString()
    }
}