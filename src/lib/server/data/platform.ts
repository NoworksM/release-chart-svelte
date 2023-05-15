import type {Binary, ObjectId} from 'mongodb'
import type {PlatformDto} from '../../data/dto/platform-dto'


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