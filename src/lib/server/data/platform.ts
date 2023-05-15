import type {Binary, ObjectId} from 'mongodb'
import type {PlatformDto} from './dto/platform-dto'


export default interface Platform {
    _id: ObjectId
    name: string
    shortName: string
    manufacturer: string
    hasIcon?: boolean
    icon?: PlatformIcon
}

export interface PlatformIcon {
    data: Binary
    contentType: string
}

export function pathToPlatformIcon(platform: Platform | PlatformDto, fallback: string | undefined = undefined) {
    if (platform.hasIcon || !fallback) {
        return `/img/platforms/${platform.shortName}.svg`
    } else {
        return fallback
    }
}