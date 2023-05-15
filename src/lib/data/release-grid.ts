import type { PlatformDto } from './platform'
import type { RegionalReleaseDto } from './regional-release'

export default interface ReleaseGridDto {
    releases: RegionalReleaseDto[]
    platforms: PlatformDto[]
}