import type {ReleaseDto} from './dto/release-dto'

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