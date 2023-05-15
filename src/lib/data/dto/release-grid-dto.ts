import type { PlatformDto } from './platform-dto'
import type { RegionalReleaseDto } from './regional-release-dto'

export default interface ReleaseGridDto {
    releases: RegionalReleaseDto[]
    platforms: PlatformDto[]
}