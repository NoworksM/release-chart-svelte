import type {Binary, ObjectId} from 'mongodb'


export default interface Platform {
    _id: ObjectId
    name: string
    shortName: string
    manufacturer: string
    icon?: PlatformIcon
}

export interface PlatformIcon {
    data: Binary
    contentType: string
}